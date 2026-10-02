import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import {
  izveidoVardnicu,
  analizeLeksiski
} from "../src/leksiskais-analizators.mjs"

import {
  analizeSintaksi
} from "../src/sintaktiskais-analizators.mjs"

const registrsPath = fileURLToPath(
  new URL(
    "../data/termini.json",
    import.meta.url
  )
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

const vardnica =
  izveidoVardnicu(registrs)

const leksiskieElementi =
  analizeLeksiski(teksts, vardnica)

const nezinamie = leksiskieElementi.filter(
  leksiskaisElements =>
    leksiskaisElements.veids === "nezināms"
)

if (nezinamie.length > 0) {
  throw new Error(
    `Sintaktisko analīzi nevar palaist: ${nezinamie.length} nezināmi leksiskieElementi`
  )
}

const ast = analizeSintaksi(leksiskieElementi)

const darbiba = ast.elementi.find(
  mezgls =>
    mezgls.veids === "Darbība"
)

console.log("")
console.log("LatNe sintaktiskā analīze")
console.log(`Leksiskie elementi: ${leksiskieElementi.length}`)
console.log(
  `AST augšējie mezgli: ${ast.elementi.length}`
)

if (darbiba) {
  console.log(
    `Darbības priekšraksti: ${darbiba.kermenis.length}`
  )
}

console.log("")
console.log("Programma")

for (
  let i = 0;
  i < ast.elementi.length;
  i++
) {
  const mezgls = ast.elementi[i]

  const pedejais =
    i === ast.elementi.length - 1

  const zars =
    pedejais ? "└─" : "├─"

  if (mezgls.veids === "Imports") {
    console.log(
      `${zars} Imports: ` +
      `${mezgls.vardi.join(", ")} ` +
      `no ${mezgls.avots}`
    )

    continue
  }

  if (mezgls.veids === "Saskarsme") {
    console.log(
      `${zars} Saskarsme: ${mezgls.nosaukums}`
    )

    continue
  }

  if (mezgls.veids === "Uzskaitījums") {
    console.log(
      `${zars} Uzskaitījums: ` +
      `${mezgls.nosaukums} ` +
      `[${mezgls.vertibas.join(", ")}]`
    )

    continue
  }

  if (mezgls.veids === "Klase") {
    console.log(
      `${zars} Klase: ${mezgls.nosaukums}`
    )

    continue
  }

  if (mezgls.veids === "Darbība") {
    console.log(
      `${zars} Darbība: ` +
      `${mezgls.nosaukums} ` +
      `[priekšraksti: ${mezgls.kermenis.length}]`
    )
  }
}

console.log("")
console.log("Darbības un izteiksmju AST")

if (darbiba) {
  console.log(
    JSON.stringify(
      darbiba.kermenis,
      null,
      2
    )
  )
}
