import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import {
  izveidoVārdnīcu,
  analizēLeksiski
} from "../src/leksiskais-analizators.mjs"

import {
  analizēSintaksi
} from "../src/sintaktiskais-analizators.mjs"

import {
  analizēIzteiksmi as analizēIzteiksmesAst
} from "../src/izteiksmju-sintaktiskais-analizators.mjs"

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

const vārdnīca =
  izveidoVārdnīcu(registrs)

const leksiskieElementi =
  analizēLeksiski(teksts, vārdnīca)

const nezināmie = leksiskieElementi.filter(
  leksiskaisElements =>
    leksiskaisElements.veids === "nezināms"
)

if (nezināmie.length > 0) {
  throw new Error(
    `Sintaktisko analīzi nevar palaist: ${nezināmie.length} nezināmi leksiskieElementi`
  )
}

const ast = analizēSintaksi(leksiskieElementi)

function pārbaudiDiapazonu(
  diapazons,
  gaidītais,
  konteksts
) {
  if (
    diapazons?.sākums.rinda !==
      gaidītais.sākums.rinda ||
    diapazons?.sākums.kolonna !==
      gaidītais.sākums.kolonna ||
    diapazons?.sākums.nobīde !==
      gaidītais.sākums.nobīde ||
    diapazons?.beigas.rinda !==
      gaidītais.beigas.rinda ||
    diapazons?.beigas.kolonna !==
      gaidītais.beigas.kolonna ||
    diapazons?.beigas.nobīde !==
      gaidītais.beigas.nobīde
  ) {
    throw new Error(
      `${konteksts} diapazons neatbilst gaidītajam: ${JSON.stringify(diapazons)}`
    )
  }
}

function pozīcijaNobīdei(
  avots,
  nobīde
) {
  const pirms =
    avots.slice(
      0,
      nobīde
    )

  const rindas =
    pirms.split("\n")

  return {
    rinda: rindas.length,
    kolonna:
      rindas[rindas.length - 1]
        .length + 1,
    nobīde
  }
}

function gaidāmaisDeklarācijasDiapazons(
  avots,
  sākumaFragments,
  nākamaisFragments = null
) {
  const sākumaNobīde =
    avots.indexOf(
      sākumaFragments
    )

  if (sākumaNobīde < 0) {
    throw new Error(
      `Nav atrasts deklarācijas sākums: ${sākumaFragments}`
    )
  }

  let beiguNobīde =
    nākamaisFragments === null
      ? avots.length
      : avots.indexOf(
          nākamaisFragments,
          sākumaNobīde +
            sākumaFragments.length
        )

  if (beiguNobīde < 0) {
    throw new Error(
      `Nav atrasta nākamā deklarācija: ${nākamaisFragments}`
    )
  }

  while (
    beiguNobīde > sākumaNobīde &&
    /\s/u.test(
      avots[beiguNobīde - 1]
    )
  ) {
    beiguNobīde--
  }

  return {
    sākums:
      pozīcijaNobīdei(
        avots,
        sākumaNobīde
      ),
    beigas:
      pozīcijaNobīdei(
        avots,
        beiguNobīde
      )
  }
}

const imports =
  ast.elementi.find(
    mezgls =>
      mezgls.veids === "Imports"
  )

const saskarsme =
  ast.elementi.find(
    mezgls =>
      mezgls.veids ===
        "Saskarsme"
  )

const uzskaitījums =
  ast.elementi.find(
    mezgls =>
      mezgls.veids ===
        "Uzskaitījums"
  )

if (
  !imports ||
  !saskarsme ||
  !uzskaitījums
) {
  throw new Error(
    "AST trūkst kāda augšējā līmeņa deklarāciju diapazona regresijas mezgla"
  )
}

pārbaudiDiapazonu(
  imports.diapazons,
  gaidāmaisDeklarācijasDiapazons(
    teksts,
    "importē ",
    "\nsaskarsme "
  ),
  "Imports"
)

pārbaudiDiapazonu(
  saskarsme.diapazons,
  gaidāmaisDeklarācijasDiapazons(
    teksts,
    "saskarsme LietotājaDati",
    "\n\nuzskaitījums "
  ),
  "Saskarsme"
)

