import {
  izveidoDiapazonu
} from "./pirmkoda-diapazons.mjs"

const PRIORITĀTES = new Map([
  ["||", 1],
  ["??", 2],
  ["&&", 3],
  ["==", 4],
  ["!=", 4],
  ["===", 4],
  ["!==", 4],
  ["<", 5],
  ["<=", 5],
  [">", 5],
  [">=", 5],
  ["+", 6],
  ["-", 6],
  ["*", 7],
  ["/", 7],
  ["%", 7]
])

const PIEŠĶIRŠANAS_OPERATORI = new Set([
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
])

function izteiksmesKļūda(ziņa, leksiskaisElements) {
  if (!leksiskaisElements) {
    throw new SyntaxError(
      `${ziņa} izteiksmes beigās`
    )
  }

  throw new SyntaxError(
    `${ziņa} rindā ${leksiskaisElements.rinda}, kolonnā ${leksiskaisElements.kolonna}: ${leksiskaisElements.vērtība}`
  )
}

export function analizēIzteiksmi(leksiskieElementi) {
  if (!leksiskieElementi || leksiskieElementi.length === 0) {
    return null
  }

  let indekss = 0

  const esošais = () =>
    leksiskieElementi[indekss] ?? null

  const paņem = () => {
    const leksiskaisElements = esošais()

    if (leksiskaisElements) {
      indekss++
    }

    return leksiskaisElements
  }

  const irVērtība = vērtība =>
    esošais()?.vērtība === vērtība

  const irAvots = avots => {
    const leksiskaisElements = esošais()

    return Boolean(
      leksiskaisElements &&
      leksiskaisElements.veids === "termins" &&
      leksiskaisElements.avots === avots
    )
  }

  const gaidiVērtību = vērtība => {
    const leksiskaisElements = esošais()

    if (!leksiskaisElements || leksiskaisElements.vērtība !== vērtība) {
      izteiksmesKļūda(
        `Gaidīts "${vērtība}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const analizēArgumentus = () => {
    gaidiVērtību("(")

    const argumenti = []

    if (irVērtība(")")) {
      paņem()
      return argumenti
    }

    while (indekss < leksiskieElementi.length) {
      argumenti.push(
        analizēPiešķiršanu()
      )

      if (irVērtība(",")) {
        paņem()
        continue
      }

      gaidiVērtību(")")
      return argumenti
    }

    izteiksmesKļūda(
      'Nav aizvērts izsaukums "("',
      null
    )
  }

  const analizēMasīvu = () => {
    const sākums = gaidiVērtību("[")
    const elementi = []

    if (irVērtība("]")) {
      paņem()

      return {
        veids: "Masīvs",
        elementi,
        rinda: sākums.rinda
      }
    }

    while (indekss < leksiskieElementi.length) {
      elementi.push(
        analizēPiešķiršanu()
      )

      if (irVērtība(",")) {
        paņem()
        continue
      }

      gaidiVērtību("]")

      return {
        veids: "Masīvs",
        elementi,
        rinda: sākums.rinda
      }
    }

    izteiksmesKļūda(
      'Nav aizvērts masīvs "["',
      null
    )
  }

  const analizēPamatu = () => {
    const leksiskaisElements = esošais()

    if (!leksiskaisElements) {
      izteiksmesKļūda(
        "Gaidīta izteiksme",
        null
      )
    }

    if (leksiskaisElements.veids === "identifikators") {
      paņem()

      return {
        veids: "Identifikators",
        nosaukums: leksiskaisElements.vērtība,
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements
          )
      }
    }

    if (leksiskaisElements.veids === "skaitlis") {
      paņem()

      return {
        veids: "Skaitlis",
        vērtība: Number(
          leksiskaisElements.vērtība.replaceAll("_", "")
        ),
        raw: leksiskaisElements.vērtība,
        rinda: leksiskaisElements.rinda
      }
    }

    if (leksiskaisElements.veids === "teksts") {
      paņem()

      return {
        veids: "Teksts",
        vērtība:
          leksiskaisElements.vērtība.slice(1, -1),
        raw: leksiskaisElements.vērtība,
        rinda: leksiskaisElements.rinda
      }
    }

    if (leksiskaisElements.veids === "veidne") {
      paņem()

      const daļas =
        Array.isArray(
          leksiskaisElements.daļas
        )
          ? leksiskaisElements.daļas.map(
              daļa => {
                if (
                  daļa.veids === "teksts"
                ) {
                  return {
                    veids:
                      "VeidnesTeksts",
                    vērtība:
                      daļa.vērtība,
                    rinda: daļa.rinda
                  }
                }

                if (
                  daļa.veids ===
                    "interpolācija"
                ) {
                  return {
                    veids:
                      "VeidnesInterpolācija",
                    izteiksme:
                      analizēIzteiksmi(
                        daļa
                          .leksiskieElementi
                      ),
                    rinda: daļa.rinda
                  }
                }

                izteiksmesKļūda(
                  "Neatpazīta veidnes daļa",
                  leksiskaisElements
                )
              }
            )
          : []

      return {
        veids: "Veidne",
        daļas,
        raw: leksiskaisElements.vērtība,
        rinda: leksiskaisElements.rinda
      }
    }

    if (irAvots("null")) {
      paņem()

      return {
        veids: "Nekas",
        rinda: leksiskaisElements.rinda
      }
    }

    if (
      irAvots("true") ||
      irAvots("false")
    ) {
      paņem()

      return {
        veids: "Loģisks",
        vērtība:
          leksiskaisElements.avots === "true",
        rinda: leksiskaisElements.rinda
      }
    }

    if (irAvots("undefined")) {
      paņem()

      return {
        veids: "Nenoteikts",
        rinda: leksiskaisElements.rinda
      }
    }

    if (irAvots("this")) {
      paņem()

      return {
        veids: "Šis",
        rinda: leksiskaisElements.rinda
      }
    }

    if (irVērtība("[")) {
      return analizēMasīvu()
    }

    if (irVērtība("(")) {
      paņem()

      const izteiksme =
        analizēPiešķiršanu()

      gaidiVērtību(")")

      return {
        veids: "Grupa",
        izteiksme,
        rinda: leksiskaisElements.rinda
      }
    }

    izteiksmesKļūda(
      "Neatpazīta izteiksmes sākuma daļa",
      leksiskaisElements
    )
  }

  const analizēPostfiksu = sakne => {
    let mezgls = sakne

    while (indekss < leksiskieElementi.length) {
      if (irVērtība(".")) {
        paņem()

        const īpašība = paņem()

        if (
          !īpašība ||
          (
            īpašība.veids !== "identifikators" &&
            īpašība.veids !== "termins"
          )
        ) {
          izteiksmesKļūda(
            "Gaidīts īpašības nosaukums",
            īpašība
          )
        }

        mezgls = {
          veids: "Īpašība",
          objekts: mezgls,
          nosaukums: īpašība.vērtība,
          rinda: mezgls.rinda
        }

        continue
      }

      if (irVērtība("(")) {
        mezgls = {
          veids: "Izsaukums",
          izsaucamais: mezgls,
          argumenti: analizēArgumentus(),
          rinda: mezgls.rinda
        }

        continue
      }

      break
    }

    return mezgls
  }

  const analizēVienību = () => {
    const leksiskaisElements = esošais()

    if (!leksiskaisElements) {
      izteiksmesKļūda(
        "Gaidīta izteiksme",
        null
      )
    }

    if (irAvots("await")) {
      paņem()

      return {
        veids: "Gaidīšana",
        izteiksme: analizēVienību(),
        rinda: leksiskaisElements.rinda
      }
    }

    if (irAvots("new")) {
      paņem()

      const sakne =
        analizēPostfiksu(
          analizēPamatu()
        )

      if (sakne.veids === "Izsaukums") {
        return {
          veids: "Jauns",
          konstruktors:
            sakne.izsaucamais,
          argumenti:
            sakne.argumenti,
          rinda: leksiskaisElements.rinda
        }
      }

      return {
        veids: "Jauns",
        konstruktors: sakne,
        argumenti: [],
        rinda: leksiskaisElements.rinda
      }
    }

    if (
      leksiskaisElements.veids === "operators" &&
      (
        leksiskaisElements.vērtība === "!" ||
        leksiskaisElements.vērtība === "+" ||
        leksiskaisElements.vērtība === "-" ||
        leksiskaisElements.vērtība === "~"
      )
    ) {
      paņem()

      return {
        veids: "UnāraIzteiksme",
        operators: leksiskaisElements.vērtība,
        izteiksme: analizēVienību(),
        rinda: leksiskaisElements.rinda
      }
    }

    if (irAvots("typeof")) {
      paņem()

      return {
        veids: "UnāraIzteiksme",
        operators: "typeof",
        izteiksme: analizēVienību(),
        rinda: leksiskaisElements.rinda
      }
    }

    return analizēPostfiksu(
      analizēPamatu()
    )
  }

  function analizēBināro(minPrioritāte) {
    let kreisā = analizēVienību()

    while (indekss < leksiskieElementi.length) {
      const operators = esošais()

      if (
        !operators ||
        operators.veids !== "operators"
      ) {
        break
      }

      const prioritāte =
        PRIORITĀTES.get(
          operators.vērtība
        )

      if (
        prioritāte === undefined ||
        prioritāte < minPrioritāte
      ) {
        break
      }

      paņem()

      const labā =
        analizēBināro(
          prioritāte + 1
        )

      kreisā = {
        veids: "BināraIzteiksme",
        operators:
          operators.vērtība,
        kreisā,
        labā,
        rinda: kreisā.rinda
      }
    }

    return kreisā
  }

  const analizēPiešķiršanu = () => {
    const mērķis =
      analizēBināro(0)

    const operators = esošais()

    if (
      !operators ||
      operators.veids !== "operators" ||
      !PIEŠĶIRŠANAS_OPERATORI.has(
        operators.vērtība
      )
    ) {
      return mērķis
    }

    if (
      mērķis.veids !== "Identifikators" &&
      mērķis.veids !== "Īpašība"
    ) {
      izteiksmesKļūda(
        "Nederīgs piešķiršanas mērķis",
        operators
      )
    }

    paņem()

    return {
      veids: "PiešķiršanasIzteiksme",
      operators: operators.vērtība,
      mērķis,
      vērtība:
        analizēPiešķiršanu(),
      rinda: mērķis.rinda
    }
  }

  const rezultāts =
    analizēPiešķiršanu()

  if (indekss < leksiskieElementi.length) {
    izteiksmesKļūda(
      "Neatpazīta izteiksmes turpinājuma daļa",
      esošais()
    )
  }

  return rezultāts
}
