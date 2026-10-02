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

const klase = ast.elementi.find(
  mezgls =>
    mezgls.veids === "Klase" &&
    mezgls.nosaukums === "Lietotājs"
)

if (!klase) {
  throw new Error(
    'AST nav atrasta klase "Lietotājs"'
  )
}

if (
  !Number.isInteger(
    klase.kermenaLeksiskoElementuSkaits
  ) ||
  klase.kermenaLeksiskoElementuSkaits <= 0
) {
  throw new Error(
    "Klases ķermeņa leksisko elementu skaits nav saglabāts"
  )
}

if ("kermenaLeksiskieElementi" in klase) {
  throw new Error(
    "Klases AST satur veco neviennozīmīgo kermenaLeksiskieElementi lauku"
  )
}

if (!Array.isArray(klase.kermenis)) {
  throw new Error(
    "Klases AST ķermenis nav mezglu masīvs"
  )
}

const gaiditieKlasesMezgli = [
  "KlasesLauks",
  "KlasesLauks",
  "KlasesLauks",
  "KlasesLauks",
  "Konstruktors",
  "Getteris"
]

if (
  klase.kermenis.length !==
  gaiditieKlasesMezgli.length
) {
  throw new Error(
    `Gaidīti ${gaiditieKlasesMezgli.length} klases ķermeņa mezgli, saņemti ${klase.kermenis.length}`
  )
}

for (
  let i = 0;
  i < gaiditieKlasesMezgli.length;
  i++
) {
  if (
    klase.kermenis[i].veids !==
    gaiditieKlasesMezgli[i]
  ) {
    throw new Error(
      `Klases ķermeņa mezgls ${i + 1} nav gaidītajā secībā`
    )
  }
}

const gaiditieLauki = [
  {
    nosaukums: "vārds",
    pieejamiba: "public",
    nemainams: true,
    tips: "teksts"
  },
  {
    nosaukums: "vecums",
    pieejamiba: "public",
    nemainams: false,
    tips: "skaitlis"
  },
  {
    nosaukums: "aktīvs",
    pieejamiba: "protected",
    nemainams: false,
    tips: "loģisks"
  },
  {
    nosaukums: "loma",
    pieejamiba: "private",
    nemainams: false,
    tips: "Loma"
  }
]

if (klase.lauki.length !== gaiditieLauki.length) {
  throw new Error(
    `Gaidīti ${gaiditieLauki.length} klases lauki, saņemti ${klase.lauki.length}`
  )
}

for (
  let i = 0;
  i < gaiditieLauki.length;
  i++
) {
  const faktiskais = klase.lauki[i]
  const gaiditais = gaiditieLauki[i]

  for (
    const lauks of [
      "nosaukums",
      "pieejamiba",
      "nemainams",
      "tips"
    ]
  ) {
    if (
      faktiskais[lauks] !==
      gaiditais[lauks]
    ) {
      throw new Error(
        `Klases lauka ${i + 1} neatbilstošs ${lauks}: ` +
        `${faktiskais[lauks]}`
      )
    }
  }
}

if (!klase.konstruktors) {
  throw new Error(
    "Klases AST nav konstruktora"
  )
}

const gaiditieParametri = [
  {
    nosaukums: "vārds",
    tips: "teksts"
  },
  {
    nosaukums: "vecums",
    tips: "skaitlis"
  }
]

if (
  klase.konstruktors.parametri.length !==
  gaiditieParametri.length
) {
  throw new Error(
    "Konstruktoram ir negaidīts parametru skaits"
  )
}

for (
  let i = 0;
  i < gaiditieParametri.length;
  i++
) {
  const faktiskais =
    klase.konstruktors.parametri[i]

  const gaiditais =
    gaiditieParametri[i]

  if (
    faktiskais.nosaukums !==
      gaiditais.nosaukums ||
    faktiskais.tips !==
      gaiditais.tips
  ) {
    throw new Error(
      `Konstruktora parametrs ${i + 1} neatbilst gaidītajam AST`
    )
  }
}

if (
  !Array.isArray(
    klase.konstruktors.kermenaLeksiskieElementi
  ) ||
  klase.konstruktors.kermenaLeksiskieElementi.length === 0
) {
  throw new Error(
    "Konstruktora ķermeņa leksiskie elementi nav saglabāti"
  )
}

if (klase.getteri.length !== 1) {
  throw new Error(
    `Gaidīts 1 getteris, saņemti ${klase.getteri.length}`
  )
}

const getteris = klase.getteri[0]

if (
  getteris.nosaukums !== "apraksts" ||
  getteris.atgriezesTips !== "teksts"
) {
  throw new Error(
    "Gettera AST neatbilst gaidītajai deklarācijai"
  )
}

if (
  !Array.isArray(
    getteris.kermenaLeksiskieElementi
  ) ||
  getteris.kermenaLeksiskieElementi.length === 0
) {
  throw new Error(
    "Gettera ķermeņa leksiskie elementi nav saglabāti"
  )
}

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

console.log(
  `Klases ķermeņa mezgli: ${klase.kermenis.length}`
)

console.log(
  `Klases lauki: ${klase.lauki.length}`
)

console.log(
  `Konstruktora parametri: ${klase.konstruktors.parametri.length}`
)

console.log(
  `Getteri: ${klase.getteri.length}`
)

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
