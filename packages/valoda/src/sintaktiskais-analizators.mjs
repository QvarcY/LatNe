import {
  analizeIzteiksmi as analizeIzteiksmesAst
} from "./izteiksmju-sintaktiskais-analizators.mjs"

import {
  analizeKlasesKermeni
} from "./klases-sintaktiskais-analizators.mjs"

function sintaksesKluda(zina, leksiskaisElements) {
  if (!leksiskaisElements) {
    throw new SyntaxError(`${zina} faila beigās`)
  }

  throw new SyntaxError(
    `${zina} rindā ${leksiskaisElements.rinda}, kolonnā ${leksiskaisElements.kolonna}: ${leksiskaisElements.vertiba}`
  )
}

function analizeKamGalveni(leksiskieElementi) {
  if (
    leksiskieElementi.length >= 4 &&
    leksiskieElementi[0].veids === "termins" &&
    (
      leksiskieElementi[0].avots === "const" ||
      leksiskieElementi[0].avots === "let" ||
      leksiskieElementi[0].avots === "var"
    ) &&
    leksiskieElementi[1].veids === "identifikators" &&
    leksiskieElementi[2].veids === "termins" &&
    leksiskieElementi[2].avots === "of"
  ) {
    return {
      variants: "of",
      deklaracija: leksiskieElementi[0].avots,
      mainigais: leksiskieElementi[1].vertiba,
      kolekcija:
        analizeIzteiksmesAst(
          leksiskieElementi.slice(3)
        )
    }
  }

  return {
    variants: "vispārīgs",
    izteiksme:
      analizeIzteiksmesAst(leksiskieElementi)
  }
}

