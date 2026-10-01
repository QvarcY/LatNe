function parseraKluda(zina, tokens) {
  if (!tokens) {
    throw new SyntaxError(`${zina} faila beigās`)
  }

  throw new SyntaxError(
    `${zina} rindā ${tokens.rinda}, kolonnā ${tokens.kolonna}: ${tokens.vertiba}`
  )
}

function izteiksmesTeksts(tokeni) {
  return tokeni
    .map(tokens => tokens.vertiba)
    .join(" ")
}

function parseKamGalveni(tokeni) {
  if (
    tokeni.length >= 4 &&
    tokeni[0].veids === "termins" &&
    (
      tokeni[0].avots === "const" ||
      tokeni[0].avots === "let" ||
      tokeni[0].avots === "var"
    ) &&
    tokeni[1].veids === "identifikators" &&
    tokeni[2].veids === "termins" &&
    tokeni[2].avots === "of"
  ) {
    return {
      variants: "of",
      deklaracija: tokeni[0].avots,
      mainigais: tokeni[1].vertiba,
      kolekcija: izteiksmesTeksts(
        tokeni.slice(3)
      )
    }
  }

  return {
    variants: "vispārīgs",
    izteiksme: izteiksmesTeksts(tokeni)
  }
}

export function parsePazinojumus(tokeni) {
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

  const nolasitIzteiksmi = sakumaRinda => {
    const saturs = []

    let iekavas = 0
    let kvadratiekavas = 0
    let figuriiekavas = 0

    while (indekss < tokeni.length) {
      const tokens = esosais()

      const dzilums =
        iekavas +
        kvadratiekavas +
        figuriiekavas

      if (
        saturs.length > 0 &&
        tokens.rinda > sakumaRinda &&
        dzilums === 0
      ) {
        break
      }

      if (
        saturs.length === 0 &&
        tokens.rinda > sakumaRinda
      ) {
        break
      }

      panem()
      saturs.push(tokens)

      if (tokens.vertiba === "(") {
        iekavas++
      }
      else if (tokens.vertiba === ")") {
        iekavas--
      }
      else if (tokens.vertiba === "[") {
        kvadratiekavas++
      }
      else if (tokens.vertiba === "]") {
        kvadratiekavas--
      }
      else if (tokens.vertiba === "{") {
        figuriiekavas++
      }
      else if (tokens.vertiba === "}") {
        figuriiekavas--
      }
    }

    return saturs
  }

  const parseMainigo = () => {
    const sakums = panem()
    const nosaukums =
      gaidiVeidu("identifikators")

    const tips = []

    if (irVertiba(":")) {
      panem()

      while (
        esosais() &&
        !irVertiba("=")
      ) {
        tips.push(
          panem().vertiba
        )
      }
    }

    const izteiksme = []

    if (irVertiba("=")) {
      panem()

      izteiksme.push(
        ...nolasitIzteiksmi(sakums.rinda)
      )
    }

    return {
      veids: "Mainīgais",
      deklaracija: sakums.avots,
      nosaukums: nosaukums.vertiba,
      tips:
        tips.length > 0
          ? tips.join("")
          : null,
      vertiba:
        izteiksme.length > 0
          ? izteiksmesTeksts(izteiksme)
          : null,
      rinda: sakums.rinda
    }
  }

  const parseNosacijumu = () => {
    const sakums = gaidiAvotu("if")
    const nosacijums =
      nolasitGrupu("(", ")")

    const kermenis =
      nolasitGrupu("{", "}")

    const mezgls = {
      veids: "Nosacījums",
      nosacijums:
        izteiksmesTeksts(nosacijums),
      kermenis:
        parsePazinojumus(kermenis),
      citadi: null,
      rinda: sakums.rinda
    }

    if (irAvots("else")) {
      panem()

      if (irAvots("if")) {
        mezgls.citadi = [
          parseNosacijumu()
        ]
      }
      else {
        const citadi =
          nolasitGrupu("{", "}")

        mezgls.citadi =
          parsePazinojumus(citadi)
      }
    }

    return mezgls
  }

  const parseKamCiklu = () => {
    const sakums = gaidiAvotu("for")
    const galvene =
      nolasitGrupu("(", ")")

    const kermenis =
      nolasitGrupu("{", "}")

    return {
      veids: "KamCikls",
      ...parseKamGalveni(galvene),
      kermenis:
        parsePazinojumus(kermenis),
      rinda: sakums.rinda
    }
  }

  const parseAtgriesanu = () => {
    const sakums = gaidiAvotu("return")

    const izteiksme =
      nolasitIzteiksmi(sakums.rinda)

    return {
      veids: "Atgriešana",
      vertiba:
        izteiksme.length > 0
          ? izteiksmesTeksts(izteiksme)
          : null,
      rinda: sakums.rinda
    }
  }

  const parseMetienu = () => {
    const sakums = gaidiAvotu("throw")

    const izteiksme =
      nolasitIzteiksmi(sakums.rinda)

    return {
      veids: "Metiens",
      vertiba:
        izteiksmesTeksts(izteiksme),
      rinda: sakums.rinda
    }
  }

  const parseMeginaBloku = () => {
    const sakums = gaidiAvotu("try")

    const meginaTokeni =
      nolasitGrupu("{", "}")

    const mezgls = {
      veids: "Mēģinājums",
      megina:
        parsePazinojumus(meginaTokeni),
      ker: null,
      beigas: null,
      rinda: sakums.rinda
    }

    if (irAvots("catch")) {
      panem()

      const parametrs =
        nolasitGrupu("(", ")")

      const kermenis =
        nolasitGrupu("{", "}")

      const nosaukums =
        parametrs.find(
          tokens =>
            tokens.veids === "identifikators"
        )

      mezgls.ker = {
        parametrs:
          nosaukums?.vertiba ?? null,
        kermenis:
          parsePazinojumus(kermenis)
      }
    }

    if (irAvots("finally")) {
      panem()

      const kermenis =
        nolasitGrupu("{", "}")

      mezgls.beigas =
        parsePazinojumus(kermenis)
    }

    return mezgls
  }

  const parseVienkarsu = (
    avots,
    veids
  ) => {
    const sakums = gaidiAvotu(avots)

    return {
      veids,
      rinda: sakums.rinda
    }
  }

  const parseIzteiksmi = () => {
    const sakums = esosais()

    const izteiksme =
      nolasitIzteiksmi(sakums.rinda)

    if (izteiksme.length === 0) {
      parseraKluda(
        "Neizdevās nolasīt izteiksmi",
        sakums
      )
    }

    return {
      veids: "Izteiksme",
      vertiba:
        izteiksmesTeksts(izteiksme),
      rinda: sakums.rinda
    }
  }

  const pazinojumi = []

  while (indekss < tokeni.length) {
    if (
      irAvots("const") ||
      irAvots("let") ||
      irAvots("var")
    ) {
      pazinojumi.push(
        parseMainigo()
      )

      continue
    }

    if (irAvots("if")) {
      pazinojumi.push(
        parseNosacijumu()
      )

      continue
    }

    if (irAvots("for")) {
      pazinojumi.push(
        parseKamCiklu()
      )

      continue
    }

    if (irAvots("return")) {
      pazinojumi.push(
        parseAtgriesanu()
      )

      continue
    }

    if (irAvots("try")) {
      pazinojumi.push(
        parseMeginaBloku()
      )

      continue
    }

    if (irAvots("continue")) {
      pazinojumi.push(
        parseVienkarsu(
          "continue",
          "Turpināšana"
        )
      )

      continue
    }

    if (irAvots("break")) {
      pazinojumi.push(
        parseVienkarsu(
          "break",
          "Pārtraukšana"
        )
      )

      continue
    }

    if (irAvots("throw")) {
      pazinojumi.push(
        parseMetienu()
      )

      continue
    }

    if (irAvots("debugger")) {
      pazinojumi.push(
        parseVienkarsu(
          "debugger",
          "Atkļūdošana"
        )
      )

      continue
    }

    pazinojumi.push(
      parseIzteiksmi()
    )
  }

  return pazinojumi
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

    const avots =
      gaidiVeidu("teksts")

    return {
      veids: "Imports",
      vardi,
      avots: avots.vertiba,
      rinda: sakums.rinda
    }
  }

  const parseSaskarsmi = () => {
    const sakums =
      gaidiAvotu("interface")

    const nosaukums =
      gaidiVeidu("identifikators")

    const saturs =
      nolasitGrupu("{", "}")

    return {
      veids: "Saskarsme",
      nosaukums: nosaukums.vertiba,
      kermenaTokeni: saturs.length,
      rinda: sakums.rinda
    }
  }

  const parseUzskaitijumu = () => {
    const sakums =
      gaidiAvotu("enum")

    const nosaukums =
      gaidiVeidu("identifikators")

    const saturs =
      nolasitGrupu("{", "}")

    const vertibas = saturs
      .filter(
        tokens =>
          tokens.veids === "identifikators"
      )
      .map(
        tokens =>
          tokens.vertiba
      )

    return {
      veids: "Uzskaitījums",
      nosaukums: nosaukums.vertiba,
      vertibas,
      rinda: sakums.rinda
    }
  }

  const parseKlasi = modifikatori => {
    const sakums =
      gaidiAvotu("class")

    const nosaukums =
      gaidiVeidu("identifikators")

    const saturs =
      nolasitGrupu("{", "}")

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
    const sakums =
      gaidiAvotu("function")

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

    const saturs =
      nolasitGrupu("{", "}")

    return {
      veids: "Darbība",
      nosaukums: nosaukums.vertiba,
      eksporteta:
        modifikatori.includes("export"),
      asinhrona:
        modifikatori.includes("async"),
      parametruTokeni:
        parametri.length,
      atgriezesTips:
        atgriezesTips.join(""),
      kermenaTokeni:
        saturs.length,
      kermenis:
        parsePazinojumus(saturs),
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
