import {
  analizēIzteiksmi as analizēIzteiksmesAst
} from "./izteiksmju-sintaktiskais-analizators.mjs"

import {
  analizēKlasesĶermeni
} from "./klases-sintaktiskais-analizators.mjs"

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

function analizēKamGalveni(leksiskieElementi) {
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
      deklarācija: leksiskieElementi[0].avots,
      mainīgais: leksiskieElementi[1].vērtība,
      kolekcija:
        analizēIzteiksmesAst(
          leksiskieElementi.slice(3)
        )
    }
  }

  return {
    variants: "vispārīgs",
    izteiksme:
      analizēIzteiksmesAst(leksiskieElementi)
  }
}

export function analizēPriekšrakstus(leksiskieElementi) {
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

  const gaidiAvotu = avots => {
    const leksiskaisElements = esošais()

    if (
      !leksiskaisElements ||
      leksiskaisElements.veids !== "termins" ||
      leksiskaisElements.avots !== avots
    ) {
      sintaksesKļūda(
        `Gaidīts termins "${avots}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const gaidiVeidu = veids => {
    const leksiskaisElements = esošais()

    if (!leksiskaisElements || leksiskaisElements.veids !== veids) {
      sintaksesKļūda(
        `Gaidīts tokena veids "${veids}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const gaidiVērtību = vērtība => {
    const leksiskaisElements = esošais()

    if (!leksiskaisElements || leksiskaisElements.vērtība !== vērtība) {
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

  const nolasītIzteiksmi = sākumaRinda => {
    const saturs = []

    let iekavas = 0
    let kvadrātiekavas = 0
    let figūriekavas = 0

    while (indekss < leksiskieElementi.length) {
      const leksiskaisElements = esošais()

      const dziļums =
        iekavas +
        kvadrātiekavas +
        figūriekavas

      if (
        saturs.length > 0 &&
        leksiskaisElements.rinda > sākumaRinda &&
        dziļums === 0
      ) {
        break
      }

      if (
        saturs.length === 0 &&
        leksiskaisElements.rinda > sākumaRinda
      ) {
        break
      }

      paņem()
      saturs.push(leksiskaisElements)

      if (leksiskaisElements.vērtība === "(") {
        iekavas++
      }
      else if (leksiskaisElements.vērtība === ")") {
        iekavas--
      }
      else if (leksiskaisElements.vērtība === "[") {
        kvadrātiekavas++
      }
      else if (leksiskaisElements.vērtība === "]") {
        kvadrātiekavas--
      }
      else if (leksiskaisElements.vērtība === "{") {
        figūriekavas++
      }
      else if (leksiskaisElements.vērtība === "}") {
        figūriekavas--
      }
    }

    return saturs
  }

  const analizēMainīgo = () => {
    const sākums = paņem()
    const nosaukums =
      gaidiVeidu("identifikators")

    const tips = []

    if (irVērtība(":")) {
      paņem()

      while (
        esošais() &&
        !irVērtība("=")
      ) {
        tips.push(
          paņem().vērtība
        )
      }
    }

    const izteiksme = []

    if (irVērtība("=")) {
      paņem()

      izteiksme.push(
        ...nolasītIzteiksmi(sākums.rinda)
      )
    }

    const beigas =
      leksiskieElementi[
        indekss - 1
      ] ??
      nosaukums

    return {
      veids: "Mainīgais",
      deklarācija: sākums.avots,
      nosaukums: nosaukums.vērtība,
      tips:
        tips.length > 0
          ? tips.join("")
          : null,
      vērtība:
        izteiksme.length > 0
          ? analizēIzteiksmesAst(izteiksme)
          : null,
      rinda: sākums.rinda,
      diapazons:
        izveidoDiapazonu(
          sākums,
          beigas
        )
    }
  }

  const analizēNosacījumu = () => {
    const sākums = gaidiAvotu("if")
    const nosacījums =
      nolasītGrupu("(", ")")

    const ķermenis =
      nolasītGrupu("{", "}")

    const mezgls = {
      veids: "Nosacījums",
      nosacījums:
        analizēIzteiksmesAst(nosacījums),
      ķermenis:
        analizēPriekšrakstus(ķermenis),
      citādi: null,
      rinda: sākums.rinda
    }

    if (irAvots("else")) {
      paņem()

      if (irAvots("if")) {
        mezgls.citādi = [
          analizēNosacījumu()
        ]
      }
      else {
        const citādi =
          nolasītGrupu("{", "}")

        mezgls.citādi =
          analizēPriekšrakstus(citādi)
      }
    }

    const beigas =
      leksiskieElementi[
        indekss - 1
      ]

    mezgls.diapazons =
      izveidoDiapazonu(
        sākums,
        beigas
      )

    return mezgls
  }

  const analizēKamCiklu = () => {
    const sākums = gaidiAvotu("for")
    const galvene =
      nolasītGrupu("(", ")")

    const ķermenis =
      nolasītGrupu("{", "}")

    const beigas =
      leksiskieElementi[
        indekss - 1
      ]

    return {
      veids: "KamCikls",
      ...analizēKamGalveni(galvene),
      ķermenis:
        analizēPriekšrakstus(ķermenis),
      rinda: sākums.rinda,
      diapazons:
        izveidoDiapazonu(
          sākums,
          beigas
        )
    }
  }

  const analizēAtgriešanu = () => {
    const sākums = gaidiAvotu("return")

    const izteiksme =
      nolasītIzteiksmi(sākums.rinda)

    return {
      veids: "Atgriešana",
      vērtība:
        izteiksme.length > 0
          ? analizēIzteiksmesAst(izteiksme)
          : null,
      rinda: sākums.rinda,
      diapazons:
        izveidoDiapazonu(
          sākums,
          izteiksme.length > 0
            ? izteiksme[
                izteiksme.length - 1
              ]
            : sākums
        )
    }
  }

  const analizēMetienu = () => {
    const sākums = gaidiAvotu("throw")

    const izteiksme =
      nolasītIzteiksmi(sākums.rinda)

    const beigas =
      izteiksme[
        izteiksme.length - 1
      ] ??
      sākums

    return {
      veids: "Metiens",
      vērtība:
        analizēIzteiksmesAst(izteiksme),
      rinda: sākums.rinda,
      diapazons:
        izveidoDiapazonu(
          sākums,
          beigas
        )
    }
  }

  const analizēMēģinaBloku = () => {
    const sākums = gaidiAvotu("try")

    const mēģinaLeksiskieElementi =
      nolasītGrupu("{", "}")

    const mezgls = {
      veids: "Mēģinājums",
      mēģina:
        analizēPriekšrakstus(mēģinaLeksiskieElementi),
      ķer: null,
      beigas: null,
      rinda: sākums.rinda
    }

    if (irAvots("catch")) {
      paņem()

      const parametrs =
        nolasītGrupu("(", ")")

      const ķermenis =
        nolasītGrupu("{", "}")

      const nosaukums =
        parametrs.find(
          leksiskaisElements =>
            leksiskaisElements.veids === "identifikators"
        )

      mezgls.ķer = {
        parametrs:
          nosaukums?.vērtība ?? null,
        ķermenis:
          analizēPriekšrakstus(ķermenis)
      }
    }

    if (irAvots("finally")) {
      paņem()

      const ķermenis =
        nolasītGrupu("{", "}")

      mezgls.beigas =
        analizēPriekšrakstus(ķermenis)
    }

    const beigas =
      leksiskieElementi[
        indekss - 1
      ]

    mezgls.diapazons =
      izveidoDiapazonu(
        sākums,
        beigas
      )

    return mezgls
  }

  const analizēVienkāršu = (
    avots,
    veids
  ) => {
    const sākums = gaidiAvotu(avots)

    return {
      veids,
      rinda: sākums.rinda,
      diapazons:
        izveidoDiapazonu(
          sākums
        )
    }
  }

  const analizēIzteiksmesPriekšrakstu = () => {
    const sākums = esošais()

    const izteiksme =
      nolasītIzteiksmi(sākums.rinda)

    if (izteiksme.length === 0) {
      sintaksesKļūda(
        "Neizdevās nolasīt izteiksmi",
        sākums
      )
    }

    const beigas =
      izteiksme[
        izteiksme.length - 1
      ]

    return {
      veids: "Izteiksme",
      izteiksme:
        analizēIzteiksmesAst(izteiksme),
      rinda: sākums.rinda,
      diapazons:
        izveidoDiapazonu(
          sākums,
          beigas
        )
    }
  }

  const paziņojumi = []

  while (indekss < leksiskieElementi.length) {
    if (
      irAvots("const") ||
      irAvots("let") ||
      irAvots("var")
    ) {
      paziņojumi.push(
        analizēMainīgo()
      )

      continue
    }

    if (irAvots("if")) {
      paziņojumi.push(
        analizēNosacījumu()
      )

      continue
    }

    if (irAvots("for")) {
      paziņojumi.push(
        analizēKamCiklu()
      )

      continue
    }

    if (irAvots("return")) {
      paziņojumi.push(
        analizēAtgriešanu()
      )

      continue
    }

    if (irAvots("try")) {
      paziņojumi.push(
        analizēMēģinaBloku()
      )

      continue
    }

    if (irAvots("continue")) {
      paziņojumi.push(
        analizēVienkāršu(
          "continue",
          "Turpināšana"
        )
      )

      continue
    }

    if (irAvots("break")) {
      paziņojumi.push(
        analizēVienkāršu(
          "break",
          "Pārtraukšana"
        )
      )

      continue
    }

    if (irAvots("throw")) {
      paziņojumi.push(
        analizēMetienu()
      )

      continue
    }

    if (irAvots("debugger")) {
      paziņojumi.push(
        analizēVienkāršu(
          "debugger",
          "Atkļūdošana"
        )
      )

      continue
    }

    paziņojumi.push(
      analizēIzteiksmesPriekšrakstu()
    )
  }

  return paziņojumi
}

export function analizēSintaksi(leksiskieElementi) {
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

  const gaidiAvotu = avots => {
    const leksiskaisElements = esošais()

    if (
      !leksiskaisElements ||
      leksiskaisElements.veids !== "termins" ||
      leksiskaisElements.avots !== avots
    ) {
      sintaksesKļūda(
        `Gaidīts termins "${avots}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const gaidiVeidu = veids => {
    const leksiskaisElements = esošais()

    if (!leksiskaisElements || leksiskaisElements.veids !== veids) {
      sintaksesKļūda(
        `Gaidīts tokena veids "${veids}"`,
        leksiskaisElements
      )
    }

    indekss++
    return leksiskaisElements
  }

  const gaidiVērtību = vērtība => {
    const leksiskaisElements = esošais()

    if (!leksiskaisElements || leksiskaisElements.vērtība !== vērtība) {
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

  const analizēImportu = () => {
    const sākums = gaidiAvotu("import")

    gaidiVērtību("{")

    const vārdi = []

    while (!irVērtība("}")) {
      const nosaukums =
        gaidiVeidu("identifikators")

      vārdi.push(nosaukums.vērtība)

      if (irVērtība(",")) {
        paņem()
      }
      else if (!irVērtība("}")) {
        sintaksesKļūda(
          'Gaidīts "," vai "}"',
          esošais()
        )
      }
    }

    gaidiVērtību("}")
    gaidiAvotu("from")

    const avots =
      gaidiVeidu("teksts")

    return {
      veids: "Imports",
      vārdi,
      avots: avots.vērtība,
      rinda: sākums.rinda,
      diapazons:
        izveidoDiapazonu(
          sākums,
          avots
        )
    }
  }

  const analizēSaskarsmi = () => {
    const sākums =
      gaidiAvotu("interface")

    const nosaukums =
      gaidiVeidu("identifikators")

    const saturs =
      nolasītGrupu("{", "}")

    const beigas =
      leksiskieElementi[
        indekss - 1
      ]

    return {
      veids: "Saskarsme",
      nosaukums: nosaukums.vērtība,
      ķermeņaLeksiskieElementi: saturs.length,
      rinda: sākums.rinda,
      diapazons:
        izveidoDiapazonu(
          sākums,
          beigas
        )
    }
  }

  const analizēUzskaitījumu = () => {
    const sākums =
      gaidiAvotu("enum")

    const nosaukums =
      gaidiVeidu("identifikators")

    const saturs =
      nolasītGrupu("{", "}")

    const vērtības = saturs
      .filter(
        leksiskaisElements =>
          leksiskaisElements.veids === "identifikators"
      )
      .map(
        leksiskaisElements =>
          leksiskaisElements.vērtība
      )

    const beigas =
      leksiskieElementi[
        indekss - 1
      ]

    return {
      veids: "Uzskaitījums",
      nosaukums: nosaukums.vērtība,
      vērtības,
      rinda: sākums.rinda,
      diapazons:
        izveidoDiapazonu(
          sākums,
          beigas
        )
    }
  }

  const analizēKlasi = (
    modifikatori,
    deklarācijasSākums
  ) => {
    const sākums =
      gaidiAvotu("class")

    const nosaukums =
      gaidiVeidu("identifikators")

    const saturs =
      nolasītGrupu("{", "}")

    const beigas =
      leksiskieElementi[
        indekss - 1
      ]

    const klasesĶermenis =
      analizēKlasesĶermeni(
        saturs,
        analizēPriekšrakstus
      )

    return {
      veids: "Klase",
      nosaukums: nosaukums.vērtība,
      eksportēta:
        modifikatori.includes("export"),
      ķermeņaLeksiskoElementuSkaits:
        saturs.length,
      ķermenis:
        klasesĶermenis.ķermenis,
      lauki:
        klasesĶermenis.lauki,
      konstruktors:
        klasesĶermenis.konstruktors,
      iegūšanas:
        klasesĶermenis.iegūšanas,
      metodes:
        klasesĶermenis.metodes,
      rinda: sākums.rinda,
      diapazons:
        izveidoDiapazonu(
          deklarācijasSākums ??
            sākums,
          beigas
        )
    }
  }

  const analizēDarbību = (
    modifikatori,
    deklarācijasSākums
  ) => {
    const sākums =
      gaidiAvotu("function")

    const nosaukums =
      gaidiVeidu("identifikators")

    const parametri =
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

    const saturs =
      nolasītGrupu("{", "}")

    const beigas =
      leksiskieElementi[
        indekss - 1
      ]

    return {
      veids: "Darbība",
      nosaukums: nosaukums.vērtība,
      eksportēta:
        modifikatori.includes("export"),
      asinhrona:
        modifikatori.includes("async"),
      parametri:
        analizēParametrus(
          parametri,
          "darbības"
        ),
      parametruLeksiskoElementuSkaits:
        parametri.length,
      atgriezesTips:
        atgriezesTips.join(""),
      ķermeņaLeksiskieElementi:
        saturs.length,
      ķermenis:
        analizēPriekšrakstus(saturs),
      rinda: sākums.rinda,
      diapazons:
        izveidoDiapazonu(
          deklarācijasSākums ??
            sākums,
          beigas
        )
    }
  }

  const elementi = []

  while (indekss < leksiskieElementi.length) {
    if (irAvots("import")) {
      elementi.push(
        analizēImportu()
      )

      continue
    }

    if (irAvots("interface")) {
      elementi.push(
        analizēSaskarsmi()
      )

      continue
    }

    if (irAvots("enum")) {
      elementi.push(
        analizēUzskaitījumu()
      )

      continue
    }

    const deklarācijasSākums =
      esošais()

    const modifikatori = []

    while (
      irAvots("export") ||
      irAvots("async")
    ) {
      modifikatori.push(
        paņem().avots
      )
    }

    if (irAvots("class")) {
      elementi.push(
        analizēKlasi(
          modifikatori,
          deklarācijasSākums
        )
      )

      continue
    }

    if (irAvots("function")) {
      elementi.push(
        analizēDarbību(
          modifikatori,
          deklarācijasSākums
        )
      )

      continue
    }

    if (modifikatori.length > 0) {
      sintaksesKļūda(
        "Pēc modifikatora gaidīta deklarācija",
        esošais()
      )
    }

    sintaksesKļūda(
      "Neatpazīta augšējā līmeņa konstrukcija",
      esošais()
    )
  }

  return {
    veids: "Programma",
    elementi,
    diapazons:
      leksiskieElementi.length > 0
        ? izveidoDiapazonu(
            leksiskieElementi[0],
            leksiskieElementi[
              leksiskieElementi.length - 1
            ]
          )
        : null
  }
}
