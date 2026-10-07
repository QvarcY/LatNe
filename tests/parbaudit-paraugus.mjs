import { readFile, readdir } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import {
  izveidoVārdnīcu,
  analizēLeksiski
} from "../packages/valoda/src/leksiskais-analizators.mjs"

import {
  analizēSintaksi
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

const vārdnīca = izveidoVārdnīcu(registrs)

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

    const ceļa = join(mape, fails)

    const teksts = await readFile(
      ceļa,
      "utf8"
    )

    const leksiskieElementi = analizēLeksiski(
      teksts,
      vārdnīca
    )

    const nezināmie = leksiskieElementi.filter(
      leksiskaisElements =>
        leksiskaisElements.veids === "nezināms"
    )

    if (nezināmie.length > 0) {
      throw new Error(
        `${grupa.nosaukums}/${fails}: ` +
        `${nezināmie.length} nezināmi leksiskieElementi`
      )
    }

    let kļūda = null

    try {
      analizēSintaksi(leksiskieElementi)
    }
    catch (error) {
      kļūda = error
    }

    if (
      grupa.parsējas &&
      kļūda
    ) {
      throw new Error(
        `${grupa.nosaukums}/${fails}: ` +
        `negaidīta sintaktiskās analīzes kļūda: ${kļūda.message}`
      )
    }

    if (
      !grupa.parsējas &&
      !kļūda
    ) {
      throw new Error(
        `${grupa.nosaukums}/${fails}: ` +
        "nederīgais paraugs negaidīti parsējās"
      )
    }

    const rezultāts =
      grupa.parsējas
        ? "OK"
        : "REJECTED"

    console.log(
      `${rezultāts}  ${grupa.nosaukums}/${fails}`
    )
  }
}

console.log("")
console.log(
  `LatNe regresijas paraugi OK: ${paraugi}`
)
