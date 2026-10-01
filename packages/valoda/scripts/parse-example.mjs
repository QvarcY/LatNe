import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import {
  izveidoVardnicu,
  tokenize
} from "../src/tokenizer.mjs"

import {
  parse
} from "../src/parser.mjs"

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

const tokeni =
  tokenize(teksts, vardnica)

const nezinamie = tokeni.filter(
  tokens =>
    tokens.veids === "nezināms"
)

if (nezinamie.length > 0) {
  throw new Error(
    `Parseri nevar palaist: ${nezinamie.length} nezināmi tokeni`
  )
}

const ast = parse(tokeni)

const darbiba = ast.elementi.find(
  mezgls =>
    mezgls.veids === "Darbība"
)

console.log("")
console.log("LatNe statement parser")
console.log(`Tokeni: ${tokeni.length}`)
console.log(
  `AST augšējie mezgli: ${ast.elementi.length}`
)

if (darbiba) {
  console.log(
    `Darbības paziņojumi: ${darbiba.kermenis.length}`
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
      `[${mezgls.kermenis.length} paziņojumi]`
    )
  }
}

console.log("")
console.log("Darbības ķermeņa AST")

if (darbiba) {
  console.log(
    JSON.stringify(
      darbiba.kermenis,
      null,
      2
    )
  )
}
