function sintaksesKluda(zina, leksiskaisElements) {
  if (!leksiskaisElements) {
    throw new SyntaxError(`${zina} faila beigās`)
  }

  throw new SyntaxError(
    `${zina} rindā ${leksiskaisElements.rinda}, kolonnā ${leksiskaisElements.kolonna}: ${leksiskaisElements.vertiba}`
  )
}

function analizeKlasesParametrus(leksiskieElementi) {
  if (leksiskieElementi.length === 0) {
    return []
  }

  const dalas = []
  let dala = []

  let iekavas = 0
  let kvadratiekavas = 0
  let figuriiekavas = 0

  for (const leksiskaisElements of leksiskieElementi) {
    const dzilums =
      iekavas +
      kvadratiekavas +
      figuriiekavas

    if (
      leksiskaisElements.vertiba === "," &&
      dzilums === 0
    ) {
      if (dala.length === 0) {
        sintaksesKluda(
          "Tukšs konstruktora parametrs",
          leksiskaisElements
        )
      }

      dalas.push(dala)
      dala = []
      continue
    }

    dala.push(leksiskaisElements)

    if (leksiskaisElements.vertiba === "(") {
      iekavas++
    }
    else if (leksiskaisElements.vertiba === ")") {
      iekavas--
    }
    else if (leksiskaisElements.vertiba === "[") {
      kvadratiekavas++
    }
    else if (leksiskaisElements.vertiba === "]") {
      kvadratiekavas--
    }
    else if (leksiskaisElements.vertiba === "{") {
      figuriiekavas++
    }
    else if (leksiskaisElements.vertiba === "}") {
      figuriiekavas--
    }
  }

  if (dala.length > 0) {
    dalas.push(dala)
  }

  return dalas.map(dala => {
    const nosaukums = dala[0]
    const kols = dala[1]
    const tipaElementi = dala.slice(2)

    if (
      !nosaukums ||
      nosaukums.veids !== "identifikators"
    ) {
      sintaksesKluda(
        "Gaidīts konstruktora parametra nosaukums",
        nosaukums
      )
    }

    if (!kols || kols.vertiba !== ":") {
      sintaksesKluda(
        'Gaidīts ":" aiz konstruktora parametra',
        kols ?? nosaukums
      )
    }

    if (tipaElementi.length === 0) {
      sintaksesKluda(
        "Gaidīts konstruktora parametra tips",
        kols
      )
    }

    return {
      veids: "Parametrs",
      nosaukums: nosaukums.vertiba,
      tips:
        tipaElementi
          .map(leksiskaisElements =>
            leksiskaisElements.vertiba
          )
          .join(""),
      rinda: nosaukums.rinda
    }
  })
}

