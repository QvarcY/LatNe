import {
  readdirSync,
  readFileSync
} from "node:fs"

import {
  extname,
  join,
  relative
} from "node:path"

const saknes = [
  "packages/valoda/src",
  "packages/valoda/scripts",
  "tests"
]

const atļautiePaplašinājumi =
  new Set([
    ".mjs",
    ".js",
    ".ts",
    ".tsx"
  ])

const pats =
  "packages/valoda/scripts/pārbaudīt-latviskos-identifikatorus.mjs"

const aizliegtieIdentifikatori = [
  "izveidoVardnicu",
  "analizeLeksiski",
  "analizeIzteiksmi",
  "analizePrieksrakstus",
  "analizeSintaksi",
  "analizeKlasesKermeni",
  "analizeParametrus",
  "vertiba",
  "vertibas",
  "dalas",
  "dala",
  "interpolacija",
  "deklaracija",
  "mainigais",
  "nosacijums",
  "kermenis",
  "megina",
  "ker",
  "citadi",
  "eksporteta",
  "kermenaLeksiskieElementi",
  "kermenaLeksiskoElementuSkaits",
  "pieejamiba",
  "nemainams",
  "kreisa",
  "laba",
  "merkis",
  "sakums",
  "nobide",
  "pozicija",
  "vardnica",
  "dzilums",
  "ipasiba",
  "prieksraksts",
  "pazinojumi",
  "kluda",
  "meginaLeksiskieElementi",
  "atlautiePaplasinajumi",
  "savacFailus",
  "rezultats",
  "cels",
  "parkapumi",
  "relativais",
  "unikals",
  "parkapums",
  "getteris",
  "getteri",
  "raw"
]

const aizliegtieFragmenti = [
  "analize",
  "Vardnic",
  "vardnic",
  "vertib",
  "kermen",
  "pieejamib",
  "nemainam",
  "sakum",
  "nobid",
  "pozicij",
  "interpolacij",
  "deklaracij",
  "mainig",
  "nosacij",
  "pieskirs",
  "prioritat",
  "ipasib",
  "prieksrakst",
  "pazinojum",
  "klud",
  "dzil",
  "figuriiekav",
  "kvadratiekav",
  "uzskaitij",
  "megina",
  "parkap",
  "paplasin",
  "savac",
  "unikal",
  "rezultat",
  "getter",
  "Getter",
  "raw"
]

function savācFailus(
  mape,
  rezultāts
) {
  for (
    const ieraksts
    of readdirSync(
      mape,
      {
        withFileTypes: true
      }
    )
  ) {
    const ceļš =
      join(
        mape,
        ieraksts.name
      )

    if (ieraksts.isDirectory()) {
      savācFailus(
        ceļš,
        rezultāts
      )

      continue
    }

    if (
      !atļautiePaplašinājumi.has(
        extname(ieraksts.name)
      )
    ) {
      continue
    }

    rezultāts.push(
      ceļš.replaceAll("\\", "/")
    )
  }
}

const faili = []

for (const sakne of saknes) {
  savācFailus(
    sakne,
    faili
  )
}

const pārkāpumi = []

for (const fails of faili) {
  const relatīvais =
    relative(
      ".",
      fails
    )
      .replaceAll("\\", "/")

  let failsTeksts =
    readFileSync(
      fails,
      "utf8"
    )

  if (relatīvais === pats) {
    failsTeksts =
      failsTeksts
        .replace(
          /const aizliegtieIdentifikatori = \[[\s\S]*?\]\r?\n\r?\nconst aizliegtieFragmenti = \[[\s\S]*?\]\r?\n/u,
          ""
        )
  }

  const rindas =
    failsTeksts
      .split(/\r?\n/u)

  for (
    let indekss = 0;
    indekss < rindas.length;
    indekss++
  ) {
    const rinda =
      rindas[indekss]

    for (
      const aizliegtais
      of aizliegtieIdentifikatori
    ) {
      const izteiksme =
        new RegExp(
          `(?<![$_\\p{L}\\p{N}])${aizliegtais}(?![$_\\p{L}\\p{N}])`,
          "u"
        )

      if (izteiksme.test(rinda)) {
        pārkāpumi.push({
          fails: relatīvais,
          rinda: indekss + 1,
          vērtība: aizliegtais,
          veids: "identifikators"
        })
      }
    }

    for (
      const fragments
      of aizliegtieFragmenti
    ) {
      if (rinda.includes(fragments)) {
        pārkāpumi.push({
          fails: relatīvais,
          rinda: indekss + 1,
          vērtība: fragments,
          veids: "fragments"
        })
      }
    }
  }
}

const unikāls = [
  ...new Map(
    pārkāpumi.map(
      pārkāpums => [
        [
          pārkāpums.fails,
          pārkāpums.rinda,
          pārkāpums.vērtība,
          pārkāpums.veids
        ].join("|"),
        pārkāpums
      ]
    )
  ).values()
]

if (unikāls.length > 0) {
  console.error(
    "Atrasti nekanoniski LatNe identifikatori vai fragmenti:"
  )

  for (
    const pārkāpums
    of unikāls
  ) {
    console.error(
      `${pārkāpums.fails}:${pārkāpums.rinda}  ${pārkāpums.vērtība} (${pārkāpums.veids})`
    )
  }

  process.exitCode = 1
}
else {
  console.log(
    `LatNe identifikatori OK: ${faili.length} faili`
  )
}