pārbaudiDiapazonu(
  uzskaitījums.diapazons,
  gaidāmaisDeklarācijasDiapazons(
    teksts,
    "uzskaitījums Loma",
    "\n\nklase "
  ),
  "Uzskaitījums"
)

const darbība = ast.elementi.find(
  mezgls =>
    mezgls.veids === "Darbība"
)

if (!darbība) {
  throw new Error(
    "AST nav atrasta augšējā līmeņa darbība"
  )
}

pārbaudiDiapazonu(
  darbība.diapazons,
  gaidāmaisDeklarācijasDiapazons(
    teksts,
    "eksportē asinhroni darbība ielādēLietotājus"
  ),
  "Darbība"
)

if (!Array.isArray(darbība.parametri)) {
  throw new Error(
    "Darbības parametri nav strukturēts AST masīvs"
  )
}

if (darbība.parametri.length !== 0) {
  throw new Error(
    "Kanoniskajai darbībai negaidīti parametri"
  )
}

if (
  darbība.parametruLeksiskoElementuSkaits !==
    0
) {
  throw new Error(
    "Kanoniskās darbības parametru leksisko elementu skaits nav 0"
  )
}

if (
  "parametruLeksiskieElementi" in darbība
) {
  throw new Error(
    "Darbības AST satur veco neviennozīmīgo parametruLeksiskieElementi lauku"
  )
}

const parametruParaugaAst =
  analizēSintaksi(
    analizēLeksiski(
      `darbība sveic(
  vārds: teksts,
  reizes: skaitlis
): teksts {
  atgriez vārds
}`,
      vārdnīca
    )
  )

const parametruParaugaDarbība =
  parametruParaugaAst.elementi.find(
    mezgls =>
      mezgls.veids === "Darbība" &&
      mezgls.nosaukums === "sveic"
  )

if (!parametruParaugaDarbība) {
  throw new Error(
    "Parametru regresijas AST nav atrasta darbība"
  )
}

const gaidītieDarbībasParametri = [
  {
    nosaukums: "vārds",
    tips: "teksts"
  },
  {
    nosaukums: "reizes",
    tips: "skaitlis"
  }
]

if (
  parametruParaugaDarbība.parametri.length !==
    gaidītieDarbībasParametri.length
) {
  throw new Error(
    "Darbības parametru AST ir negaidīts parametru skaits"
  )
}

for (
  let i = 0;
  i < gaidītieDarbībasParametri.length;
  i++
) {
  const faktiskais =
    parametruParaugaDarbība.parametri[i]

  const gaidītais =
    gaidītieDarbībasParametri[i]

  if (
    faktiskais.veids !== "Parametrs" ||
    faktiskais.nosaukums !==
      gaidītais.nosaukums ||
    faktiskais.tips !==
      gaidītais.tips ||
    !Number.isInteger(faktiskais.rinda)
  ) {
    throw new Error(
      `Darbības parametrs ${i + 1} neatbilst gaidītajam AST`
    )
  }
}

pārbaudiDiapazonu(
  parametruParaugaDarbība
    .parametri[0].diapazons,
  {
    sākums: {
      rinda: 2,
      kolonna: 3,
      nobīde: 17
    },
    beigas: {
      rinda: 2,
      kolonna: 16,
      nobīde: 30
    }
  },
  "Parametrs"
)

const identifikatoraAst =
  analizēIzteiksmesAst(
    analizēLeksiski(
      "vērtība",
      vārdnīca
    )
  )

if (
  identifikatoraAst?.veids !==
    "Identifikators"
) {
  throw new Error(
    "Diapazona regresijas izteiksme nav identifikators"
  )
}

pārbaudiDiapazonu(
  identifikatoraAst.diapazons,
  {
    sākums: {
      rinda: 1,
      kolonna: 1,
      nobīde: 0
    },
    beigas: {
      rinda: 1,
      kolonna: 8,
      nobīde: 7
    }
  },
  "Identifikators"
)

const īpašībasAst =
  analizēIzteiksmesAst(
    analizēLeksiski(
      "lietotājs.vārds",
      vārdnīca
    )
  )

if (
  īpašībasAst?.veids !==
    "Īpašība" ||
  īpašībasAst.nosaukums !==
    "vārds"
) {
  throw new Error(
    "Diapazona regresijas izteiksme nav īpašības piekļuve"
  )
}

