import {
  analizēParametrus
} from "./parametru-sintaktiskais-analizators.mjs"

import {
  izveidoDiapazonu
} from "./pirmkoda-diapazons.mjs"

function sintaksesKļūda(ziņa, leksiskaisElements) {
  if (!leksiskaisElements) {
    throw new SyntaxError(`${ziņa} faila beigās`)
  }

  throw new SyntaxError(
    `${ziņa} rindā ${leksiskaisElements.rinda}, kolonnā ${leksiskaisElements.kolonna}: ${leksiskaisElements.vērtība}`
  )
}

export function analizēKlasesĶermeni(
  leksiskieElementi,
  priekšrakstuAnalizators = null
) {
  let indekss = 0

  const ķermenis = []
  const lauki = []
  let konstruktors = null
  const iegūšanas = []
  const metodes = []

  const esošais = () =>
    leksiskieElementi[indekss] ?? null

  const paņem = () => {
    const leksiskaisElements = esošais()

    if (leksiskaisElements) {
      indekss++
    }

    return leksiskaisElements
  }

  const irAvots = avots => {
    const leksiskaisElements = esošais()

    return Boolean(
      leksiskaisElements &&
      leksiskaisElements.veids === "termins" &&
      leksiskaisElements.avots === avots
    )
  }

  const irVērtība = vērtība =>
    esošais()?.vērtība === vērtība

  const gaidiVeidu = veids => {
    const leksiskaisElements = esošais()

    if (
      !leksiskaisElements ||
      leksiskaisElements.veids !== veids
    ) {
      sintaksesKļūda(
        `Gaidīts leksiskā elementa veids "${veids}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const gaidiVērtību = vērtība => {
    const leksiskaisElements = esošais()

    if (
      !leksiskaisElements ||
      leksiskaisElements.vērtība !== vērtība
    ) {
      sintaksesKļūda(
        `Gaidīts "${vērtība}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const nolasītGrupu = (
    atverošā,
    aizverošā
  ) => {
    gaidiVērtību(atverošā)

    const saturs = []
    let dziļums = 1

    while (indekss < leksiskieElementi.length) {
      const leksiskaisElements = paņem()

      if (leksiskaisElements.vērtība === atverošā) {
        dziļums++
      }
      else if (leksiskaisElements.vērtība === aizverošā) {
        dziļums--

        if (dziļums === 0) {
          return saturs
        }
      }

      if (dziļums > 0) {
        saturs.push(leksiskaisElements)
      }
    }

    sintaksesKļūda(
      `Nav aizvērta grupa "${atverošā}"`,
      null
    )
  }

  while (indekss < leksiskieElementi.length) {
    if (irVērtība(";")) {
      paņem()
      continue
    }

    const deklarācijasSākums =
      esošais()

    let pieejamība = null
    let nemaināms = false

    if (
      irAvots("public") ||
      irAvots("protected") ||
      irAvots("private")
    ) {
      pieejamība = paņem().avots
    }

    if (irAvots("readonly")) {
      nemaināms = true
      paņem()
    }

    if (irAvots("constructor")) {
      const sākums = paņem()

      if (nemaināms) {
        sintaksesKļūda(
          'Modifikators "readonly" nav derīgs konstruktoram',
          sākums
        )
      }

      if (konstruktors) {
        sintaksesKļūda(
          "Klasei jau ir konstruktors",
          sākums
        )
      }

      const parametruElementi =
        nolasītGrupu("(", ")")

      const konstruktoraĶermenis =
        nolasītGrupu("{", "}")

      const beigas =
        leksiskieElementi[
          indekss - 1
        ]

      konstruktors = {
        veids: "Konstruktors",
        pieejamība,
        parametri:
          analizēParametrus(
            parametruElementi,
            "konstruktora"
          ),
        ķermenis:
          typeof priekšrakstuAnalizators ===
            "function"
            ? priekšrakstuAnalizators(
                konstruktoraĶermenis
              )
            : null,
        ķermeņaLeksiskieElementi:
          konstruktoraĶermenis,
        rinda: sākums.rinda,
        diapazons:
          izveidoDiapazonu(
            deklarācijasSākums ??
              sākums,
            beigas
          )
      }

      ķermenis.push(konstruktors)

      continue
    }

    if (irAvots("get")) {
      const sākums = paņem()

      if (nemaināms) {
        sintaksesKļūda(
          'Modifikators "readonly" nav derīgs iegūšanai',
          sākums
        )
      }

      const nosaukums =
        gaidiVeidu("identifikators")

      const parametri =
        nolasītGrupu("(", ")")

      if (parametri.length > 0) {
        sintaksesKļūda(
          "Iegūšanai nedrīkst būt parametri",
          parametri[0]
        )
      }

      gaidiVērtību(":")

      const atgriezesTips = []

      while (
        esošais() &&
        !irVērtība("{")
      ) {
        atgriezesTips.push(
          paņem().vērtība
        )
      }

      if (atgriezesTips.length === 0) {
        sintaksesKļūda(
          "Gaidīts iegūšanas atgriezes tips",
          esošais()
        )
      }

      const saturs =
        nolasītGrupu("{", "}")

      const beigas =
        leksiskieElementi[
          indekss - 1
        ]

      const iegūšana = {
        veids: "Iegūšana",
        nosaukums: nosaukums.vērtība,
        pieejamība,
        atgriezesTips:
          atgriezesTips.join(""),
        ķermenis:
          typeof priekšrakstuAnalizators ===
            "function"
            ? priekšrakstuAnalizators(
                saturs
              )
            : null,
        ķermeņaLeksiskieElementi:
          saturs,
        rinda: sākums.rinda,
        diapazons:
          izveidoDiapazonu(
            deklarācijasSākums ??
              sākums,
            beigas
          )
      }

      iegūšanas.push(iegūšana)
      ķermenis.push(iegūšana)

      continue
    }

    if (irAvots("function")) {
      const sākums = paņem()

      if (nemaināms) {
        sintaksesKļūda(
          'Modifikators "readonly" nav derīgs metodei',
          sākums
        )
      }

      const nosaukums =
        gaidiVeidu("identifikators")

      const parametruElementi =
        nolasītGrupu("(", ")")

      const atgriezesTips = []

      if (irVērtība(":")) {
        paņem()

        while (
          esošais() &&
          !irVērtība("{")
        ) {
          atgriezesTips.push(
            paņem().vērtība
          )
        }
      }

      const metodesĶermenis =
        nolasītGrupu("{", "}")

      const beigas =
        leksiskieElementi[
          indekss - 1
        ]

      const metode = {
        veids: "Metode",
        nosaukums: nosaukums.vērtība,
        pieejamība,
        parametri:
          analizēParametrus(
            parametruElementi,
            "metodes"
          ),
        atgriezesTips:
          atgriezesTips.length > 0
            ? atgriezesTips.join("")
            : null,
        ķermenis:
          typeof priekšrakstuAnalizators ===
            "function"
            ? priekšrakstuAnalizators(
                metodesĶermenis
              )
            : null,
        ķermeņaLeksiskieElementi:
          metodesĶermenis,
        rinda: sākums.rinda,
        diapazons:
          izveidoDiapazonu(
            deklarācijasSākums ??
              sākums,
            beigas
          )
      }

      metodes.push(metode)
      ķermenis.push(metode)

      continue
    }

    const nosaukums =
      gaidiVeidu("identifikators")

    gaidiVērtību(":")

    const tipaElementi = []
    let beigas = null

    while (
      esošais() &&
      esošais().rinda === nosaukums.rinda &&
      !irVērtība(";")
    ) {
      const tipaElements =
        paņem()

      tipaElementi.push(
        tipaElements.vērtība
      )

      beigas =
        tipaElements
    }

    if (tipaElementi.length === 0) {
      sintaksesKļūda(
        "Gaidīts klases lauka tips",
        esošais() ?? nosaukums
      )
    }

    if (irVērtība(";")) {
      beigas =
        paņem()
    }

    const lauks = {
      veids: "KlasesLauks",
      nosaukums: nosaukums.vērtība,
      pieejamība,
      nemaināms,
      tips: tipaElementi.join(""),
      rinda: nosaukums.rinda,
      diapazons:
        izveidoDiapazonu(
          deklarācijasSākums ??
            nosaukums,
          beigas ??
            nosaukums
        )
    }

    lauki.push(lauks)
    ķermenis.push(lauks)
  }

  return {
    ķermenis,
    lauki,
    konstruktors,
    iegūšanas,
    metodes
  }
}