export function analizePrieksrakstus(leksiskieElementi) {
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

  const gaidiAvotu = avots => {
    const leksiskaisElements = esosais()

    if (
      !leksiskaisElements ||
      leksiskaisElements.veids !== "termins" ||
      leksiskaisElements.avots !== avots
    ) {
      sintaksesKluda(
        `Gaidīts termins "${avots}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const gaidiVeidu = veids => {
    const leksiskaisElements = esosais()

    if (!leksiskaisElements || leksiskaisElements.veids !== veids) {
      sintaksesKluda(
        `Gaidīts tokena veids "${veids}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const gaidiVertibu = vertiba => {
    const leksiskaisElements = esosais()

    if (!leksiskaisElements || leksiskaisElements.vertiba !== vertiba) {
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

  const nolasitIzteiksmi = sakumaRinda => {
    const saturs = []

    let iekavas = 0
    let kvadratiekavas = 0
    let figuriiekavas = 0

    while (indekss < leksiskieElementi.length) {
      const leksiskaisElements = esosais()

      const dzilums =
        iekavas +
        kvadratiekavas +
        figuriiekavas

      if (
        saturs.length > 0 &&
        leksiskaisElements.rinda > sakumaRinda &&
        dzilums === 0
      ) {
        break
      }

      if (
        saturs.length === 0 &&
        leksiskaisElements.rinda > sakumaRinda
      ) {
        break
      }

      panem()
      saturs.push(leksiskaisElements)

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

    return saturs
  }

  const analizeMainigo = () => {
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
          ? analizeIzteiksmesAst(izteiksme)
          : null,
      rinda: sakums.rinda
    }
  }

  const analizeNosacijumu = () => {
    const sakums = gaidiAvotu("if")
    const nosacijums =
      nolasitGrupu("(", ")")

    const kermenis =
      nolasitGrupu("{", "}")

    const mezgls = {
      veids: "Nosacījums",
      nosacijums:
        analizeIzteiksmesAst(nosacijums),
      kermenis:
        analizePrieksrakstus(kermenis),
      citadi: null,
      rinda: sakums.rinda
    }

    if (irAvots("else")) {
      panem()

      if (irAvots("if")) {
        mezgls.citadi = [
          analizeNosacijumu()
        ]
      }
      else {
        const citadi =
          nolasitGrupu("{", "}")

        mezgls.citadi =
          analizePrieksrakstus(citadi)
      }
    }

    return mezgls
  }

  const analizeKamCiklu = () => {
    const sakums = gaidiAvotu("for")
    const galvene =
      nolasitGrupu("(", ")")

    const kermenis =
      nolasitGrupu("{", "}")

    return {
      veids: "KamCikls",
      ...analizeKamGalveni(galvene),
      kermenis:
        analizePrieksrakstus(kermenis),
      rinda: sakums.rinda
    }
  }

  const analizeAtgriesanu = () => {
    const sakums = gaidiAvotu("return")

    const izteiksme =
      nolasitIzteiksmi(sakums.rinda)

    return {
      veids: "Atgriešana",
      vertiba:
        izteiksme.length > 0
          ? analizeIzteiksmesAst(izteiksme)
          : null,
      rinda: sakums.rinda
    }
  }

  const analizeMetienu = () => {
    const sakums = gaidiAvotu("throw")

    const izteiksme =
      nolasitIzteiksmi(sakums.rinda)

    return {
      veids: "Metiens",
      vertiba:
        analizeIzteiksmesAst(izteiksme),
      rinda: sakums.rinda
    }
  }

  const analizeMeginaBloku = () => {
    const sakums = gaidiAvotu("try")

    const meginaLeksiskieElementi =
      nolasitGrupu("{", "}")

    const mezgls = {
      veids: "Mēģinājums",
      megina:
        analizePrieksrakstus(meginaLeksiskieElementi),
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
          leksiskaisElements =>
            leksiskaisElements.veids === "identifikators"
        )

      mezgls.ker = {
        parametrs:
          nosaukums?.vertiba ?? null,
        kermenis:
          analizePrieksrakstus(kermenis)
      }
    }

    if (irAvots("finally")) {
      panem()

      const kermenis =
        nolasitGrupu("{", "}")

      mezgls.beigas =
        analizePrieksrakstus(kermenis)
    }

    return mezgls
  }

  const analizeVienkarsu = (
    avots,
    veids
  ) => {
    const sakums = gaidiAvotu(avots)

    return {
      veids,
      rinda: sakums.rinda
    }
  }

  const analizeIzteiksmesPrieksrakstu = () => {
    const sakums = esosais()

    const izteiksme =
      nolasitIzteiksmi(sakums.rinda)

    if (izteiksme.length === 0) {
      sintaksesKluda(
        "Neizdevās nolasīt izteiksmi",
        sakums
      )
    }

    return {
      veids: "Izteiksme",
      izteiksme:
        analizeIzteiksmesAst(izteiksme),
      rinda: sakums.rinda
    }
  }

  const pazinojumi = []

  while (indekss < leksiskieElementi.length) {
    if (
      irAvots("const") ||
      irAvots("let") ||
      irAvots("var")
    ) {
      pazinojumi.push(
        analizeMainigo()
      )

      continue
    }

    if (irAvots("if")) {
      pazinojumi.push(
        analizeNosacijumu()
      )

      continue
    }

    if (irAvots("for")) {
      pazinojumi.push(
        analizeKamCiklu()
      )

      continue
    }

    if (irAvots("return")) {
      pazinojumi.push(
        analizeAtgriesanu()
      )

      continue
    }

    if (irAvots("try")) {
      pazinojumi.push(
        analizeMeginaBloku()
      )

      continue
    }

    if (irAvots("continue")) {
      pazinojumi.push(
        analizeVienkarsu(
          "continue",
          "Turpināšana"
        )
      )

      continue
    }

    if (irAvots("break")) {
      pazinojumi.push(
        analizeVienkarsu(
          "break",
          "Pārtraukšana"
        )
      )

      continue
    }

    if (irAvots("throw")) {
      pazinojumi.push(
        analizeMetienu()
      )

      continue
    }

    if (irAvots("debugger")) {
      pazinojumi.push(
        analizeVienkarsu(
          "debugger",
          "Atkļūdošana"
        )
      )

      continue
    }

    pazinojumi.push(
      analizeIzteiksmesPrieksrakstu()
    )
  }

  return pazinojumi
}

export function analizeSintaksi(leksiskieElementi) {
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

  const gaidiAvotu = avots => {
    const leksiskaisElements = esosais()

    if (
      !leksiskaisElements ||
      leksiskaisElements.veids !== "termins" ||
      leksiskaisElements.avots !== avots
    ) {
      sintaksesKluda(
        `Gaidīts termins "${avots}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const gaidiVeidu = veids => {
    const leksiskaisElements = esosais()

    if (!leksiskaisElements || leksiskaisElements.veids !== veids) {
      sintaksesKluda(
        `Gaidīts tokena veids "${veids}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const gaidiVertibu = vertiba => {
    const leksiskaisElements = esosais()

    if (!leksiskaisElements || leksiskaisElements.vertiba !== vertiba) {
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

  const analizeImportu = () => {
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
        sintaksesKluda(
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

  const analizeSaskarsmi = () => {
    const sakums =
      gaidiAvotu("interface")

    const nosaukums =
      gaidiVeidu("identifikators")

    const saturs =
      nolasitGrupu("{", "}")

    return {
      veids: "Saskarsme",
      nosaukums: nosaukums.vertiba,
      kermenaLeksiskieElementi: saturs.length,
      rinda: sakums.rinda
    }
  }

  const analizeUzskaitijumu = () => {
    const sakums =
      gaidiAvotu("enum")

    const nosaukums =
      gaidiVeidu("identifikators")

    const saturs =
      nolasitGrupu("{", "}")

    const vertibas = saturs
      .filter(
        leksiskaisElements =>
          leksiskaisElements.veids === "identifikators"
      )
      .map(
        leksiskaisElements =>
          leksiskaisElements.vertiba
      )

    return {
      veids: "Uzskaitījums",
      nosaukums: nosaukums.vertiba,
      vertibas,
      rinda: sakums.rinda
    }
  }

  const analizeKlasi = modifikatori => {
    const sakums =
      gaidiAvotu("class")

    const nosaukums =
      gaidiVeidu("identifikators")

    const saturs =
      nolasitGrupu("{", "}")

    const klasesKermenis =
      analizeKlasesKermeni(
        saturs,
        analizePrieksrakstus
      )

    return {
      veids: "Klase",
      nosaukums: nosaukums.vertiba,
      eksporteta:
        modifikatori.includes("export"),
      kermenaLeksiskoElementuSkaits:
        saturs.length,
      kermenis:
        klasesKermenis.kermenis,
      lauki:
        klasesKermenis.lauki,
      konstruktors:
        klasesKermenis.konstruktors,
      getteri:
        klasesKermenis.getteri,
      metodes:
        klasesKermenis.metodes,
      rinda: sakums.rinda
    }
  }

  const analizeDarbibu = modifikatori => {
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
      parametruLeksiskieElementi:
        parametri.length,
      atgriezesTips:
        atgriezesTips.join(""),
      kermenaLeksiskieElementi:
        saturs.length,
      kermenis:
        analizePrieksrakstus(saturs),
      rinda: sakums.rinda
    }
  }

  const elementi = []

  while (indekss < leksiskieElementi.length) {
    if (irAvots("import")) {
      elementi.push(
        analizeImportu()
      )

      continue
    }

    if (irAvots("interface")) {
      elementi.push(
        analizeSaskarsmi()
      )

      continue
    }

    if (irAvots("enum")) {
      elementi.push(
        analizeUzskaitijumu()
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
        analizeKlasi(modifikatori)
      )

      continue
    }

    if (irAvots("function")) {
      elementi.push(
        analizeDarbibu(modifikatori)
      )

      continue
    }

    if (modifikatori.length > 0) {
      sintaksesKluda(
        "Pēc modifikatora gaidīta deklarācija",
        esosais()
      )
    }

    sintaksesKluda(
      "Neatpazīta augšējā līmeņa konstrukcija",
      esosais()
    )
  }

  return {
    veids: "Programma",
    elementi
  }
}