pārbaudiDiapazonu(
  īpašībasAst.diapazons,
  {
    sākums: {
      rinda: 1,
      kolonna: 1,
      nobīde: 0
    },
    beigas: {
      rinda: 1,
      kolonna: 16,
      nobīde: 15
    }
  },
  "Īpašība"
)

const izsaukumaAst =
  analizēIzteiksmesAst(
    analizēLeksiski(
      "sveic(vārds, reizes)",
      vārdnīca
    )
  )

if (
  izsaukumaAst?.veids !==
    "Izsaukums" ||
  izsaukumaAst.argumenti.length !== 2
) {
  throw new Error(
    "Diapazona regresijas izteiksme nav izsaukums ar diviem argumentiem"
  )
}

pārbaudiDiapazonu(
  izsaukumaAst.diapazons,
  {
    sākums: {
      rinda: 1,
      kolonna: 1,
      nobīde: 0
    },
    beigas: {
      rinda: 1,
      kolonna: 21,
      nobīde: 20
    }
  },
  "Izsaukums"
)

const binārāsIzteiksmesAst =
  analizēIzteiksmesAst(
    analizēLeksiski(
      "vērtība + 1",
      vārdnīca
    )
  )

if (
  binārāsIzteiksmesAst?.veids !==
    "BināraIzteiksme" ||
  binārāsIzteiksmesAst.operators !== "+"
) {
  throw new Error(
    "Diapazona regresijas izteiksme nav bināra izteiksme"
  )
}

pārbaudiDiapazonu(
  binārāsIzteiksmesAst.diapazons,
  {
    sākums: {
      rinda: 1,
      kolonna: 1,
      nobīde: 0
    },
    beigas: {
      rinda: 1,
      kolonna: 12,
      nobīde: 11
    }
  },
  "BināraIzteiksme"
)

const piešķiršanasDiapazonaAst =
  analizēIzteiksmesAst(
    analizēLeksiski(
      "mērķis = vērtība + 1",
      vārdnīca
    )
  )

if (
  piešķiršanasDiapazonaAst?.veids !==
    "PiešķiršanasIzteiksme" ||
  piešķiršanasDiapazonaAst
    .vērtība?.veids !==
      "BināraIzteiksme"
) {
  throw new Error(
    "Diapazona regresijas izteiksme nav piešķiršana ar bināru vērtību"
  )
}

pārbaudiDiapazonu(
  piešķiršanasDiapazonaAst.diapazons,
  {
    sākums: {
      rinda: 1,
      kolonna: 1,
      nobīde: 0
    },
    beigas: {
      rinda: 1,
      kolonna: 21,
      nobīde: 20
    }
  },
  "PiešķiršanasIzteiksme"
)

pārbaudiDiapazonu(
  piešķiršanasDiapazonaAst
    .vērtība.diapazons,
  {
    sākums: {
      rinda: 1,
      kolonna: 10,
      nobīde: 9
    },
    beigas: {
      rinda: 1,
      kolonna: 21,
      nobīde: 20
    }
  },
  "PiešķiršanasIzteiksmes binārā vērtība"
)

const atgriešana =
  parametruParaugaDarbība
    .ķermenis[0]

if (
  atgriešana?.veids !==
    "Atgriešana"
) {
  throw new Error(
    "Diapazona regresijas priekšraksts nav atgriešana"
  )
}

pārbaudiDiapazonu(
  atgriešana.diapazons,
  {
    sākums: {
      rinda: 5,
      kolonna: 3,
      nobīde: 65
    },
    beigas: {
      rinda: 5,
      kolonna: 16,
      nobīde: 78
    }
  },
  "Atgriešana"
)

if (
  parametruParaugaDarbība
    .parametruLeksiskoElementuSkaits <= 0
) {
  throw new Error(
    "Darbības parametru pārejas skaits nav saglabāts"
  )
}

if (
  parametruParaugaDarbība.atgriezesTips !==
    "teksts"
) {
  throw new Error(
    "Parametru regresijas darbībai ir nepareizs atgriezes tips"
  )
}

if (
  parametruParaugaDarbība.ķermenis.length !==
    1 ||
  parametruParaugaDarbība
    .ķermenis[0].veids !==
      "Atgriešana"
) {
  throw new Error(
    "Parametru regresijas darbības ķermenis nav saglabāts"
  )
}

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

