function sintaksesKļūda(
  ziņa,
  leksiskaisElements
) {
  if (!leksiskaisElements) {
    throw new SyntaxError(
      `${ziņa} faila beigās`
    )
  }

  throw new SyntaxError(
    `${ziņa} rindā ${leksiskaisElements.rinda}, kolonnā ${leksiskaisElements.kolonna}: ${leksiskaisElements.vērtība}`
  )
}

export function analizēParametrus(
  leksiskieElementi,
  konteksts = "darbības"
) {
  if (leksiskieElementi.length === 0) {
    return []
  }

  const daļas = []
  let daļa = []

  let iekavas = 0
  let kvadrātiekavas = 0
  let figūriekavas = 0

  for (
    const leksiskaisElements
    of leksiskieElementi
  ) {
    const dziļums =
      iekavas +
      kvadrātiekavas +
      figūriekavas

    if (
      leksiskaisElements.vērtība === "," &&
      dziļums === 0
    ) {
      if (daļa.length === 0) {
        sintaksesKļūda(
          `Tukšs ${konteksts} parametrs`,
          leksiskaisElements
        )
      }

      daļas.push(daļa)
      daļa = []
      continue
    }

    daļa.push(leksiskaisElements)

    if (
      leksiskaisElements.vērtība === "("
    ) {
      iekavas++
    }
    else if (
      leksiskaisElements.vērtība === ")"
    ) {
      iekavas--
    }
    else if (
      leksiskaisElements.vērtība === "["
    ) {
      kvadrātiekavas++
    }
    else if (
      leksiskaisElements.vērtība === "]"
    ) {
      kvadrātiekavas--
    }
    else if (
      leksiskaisElements.vērtība === "{"
    ) {
      figūriekavas++
    }
    else if (
      leksiskaisElements.vērtība === "}"
    ) {
      figūriekavas--
    }
  }

  if (daļa.length > 0) {
    daļas.push(daļa)
  }

  return daļas.map(daļa => {
    const nosaukums = daļa[0]
    const kols = daļa[1]
    const tipaElementi = daļa.slice(2)

    if (
      !nosaukums ||
      nosaukums.veids !== "identifikators"
    ) {
      sintaksesKļūda(
        `Gaidīts ${konteksts} parametra nosaukums`,
        nosaukums
      )
    }

    if (
      !kols ||
      kols.vērtība !== ":"
    ) {
      sintaksesKļūda(
        `Gaidīts ":" aiz ${konteksts} parametra`,
        kols ?? nosaukums
      )
    }

    if (tipaElementi.length === 0) {
      sintaksesKļūda(
        `Gaidīts ${konteksts} parametra tips`,
        kols
      )
    }

    return {
      veids: "Parametrs",
      nosaukums: nosaukums.vērtība,
      tips:
        tipaElementi
          .map(
            leksiskaisElements =>
              leksiskaisElements.vērtība
          )
          .join(""),
      rinda: nosaukums.rinda
    }
  })
}
