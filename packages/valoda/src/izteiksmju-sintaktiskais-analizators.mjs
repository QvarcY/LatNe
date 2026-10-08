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
      const beigas = paņem()

      return {
        argumenti,
        beigas
      }
    }

    while (indekss < leksiskieElementi.length) {
      argumenti.push(
        analizēPiešķiršanu()
      )

      if (irVērtība(",")) {
        paņem()
        continue
      }

      const beigas =
        gaidiVērtību(")")

      return {
        argumenti,
        beigas
      }
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
      const beigas =
        paņem()

      return {
        veids: "Masīvs",
        elementi,
        rinda: sākums.rinda,
        diapazons:
          izveidoDiapazonu(
            sākums,
            beigas
          )
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

      const beigas =
        gaidiVērtību("]")

      return {
        veids: "Masīvs",
        elementi,
        rinda: sākums.rinda,
        diapazons:
          izveidoDiapazonu(
            sākums,
            beigas
          )
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
        pieraksts: leksiskaisElements.vērtība,
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements
          )
      }
    }

    if (leksiskaisElements.veids === "teksts") {
      paņem()

      return {
        veids: "Teksts",
        vērtība:
          leksiskaisElements.vērtība.slice(1, -1),
        pieraksts: leksiskaisElements.vērtība,
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements
          )
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
                    rinda: daļa.rinda,
                    diapazons:
                      izveidoDiapazonu(
                        daļa
                      )
                  }
                }

                if (
                  daļa.veids ===
                    "aizpildījums"
                ) {
                  return {
                    veids:
                      "VeidnesAizpildījums",
                    izteiksme:
                      analizēIzteiksmi(
                        daļa
                          .leksiskieElementi
                      ),
                    rinda: daļa.rinda,
                    diapazons:
                      izveidoDiapazonu(
                        daļa
                      )
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
        pieraksts: leksiskaisElements.vērtība,
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements
          )
      }
    }

    if (irAvots("null")) {
      paņem()

      return {
        veids: "Nekas",
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements
          )
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
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements
          )
      }
    }

    if (irAvots("undefined")) {
      paņem()

      return {
        veids: "Nenoteikts",
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements
          )
      }
    }

    if (irAvots("this")) {
      paņem()

      return {
        veids: "Šis",
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements
          )
      }
    }

    if (irVērtība("[")) {
      return analizēMasīvu()
    }

    if (irVērtība("(")) {
      paņem()

      const izteiksme =
        analizēPiešķiršanu()

      const beigas =
        gaidiVērtību(")")

      return {
        veids: "Grupa",
        izteiksme,
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements,
            beigas
          )
      }
    }

    izteiksmesKļūda(
      "Neatpazīta izteiksmes sākuma daļa",
      leksiskaisElements
    )
  }

  const analizēPostfiksu = (
    sakne,
    sākumaIndekss
  ) => {
    let mezgls = sakne

    const sākums =
      leksiskieElementi[
        sākumaIndekss
      ]

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
          rinda: mezgls.rinda,
          diapazons:
            izveidoDiapazonu(
              sākums,
              īpašība
            )
        }

        continue
      }

      if (irVērtība("(")) {
        const {
          argumenti,
          beigas
        } =
          analizēArgumentus()

        mezgls = {
          veids: "Izsaukums",
          izsaucamais: mezgls,
          argumenti,
          rinda: mezgls.rinda,
          diapazons:
            izveidoDiapazonu(
              sākums,
              beigas
            )
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

    const vienībasSākumaIndekss =
      indekss

    if (irAvots("await")) {
      paņem()

      const izteiksme =
        analizēVienību()

      const beigas =
        leksiskieElementi[
          indekss - 1
        ]

      return {
        veids: "Gaidīšana",
        izteiksme,
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements,
            beigas
          )
      }
    }

    if (irAvots("new")) {
      paņem()

      const konstruktoraSākumaIndekss =
        indekss

      const sakne =
        analizēPostfiksu(
          analizēPamatu(),
          konstruktoraSākumaIndekss
        )

      const beigas =
        leksiskieElementi[
          indekss - 1
        ]

      if (sakne.veids === "Izsaukums") {
        return {
          veids: "Jauns",
          konstruktors:
            sakne.izsaucamais,
          argumenti:
            sakne.argumenti,
          rinda: leksiskaisElements.rinda,
          diapazons:
            izveidoDiapazonu(
              leksiskaisElements,
              beigas
            )
        }
      }

      return {
        veids: "Jauns",
        konstruktors: sakne,
        argumenti: [],
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements,
            beigas
          )
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

      const izteiksme =
        analizēVienību()

      const beigas =
        leksiskieElementi[
          indekss - 1
        ]

      return {
        veids: "PirmsIzteiksme",
        operators: leksiskaisElements.vērtība,
        izteiksme,
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements,
            beigas
          )
      }
    }

    if (irAvots("typeof")) {
      paņem()

      const izteiksme =
        analizēVienību()

      const beigas =
        leksiskieElementi[
          indekss - 1
        ]

      return {
        veids: "PirmsIzteiksme",
        operators: "veids",
        izteiksme,
        rinda: leksiskaisElements.rinda,
        diapazons:
          izveidoDiapazonu(
            leksiskaisElements,
            beigas
          )
      }
    }

    return analizēPostfiksu(
      analizēPamatu(),
      vienībasSākumaIndekss
    )
  }

  function analizēBināro(minPrioritāte) {
    const sākums = esošais()

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

      const beigas =
        leksiskieElementi[
          indekss - 1
        ]

      kreisā = {
        veids: "BināraIzteiksme",
        operators:
          operators.vērtība,
        kreisā,
        labā,
        rinda: kreisā.rinda,
        diapazons:
          izveidoDiapazonu(
            sākums,
            beigas
          )
      }
    }

    return kreisā
  }

  const analizēPiešķiršanu = () => {
    const sākums = esošais()

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

    const vērtība =
      analizēPiešķiršanu()

    const beigas =
      leksiskieElementi[
        indekss - 1
      ]

    return {
      veids: "PiešķiršanasIzteiksme",
      operators: operators.vērtība,
      mērķis,
      vērtība,
      rinda: mērķis.rinda,
      diapazons:
        izveidoDiapazonu(
          sākums,
          beigas
        )
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