pārbaudiDiapazonu(
  klase.diapazons,
  gaidāmaisDeklarācijasDiapazons(
    teksts,
    "klase Lietotājs",
    "\n\neksportē asinhroni darbība "
  ),
  "Klase"
)

if (
  !Number.isInteger(
    klase.ķermeņaLeksiskoElementuSkaits
  ) ||
  klase.ķermeņaLeksiskoElementuSkaits <= 0
) {
  throw new Error(
    "Klases ķermeņa leksisko elementu skaits nav saglabāts"
  )
}

if ("ķermeņaLeksiskieElementi" in klase) {
  throw new Error(
    "Klases AST satur veco neviennozīmīgo ķermeņaLeksiskieElementi lauku"
  )
}

if (!Array.isArray(klase.ķermenis)) {
  throw new Error(
    "Klases AST ķermenis nav mezglu masīvs"
  )
}

const gaidītieKlasesMezgli = [
  "KlasesLauks",
  "KlasesLauks",
  "KlasesLauks",
  "KlasesLauks",
  "Konstruktors",
  "Iegūšana"
]

if (
  klase.ķermenis.length !==
  gaidītieKlasesMezgli.length
) {
  throw new Error(
    `Gaidīti ${gaidītieKlasesMezgli.length} klases ķermeņa mezgli, saņemti ${klase.ķermenis.length}`
  )
}

for (
  let i = 0;
  i < gaidītieKlasesMezgli.length;
  i++
) {
  if (
    klase.ķermenis[i].veids !==
    gaidītieKlasesMezgli[i]
  ) {
    throw new Error(
      `Klases ķermeņa mezgls ${i + 1} nav gaidītajā secībā`
    )
  }
}

const gaidītieLauki = [
  {
    nosaukums: "vārds",
    pieejamība: "public",
    nemaināms: true,
    tips: "teksts"
  },
  {
    nosaukums: "vecums",
    pieejamība: "public",
    nemaināms: false,
    tips: "skaitlis"
  },
  {
    nosaukums: "aktīvs",
    pieejamība: "protected",
    nemaināms: false,
    tips: "loģisks"
  },
  {
    nosaukums: "loma",
    pieejamība: "private",
    nemaināms: false,
    tips: "Loma"
  }
]

if (klase.lauki.length !== gaidītieLauki.length) {
  throw new Error(
    `Gaidīti ${gaidītieLauki.length} klases lauki, saņemti ${klase.lauki.length}`
  )
}

for (
  let i = 0;
  i < gaidītieLauki.length;
  i++
) {
  const faktiskais = klase.lauki[i]
  const gaidītais = gaidītieLauki[i]

  for (
    const lauks of [
      "nosaukums",
      "pieejamība",
      "nemaināms",
      "tips"
    ]
  ) {
    if (
      faktiskais[lauks] !==
      gaidītais[lauks]
    ) {
      throw new Error(
        `Klases lauka ${i + 1} neatbilstošs ${lauks}: ` +
        `${faktiskais[lauks]}`
      )
    }
  }
}

const gaidītieLaukuDiapazoni = [
  [
    "atvērts nemaināms vārds: teksts",
    "\n  atvērts vecums: skaitlis"
  ],
  [
    "atvērts vecums: skaitlis",
    "\n  aizsargāts aktīvs: loģisks"
  ],
  [
    "aizsargāts aktīvs: loģisks",
    "\n  privāts loma: Loma"
  ],
  [
    "privāts loma: Loma",
    "\n\n  konstruktors("
  ]
]

for (
  let i = 0;
  i < gaidītieLaukuDiapazoni.length;
  i++
) {
  const [
    sākumaFragments,
    nākamaisFragments
  ] =
    gaidītieLaukuDiapazoni[i]

  pārbaudiDiapazonu(
    klase.lauki[i].diapazons,
    gaidāmaisDeklarācijasDiapazons(
      teksts,
      sākumaFragments,
      nākamaisFragments
    ),
    `KlasesLauks ${i + 1}`
  )
}

if (!klase.konstruktors) {
  throw new Error(
    "Klases AST nav konstruktora"
  )
}

