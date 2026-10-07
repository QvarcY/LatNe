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

const atlautiePaplasinajumi =
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
  "kluda"
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
  "uzskaitij"
]

function savacFailus(
  mape,
  rezultats
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
    const cels =
      join(
        mape,
        ieraksts.name
      )

    if (ieraksts.isDirectory()) {
      savacFailus(
        cels,
        rezultats
      )

      continue
    }

    if (
      !atlautiePaplasinajumi.has(
        extname(ieraksts.name)
      )
    ) {
      continue
    }

    rezultats.push(
      cels.replaceAll("\\", "/")
    )
  }
}

const faili = []

for (const sakne of saknes) {
  savacFailus(
    sakne,
    faili
  )
}

const parkapumi = []

for (const fails of faili) {
  const relativais =
    relative(
      ".",
      fails
    )
      .replaceAll("\\", "/")

  if (relativais === pats) {
    continue
  }

  const rindas =
    readFileSync(
      fails,
      "utf8"
    )
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
        parkapumi.push({
          fails: relativais,
          rinda: indekss + 1,
          vertiba: aizliegtais,
          veids: "identifikators"
        })
      }
    }

    for (
      const fragments
      of aizliegtieFragmenti
    ) {
      if (rinda.includes(fragments)) {
        parkapumi.push({
          fails: relativais,
          rinda: indekss + 1,
          vertiba: fragments,
          veids: "fragments"
        })
      }
    }
  }
}

const unikals = [
  ...new Map(
    parkapumi.map(
      parkapums => [
        [
          parkapums.fails,
          parkapums.rinda,
          parkapums.vertiba,
          parkapums.veids
        ].join("|"),
        parkapums
      ]
    )
  ).values()
]

if (unikals.length > 0) {
  console.error(
    "Atrasti transliterēti LatNe identifikatori:"
  )

  for (
    const parkapums
    of unikals
  ) {
    console.error(
      `${parkapums.fails}:${parkapums.rinda}  ${parkapums.vertiba} (${parkapums.veids})`
    )
  }

  process.exitCode = 1
}
else {
  console.log(
    `LatNe identifikatori OK: ${faili.length - 1} faili`
  )
}
