const SAKUMS = /[\p{L}_$]/u
const TURPINAJUMS = /[\p{L}\p{N}_$]/u
const CIPARS = /[0-9]/

const OPERATORI = [
  "===", "!==", ">>>", "**=", "&&=", "||=", "??=",
  "==", "!=", "<=", ">=", "=>", "++", "--", "&&", "||",
  "??", "?.", "**", "+=", "-=", "*=", "/=", "%=", "<<", ">>",
  "=", "+", "-", "*", "/", "%", "<", ">", "!", "&", "|", "^", "~"
]

const PIETURZIMES = new Set([
  "(", ")", "{", "}", "[", "]", ",", ";", ":", ".", "?"
])

export function izveidoVardnicu(registrs) {
  const vardnica = new Map()

  for (const termins of registrs.terms ?? []) {
    if (
      termins.status !== "approved" ||
      !termins.latvian
    ) {
      continue
    }

    if (vardnica.has(termins.latvian)) {
      throw new Error(
        `Dublēts LatNe vārds: ${termins.latvian}`
      )
    }

    vardnica.set(termins.latvian, {
      avots: termins.source,
      kategorija: termins.category,
      terminaVeids: termins.kind
    })
  }

  return vardnica
}

export function analizeLeksiski(teksts, vardnica) {
  const leksiskieElementi = []

  let i = 0
  let rinda = 1
  let kolonna = 1

  const pozicija = () => ({
    rinda,
    kolonna
  })

  const soli = () => {
    const zime = teksts[i++]

    if (zime === "\n") {
      rinda++
      kolonna = 1
    }
    else {
      kolonna++
    }

    return zime
  }

  const pievieno = (
    veids,
    vertiba,
    sakums,
    papildus = {}
  ) => {
    leksiskieElementi.push({
      veids,
      vertiba,
      ...sakums,
      ...papildus
    })
  }

  const analizeVeidnesDalas = (
    raw,
    sakums
  ) => {
    const gravis =
      String.fromCharCode(96)

    const aizverta =
      raw.endsWith(gravis)

    const saturs =
      raw.slice(
        1,
        aizverta ? -1 : undefined
      )

    const pozicijaSaturaOffsetam =
      offset => {
        let dalasRinda =
          sakums.rinda

        let dalasKolonna =
          sakums.kolonna + 1

        for (
          let indekss = 0;
          indekss < offset;
          indekss++
        ) {
          if (saturs[indekss] === "\n") {
            dalasRinda++
            dalasKolonna = 1
          }
          else {
            dalasKolonna++
          }
        }

        return {
          rinda: dalasRinda,
          kolonna: dalasKolonna
        }
      }

    const dalas = []

    let tekstaSakums = 0
    let indekss = 0

    const pievienoTekstu =
      beigas => {
        if (beigas <= tekstaSakums) {
          return
        }

        const pozicija =
          pozicijaSaturaOffsetam(
            tekstaSakums
          )

        dalas.push({
          veids: "teksts",
          vertiba:
            saturs.slice(
              tekstaSakums,
              beigas
            ),
          ...pozicija
        })
      }

    while (indekss < saturs.length) {
      if (saturs[indekss] === "\\") {
        indekss += 2
        continue
      }

      if (
        saturs[indekss] !== "$" ||
        saturs[indekss + 1] !== "{"
      ) {
        indekss++
        continue
      }

      pievienoTekstu(indekss)

      const izteiksmesSakums =
        indekss + 2

      const izteiksmesPozicija =
        pozicijaSaturaOffsetam(
          izteiksmesSakums
        )

      let beigas =
        izteiksmesSakums

      let dzilums = 1
      let quote = null

      while (
        beigas < saturs.length &&
        dzilums > 0
      ) {
        const zime =
          saturs[beigas]

        if (quote) {
          if (zime === "\\") {
            beigas += 2
            continue
          }

          if (zime === quote) {
            quote = null
          }

          beigas++
          continue
        }

        if (
          zime === '"' ||
          zime === "'"
        ) {
          quote = zime
          beigas++
          continue
        }

        if (zime === "{") {
          dzilums++
        }
        else if (zime === "}") {
          dzilums--
        }

        beigas++
      }

      if (dzilums !== 0) {
        throw new SyntaxError(
          "Nav aizvērta veidnes interpolācija rindā " +
          izteiksmesPozicija.rinda +
          ", kolonnā " +
          izteiksmesPozicija.kolonna
        )
      }

      const izteiksmesBeigas =
        beigas - 1

      const izteiksmesTeksts =
        saturs.slice(
          izteiksmesSakums,
          izteiksmesBeigas
        )

      if (
        izteiksmesTeksts.trim()
          .length === 0
      ) {
        throw new SyntaxError(
          "Tukša veidnes interpolācija rindā " +
          izteiksmesPozicija.rinda +
          ", kolonnā " +
          izteiksmesPozicija.kolonna
        )
      }

      const interpolacijasElementi =
        analizeLeksiski(
          izteiksmesTeksts,
          vardnica
        ).map(
          leksiskaisElements => ({
            ...leksiskaisElements,
            rinda:
              izteiksmesPozicija.rinda +
              leksiskaisElements.rinda -
              1,
            kolonna:
              leksiskaisElements.rinda ===
                1
                ? izteiksmesPozicija
                    .kolonna +
                  leksiskaisElements
                    .kolonna -
                  1
                : leksiskaisElements
                    .kolonna
          })
        )

      dalas.push({
        veids: "interpolacija",
        leksiskieElementi:
          interpolacijasElementi,
        ...izteiksmesPozicija
      })

      indekss = beigas
      tekstaSakums = beigas
    }

    pievienoTekstu(saturs.length)

    return dalas
  }

  while (i < teksts.length) {
    const zime = teksts[i]

    if (/\s/u.test(zime)) {
      soli()
      continue
    }

    if (teksts.startsWith("//", i)) {
      while (
        i < teksts.length &&
        teksts[i] !== "\n"
      ) {
        soli()
      }

      continue
    }

    if (teksts.startsWith("/*", i)) {
      soli()
      soli()

      while (
        i < teksts.length &&
        !teksts.startsWith("*/", i)
      ) {
        soli()
      }

      if (i < teksts.length) {
        soli()
        soli()
      }

      continue
    }

    const sakums = pozicija()

    if (zime === '"' || zime === "'") {
      const quote = soli()
      let vertiba = quote

      while (i < teksts.length) {
        const dala = soli()
        vertiba += dala

        if (
          dala === "\\" &&
          i < teksts.length
        ) {
          vertiba += soli()
          continue
        }

        if (dala === quote) {
          break
        }
      }

      pievieno(
        "teksts",
        vertiba,
        sakums
      )

      continue
    }

    if (zime === "`") {
      let vertiba = soli()

      while (i < teksts.length) {
        const dala = soli()
        vertiba += dala

        if (
          dala === "\\" &&
          i < teksts.length
        ) {
          vertiba += soli()
          continue
        }

        if (dala === "`") {
          break
        }
      }

      pievieno(
        "veidne",
        vertiba,
        sakums,
        {
          dalas:
            analizeVeidnesDalas(
              vertiba,
              sakums
            )
        }
      )

      continue
    }

    if (CIPARS.test(zime)) {
      let vertiba = ""

      while (
        i < teksts.length &&
        /[0-9._]/.test(teksts[i])
      ) {
        vertiba += soli()
      }

      pievieno(
        "skaitlis",
        vertiba,
        sakums
      )

      continue
    }

    if (SAKUMS.test(zime)) {
      let vertiba = soli()

      while (
        i < teksts.length &&
        TURPINAJUMS.test(teksts[i])
      ) {
        vertiba += soli()
      }

      const termins = vardnica.get(vertiba)

      if (termins) {
        pievieno(
          "termins",
          vertiba,
          sakums,
          termins
        )
      }
      else {
        pievieno(
          "identifikators",
          vertiba,
          sakums
        )
      }

      continue
    }

    const operators = OPERATORI.find(
      variants =>
        teksts.startsWith(variants, i)
    )

    if (operators) {
      for (
        let n = 0;
        n < operators.length;
        n++
      ) {
        soli()
      }

      pievieno(
        "operators",
        operators,
        sakums
      )

      continue
    }

    if (PIETURZIMES.has(zime)) {
      pievieno(
        "pieturzīme",
        soli(),
        sakums
      )

      continue
    }

    pievieno(
      "nezināms",
      soli(),
      sakums
    )
  }

  return leksiskieElementi
}