pārbaudiDiapazonu(
  klase.konstruktors.diapazons,
  gaidāmaisDeklarācijasDiapazons(
    teksts,
    "konstruktors(",
    "\n\n  ņem apraksts"
  ),
  "Konstruktors"
)

const gaidītieParametri = [
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
  gaidītieParametri.length
) {
  throw new Error(
    "Konstruktoram ir negaidīts parametru skaits"
  )
}

for (
  let i = 0;
  i < gaidītieParametri.length;
  i++
) {
  const faktiskais =
    klase.konstruktors.parametri[i]

  const gaidītais =
    gaidītieParametri[i]

  if (
    faktiskais.nosaukums !==
      gaidītais.nosaukums ||
    faktiskais.tips !==
      gaidītais.tips
  ) {
    throw new Error(
      `Konstruktora parametrs ${i + 1} neatbilst gaidītajam AST`
    )
  }
}

if (
  !Array.isArray(
    klase.konstruktors.ķermeņaLeksiskieElementi
  ) ||
  klase.konstruktors.ķermeņaLeksiskieElementi.length === 0
) {
  throw new Error(
    "Konstruktora ķermeņa leksiskie elementi nav saglabāti"
  )
}

if (
  !Array.isArray(
    klase.konstruktors.ķermenis
  )
) {
  throw new Error(
    "Konstruktora ķermenis nav strukturētu priekšrakstu masīvs"
  )
}

if (
  klase.konstruktors.ķermenis.length !== 4
) {
  throw new Error(
    `Gaidīti 4 konstruktora priekšraksti, saņemti ${klase.konstruktors.ķermenis.length}`
  )
}

for (
  let i = 0;
  i < klase.konstruktors.ķermenis.length;
  i++
) {
  const priekšraksts =
    klase.konstruktors.ķermenis[i]

  if (
    priekšraksts.veids !==
      "Izteiksme"
  ) {
    throw new Error(
      `Konstruktora priekšraksts ${i + 1} nav izteiksmes priekšraksts`
    )
  }

  if (
    priekšraksts.izteiksme?.veids !==
      "PiešķiršanasIzteiksme"
  ) {
    throw new Error(
      `Konstruktora priekšraksts ${i + 1} nesatur piešķiršanas AST`
    )
  }
}

if (klase.iegūšanas.length !== 1) {
  throw new Error(
    `Gaidīta 1 iegūšana, saņemta ${klase.iegūšanas.length}`
  )
}

const iegūšana = klase.iegūšanas[0]

if (
  iegūšana.nosaukums !== "apraksts" ||
  iegūšana.atgriezesTips !== "teksts"
) {
  throw new Error(
    "Iegūšanas AST neatbilst gaidītajai deklarācijai"
  )
}

pārbaudiDiapazonu(
  iegūšana.diapazons,
  gaidāmaisDeklarācijasDiapazons(
    teksts,
    "ņem apraksts",
    "\n}"
  ),
  "Iegūšana"
)

if (
  !Array.isArray(
    iegūšana.ķermeņaLeksiskieElementi
  ) ||
  iegūšana.ķermeņaLeksiskieElementi.length === 0
) {
  throw new Error(
    "Iegūšanas ķermeņa leksiskie elementi nav saglabāti"
  )
}

if (
  !Array.isArray(
    iegūšana.ķermenis
  )
) {
  throw new Error(
    "Iegūšanas ķermenis nav strukturētu priekšrakstu masīvs"
  )
}

if (iegūšana.ķermenis.length !== 1) {
  throw new Error(
    `Gaidīts 1 iegūšanas priekšraksts, saņemti ${iegūšana.ķermenis.length}`
  )
}

const iegūšanasPriekšraksts =
  iegūšana.ķermenis[0]

if (
  iegūšanasPriekšraksts.veids !==
    "Atgriešana"
) {
  throw new Error(
    "Iegūšanas priekšraksts nav atgriešanas priekšraksts"
  )
}

if (
  iegūšanasPriekšraksts.vērtība?.veids !==
    "Veidne"
) {
  throw new Error(
    "Iegūšanas atgriešanas vērtība nav veidnes AST"
  )
}

const veidne =
  iegūšanasPriekšraksts.vērtība

