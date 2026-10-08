import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

import {
  izveidoVārdnīcu,
  analizēLeksiski
} from "../src/leksiskais-analizators.mjs"

import {
  analizēPriekšrakstus,
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

const zināmieAstVeidi =
  new Set([
    "Programma",
    "Imports",
    "Saskarsme",
    "Uzskaitījums",
    "Klase",
    "Darbība",
    "KlasesLauks",
    "Konstruktors",
    "Iegūšana",
    "Metode",
    "Parametrs",
    "Mainīgais",
    "Nosacījums",
    "KārtasCikls",
    "Atgriešana",
    "Metiens",
    "Mēģinājums",
    "Turpināšana",
    "Pārtraukšana",
    "Atkļūdošana",
    "Izteiksme",
    "Identifikators",
    "Skaitlis",
    "Teksts",
    "Veidne",
    "VeidnesTeksts",
    "VeidnesAizpildījums",
    "Nekas",
    "Loģisks",
    "Nenoteikts",
    "Šis",
    "Masīvs",
    "Grupa",
    "Īpašība",
    "Izsaukums",
    "Gaidīšana",
    "Jauns",
    "PirmsIzteiksme",
    "BināraIzteiksme",
    "PiešķiršanasIzteiksme"
  ])

function pārbaudiAstDiapazonus(
  vērtība,
  atrastieVeidi,
  vecākaDiapazons = null
) {
  if (Array.isArray(vērtība)) {
    for (const elements of vērtība) {
      pārbaudiAstDiapazonus(
        elements,
        atrastieVeidi,
        vecākaDiapazons
      )
    }

    return
  }

  if (
    !vērtība ||
    typeof vērtība !== "object"
  ) {
    return
  }

  let šīMezglaDiapazons =
    vecākaDiapazons

  if (
    typeof vērtība.veids === "string" &&
    zināmieAstVeidi.has(
      vērtība.veids
    )
  ) {
    const diapazons =
      vērtība.diapazons

    if (
      !diapazons ||
      !Number.isInteger(
        diapazons.sākums?.rinda
      ) ||
      !Number.isInteger(
        diapazons.sākums?.kolonna
      ) ||
      !Number.isInteger(
        diapazons.sākums?.nobīde
      ) ||
      !Number.isInteger(
        diapazons.beigas?.rinda
      ) ||
      !Number.isInteger(
        diapazons.beigas?.kolonna
      ) ||
      !Number.isInteger(
        diapazons.beigas?.nobīde
      ) ||
      diapazons.sākums.rinda < 1 ||
      diapazons.sākums.kolonna < 1 ||
      diapazons.sākums.nobīde < 0 ||
      diapazons.beigas.rinda < 1 ||
      diapazons.beigas.kolonna < 1 ||
      diapazons.beigas.nobīde <
        diapazons.sākums.nobīde
    ) {
      throw new Error(
        `AST mezglam ${vērtība.veids} nav derīga pirmkoda diapazona`
      )
    }

    if (
      vecākaDiapazons &&
      (
        diapazons.sākums.nobīde <
          vecākaDiapazons.sākums.nobīde ||
        diapazons.beigas.nobīde >
          vecākaDiapazons.beigas.nobīde
      )
    ) {
      throw new Error(
        `AST mezgla ${vērtība.veids} diapazons iziet ārpus vecāka mezgla robežām`
      )
    }

    atrastieVeidi.add(
      vērtība.veids
    )

    šīMezglaDiapazons =
      diapazons
  }

  for (
    const [
      atslēga,
      bērns
    ] of Object.entries(vērtība)
  ) {
    if (
      atslēga === "diapazons" ||
      atslēga ===
        "ķermeņaLeksiskieElementi"
    ) {
      continue
    }

    pārbaudiAstDiapazonus(
      bērns,
      atrastieVeidi,
      šīMezglaDiapazons
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

const mēģinājumsBezĶer =
  analizēPriekšrakstus(
    analizēLeksiski(
      `mēģini {
  atkļūdo
} beigās {
  atkļūdo
}`,
      vārdnīca
    )
  )[0]

if (
  mēģinājumsBezĶer?.veids !==
    "Mēģinājums" ||
  mēģinājumsBezĶer.ķer !== null ||
  !Array.isArray(
    mēģinājumsBezĶer.beigas
  ) ||
  mēģinājumsBezĶer.beigas
    .length !== 1
) {
  throw new Error(
    "Mēģinājums bez ķer neveido gaidīto AST"
  )
}

const mēģinājumsArĶer =
  analizēPriekšrakstus(
    analizēLeksiski(
      `mēģini {
  atkļūdo
} ķer (kļūda) {
  atkļūdo
}`,
      vārdnīca
    )
  )[0]

if (
  mēģinājumsArĶer?.veids !==
    "Mēģinājums" ||
  !mēģinājumsArĶer.ķer ||
  mēģinājumsArĶer.ķer.parametrs !==
    "kļūda" ||
  !Array.isArray(
    mēģinājumsArĶer.ķer.ķermenis
  ) ||
  mēģinājumsArĶer.ķer.ķermenis
    .length !== 1 ||
  mēģinājumsArĶer.ķer.ķermenis[0]
    ?.veids !== "Atkļūdošana" ||
  "veids" in mēģinājumsArĶer.ķer ||
  "rinda" in mēģinājumsArĶer.ķer ||
  "diapazons" in mēģinājumsArĶer.ķer
) {
  throw new Error(
    "Mēģinājums.ķer nav gaidītais iekšējais objekts"
  )
}

const mēģinājumsArTukšuĶer =
  analizēPriekšrakstus(
    analizēLeksiski(
      `mēģini {
  atkļūdo
} ķer () {
}`,
      vārdnīca
    )
  )[0]

if (
  !mēģinājumsArTukšuĶer?.ķer ||
  mēģinājumsArTukšuĶer.ķer.parametrs !==
    null ||
  !Array.isArray(
    mēģinājumsArTukšuĶer.ķer.ķermenis
  ) ||
  mēģinājumsArTukšuĶer.ķer.ķermenis
    .length !== 0
) {
  throw new Error(
    "Tukšs Mēģinājums.ķer neatbilst gaidītajam AST"
  )
}

const nosacījumsBezCitādi =
  analizēPriekšrakstus(
    analizēLeksiski(
      `ja (patiess) {
  atkļūdo
}`,
      vārdnīca
    )
  )[0]

if (
  nosacījumsBezCitādi?.veids !==
    "Nosacījums" ||
  nosacījumsBezCitādi.citādi !==
    null
) {
  throw new Error(
    "Nosacījums bez citādi neizmanto null"
  )
}

const nosacījumsArTukšuCitādi =
  analizēPriekšrakstus(
    analizēLeksiski(
      `ja (patiess) {
  atkļūdo
} citādi {
}`,
      vārdnīca
    )
  )[0]

if (
  nosacījumsArTukšuCitādi?.veids !==
    "Nosacījums" ||
  !Array.isArray(
    nosacījumsArTukšuCitādi.citādi
  ) ||
  nosacījumsArTukšuCitādi.citādi
    .length !== 0
) {
  throw new Error(
    "Tukšs citādi neveido tukšu priekšrakstu masīvu"
  )
}

const nosacījumsArCitādiJa =
  analizēPriekšrakstus(
    analizēLeksiski(
      `ja (patiess) {
  atkļūdo
} citādi ja (nepatiess) {
  atkļūdo
} citādi {
}`,
      vārdnīca
    )
  )[0]

const iegultaisNosacījums =
  nosacījumsArCitādiJa
    ?.citādi?.[0]

if (
  nosacījumsArCitādiJa?.veids !==
    "Nosacījums" ||
  !Array.isArray(
    nosacījumsArCitādiJa.citādi
  ) ||
  nosacījumsArCitādiJa.citādi
    .length !== 1 ||
  iegultaisNosacījums?.veids !==
    "Nosacījums" ||
  !Array.isArray(
    iegultaisNosacījums.ķermenis
  ) ||
  iegultaisNosacījums.ķermenis
    .length !== 1 ||
  iegultaisNosacījums.ķermenis[0]
    ?.veids !== "Atkļūdošana" ||
  !Array.isArray(
    iegultaisNosacījums.citādi
  ) ||
  iegultaisNosacījums.citādi
    .length !== 0
) {
  throw new Error(
    "citādi ja neveido iegultu Nosacījums priekšrakstu"
  )
}

const deklarācijuSemantikasParaugi = [
  [
    "nemainīgs vērtība = 1",
    "konstante"
  ],
  [
    "lai vērtība = 1",
    "mainīgais"
  ],
  [
    "mainīgs vērtība = 1",
    "funkcijasMainīgais"
  ]
]

for (
  const [
    avots,
    gaidītāDeklarācija
  ] of deklarācijuSemantikasParaugi
) {
  const mezgli =
    analizēPriekšrakstus(
      analizēLeksiski(
        avots,
        vārdnīca
      )
    )

  if (
    mezgli.length !== 1 ||
    mezgli[0]?.veids !==
      "Mainīgais" ||
    mezgli[0].deklarācija !==
      gaidītāDeklarācija
  ) {
    throw new Error(
      `Mainīgais.deklarācija neatbilst semantikai: ${avots}`
    )
  }
}

const skaitītājaCiklaAvots =
  `kam (lai i = 0; i < 10; i += 1) {
  atkļūdo
}`

const skaitītājaCiklaAst =
  analizēPriekšrakstus(
    analizēLeksiski(
      skaitītājaCiklaAvots,
      vārdnīca
    )
  )

const skaitītājaCikls =
  skaitītājaCiklaAst[0]

if (
  skaitītājaCiklaAst.length !== 1 ||
  skaitītājaCikls?.veids !==
    "KārtasCikls" ||
  skaitītājaCikls.variants !==
    "skaitītājs"
) {
  throw new Error(
    "Skaitītāja KārtasCikls neveido gaidīto AST"
  )
}

if (
  skaitītājaCikls.sākums?.veids !==
    "Mainīgais" ||
  skaitītājaCikls.sākums.deklarācija !==
    "mainīgais" ||
  skaitītājaCikls.sākums.nosaukums !==
    "i" ||
  skaitītājaCikls.sākums.vērtība?.veids !==
    "Skaitlis" ||
  skaitītājaCikls.sākums.vērtība.vērtība !==
    0
) {
  throw new Error(
    "Skaitītāja KārtasCikls sākums neatbilst gaidītajam AST"
  )
}

if (
  skaitītājaCikls.nosacījums?.veids !==
    "BināraIzteiksme" ||
  skaitītājaCikls.nosacījums.operators !==
    "<" ||
  skaitītājaCikls.nosacījums.kreisā?.veids !==
    "Identifikators" ||
  skaitītājaCikls.nosacījums.kreisā.nosaukums !==
    "i" ||
  skaitītājaCikls.nosacījums.labā?.veids !==
    "Skaitlis" ||
  skaitītājaCikls.nosacījums.labā.vērtība !==
    10
) {
  throw new Error(
    "Skaitītāja KārtasCikls nosacījums neatbilst gaidītajam AST"
  )
}

if (
  skaitītājaCikls.solis?.veids !==
    "PiešķiršanasIzteiksme" ||
  skaitītājaCikls.solis.operators !==
    "+=" ||
  skaitītājaCikls.solis.mērķis?.veids !==
    "Identifikators" ||
  skaitītājaCikls.solis.mērķis.nosaukums !==
    "i" ||
  skaitītājaCikls.solis.vērtība?.veids !==
    "Skaitlis" ||
  skaitītājaCikls.solis.vērtība.vērtība !==
    1
) {
  throw new Error(
    "Skaitītāja KārtasCikls solis neatbilst gaidītajam AST"
  )
}

if (
  !Array.isArray(
    skaitītājaCikls.ķermenis
  ) ||
  skaitītājaCikls.ķermenis.length !== 1 ||
  skaitītājaCikls.ķermenis[0].veids !==
    "Atkļūdošana"
) {
  throw new Error(
    "Skaitītāja KārtasCikls ķermenis neatbilst gaidītajam AST"
  )
}

for (
  const lauks of [
    "deklarācija",
    "mainīgais",
    "kolekcija",
    "izteiksme"
  ]
) {
  if (lauks in skaitītājaCikls) {
    throw new Error(
      `Skaitītāja KārtasCikls satur cita varianta lauku: ${lauks}`
    )
  }
}

const kolekcijasCiklaAvots =
  `kam (nemainīgs ieraksts ar dati) {
  atkļūdo
}`

const kolekcijasCiklaAst =
  analizēPriekšrakstus(
    analizēLeksiski(
      kolekcijasCiklaAvots,
      vārdnīca
    )
  )

const kolekcijasCikls =
  kolekcijasCiklaAst[0]

if (
  kolekcijasCiklaAst.length !== 1 ||
  kolekcijasCikls?.veids !==
    "KārtasCikls" ||
  kolekcijasCikls.variants !== "kolekcija" ||
  kolekcijasCikls.deklarācija !==
    "konstante" ||
  kolekcijasCikls.mainīgais !==
    "ieraksts" ||
  kolekcijasCikls.kolekcija?.veids !==
    "Identifikators" ||
  kolekcijasCikls.kolekcija.nosaukums !==
    "dati"
) {
  throw new Error(
    "Kolekcijas KārtasCikls neveido gaidīto AST"
  )
}

for (
  const lauks of [
    "sākums",
    "nosacījums",
    "solis"
  ]
) {
  if (lauks in kolekcijasCikls) {
    throw new Error(
      `Kolekcijas KārtasCikls satur skaitītāja lauku: ${lauks}`
    )
  }
}

let nepilnīgaSkaitītājaGalveneNoraidīta =
  false

try {
  analizēPriekšrakstus(
    analizēLeksiski(
      `kam (i < 10) {
  atkļūdo
}`,
      vārdnīca
    )
  )
}
catch (kļūda) {
  nepilnīgaSkaitītājaGalveneNoraidīta =
    kļūda instanceof SyntaxError
}

if (
  !nepilnīgaSkaitītājaGalveneNoraidīta
) {
  throw new Error(
    "Nepilnīga skaitītāja cikla galvene netika noraidīta"
  )
}

const veidaOperatoraAst =
  analizēIzteiksmesAst(
    analizēLeksiski(
      "veids vērtība",
      vārdnīca
    )
  )

if (
  veidaOperatoraAst?.veids !==
    "PirmsIzteiksme" ||
  veidaOperatoraAst.operators !==
    "veids" ||
  veidaOperatoraAst.izteiksme?.veids !==
    "Identifikators" ||
  veidaOperatoraAst.izteiksme.nosaukums !==
    "vērtība"
) {
  throw new Error(
    "veids operators neveido latvisku AST semantiku"
  )
}

const darbībaBezAtgriezesTipaAst =
  analizēSintaksi(
    analizēLeksiski(
      `darbība bezTipa() {
  atkļūdo
}`,
      vārdnīca
    )
  )

const darbībaBezAtgriezesTipa =
  darbībaBezAtgriezesTipaAst
    .elementi[0]

if (
  darbībaBezAtgriezesTipa?.veids !==
    "Darbība" ||
  darbībaBezAtgriezesTipa.atgriezesTips !==
    null
) {
  throw new Error(
    "Darbība bez atgriezes tipa neizmanto null"
  )
}

const metodeBezAtgriezesTipaAst =
  analizēSintaksi(
    analizēLeksiski(
      `klase BezTipa {
  darbība dari() {
    atkļūdo
  }
}`,
      vārdnīca
    )
  )

const metodeBezAtgriezesTipa =
  metodeBezAtgriezesTipaAst
    .elementi[0]
    ?.metodes?.[0]

if (
  metodeBezAtgriezesTipa?.veids !==
    "Metode" ||
  metodeBezAtgriezesTipa.atgriezesTips !==
    null
) {
  throw new Error(
    "Metode bez atgriezes tipa neizmanto null"
  )
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
    veids: "VeidnesAizpildījums",
    nosaukums: "vārds"
  },
  {
    veids: "VeidnesTeksts",
    vērtība: " ("
  },
  {
    veids: "VeidnesAizpildījums",
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
      `Veidnes aizpildījums ${i + 1} neatbilst gaidītajam AST`
    )
  }
}

const veidnesAizpildījumi =
  veidne.daļas.filter(
    daļa =>
      daļa.veids ===
        "VeidnesAizpildījums"
  )

if (
  veidnesAizpildījumi.length !== 2
) {
  throw new Error(
    `Gaidītas 2 veidnes aizpildījumi, saņemtas ${veidnesAizpildījumi.length}`
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

const saliktsAizpildījums =
  saliktasVeidnesAst.daļas[1]

if (
  saliktsAizpildījums.veids !==
    "VeidnesAizpildījums" ||
  saliktsAizpildījums
    .izteiksme?.veids !==
      "BināraIzteiksme" ||
  saliktsAizpildījums
    .izteiksme.operators !== "+" ||
  saliktsAizpildījums
    .izteiksme.kreisā?.veids !==
      "Identifikators" ||
  saliktsAizpildījums
    .izteiksme.kreisā.nosaukums !==
      "vērtība" ||
  saliktsAizpildījums
    .izteiksme.labā?.veids !==
      "Skaitlis" ||
  saliktsAizpildījums
    .izteiksme.labā.vērtība !== 1
) {
  throw new Error(
    "Veidnes aizpildījums neizmanto pilno izteiksmju AST"
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
    "Escapots aizpildījuma marķieris netika saglabāts kā veidnes teksts"
  )
}

if (
  escapotasVeidnesAst.daļas.some(
    daļa =>
      daļa.veids ===
        "VeidnesAizpildījums"
  )
) {
  throw new Error(
    "Escapots aizpildījuma marķieris kļūdaini parsēts kā aizpildījums"
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

const izteiksmjuDiapazonaParaugi = [
  "vērtība",
  "1_000",
  "\"teksts\"",
  "`A ${vērtība}`",
  "nekas",
  "patiess",
  "nenoteikts",
  "šis",
  "[]",
  "(vērtība)",
  "vērtība.nosaukums",
  "sveic()",
  "gaidi sveic()",
  "jauns Lietotājs()",
  "-vērtība",
  "veids vērtība",
  "vērtība + 1",
  "vērtība = 1"
]

const auditētieAstVeidi =
  new Set()

pārbaudiAstDiapazonus(
  ast,
  auditētieAstVeidi
)

pārbaudiAstDiapazonus(
  metodesParaugaAst,
  auditētieAstVeidi
)

pārbaudiAstDiapazonus(
  skaitītājaCiklaAst,
  auditētieAstVeidi
)

pārbaudiAstDiapazonus(
  kolekcijasCiklaAst,
  auditētieAstVeidi
)

for (
  const avots
  of izteiksmjuDiapazonaParaugi
) {
  const izteiksmesAst =
    analizēIzteiksmesAst(
      analizēLeksiski(
        avots,
        vārdnīca
      )
    )

  pārbaudiDiapazonu(
    izteiksmesAst.diapazons,
    {
      sākums:
        pozīcijaNobīdei(
          avots,
          0
        ),
      beigas:
        pozīcijaNobīdei(
          avots,
          avots.length
        )
    },
    `Izteiksmes paraugs: ${avots}`
  )

  pārbaudiAstDiapazonus(
    izteiksmesAst,
    auditētieAstVeidi
  )
}

const pārtraukšanasAvots =
  "beidz"

const pārtraukšanasAst =
  analizēPriekšrakstus(
    analizēLeksiski(
      pārtraukšanasAvots,
      vārdnīca
    )
  )

if (
  pārtraukšanasAst.length !== 1 ||
  pārtraukšanasAst[0].veids !==
    "Pārtraukšana"
) {
  throw new Error(
    "Pārtraukšanas diapazona paraugs neveido gaidīto AST"
  )
}

pārbaudiDiapazonu(
  pārtraukšanasAst[0].diapazons,
  {
    sākums:
      pozīcijaNobīdei(
        pārtraukšanasAvots,
        0
      ),
    beigas:
      pozīcijaNobīdei(
        pārtraukšanasAvots,
        pārtraukšanasAvots.length
      )
  },
  "Pārtraukšana"
)

pārbaudiAstDiapazonus(
  pārtraukšanasAst,
  auditētieAstVeidi
)

const tukšaProgramma =
  analizēSintaksi([])

pārbaudiDiapazonu(
  tukšaProgramma.diapazons,
  {
    sākums: {
      rinda: 1,
      kolonna: 1,
      nobīde: 0
    },
    beigas: {
      rinda: 1,
      kolonna: 1,
      nobīde: 0
    }
  },
  "Tukša Programma"
)

pārbaudiDiapazonu(
  ast.diapazons,
  {
    sākums:
      pozīcijaNobīdei(
        teksts,
        0
      ),
    beigas:
      pozīcijaNobīdei(
        teksts,
        teksts.trimEnd().length
      )
  },
  "Programma"
)

const trūkstošieAstVeidi = [
  ...zināmieAstVeidi
].filter(
  veids =>
    !auditētieAstVeidi.has(
      veids
    )
)

if (trūkstošieAstVeidi.length > 0) {
  throw new Error(
    "AST diapazonu audits nav pārklājis mezglus: " +
    trūkstošieAstVeidi.join(", ")
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
  `Veidnes aizpildījumss: ${veidnesAizpildījumi.length}`
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
