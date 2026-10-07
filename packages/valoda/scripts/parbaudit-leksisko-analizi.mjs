import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import {
  izveidoVārdnīcu,
  analizēLeksiski
} from "../src/leksiskais-analizators.mjs"

const registrsPath = fileURLToPath(
  new URL("../data/termini.json", import.meta.url)
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

const vārdnīca = izveidoVārdnīcu(registrs)
const leksiskieElementi = analizēLeksiski(teksts, vārdnīca)

const nezināmie = leksiskieElementi.filter(
  leksiskaisElements => leksiskaisElements.veids === "nezināms"
)

const diapazonaParaugs =
  analizēLeksiski(
    "darbība sveic",
    vārdnīca
  )

const darbībasElements =
  diapazonaParaugs[0]

const nosaukumaElements =
  diapazonaParaugs[1]

if (
  darbībasElements
    ?.diapazons?.sākums.rinda !== 1 ||
  darbībasElements
    ?.diapazons?.sākums.kolonna !== 1 ||
  darbībasElements
    ?.diapazons?.sākums.nobīde !== 0 ||
  darbībasElements
    ?.diapazons?.beigas.rinda !== 1 ||
  darbībasElements
    ?.diapazons?.beigas.kolonna !== 8 ||
  darbībasElements
    ?.diapazons?.beigas.nobīde !== 7
) {
  throw new Error(
    "Pirmā leksiskā elementa diapazons neatbilst pusatvērtajam kontraktam"
  )
}

if (
  nosaukumaElements
    ?.diapazons?.sākums.kolonna !== 9 ||
  nosaukumaElements
    ?.diapazons?.sākums.nobīde !== 8 ||
  nosaukumaElements
    ?.diapazons?.beigas.kolonna !== 14 ||
  nosaukumaElements
    ?.diapazons?.beigas.nobīde !== 13
) {
  throw new Error(
    "Otrā leksiskā elementa diapazons neatbilst gaidītajam"
  )
}

const veidnesParaugs =
  analizēLeksiski(
    "`A ${vērtība}`",
    vārdnīca
  )[0]

const interpolācijasElements =
  veidnesParaugs
    ?.daļas
    ?.find(
      daļa =>
        daļa.veids ===
          "interpolācija"
    )
    ?.leksiskieElementi
    ?.[0]

if (
  interpolācijasElements
    ?.diapazons?.sākums.nobīde !== 5 ||
  interpolācijasElements
    ?.diapazons?.beigas.nobīde !== 12 ||
  interpolācijasElements
    ?.diapazons?.sākums.kolonna !== 6 ||
  interpolācijasElements
    ?.diapazons?.beigas.kolonna !== 13
) {
  throw new Error(
    "Veidnes interpolācijas leksiskā elementa absolūtais diapazons nav saglabāts"
  )
}

console.log("")
console.log("LatNe leksiskā analīze")
console.log(`Apstiprināti termini: ${vārdnīca.size}`)
console.log(`Leksiskie elementi: ${leksiskieElementi.length}`)
console.log(`Nezināmi: ${nezināmie.length}`)
console.log("")

for (const leksiskaisElements of leksiskieElementi.slice(0, 40)) {
  const avots = leksiskaisElements.avots
    ? ` <- ${leksiskaisElements.avots}`
    : ""

  console.log(
    `${leksiskaisElements.rinda}:${leksiskaisElements.kolonna}` +
    `  ${leksiskaisElements.veids}` +
    `  ${leksiskaisElements.vērtība}` +
    avots
  )
}

if (nezināmie.length > 0) {
  console.log("")
  console.log("Nezināmie simboli:")

  for (const leksiskaisElements of nezināmie) {
    console.log(
      `${leksiskaisElements.rinda}:${leksiskaisElements.kolonna}` +
      `  ${leksiskaisElements.vērtība}`
    )
  }

  process.exitCode = 1
}