if (
  !Array.isArray(veidne.daļas) ||
  veidne.daļas.length !== 4
) {
  throw new Error(
    `Gaidītas 4 veidnes AST daļas, saņemtas ${veidne.daļas?.length ?? "nav"}`
  )
}

const gaidītāsVeidnesDaļas = [
  {
    veids: "VeidnesInterpolācija",
    nosaukums: "vārds"
  },
  {
    veids: "VeidnesTeksts",
    vērtība: " ("
  },
  {
    veids: "VeidnesInterpolācija",
    nosaukums: "vecums"
  },
  {
    veids: "VeidnesTeksts",
    vērtība: ")"
  }
]

for (
  let i = 0;
  i < gaidītāsVeidnesDaļas.length;
  i++
) {
  const faktiskā =
    veidne.daļas[i]

  const gaidītā =
    gaidītāsVeidnesDaļas[i]

  if (
    faktiskā.veids !==
      gaidītā.veids
  ) {
    throw new Error(
      `Veidnes daļa ${i + 1} nav gaidītā tipa`
    )
  }

  if (
    gaidītā.veids ===
      "VeidnesTeksts"
  ) {
    if (
      faktiskā.vērtība !==
        gaidītā.vērtība
    ) {
      throw new Error(
        `Veidnes teksta daļa ${i + 1} neatbilst gaidītajai vērtībai`
      )
    }

    continue
  }

  if (
    faktiskā.izteiksme?.veids !==
      "Īpašība" ||
    faktiskā.izteiksme
      .objekts?.veids !==
        "Šis" ||
    faktiskā.izteiksme
      .nosaukums !==
        gaidītā.nosaukums
  ) {
    throw new Error(
      `Veidnes interpolācija ${i + 1} neatbilst gaidītajam AST`
    )
  }
}

const veidnesInterpolācijas =
  veidne.daļas.filter(
    daļa =>
      daļa.veids ===
        "VeidnesInterpolācija"
  )

if (
  veidnesInterpolācijas.length !== 2
) {
  throw new Error(
    `Gaidītas 2 veidnes interpolācijas, saņemtas ${veidnesInterpolācijas.length}`
  )
}

const saliktasVeidnesAst =
  analizēIzteiksmesAst(
    analizēLeksiski(
      "`Rezultāts: ${vērtība + 1}`",
      vārdnīca
    )
  )

if (
  saliktasVeidnesAst?.veids !==
    "Veidne" ||
  saliktasVeidnesAst.daļas.length !==
    2
) {
  throw new Error(
    "Saliktas veidnes AST struktūra neatbilst gaidītajai"
  )
}

const saliktaInterpolācija =
  saliktasVeidnesAst.daļas[1]

if (
  saliktaInterpolācija.veids !==
    "VeidnesInterpolācija" ||
  saliktaInterpolācija
    .izteiksme?.veids !==
      "BināraIzteiksme" ||
  saliktaInterpolācija
    .izteiksme.operators !== "+" ||
  saliktaInterpolācija
    .izteiksme.kreisā?.veids !==
      "Identifikators" ||
  saliktaInterpolācija
    .izteiksme.kreisā.nosaukums !==
      "vērtība" ||
  saliktaInterpolācija
    .izteiksme.labā?.veids !==
      "Skaitlis" ||
  saliktaInterpolācija
    .izteiksme.labā.vērtība !== 1
) {
  throw new Error(
    "Veidnes interpolācija neizmanto pilno izteiksmju AST"
  )
}

const escapotasVeidnesAst =
  analizēIzteiksmesAst(
    analizēLeksiski(
      "`\\${navInterpolacija}`",
      vārdnīca
    )
  )

if (
  escapotasVeidnesAst?.veids !==
    "Veidne" ||
  !Array.isArray(
    escapotasVeidnesAst.daļas
  ) ||
  escapotasVeidnesAst.daļas.length !==
    1 ||
  escapotasVeidnesAst
    .daļas[0].veids !==
      "VeidnesTeksts"
) {
  throw new Error(
    "Escapots interpolācijas marķieris netika saglabāts kā veidnes teksts"
  )
}

if (
  escapotasVeidnesAst.daļas.some(
    daļa =>
      daļa.veids ===
        "VeidnesInterpolācija"
  )
) {
  throw new Error(
    "Escapots interpolācijas marķieris kļūdaini parsēts kā interpolācija"
  )
}

