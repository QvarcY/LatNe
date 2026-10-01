import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import {
  izveidoVardnicu,
  tokenize
} from "../src/tokenizer.mjs"

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
const tokeni = tokenize(teksts, vardnica)

const nezinamie = tokeni.filter(
  tokens => tokens.veids === "nezināms"
)

console.log("")
console.log("LatNe tokenizer")
console.log(`Apstiprināti termini: ${vardnica.size}`)
console.log(`Tokeni: ${tokeni.length}`)
console.log(`Nezināmi: ${nezinamie.length}`)
console.log("")

for (const tokens of tokeni.slice(0, 40)) {
  const avots = tokens.avots
    ? ` <- ${tokens.avots}`
    : ""

  console.log(
    `${tokens.rinda}:${tokens.kolonna}` +
    `  ${tokens.veids}` +
    `  ${tokens.vertiba}` +
    avots
  )
}

if (nezinamie.length > 0) {
  console.log("")
  console.log("Nezināmie simboli:")

  for (const tokens of nezinamie) {
    console.log(
      `${tokens.rinda}:${tokens.kolonna}` +
      `  ${tokens.vertiba}`
    )
  }

  process.exitCode = 1
}
