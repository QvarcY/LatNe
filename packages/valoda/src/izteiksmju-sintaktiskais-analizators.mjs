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

const PIESKIRSANAS_OPERATORI = new Set([
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

function izteiksmesKluda(zina, leksiskaisElements) {
  if (!leksiskaisElements) {
    throw new SyntaxError(
      `${zina} izteiksmes beigās`
    )
  }

  throw new SyntaxError(
    `${zina} rindā ${leksiskaisElements.rinda}, kolonnā ${leksiskaisElements.kolonna}: ${leksiskaisElements.vertiba}`
  )
}

export function analizeIzteiksmi(leksiskieElementi) {
  if (!leksiskieElementi || leksiskieElementi.length === 0) {
    return null
  }

  let indekss = 0

  const esosais = () =>
    leksiskieElementi[indekss] ?? null

  const panem = () => {
    const leksiskaisElements = esosais()

    if (leksiskaisElements) {
      indekss++
    }

    return leksiskaisElements
  }

  const irVertiba = vertiba =>
    esosais()?.vertiba === vertiba

  const irAvots = avots => {
    const leksiskaisElements = esosais()

    return Boolean(
      leksiskaisElements &&
      leksiskaisElements.veids === "termins" &&
      leksiskaisElements.avots === avots
    )
  }

  const gaidiVertibu = vertiba => {
    const leksiskaisElements = esosais()

    if (!leksiskaisElements || leksiskaisElements.vertiba !== vertiba) {
      izteiksmesKluda(
        `Gaidīts "${vertiba}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const analizeArgumentus = () => {
    gaidiVertibu("(")

    const argumenti = []

    if (irVertiba(")")) {
      panem()
      return argumenti
    }

    while (indekss < leksiskieElementi.length) {
      argumenti.push(
        analizePieskirsanu()
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

  const analizeMasivu = () => {
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

    while (indekss < leksiskieElementi.length) {
      elementi.push(
        analizePieskirsanu()
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

  const analizePamatu = () => {
    const leksiskaisElements = esosais()

    if (!leksiskaisElements) {
      izteiksmesKluda(
        "Gaidīta izteiksme",
        null
      )
    }

    if (leksiskaisElements.veids === "identifikators") {
      panem()

      return {
        veids: "Identifikators",
        nosaukums: leksiskaisElements.vertiba,
        rinda: leksiskaisElements.rinda
      }
    }

    if (leksiskaisElements.veids === "skaitlis") {
      panem()

      return {
        veids: "Skaitlis",
        vertiba: Number(
          leksiskaisElements.vertiba.replaceAll("_", "")
        ),
        raw: leksiskaisElements.vertiba,
        rinda: leksiskaisElements.rinda
      }
    }

    if (leksiskaisElements.veids === "teksts") {
      panem()

      return {
        veids: "Teksts",
        vertiba:
          leksiskaisElements.vertiba.slice(1, -1),
        raw: leksiskaisElements.vertiba,
        rinda: leksiskaisElements.rinda
      }
    }

    if (leksiskaisElements.veids === "veidne") {
      panem()

      return {
        veids: "Veidne",
        raw: leksiskaisElements.vertiba,
        rinda: leksiskaisElements.rinda
      }
    }

    if (irAvots("null")) {
      panem()

      return {
        veids: "Nekas",
        rinda: leksiskaisElements.rinda
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
          leksiskaisElements.avots === "true",
        rinda: leksiskaisElements.rinda
      }
    }

    if (irAvots("undefined")) {
      panem()

      return {
        veids: "Nenoteikts",
        rinda: leksiskaisElements.rinda
      }
    }

    if (irAvots("this")) {
      panem()

      return {
        veids: "Šis",
        rinda: leksiskaisElements.rinda
      }
    }

    if (irVertiba("[")) {
      return analizeMasivu()
    }

    if (irVertiba("(")) {
      panem()

      const izteiksme =
        analizePieskirsanu()

      gaidiVertibu(")")

      return {
        veids: "Grupa",
        izteiksme,
        rinda: leksiskaisElements.rinda
      }
    }

    izteiksmesKluda(
      "Neatpazīta izteiksmes sākuma daļa",
      leksiskaisElements
    )
  }

  const analizePostfiksu = sakne => {
    let mezgls = sakne

    while (indekss < leksiskieElementi.length) {
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
          argumenti: analizeArgumentus(),
          rinda: mezgls.rinda
        }

        continue
      }

      break
    }

    return mezgls
  }

  const analizeVienibu = () => {
    const leksiskaisElements = esosais()

    if (!leksiskaisElements) {
      izteiksmesKluda(
        "Gaidīta izteiksme",
        null
      )
    }

    if (irAvots("await")) {
      panem()

      return {
        veids: "Gaidīšana",
        izteiksme: analizeVienibu(),
        rinda: leksiskaisElements.rinda
      }
    }

    if (irAvots("new")) {
      panem()

      const sakne =
        analizePostfiksu(
          analizePamatu()
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
        leksiskaisElements.vertiba === "!" ||
        leksiskaisElements.vertiba === "+" ||
        leksiskaisElements.vertiba === "-" ||
        leksiskaisElements.vertiba === "~"
      )
    ) {
      panem()

      return {
        veids: "UnāraIzteiksme",
        operators: leksiskaisElements.vertiba,
        izteiksme: analizeVienibu(),
        rinda: leksiskaisElements.rinda
      }
    }

    if (irAvots("typeof")) {
      panem()

      return {
        veids: "UnāraIzteiksme",
        operators: "typeof",
        izteiksme: analizeVienibu(),
        rinda: leksiskaisElements.rinda
      }
    }

    return analizePostfiksu(
      analizePamatu()
    )
  }

  function analizeBinaro(minPrioritate) {
    let kreisa = analizeVienibu()

    while (indekss < leksiskieElementi.length) {
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
        analizeBinaro(
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

  const analizePieskirsanu = () => {
    const merkis =
      analizeBinaro(0)

    const operators = esosais()

    if (
      !operators ||
      operators.veids !== "operators" ||
      !PIESKIRSANAS_OPERATORI.has(
        operators.vertiba
      )
    ) {
      return merkis
    }

    if (
      merkis.veids !== "Identifikators" &&
      merkis.veids !== "Īpašība"
    ) {
      izteiksmesKluda(
        "Nederīgs piešķiršanas mērķis",
        operators
      )
    }

    panem()

    return {
      veids: "PiešķiršanasIzteiksme",
      operators: operators.vertiba,
      merkis,
      vertiba:
        analizePieskirsanu(),
      rinda: merkis.rinda
    }
  }

  const rezultats =
    analizePieskirsanu()

  if (indekss < leksiskieElementi.length) {
    izteiksmesKluda(
      "Neatpazīta izteiksmes turpinājuma daļa",
      esosais()
    )
  }

  return rezultats
}
