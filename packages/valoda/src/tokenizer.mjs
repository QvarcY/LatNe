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

export function tokenize(teksts, vardnica) {
  const tokeni = []

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
    tokeni.push({
      veids,
      vertiba,
      ...sakums,
      ...papildus
    })
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
        sakums
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

  return tokeni
}
