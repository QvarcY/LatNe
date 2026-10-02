import {
  readFile,
  rename,
  rm,
  writeFile
} from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { defineConfig, type Plugin } from "vite"

const registraCels = fileURLToPath(
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

type Termins = {
  id: string
  source: string
  status: string
  latvian: string | null
  notes: string
  [key: string]: unknown
}

type Registrs = {
  terms: Termins[]
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

function irTermins(value: unknown): value is Termins {
  if (!value || typeof value !== "object") {
    return false
  }

  const termins = value as Record<string, unknown>

  return (
    typeof termins.id === "string" &&
    typeof termins.source === "string" &&
    typeof termins.status === "string" &&
    (
      termins.latvian === null ||
      typeof termins.latvian === "string"
    ) &&
    typeof termins.notes === "string"
  )
}

function parbaudiRegistru(
  value: unknown
): asserts value is Registrs {
  if (!value || typeof value !== "object") {
    throw new Error("Terminoloģijas reģistrs nav derīgs")
  }

  const registrs = value as Record<string, unknown>

  if (!Array.isArray(registrs.terms)) {
    throw new Error("Terminoloģijas reģistrs nav derīgs")
  }

  if (!registrs.terms.every(irTermins)) {
    throw new Error("Reģistrā ir nederīgs termins")
  }

  const ids = new Set<string>()

  for (const termins of registrs.terms) {
    if (ids.has(termins.id)) {
      throw new Error(`Dublēts termina id: ${termins.id}`)
    }

    ids.add(termins.id)

    if (!statuses.has(termins.status)) {
      throw new Error(
        `Nederīgs statuss terminam: ${termins.id}`
      )
    }

    if (
      termins.status === "approved" &&
      !termins.latvian?.trim()
    ) {
      throw new Error(
        `Apstiprinātam terminam trūkst latviskā varianta: ${termins.id}`
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

async function ieladeRegistru(): Promise<Registrs> {
  const text = await readFile(registraCels, "utf8")
  const registrs = JSON.parse(text) as unknown

  parbaudiRegistru(registrs)

  return registrs
}

async function saglabaRegistru(
  registrs: Registrs
): Promise<void> {
  parbaudiRegistru(registrs)

  const text = JSON.stringify(registrs, null, 2) + "\n"
  const temporaryPath = `${registraCels}.tmp`

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

    const parbaudesRegistrs = JSON.parse(
      checkText
    ) as unknown

    parbaudiRegistru(parbaudesRegistrs)

    await rename(
      temporaryPath,
      registraCels
    )
  }
  catch (error) {
    await rm(temporaryPath, { force: true })
    throw error
  }
}

function terminologijasApi(): Plugin {
  return {
    name: "latne-terminologijas-api",

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

          const registrs = await ieladeRegistru()

          const termins = registrs.terms.find(
            item => item.id === payload.id
          )

          if (!termins) {
            throw new Error("Termins nav atrasts")
          }

          const changes = normalizeChanges(
            validateChanges(payload.changes)
          )

          const candidate: Termins = {
            ...termins,
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
            const nakamaisRegistrs: Registrs = {
              ...registrs,
              terms: registrs.terms.map(item =>
                item.id === candidate.id
                  ? candidate
                  : item
              )
            }

            await saglabaRegistru(nakamaisRegistrs)

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
    terminologijasApi()
  ]
})
