function kopēPozīciju(pozīcija) {
  if (
    !pozīcija ||
    !Number.isInteger(pozīcija.rinda) ||
    !Number.isInteger(pozīcija.kolonna) ||
    !Number.isInteger(pozīcija.nobīde)
  ) {
    throw new TypeError(
      "Pirmkoda pozīcijai nepieciešama rinda, kolonna un nobīde"
    )
  }

  return {
    rinda: pozīcija.rinda,
    kolonna: pozīcija.kolonna,
    nobīde: pozīcija.nobīde
  }
}

function paņemPozīciju(avots, mala) {
  const pozīcija =
    avots?.diapazons?.[mala]

  if (!pozīcija) {
    throw new TypeError(
      `Nav pieejama diapazona ${mala} pozīcija`
    )
  }

  return kopēPozīciju(pozīcija)
}

export function izveidoDiapazonu(
  sākums,
  beigas = sākums
) {
  return {
    sākums:
      paņemPozīciju(
        sākums,
        "sākums"
      ),
    beigas:
      paņemPozīciju(
        beigas,
        "beigas"
      )
  }
}
