import { readFile, readdir } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import {
  izveidoVardnicu,
  analizeLeksiski
} from "../packages/valoda/src/leksiskais-analizators.mjs"

import {
  analizeSintaksi
} from "../packages/valoda/src/sintaktiskais-analizators.mjs"

const parauguSakne = fileURLToPath(
  new URL("./paraugi/", import.meta.url)
)

const registryPath = fileURLToPath(
  new URL(
    "../packages/valoda/data/termini.json",
    import.meta.url
  )
)

const registrs = JSON.parse(
  await readFile(registryPath, "utf8")
)

const vardnica = izveidoVardnicu(registrs)

const grupas = [
  {
    nosaukums: "derigi",
    parsējas: true
  },
  {
    nosaukums: "nederigi",
    parsējas: false
  },
  {
    nosaukums: "robezgadijumi",
    parsējas: true
  },
  {
    nosaukums: "unicode",
    parsējas: true
  }
]

let paraugi = 0

for (const grupa of grupas) {
  const mape = join(
    parauguSakne,
    grupa.nosaukums
  )

  const faili = (
    await readdir(mape)
  )
    .filter(fails =>
      fails.endsWith(".lat")
    )
    .sort()

  if (faili.length === 0) {
    throw new Error(
      `Paraugu grupa ir tukša: ${grupa.nosaukums}`
    )
  }

  for (const fails of faili) {
    paraugi++

    const cela = join(mape, fails)

    const teksts = await readFile(
      cela,
      "utf8"
    )

    const leksiskieElementi = analizeLeksiski(
      teksts,
      vardnica
    )

    const nezinamie = leksiskieElementi.filter(
      leksiskaisElements =>
        leksiskaisElements.veids === "nezināms"
    )

    if (nezinamie.length > 0) {
      throw new Error(
        `${grupa.nosaukums}/${fails}: ` +
        `${nezinamie.length} nezināmi leksiskieElementi`
      )
    }

    let kluda = null

    try {
      analizeSintaksi(leksiskieElementi)
    }
    catch (error) {
      kluda = error
    }

    if (
      grupa.parsējas &&
      kluda
    ) {
      throw new Error(
        `${grupa.nosaukums}/${fails}: ` +
        `negaidīta sintaktiskās analīzes kļūda: ${kluda.message}`
      )
    }

    if (
      !grupa.parsējas &&
      !kluda
    ) {
      throw new Error(
        `${grupa.nosaukums}/${fails}: ` +
        "nederīgais paraugs negaidīti parsējās"
      )
    }

    const rezultats =
      grupa.parsējas
        ? "OK"
        : "REJECTED"

    console.log(
      `${rezultats}  ${grupa.nosaukums}/${fails}`
    )
  }
}

console.log("")
console.log(
  `LatNe regresijas paraugi OK: ${paraugi}`
)
