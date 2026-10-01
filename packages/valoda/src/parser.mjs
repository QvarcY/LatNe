function parseraKluda(zina, tokens) {
  if (!tokens) {
    throw new SyntaxError(`${zina} faila beigās`)
  }

  throw new SyntaxError(
    `${zina} rindā ${tokens.rinda}, kolonnā ${tokens.kolonna}: ${tokens.vertiba}`
  )
}

export function parse(tokeni) {
  let indekss = 0

  const esosais = () =>
    tokeni[indekss] ?? null

  const panem = () => {
    const tokens = esosais()

    if (tokens) {
      indekss++
    }

    return tokens
  }

  const irAvots = avots => {
    const tokens = esosais()

    return Boolean(
      tokens &&
      tokens.veids === "termins" &&
      tokens.avots === avots
    )
  }

  const irVertiba = vertiba =>
    esosais()?.vertiba === vertiba

  const gaidiAvotu = avots => {
    const tokens = esosais()

    if (
      !tokens ||
      tokens.veids !== "termins" ||
      tokens.avots !== avots
    ) {
      parseraKluda(
        `Gaidīts termins "${avots}"`,
        tokens
      )
    }

    indekss++
    return tokens
  }

  const gaidiVeidu = veids => {
    const tokens = esosais()

    if (!tokens || tokens.veids !== veids) {
      parseraKluda(
        `Gaidīts tokena veids "${veids}"`,
        tokens
      )
    }

    indekss++
    return tokens
  }

  const gaidiVertibu = vertiba => {
    const tokens = esosais()

    if (!tokens || tokens.vertiba !== vertiba) {
      parseraKluda(
        `Gaidīts "${vertiba}"`,
        tokens
      )
    }

    indekss++
    return tokens
  }

  const nolasitGrupu = (
    atverosa,
    aizverosa
  ) => {
    gaidiVertibu(atverosa)

    const saturs = []
    let dzilums = 1

    while (indekss < tokeni.length) {
      const tokens = panem()

      if (tokens.vertiba === atverosa) {
        dzilums++
      }
      else if (tokens.vertiba === aizverosa) {
        dzilums--

        if (dzilums === 0) {
          return saturs
        }
      }

      if (dzilums > 0) {
        saturs.push(tokens)
      }
    }

    parseraKluda(
      `Nav aizvērta grupa "${atverosa}"`,
      null
    )
  }

  const parseImportu = () => {
    const sakums = gaidiAvotu("import")

    gaidiVertibu("{")

    const vardi = []

    while (!irVertiba("}")) {
      const nosaukums =
        gaidiVeidu("identifikators")

      vardi.push(nosaukums.vertiba)

      if (irVertiba(",")) {
        panem()
      }
      else if (!irVertiba("}")) {
        parseraKluda(
          'Gaidīts "," vai "}"',
          esosais()
        )
      }
    }

    gaidiVertibu("}")
    gaidiAvotu("from")

    const avots = gaidiVeidu("teksts")

    return {
      veids: "Imports",
      vardi,
      avots: avots.vertiba,
      rinda: sakums.rinda
    }
  }

  const parseSaskarsmi = () => {
    const sakums = gaidiAvotu("interface")
    const nosaukums =
      gaidiVeidu("identifikators")

    const saturs = nolasitGrupu("{", "}")

    return {
      veids: "Saskarsme",
      nosaukums: nosaukums.vertiba,
      kermenaTokeni: saturs.length,
      rinda: sakums.rinda
    }
  }

  const parseUzskaitijumu = () => {
    const sakums = gaidiAvotu("enum")
    const nosaukums =
      gaidiVeidu("identifikators")

    const saturs = nolasitGrupu("{", "}")

    const vertibas = saturs
      .filter(
        tokens =>
          tokens.veids === "identifikators"
      )
      .map(tokens => tokens.vertiba)

    return {
      veids: "Uzskaitījums",
      nosaukums: nosaukums.vertiba,
      vertibas,
      rinda: sakums.rinda
    }
  }

  const parseKlasi = modifikatori => {
    const sakums = gaidiAvotu("class")
    const nosaukums =
      gaidiVeidu("identifikators")

    const saturs = nolasitGrupu("{", "}")

    return {
      veids: "Klase",
      nosaukums: nosaukums.vertiba,
      eksporteta:
        modifikatori.includes("export"),
      kermenaTokeni: saturs.length,
      rinda: sakums.rinda
    }
  }

  const parseDarbibu = modifikatori => {
    const sakums = gaidiAvotu("function")
    const nosaukums =
      gaidiVeidu("identifikators")

    const parametri =
      nolasitGrupu("(", ")")

    const atgriezesTips = []

    if (irVertiba(":")) {
      panem()

      while (
        esosais() &&
        !irVertiba("{")
      ) {
        atgriezesTips.push(
          panem().vertiba
        )
      }
    }

    if (!irVertiba("{")) {
      parseraKluda(
        'Gaidīts darbības ķermenis "{"',
        esosais()
      )
    }

    const saturs =
      nolasitGrupu("{", "}")

    return {
      veids: "Darbība",
      nosaukums: nosaukums.vertiba,
      eksporteta:
        modifikatori.includes("export"),
      asinhrona:
        modifikatori.includes("async"),
      parametruTokeni: parametri.length,
      atgriezesTips:
        atgriezesTips.join(""),
      kermenaTokeni: saturs.length,
      rinda: sakums.rinda
    }
  }

  const elementi = []

  while (indekss < tokeni.length) {
    if (irAvots("import")) {
      elementi.push(
        parseImportu()
      )

      continue
    }

    if (irAvots("interface")) {
      elementi.push(
        parseSaskarsmi()
      )

      continue
    }

    if (irAvots("enum")) {
      elementi.push(
        parseUzskaitijumu()
      )

      continue
    }

    const modifikatori = []

    while (
      irAvots("export") ||
      irAvots("async")
    ) {
      modifikatori.push(
        panem().avots
      )
    }

    if (irAvots("class")) {
      elementi.push(
        parseKlasi(modifikatori)
      )

      continue
    }

    if (irAvots("function")) {
      elementi.push(
        parseDarbibu(modifikatori)
      )

      continue
    }

    if (modifikatori.length > 0) {
      parseraKluda(
        "Pēc modifikatora gaidīta deklarācija",
        esosais()
      )
    }

    parseraKluda(
      "Neatpazīta augšējā līmeņa konstrukcija",
      esosais()
    )
  }

  return {
    veids: "Programma",
    elementi
  }
}