export function analizeKlasesKermeni(
  leksiskieElementi,
  prieksrakstuAnalizators = null
) {
  let indekss = 0

  const kermenis = []
  const lauki = []
  let konstruktors = null
  const getteri = []

  const esosais = () =>
    leksiskieElementi[indekss] ?? null

  const panem = () => {
    const leksiskaisElements = esosais()

    if (leksiskaisElements) {
      indekss++
    }

    return leksiskaisElements
  }

  const irAvots = avots => {
    const leksiskaisElements = esosais()

    return Boolean(
      leksiskaisElements &&
      leksiskaisElements.veids === "termins" &&
      leksiskaisElements.avots === avots
    )
  }

  const irVertiba = vertiba =>
    esosais()?.vertiba === vertiba

  const gaidiVeidu = veids => {
    const leksiskaisElements = esosais()

    if (
      !leksiskaisElements ||
      leksiskaisElements.veids !== veids
    ) {
      sintaksesKluda(
        `Gaidīts leksiskā elementa veids "${veids}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const gaidiVertibu = vertiba => {
    const leksiskaisElements = esosais()

    if (
      !leksiskaisElements ||
      leksiskaisElements.vertiba !== vertiba
    ) {
      sintaksesKluda(
        `Gaidīts "${vertiba}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const nolasitGrupu = (
    atverosa,
    aizverosa
  ) => {
    gaidiVertibu(atverosa)

    const saturs = []
    let dzilums = 1

    while (indekss < leksiskieElementi.length) {
      const leksiskaisElements = panem()

      if (leksiskaisElements.vertiba === atverosa) {
        dzilums++
      }
      else if (leksiskaisElements.vertiba === aizverosa) {
        dzilums--

        if (dzilums === 0) {
          return saturs
        }
      }

      if (dzilums > 0) {
        saturs.push(leksiskaisElements)
      }
    }

    sintaksesKluda(
      `Nav aizvērta grupa "${atverosa}"`,
      null
    )
  }

  while (indekss < leksiskieElementi.length) {
    if (irVertiba(";")) {
      panem()
      continue
    }

    let pieejamiba = null
    let nemainams = false

    if (
      irAvots("public") ||
      irAvots("protected") ||
      irAvots("private")
    ) {
      pieejamiba = panem().avots
    }

    if (irAvots("readonly")) {
      nemainams = true
      panem()
    }

    if (irAvots("constructor")) {
      const sakums = panem()

      if (nemainams) {
        sintaksesKluda(
          'Modifikators "readonly" nav derīgs konstruktoram',
          sakums
        )
      }

      if (konstruktors) {
        sintaksesKluda(
          "Klasei jau ir konstruktors",
          sakums
        )
      }

      const parametruElementi =
        nolasitGrupu("(", ")")

      const konstruktoraKermenis =
        nolasitGrupu("{", "}")

      konstruktors = {
        veids: "Konstruktors",
        pieejamiba,
        parametri:
          analizeKlasesParametrus(
            parametruElementi
          ),
        kermenis:
          typeof prieksrakstuAnalizators ===
            "function"
            ? prieksrakstuAnalizators(
                konstruktoraKermenis
              )
            : null,
        kermenaLeksiskieElementi:
          konstruktoraKermenis,
        rinda: sakums.rinda
      }

      kermenis.push(konstruktors)

      continue
    }

    if (irAvots("get")) {
      const sakums = panem()

      if (nemainams) {
        sintaksesKluda(
          'Modifikators "readonly" nav derīgs getterim',
          sakums
        )
      }

      const nosaukums =
        gaidiVeidu("identifikators")

      const parametri =
        nolasitGrupu("(", ")")

      if (parametri.length > 0) {
        sintaksesKluda(
          "Getterim nedrīkst būt parametri",
          parametri[0]
        )
      }

      gaidiVertibu(":")

      const atgriezesTips = []

      while (
        esosais() &&
        !irVertiba("{")
      ) {
        atgriezesTips.push(
          panem().vertiba
        )
      }

      if (atgriezesTips.length === 0) {
        sintaksesKluda(
          "Gaidīts gettera atgriezes tips",
          esosais()
        )
      }

      const getteraKermenis =
        nolasitGrupu("{", "}")

      const getteris = {
        veids: "Getteris",
        nosaukums: nosaukums.vertiba,
        pieejamiba,
        atgriezesTips:
          atgriezesTips.join(""),
        kermenis:
          typeof prieksrakstuAnalizators ===
            "function"
            ? prieksrakstuAnalizators(
                getteraKermenis
              )
            : null,
        kermenaLeksiskieElementi:
          getteraKermenis,
        rinda: sakums.rinda
      }

      getteri.push(getteris)
      kermenis.push(getteris)

      continue
    }

    const nosaukums =
      gaidiVeidu("identifikators")

    gaidiVertibu(":")

    const tipaElementi = []

    while (
      esosais() &&
      esosais().rinda === nosaukums.rinda &&
      !irVertiba(";")
    ) {
      tipaElementi.push(
        panem().vertiba
      )
    }

    if (tipaElementi.length === 0) {
      sintaksesKluda(
        "Gaidīts klases lauka tips",
        esosais() ?? nosaukums
      )
    }

    if (irVertiba(";")) {
      panem()
    }

    const lauks = {
      veids: "KlasesLauks",
      nosaukums: nosaukums.vertiba,
      pieejamiba,
      nemainams,
      tips: tipaElementi.join(""),
      rinda: nosaukums.rinda
    }

    lauki.push(lauks)
    kermenis.push(lauks)
  }

  return {
    kermenis,
    lauki,
    konstruktors,
    getteri
  }
}
