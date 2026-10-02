import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const registraCels = fileURLToPath(
  new URL(
    "../packages/valoda/data/termini.json",
    import.meta.url
  )
)

const registrs = JSON.parse(
  await readFile(registraCels, "utf8")
)

const termini = registrs.terms

if (registrs.schemaVersion !== 2) {
  throw new Error("Neatbalstīta shēmas versija")
}

if (!Array.isArray(termini) || termini.length === 0) {
  throw new Error("Terminoloģijas reģistrs ir tukšs")
}

const duplicateIds = termini
  .map(term => term.id)
  .filter((id, index, all) => all.indexOf(id) !== index)

if (duplicateIds.length > 0) {
  throw new Error("Atrasti dublēti id")
}

const duplicateSources = termini
  .map(term => term.source)
  .filter(
    (source, index, all) =>
      all.indexOf(source) !== index
  )

if (duplicateSources.length > 0) {
  throw new Error("Atrasti dublēti source termini")
}

const allowedStatuses = new Set([
  "pending",
  "approved",
  "rejected",
  "reserved"
])

for (let index = 0; index < termini.length; index++) {
  const term = termini[index]
  const expectedOrder = index + 1

  if (term.order !== expectedOrder) {
    throw new Error(
      `Nederīga secība pie ${term.source}`
    )
  }

  if (!allowedStatuses.has(term.status)) {
    throw new Error(
      `Nederīgs statuss pie ${term.source}`
    )
  }

  if (
    term.status === "approved" &&
    (
      typeof term.latvian !== "string" ||
      term.latvian.trim() === ""
    )
  ) {
    throw new Error(
      `Apstiprinātam terminam trūkst latviskā varianta pie ${term.source}`
    )
  }

  if (
    !Array.isArray(term.sourceRefs) ||
    term.sourceRefs.length === 0
  ) {
    throw new Error(
      `Terminā trūkst avota ${term.source}`
    )
  }
}

const counts = new Map()

for (const term of termini) {
  counts.set(
    term.status,
    (counts.get(term.status) ?? 0) + 1
  )
}

console.log("")
console.log("LatNe terminoloģijas reģistrs OK")
console.log(`Termini: ${termini.length}`)

for (const status of [...counts.keys()].sort()) {
  console.log(`${status}: ${counts.get(status)}`)
}
