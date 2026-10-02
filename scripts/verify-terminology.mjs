import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const registryPath = fileURLToPath(
  new URL(
    "../packages/valoda/data/termini.json",
    import.meta.url
  )
)

const registry = JSON.parse(
  await readFile(registryPath, "utf8")
)

const terms = registry.terms

if (registry.schemaVersion !== 2) {
  throw new Error("Neatbalstīta shēmas versija")
}

if (!Array.isArray(terms) || terms.length === 0) {
  throw new Error("Terminoloģijas reģistrs ir tukšs")
}

const duplicateIds = terms
  .map(term => term.id)
  .filter((id, index, all) => all.indexOf(id) !== index)

if (duplicateIds.length > 0) {
  throw new Error("Atrasti dublēti id")
}

const duplicateSources = terms
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

for (let index = 0; index < terms.length; index++) {
  const term = terms[index]
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

for (const term of terms) {
  counts.set(
    term.status,
    (counts.get(term.status) ?? 0) + 1
  )
}

console.log("")
console.log("LatNe terminology registry OK")
console.log(`Terms: ${terms.length}`)

for (const status of [...counts.keys()].sort()) {
  console.log(`${status}: ${counts.get(status)}`)
}
