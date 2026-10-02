import { readFile, readdir } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import {
  izveidoVardnicu,
  tokenize
} from "../packages/valoda/src/tokenizer.mjs"

import {
  parse
} from "../packages/valoda/src/parser.mjs"

const fixturesRoot = fileURLToPath(
  new URL("./fixtures/", import.meta.url)
)

const registryPath = fileURLToPath(
  new URL(
    "../packages/valoda/data/termini.json",
    import.meta.url
  )
)

const registry = JSON.parse(
  await readFile(registryPath, "utf8")
)

const vardnica = izveidoVardnicu(registry)

const grupas = [
  {
    nosaukums: "valid",
    parsējas: true
  },
  {
    nosaukums: "invalid",
    parsējas: false
  },
  {
    nosaukums: "edge-case",
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
    fixturesRoot,
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
      `Fixture grupa ir tukša: ${grupa.nosaukums}`
    )
  }

  for (const fails of faili) {
    paraugi++

    const cela = join(mape, fails)

    const teksts = await readFile(
      cela,
      "utf8"
    )

    const tokeni = tokenize(
      teksts,
      vardnica
    )

    const nezinamie = tokeni.filter(
      tokens =>
        tokens.veids === "nezināms"
    )

    if (nezinamie.length > 0) {
      throw new Error(
        `${grupa.nosaukums}/${fails}: ` +
        `${nezinamie.length} nezināmi tokeni`
      )
    }

    let kluda = null

    try {
      parse(tokeni)
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
        `negaidīta parsera kļūda: ${kluda.message}`
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
  `LatNe regression fixtures OK: ${paraugi}`
)
