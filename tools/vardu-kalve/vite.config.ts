import {
  readFile,
  rename,
  rm,
  writeFile
} from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { defineConfig, type Plugin } from "vite"

const registryPath = fileURLToPath(
  new URL("../../packages/valoda/data/termini.json", import.meta.url)
)

const statuses = new Set([
  "pending",
  "approved",
  "rejected",
  "reserved"
])

const allowedFields = new Set([
  "latvian",
  "status",
  "notes"
])

type Term = {
  id: string
  source: string
  status: string
  latvian: string | null
  notes: string
  [key: string]: unknown
}

type Registry = {
  terms: Term[]
  [key: string]: unknown
}

type ChangePayload = {
  id?: unknown
  changes?: unknown
}

function sendJson(
  res: import("node:http").ServerResponse,
  status: number,
  body: unknown
): void {
  res.statusCode = status
  res.setHeader(
    "Content-Type",
    "application/json; charset=utf-8"
  )
  res.end(JSON.stringify(body))
}

async function readJson(
  req: import("node:http").IncomingMessage
): Promise<unknown> {
  const chunks: Buffer[] = []
  let size = 0

  for await (const chunk of req) {
    const part = Buffer.from(chunk)
    size += part.length

    if (size > 65536) {
      throw new Error("Pieprasījums ir pārāk liels")
    }

    chunks.push(part)
  }

  if (!chunks.length) {
    throw new Error("Trūkst pieprasījuma datu")
  }

  return JSON.parse(
    Buffer.concat(chunks).toString("utf8")
  )
}

function isTerm(value: unknown): value is Term {
  if (!value || typeof value !== "object") {
    return false
  }

  const term = value as Record<string, unknown>

  return (
    typeof term.id === "string" &&
    typeof term.source === "string" &&
    typeof term.status === "string" &&
    (
      term.latvian === null ||
      typeof term.latvian === "string"
    ) &&
    typeof term.notes === "string"
  )
}

function validateRegistry(
  value: unknown
): asserts value is Registry {
  if (!value || typeof value !== "object") {
    throw new Error("Terminoloģijas reģistrs nav derīgs")
  }

  const registry = value as Record<string, unknown>

  if (!Array.isArray(registry.terms)) {
    throw new Error("Terminoloģijas reģistrs nav derīgs")
  }

  if (!registry.terms.every(isTerm)) {
    throw new Error("Reģistrā ir nederīgs termins")
  }

  const ids = new Set<string>()

  for (const term of registry.terms) {
    if (ids.has(term.id)) {
      throw new Error(`Dublēts termina id: ${term.id}`)
    }

    ids.add(term.id)

    if (!statuses.has(term.status)) {
      throw new Error(
        `Nederīgs statuss terminam: ${term.id}`
      )
    }

    if (
      term.status === "approved" &&
      !term.latvian?.trim()
    ) {
      throw new Error(
        `Apstiprinātam terminam trūkst latviskā varianta: ${term.id}`
      )
    }
  }
}

function validateChanges(
  value: unknown
): Record<string, unknown> {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    throw new Error("Nederīgas termina izmaiņas")
  }

  const changes = value as Record<string, unknown>
  const keys = Object.keys(changes)

  if (!keys.length) {
    throw new Error("Nav norādīta neviena izmaiņa")
  }

  for (const key of keys) {
    if (!allowedFields.has(key)) {
      throw new Error(`Lauks nav rediģējams: ${key}`)
    }
  }

  if (
    "status" in changes &&
    (
      typeof changes.status !== "string" ||
      !statuses.has(changes.status)
    )
  ) {
    throw new Error("Nederīgs termina statuss")
  }

  if (
    "latvian" in changes &&
    changes.latvian !== null &&
    typeof changes.latvian !== "string"
  ) {
    throw new Error("Nederīgs latviskais variants")
  }

  if (
    "notes" in changes &&
    typeof changes.notes !== "string"
  ) {
    throw new Error("Nederīgas piezīmes")
  }

  return changes
}

function normalizeChanges(
  changes: Record<string, unknown>
): Record<string, unknown> {
  const normalized = { ...changes }

  if (typeof normalized.latvian === "string") {
    normalized.latvian =
      normalized.latvian.trim() || null
  }

  if (typeof normalized.notes === "string") {
    normalized.notes = normalized.notes.trim()
  }

  return normalized
}

async function loadRegistry(): Promise<Registry> {
  const text = await readFile(registryPath, "utf8")
  const registry = JSON.parse(text) as unknown

  validateRegistry(registry)

  return registry
}

async function saveRegistry(
  registry: Registry
): Promise<void> {
  validateRegistry(registry)

  const text = JSON.stringify(registry, null, 2) + "\n"
  const temporaryPath = `${registryPath}.tmp`

  await rm(temporaryPath, { force: true })

  try {
    await writeFile(
      temporaryPath,
      text,
      "utf8"
    )

    const checkText = await readFile(
      temporaryPath,
      "utf8"
    )

    const checkRegistry = JSON.parse(
      checkText
    ) as unknown

    validateRegistry(checkRegistry)

    await rename(
      temporaryPath,
      registryPath
    )
  }
  catch (error) {
    await rm(temporaryPath, { force: true })
    throw error
  }
}

function terminologyApi(): Plugin {
  return {
    name: "latne-terminology-api",

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(
          req.url ?? "/",
          "http://localhost"
        )

        const validatePath =
          "/api/termini/validate-change"

        const savePath =
          "/api/termini/save-change"

        if (
          url.pathname !== validatePath &&
          url.pathname !== savePath
        ) {
          next()
          return
        }

        if (req.method !== "POST") {
          sendJson(res, 405, {
            ok: false,
            error: "Atļauts tikai POST"
          })
          return
        }

        try {
          const payload =
            await readJson(req) as ChangePayload

          if (typeof payload.id !== "string") {
            throw new Error("Trūkst termina id")
          }

          const registry = await loadRegistry()

          const term = registry.terms.find(
            item => item.id === payload.id
          )

          if (!term) {
            throw new Error("Termins nav atrasts")
          }

          const changes = normalizeChanges(
            validateChanges(payload.changes)
          )

          const candidate: Term = {
            ...term,
            ...changes
          }

          if (
            candidate.status === "approved" &&
            !candidate.latvian?.trim()
          ) {
            throw new Error(
              "Apstiprinātam terminam vajag latvisko variantu"
            )
          }

          if (url.pathname === savePath) {
            const nextRegistry: Registry = {
              ...registry,
              terms: registry.terms.map(item =>
                item.id === candidate.id
                  ? candidate
                  : item
              )
            }

            await saveRegistry(nextRegistry)

            sendJson(res, 200, {
              ok: true,
              persisted: true,
              candidate
            })

            return
          }

          sendJson(res, 200, {
            ok: true,
            persisted: false,
            candidate
          })
        }
        catch (error) {
          sendJson(res, 400, {
            ok: false,
            error:
              error instanceof Error
                ? error.message
                : "Nezināma kļūda"
          })
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [
    terminologyApi()
  ]
})
