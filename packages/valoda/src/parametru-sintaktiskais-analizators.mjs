function sintaksesKluda(
  zina,
  leksiskaisElements
) {
  if (!leksiskaisElements) {
    throw new SyntaxError(
      `${zina} faila beigās`
    )
  }

  throw new SyntaxError(
    `${zina} rindā ${leksiskaisElements.rinda}, kolonnā ${leksiskaisElements.kolonna}: ${leksiskaisElements.vertiba}`
  )
}

export function analizeParametrus(
  leksiskieElementi,
  konteksts = "darbības"
) {
  if (leksiskieElementi.length === 0) {
    return []
  }

  const dalas = []
  let dala = []

  let iekavas = 0
  let kvadratiekavas = 0
  let figuriiekavas = 0

  for (
    const leksiskaisElements
    of leksiskieElementi
  ) {
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
          `Tukšs ${konteksts} parametrs`,
          leksiskaisElements
        )
      }

      dalas.push(dala)
      dala = []
      continue
    }

    dala.push(leksiskaisElements)

    if (
      leksiskaisElements.vertiba === "("
    ) {
      iekavas++
    }
    else if (
      leksiskaisElements.vertiba === ")"
    ) {
      iekavas--
    }
    else if (
      leksiskaisElements.vertiba === "["
    ) {
      kvadratiekavas++
    }
    else if (
      leksiskaisElements.vertiba === "]"
    ) {
      kvadratiekavas--
    }
    else if (
      leksiskaisElements.vertiba === "{"
    ) {
      figuriiekavas++
    }
    else if (
      leksiskaisElements.vertiba === "}"
    ) {
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
        `Gaidīts ${konteksts} parametra nosaukums`,
        nosaukums
      )
    }

    if (
      !kols ||
      kols.vertiba !== ":"
    ) {
      sintaksesKluda(
        `Gaidīts ":" aiz ${konteksts} parametra`,
        kols ?? nosaukums
      )
    }

    if (tipaElementi.length === 0) {
      sintaksesKluda(
        `Gaidīts ${konteksts} parametra tips`,
        kols
      )
    }

    return {
      veids: "Parametrs",
      nosaukums: nosaukums.vertiba,
      tips:
        tipaElementi
          .map(
            leksiskaisElements =>
              leksiskaisElements.vertiba
          )
          .join(""),
      rinda: nosaukums.rinda
    }
  })
}
