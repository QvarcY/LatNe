import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import {
  izveidoVardnicu,
  analizeLeksiski
} from "../src/leksiskais-analizators.mjs"

const registrsPath = fileURLToPath(
  new URL("../data/termini.json", import.meta.url)
)

const paraugsPath = fileURLToPath(
  new URL(
    "../../../examples/pamata-paraugs.lat",
    import.meta.url
  )
)

const registrs = JSON.parse(
  await readFile(
    registrsPath,
    "utf8"
  )
)

const teksts = await readFile(
  paraugsPath,
  "utf8"
)

const vardnica = izveidoVardnicu(registrs)
const leksiskieElementi = analizeLeksiski(teksts, vardnica)

const nezinamie = leksiskieElementi.filter(
  leksiskaisElements => leksiskaisElements.veids === "nezināms"
)

console.log("")
console.log("LatNe leksiskā analīze")
console.log(`Apstiprināti termini: ${vardnica.size}`)
console.log(`Leksiskie elementi: ${leksiskieElementi.length}`)
console.log(`Nezināmi: ${nezinamie.length}`)
console.log("")

for (const leksiskaisElements of leksiskieElementi.slice(0, 40)) {
  const avots = leksiskaisElements.avots
    ? ` <- ${leksiskaisElements.avots}`
    : ""

  console.log(
    `${leksiskaisElements.rinda}:${leksiskaisElements.kolonna}` +
    `  ${leksiskaisElements.veids}` +
    `  ${leksiskaisElements.vertiba}` +
    avots
  )
}

if (nezinamie.length > 0) {
  console.log("")
  console.log("Nezināmie simboli:")

  for (const leksiskaisElements of nezinamie) {
    console.log(
      `${leksiskaisElements.rinda}:${leksiskaisElements.kolonna}` +
      `  ${leksiskaisElements.vertiba}`
    )
  }

  process.exitCode = 1
}
