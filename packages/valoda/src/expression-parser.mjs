const PRIORITATES = new Map([
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

function izteiksmesKluda(zina, tokens) {
  if (!tokens) {
    throw new SyntaxError(
      `${zina} izteiksmes beigās`
    )
  }

  throw new SyntaxError(
    `${zina} rindā ${tokens.rinda}, kolonnā ${tokens.kolonna}: ${tokens.vertiba}`
  )
}

export function parseIzteiksmi(tokeni) {
  if (!tokeni || tokeni.length === 0) {
    return null
  }

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

  const irVertiba = vertiba =>
    esosais()?.vertiba === vertiba

  const irAvots = avots => {
    const tokens = esosais()

    return Boolean(
      tokens &&
      tokens.veids === "termins" &&
      tokens.avots === avots
    )
  }

  const gaidiVertibu = vertiba => {
    const tokens = esosais()

    if (!tokens || tokens.vertiba !== vertiba) {
      izteiksmesKluda(
        `Gaidīts "${vertiba}"`,
        tokens
      )
    }

    indekss++
    return tokens
  }

  const parseArgumentus = () => {
    gaidiVertibu("(")

    const argumenti = []

    if (irVertiba(")")) {
      panem()
      return argumenti
    }

    while (indekss < tokeni.length) {
      argumenti.push(
        parseBinaro(0)
      )

      if (irVertiba(",")) {
        panem()
        continue
      }

      gaidiVertibu(")")
      return argumenti
    }

    izteiksmesKluda(
      'Nav aizvērts izsaukums "("',
      null
    )
  }

  const parseMasivu = () => {
    const sakums = gaidiVertibu("[")
    const elementi = []

    if (irVertiba("]")) {
      panem()

      return {
        veids: "Masīvs",
        elementi,
        rinda: sakums.rinda
      }
    }

    while (indekss < tokeni.length) {
      elementi.push(
        parseBinaro(0)
      )

      if (irVertiba(",")) {
        panem()
        continue
      }

      gaidiVertibu("]")

      return {
        veids: "Masīvs",
        elementi,
        rinda: sakums.rinda
      }
    }

    izteiksmesKluda(
      'Nav aizvērts masīvs "["',
      null
    )
  }

  const parsePamatu = () => {
    const tokens = esosais()

    if (!tokens) {
      izteiksmesKluda(
        "Gaidīta izteiksme",
        null
      )
    }

    if (tokens.veids === "identifikators") {
      panem()

      return {
        veids: "Identifikators",
        nosaukums: tokens.vertiba,
        rinda: tokens.rinda
      }
    }

    if (tokens.veids === "skaitlis") {
      panem()

      return {
        veids: "Skaitlis",
        vertiba: Number(
          tokens.vertiba.replaceAll("_", "")
        ),
        raw: tokens.vertiba,
        rinda: tokens.rinda
      }
    }

    if (tokens.veids === "teksts") {
      panem()

      return {
        veids: "Teksts",
        vertiba:
          tokens.vertiba.slice(1, -1),
        raw: tokens.vertiba,
        rinda: tokens.rinda
      }
    }

    if (tokens.veids === "veidne") {
      panem()

      return {
        veids: "Veidne",
        raw: tokens.vertiba,
        rinda: tokens.rinda
      }
    }

    if (irAvots("null")) {
      panem()

      return {
        veids: "Nekas",
        rinda: tokens.rinda
      }
    }

    if (
      irAvots("true") ||
      irAvots("false")
    ) {
      panem()

      return {
        veids: "Loģisks",
        vertiba:
          tokens.avots === "true",
        rinda: tokens.rinda
      }
    }

    if (irAvots("undefined")) {
      panem()

      return {
        veids: "Nenoteikts",
        rinda: tokens.rinda
      }
    }

    if (irAvots("this")) {
      panem()

      return {
        veids: "Šis",
        rinda: tokens.rinda
      }
    }

    if (irVertiba("[")) {
      return parseMasivu()
    }

    if (irVertiba("(")) {
      panem()

      const izteiksme =
        parseBinaro(0)

      gaidiVertibu(")")

      return {
        veids: "Grupa",
        izteiksme,
        rinda: tokens.rinda
      }
    }

    izteiksmesKluda(
      "Neatpazīta izteiksmes sākuma daļa",
      tokens
    )
  }

  const parsePostfiksu = sakne => {
    let mezgls = sakne

    while (indekss < tokeni.length) {
      if (irVertiba(".")) {
        panem()

        const ipasiba = panem()

        if (
          !ipasiba ||
          (
            ipasiba.veids !== "identifikators" &&
            ipasiba.veids !== "termins"
          )
        ) {
          izteiksmesKluda(
            "Gaidīts īpašības nosaukums",
            ipasiba
          )
        }

        mezgls = {
          veids: "Īpašība",
          objekts: mezgls,
          nosaukums: ipasiba.vertiba,
          rinda: mezgls.rinda
        }

        continue
      }

      if (irVertiba("(")) {
        mezgls = {
          veids: "Izsaukums",
          izsaucamais: mezgls,
          argumenti: parseArgumentus(),
          rinda: mezgls.rinda
        }

        continue
      }

      break
    }

    return mezgls
  }

  const parseVienibu = () => {
    const tokens = esosais()

    if (!tokens) {
      izteiksmesKluda(
        "Gaidīta izteiksme",
        null
      )
    }

    if (irAvots("await")) {
      panem()

      return {
        veids: "Gaidīšana",
        izteiksme: parseVienibu(),
        rinda: tokens.rinda
      }
    }

    if (irAvots("new")) {
      panem()

      const sakne =
        parsePostfiksu(
          parsePamatu()
        )

      if (sakne.veids === "Izsaukums") {
        return {
          veids: "Jauns",
          konstruktors:
            sakne.izsaucamais,
          argumenti:
            sakne.argumenti,
          rinda: tokens.rinda
        }
      }

      return {
        veids: "Jauns",
        konstruktors: sakne,
        argumenti: [],
        rinda: tokens.rinda
      }
    }

    if (
      tokens.veids === "operators" &&
      (
        tokens.vertiba === "!" ||
        tokens.vertiba === "+" ||
        tokens.vertiba === "-" ||
        tokens.vertiba === "~"
      )
    ) {
      panem()

      return {
        veids: "UnāraIzteiksme",
        operators: tokens.vertiba,
        izteiksme: parseVienibu(),
        rinda: tokens.rinda
      }
    }

    if (irAvots("typeof")) {
      panem()

      return {
        veids: "UnāraIzteiksme",
        operators: "typeof",
        izteiksme: parseVienibu(),
        rinda: tokens.rinda
      }
    }

    return parsePostfiksu(
      parsePamatu()
    )
  }

  function parseBinaro(minPrioritate) {
    let kreisa = parseVienibu()

    while (indekss < tokeni.length) {
      const operators = esosais()

      if (
        !operators ||
        operators.veids !== "operators"
      ) {
        break
      }

      const prioritate =
        PRIORITATES.get(
          operators.vertiba
        )

      if (
        prioritate === undefined ||
        prioritate < minPrioritate
      ) {
        break
      }

      panem()

      const laba =
        parseBinaro(
          prioritate + 1
        )

      kreisa = {
        veids: "BināraIzteiksme",
        operators:
          operators.vertiba,
        kreisa,
        laba,
        rinda: kreisa.rinda
      }
    }

    return kreisa
  }

  const rezultats =
    parseBinaro(0)

  if (indekss < tokeni.length) {
    izteiksmesKluda(
      "Neatpazīta izteiksmes turpinājuma daļa",
      esosais()
    )
  }

  return rezultats
}
