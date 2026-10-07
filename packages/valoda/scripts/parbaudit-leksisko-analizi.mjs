import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import {
  izveidoVārdnīcu,
  analizēLeksiski
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

const vārdnīca = izveidoVārdnīcu(registrs)
const leksiskieElementi = analizēLeksiski(teksts, vārdnīca)

const nezināmie = leksiskieElementi.filter(
  leksiskaisElements => leksiskaisElements.veids === "nezināms"
)

console.log("")
console.log("LatNe leksiskā analīze")
console.log(`Apstiprināti termini: ${vārdnīca.size}`)
console.log(`Leksiskie elementi: ${leksiskieElementi.length}`)
console.log(`Nezināmi: ${nezināmie.length}`)
console.log("")

for (const leksiskaisElements of leksiskieElementi.slice(0, 40)) {
  const avots = leksiskaisElements.avots
    ? ` <- ${leksiskaisElements.avots}`
    : ""

  console.log(
    `${leksiskaisElements.rinda}:${leksiskaisElements.kolonna}` +
    `  ${leksiskaisElements.veids}` +
    `  ${leksiskaisElements.vērtība}` +
    avots
  )
}

if (nezināmie.length > 0) {
  console.log("")
  console.log("Nezināmie simboli:")

  for (const leksiskaisElements of nezināmie) {
    console.log(
      `${leksiskaisElements.rinda}:${leksiskaisElements.kolonna}` +
      `  ${leksiskaisElements.vērtība}`
    )
  }

  process.exitCode = 1
}
