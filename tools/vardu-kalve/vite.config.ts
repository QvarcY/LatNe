import { readFile } from "node:fs/promises"
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

type ChangePayload = {
  id?: unknown
  changes?: unknown
}

type Registry = {
  terms?: unknown
}

type Term = {
  id: string
  source: string
  status: string
  latvian: string | null
  notes: string
  [key: string]: unknown
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
    typeof term.status === "string"
  )
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

  if ("status" in changes) {
    if (
      typeof changes.status !== "string" ||
      !statuses.has(changes.status)
    ) {
      throw new Error("Nederīgs termina statuss")
    }
  }

  if ("latvian" in changes) {
    if (
      changes.latvian !== null &&
      typeof changes.latvian !== "string"
    ) {
      throw new Error("Nederīgs latviskais variants")
    }

    if (
      typeof changes.latvian === "string" &&
      changes.latvian.trim().length > 80
    ) {
      throw new Error("Latviskais variants ir pārāk garš")
    }
  }

  if ("notes" in changes) {
    if (typeof changes.notes !== "string") {
      throw new Error("Nederīgas piezīmes")
    }

    if (changes.notes.length > 2000) {
      throw new Error("Piezīmes ir pārāk garas")
    }
  }

  return changes
}

function normalizeChanges(
  changes: Record<string, unknown>
): Record<string, unknown> {
  const normalized = { ...changes }

  if (typeof normalized.latvian === "string") {
    const value = normalized.latvian.trim()
    normalized.latvian = value || null
  }

  if (typeof normalized.notes === "string") {
    normalized.notes = normalized.notes.trim()
  }

  return normalized
}

async function loadTerms(): Promise<Term[]> {
  const text = await readFile(registryPath, "utf8")
  const registry = JSON.parse(text) as Registry

  if (!Array.isArray(registry.terms)) {
    throw new Error("Terminoloģijas reģistrs nav derīgs")
  }

  const terms = registry.terms.filter(isTerm)

  if (terms.length !== registry.terms.length) {
    throw new Error("Reģistrā ir nederīgs termins")
  }

  return terms
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

        if (
          url.pathname !==
          "/api/termini/validate-change"
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
          const payload = await readJson(req) as ChangePayload

          if (typeof payload.id !== "string") {
            throw new Error("Trūkst termina id")
          }

          const terms = await loadTerms()
          const term = terms.find(
            item => item.id === payload.id
          )

          if (!term) {
            throw new Error("Termins nav atrasts")
          }

          const changes = normalizeChanges(
            validateChanges(payload.changes)
          )

          const candidate = {
            ...term,
            ...changes
          }

          if (
            candidate.status === "approved" &&
            (
              typeof candidate.latvian !== "string" ||
              !candidate.latvian.trim()
            )
          ) {
            throw new Error(
              "Apstiprinātam terminam vajag latvisko variantu"
            )
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