const metodesParaugaTeksts =
  `klase MetodesParaugs {
  atvērts darbība sveic(vārds: teksts): teksts {
    atgriez vārds
  }
}`

const metodesParaugaAst =
  analizēSintaksi(
    analizēLeksiski(
      metodesParaugaTeksts,
      vārdnīca
    )
  )

const metodesParaugaKlase =
  metodesParaugaAst.elementi.find(
    mezgls =>
      mezgls.veids === "Klase" &&
      mezgls.nosaukums ===
        "MetodesParaugs"
  )

if (!metodesParaugaKlase) {
  throw new Error(
    "Metodes regresijas AST nav atrasta klase"
  )
}

if (
  !Array.isArray(
    metodesParaugaKlase.metodes
  ) ||
  metodesParaugaKlase.metodes.length !== 1
) {
  throw new Error(
    "Klases metodes AST nav izveidots"
  )
}

const metode =
  metodesParaugaKlase.metodes[0]

if (
  metode.veids !== "Metode" ||
  metode.nosaukums !== "sveic" ||
  metode.pieejamība !== "public"
) {
  throw new Error(
    "Metodes deklarācijas AST neatbilst gaidītajam"
  )
}

pārbaudiDiapazonu(
  metode.diapazons,
  gaidāmaisDeklarācijasDiapazons(
    metodesParaugaTeksts,
    "atvērts darbība sveic",
    "\n}"
  ),
  "Metode"
)

if (
  metode.atgriezesTips !== "teksts"
) {
  throw new Error(
    "Metodes atgriezes tips neatbilst gaidītajam"
  )
}

if (
  !Array.isArray(metode.parametri) ||
  metode.parametri.length !== 1 ||
  metode.parametri[0].veids !==
    "Parametrs" ||
  metode.parametri[0].nosaukums !==
    "vārds" ||
  metode.parametri[0].tips !==
    "teksts"
) {
  throw new Error(
    "Metodes parametru AST neatbilst gaidītajam"
  )
}

if (
  !Array.isArray(metode.ķermenis) ||
  metode.ķermenis.length !== 1
) {
  throw new Error(
    "Metodes ķermenis nav strukturēts"
  )
}

const metodesPriekšraksts =
  metode.ķermenis[0]

if (
  metodesPriekšraksts.veids !==
    "Atgriešana" ||
  metodesPriekšraksts.vērtība?.veids !==
    "Identifikators" ||
  metodesPriekšraksts.vērtība.nosaukums !==
    "vārds"
) {
  throw new Error(
    "Metodes ķermeņa AST neatbilst gaidītajam"
  )
}

if (
  !Array.isArray(
    metode.ķermeņaLeksiskieElementi
  ) ||
  metode.ķermeņaLeksiskieElementi.length === 0
) {
  throw new Error(
    "Metodes neapstrādātie ķermeņa elementi nav saglabāti"
  )
}

if (
  !metodesParaugaKlase.ķermenis.includes(
    metode
  )
) {
  throw new Error(
    "Metode nav iekļauta klases ķermeņa AST"
  )
}

const piešķiršanas =
  klase.konstruktors.ķermenis.map(
    priekšraksts =>
      priekšraksts.izteiksme
  )

if (piešķiršanas.length !== 4) {
  throw new Error(
    `Gaidītas 4 konstruktora piešķiršanas izteiksmes, saņemtas ${piešķiršanas.length}`
  )
}

const gaidītieMērķi = [
  "vārds",
  "vecums",
  "aktīvs",
  "loma"
]

const gaidītieVērtībuVeidi = [
  "Identifikators",
  "Identifikators",
  "Loģisks",
  "Īpašība"
]

for (
  let i = 0;
  i < piešķiršanas.length;
  i++
) {
  const piešķiršana =
    piešķiršanas[i]

  if (
    piešķiršana.veids !==
      "PiešķiršanasIzteiksme" ||
    piešķiršana.operators !== "="
  ) {
    throw new Error(
      `Konstruktora piešķiršana ${i + 1} nav korekts piešķiršanas AST`
    )
  }

  if (
    piešķiršana.mērķis.veids !==
      "Īpašība" ||
    piešķiršana.mērķis.objekts.veids !==
      "Šis" ||
    piešķiršana.mērķis.nosaukums !==
      gaidītieMērķi[i]
  ) {
    throw new Error(
      `Konstruktora piešķiršanai ${i + 1} ir nepareizs mērķis`
    )
  }

  if (
    piešķiršana.vērtība.veids !==
      gaidītieVērtībuVeidi[i]
  ) {
    throw new Error(
      `Konstruktora piešķiršanai ${i + 1} ir nepareiza vērtība`
    )
  }
}

const piešķiršanasOperatori = [
  "=",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "**=",
  "&&=",
  "||=",
  "??="
]

for (
  const operators of piešķiršanasOperatori
) {
  const operatoraAst =
    analizēIzteiksmesAst(
      analizēLeksiski(
        `vērtība ${operators} 1`,
        vārdnīca
      )
    )

  if (
    operatoraAst.veids !==
      "PiešķiršanasIzteiksme" ||
    operatoraAst.operators !== operators ||
    operatoraAst.mērķis.veids !==
      "Identifikators" ||
    operatoraAst.vērtība.veids !==
      "Skaitlis"
  ) {
    throw new Error(
      `Piešķiršanas operators ${operators} neveido gaidīto AST`
    )
  }
}

const labāsAsociativitātesAst =
  analizēIzteiksmesAst(
    analizēLeksiski(
      "a = b = 1",
      vārdnīca
    )
  )

if (
  labāsAsociativitātesAst.veids !==
    "PiešķiršanasIzteiksme" ||
  labāsAsociativitātesAst.vērtība.veids !==
    "PiešķiršanasIzteiksme"
) {
  throw new Error(
    "Piešķiršanas izteiksme nav labēji asociatīva"
  )
}

let nederīgsMērķisNoraidīts = false

try {
  analizēIzteiksmesAst(
    analizēLeksiski(
      "1 = vērtība",
      vārdnīca
    )
  )
}
catch (kļūda) {
  nederīgsMērķisNoraidīts =
    kļūda instanceof SyntaxError &&
    kļūda.message.includes(
      "Nederīgs piešķiršanas mērķis"
    )
}

if (!nederīgsMērķisNoraidīts) {
  throw new Error(
    "Nederīgs piešķiršanas mērķis netika noraidīts"
  )
}

console.log("")
console.log("LatNe sintaktiskā analīze")
console.log(`Leksiskie elementi: ${leksiskieElementi.length}`)
console.log(
  `AST augšējie mezgli: ${ast.elementi.length}`
)

console.log(
  `Darbības parametri: ${darbība.parametri.length}`
)

console.log(
  `Darbības priekšraksti: ${darbība.ķermenis.length}`
)

console.log(
  `Klases ķermeņa mezgli: ${klase.ķermenis.length}`
)

console.log(
  `Klases lauki: ${klase.lauki.length}`
)

console.log(
  `Konstruktora parametri: ${klase.konstruktors.parametri.length}`
)

console.log(
  `Konstruktora priekšraksti: ${klase.konstruktors.ķermenis.length}`
)

console.log(
  `Iegūšanas: ${klase.iegūšanas.length}`
)

console.log(
  `Iegūšanas priekšraksti: ${iegūšana.ķermenis.length}`
)

console.log(
  `Veidnes daļas: ${veidne.daļas.length}`
)

console.log(
  `Veidnes interpolācijas: ${veidnesInterpolācijas.length}`
)

console.log("")
console.log("Programma")

for (
  let i = 0;
  i < ast.elementi.length;
  i++
) {
  const mezgls = ast.elementi[i]

  const pēdējais =
    i === ast.elementi.length - 1

  const zars =
    pēdējais ? "└─" : "├─"

  if (mezgls.veids === "Imports") {
    console.log(
      `${zars} Imports: ` +
      `${mezgls.vārdi.join(", ")} ` +
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
      `[${mezgls.vērtības.join(", ")}]`
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
      `[priekšraksti: ${mezgls.ķermenis.length}]`
    )
  }
}

console.log("")
console.log("Darbības un izteiksmju AST")

if (darbība) {
  console.log(
    JSON.stringify(
      darbība.ķermenis,
      null,
      2
    )
  )
}
