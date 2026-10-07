const SĀKUMS = /[\p{L}_$]/u
const TURPINĀJUMS = /[\p{L}\p{N}_$]/u
const CIPARS = /[0-9]/

const OPERATORI = [
  "===", "!==", ">>>", "**=", "&&=", "||=", "??=",
  "==", "!=", "<=", ">=", "=>", "++", "--", "&&", "||",
  "??", "?.", "**", "+=", "-=", "*=", "/=", "%=", "<<", ">>",
  "=", "+", "-", "*", "/", "%", "<", ">", "!", "&", "|", "^", "~"
]

const PIETURZĪMES = new Set([
  "(", ")", "{", "}", "[", "]", ",", ";", ":", ".", "?"
])

export function izveidoVārdnīcu(registrs) {
  const vārdnīca = new Map()

  for (const termins of registrs.terms ?? []) {
    if (
      termins.status !== "approved" ||
      !termins.latvian
    ) {
      continue
    }

    if (vārdnīca.has(termins.latvian)) {
      throw new Error(
        `Dublēts LatNe vārds: ${termins.latvian}`
      )
    }

    vārdnīca.set(termins.latvian, {
      avots: termins.source,
      kategorija: termins.category,
      terminaVeids: termins.kind
    })
  }

  return vārdnīca
}

export function analizēLeksiski(teksts, vārdnīca) {
  const leksiskieElementi = []

  let i = 0
  let rinda = 1
  let kolonna = 1

  const pozīcija = () => ({
    rinda,
    kolonna,
    nobīde: i
  })

  const soli = () => {
    const zīme = teksts[i++]

    if (zīme === "\n") {
      rinda++
      kolonna = 1
    }
    else {
      kolonna++
    }

    return zīme
  }

  const pievieno = (
    veids,
    vērtība,
    sākums,
    papildus = {}
  ) => {
    const beigas =
      pozīcija()

    leksiskieElementi.push({
      veids,
      vērtība,
      rinda: sākums.rinda,
      kolonna: sākums.kolonna,
      diapazons: {
        sākums: {
          ...sākums
        },
        beigas: {
          ...beigas
        }
      },
      ...papildus
    })
  }

  const analizēVeidnesDaļas = (
    raw,
    sākums
  ) => {
    const gravis =
      String.fromCharCode(96)

    const aizvērta =
      raw.endsWith(gravis)

    const saturs =
      raw.slice(
        1,
        aizvērta ? -1 : undefined
      )

    const pozīcijaSaturaOffsetam =
      offset => {
        let daļasRinda =
          sākums.rinda

        let daļasKolonna =
          sākums.kolonna + 1

        for (
          let indekss = 0;
          indekss < offset;
          indekss++
        ) {
          if (saturs[indekss] === "\n") {
            daļasRinda++
            daļasKolonna = 1
          }
          else {
            daļasKolonna++
          }
        }

        return {
          rinda: daļasRinda,
          kolonna: daļasKolonna,
          nobīde:
            sākums.nobīde +
            1 +
            offset
        }
      }

    const daļas = []

    let tekstaSākums = 0
    let indekss = 0

    const pievienoTekstu =
      beigas => {
        if (beigas <= tekstaSākums) {
          return
        }

        const pozīcija =
          pozīcijaSaturaOffsetam(
            tekstaSākums
          )

        daļas.push({
          veids: "teksts",
          vērtība:
            saturs.slice(
              tekstaSākums,
              beigas
            ),
          ...pozīcija
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

      const izteiksmesSākums =
        indekss + 2

      const izteiksmesPozīcija =
        pozīcijaSaturaOffsetam(
          izteiksmesSākums
        )

      let beigas =
        izteiksmesSākums

      let dziļums = 1
      let quote = null

      while (
        beigas < saturs.length &&
        dziļums > 0
      ) {
        const zīme =
          saturs[beigas]

        if (quote) {
          if (zīme === "\\") {
            beigas += 2
            continue
          }

          if (zīme === quote) {
            quote = null
          }

          beigas++
          continue
        }

        if (
          zīme === '"' ||
          zīme === "'"
        ) {
          quote = zīme
          beigas++
          continue
        }

        if (zīme === "{") {
          dziļums++
        }
        else if (zīme === "}") {
          dziļums--
        }

        beigas++
      }

      if (dziļums !== 0) {
        throw new SyntaxError(
          "Nav aizvērta veidnes interpolācija rindā " +
          izteiksmesPozīcija.rinda +
          ", kolonnā " +
          izteiksmesPozīcija.kolonna
        )
      }

      const izteiksmesBeigas =
        beigas - 1

      const izteiksmesTeksts =
        saturs.slice(
          izteiksmesSākums,
          izteiksmesBeigas
        )

      if (
        izteiksmesTeksts.trim()
          .length === 0
      ) {
        throw new SyntaxError(
          "Tukša veidnes interpolācija rindā " +
          izteiksmesPozīcija.rinda +
          ", kolonnā " +
          izteiksmesPozīcija.kolonna
        )
      }

      const pielāgoPozīciju =
        pozīcija => ({
          rinda:
            izteiksmesPozīcija.rinda +
            pozīcija.rinda -
            1,
          kolonna:
            pozīcija.rinda === 1
              ? izteiksmesPozīcija
                  .kolonna +
                pozīcija.kolonna -
                1
              : pozīcija.kolonna,
          nobīde:
            izteiksmesPozīcija.nobīde +
            pozīcija.nobīde
        })

      const interpolācijasElementi =
        analizēLeksiski(
          izteiksmesTeksts,
          vārdnīca
        ).map(
          leksiskaisElements => {
            const diapazonaSākums =
              pielāgoPozīciju(
                leksiskaisElements
                  .diapazons.sākums
              )

            const diapazonaBeigas =
              pielāgoPozīciju(
                leksiskaisElements
                  .diapazons.beigas
              )

            return {
              ...leksiskaisElements,
              rinda:
                diapazonaSākums.rinda,
              kolonna:
                diapazonaSākums.kolonna,
              diapazons: {
                sākums:
                  diapazonaSākums,
                beigas:
                  diapazonaBeigas
              }
            }
          }
        )

      daļas.push({
        veids: "interpolācija",
        leksiskieElementi:
          interpolācijasElementi,
        ...izteiksmesPozīcija
      })

      indekss = beigas
      tekstaSākums = beigas
    }

    pievienoTekstu(saturs.length)

    return daļas
  }

  while (i < teksts.length) {
    const zīme = teksts[i]

    if (/\s/u.test(zīme)) {
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

    const sākums = pozīcija()

    if (zīme === '"' || zīme === "'") {
      const quote = soli()
      let vērtība = quote

      while (i < teksts.length) {
        const daļa = soli()
        vērtība += daļa

        if (
          daļa === "\\" &&
          i < teksts.length
        ) {
          vērtība += soli()
          continue
        }

        if (daļa === quote) {
          break
        }
      }

      pievieno(
        "teksts",
        vērtība,
        sākums
      )

      continue
    }

    if (zīme === "`") {
      let vērtība = soli()

      while (i < teksts.length) {
        const daļa = soli()
        vērtība += daļa

        if (
          daļa === "\\" &&
          i < teksts.length
        ) {
          vērtība += soli()
          continue
        }

        if (daļa === "`") {
          break
        }
      }

      pievieno(
        "veidne",
        vērtība,
        sākums,
        {
          daļas:
            analizēVeidnesDaļas(
              vērtība,
              sākums
            )
        }
      )

      continue
    }

    if (CIPARS.test(zīme)) {
      let vērtība = ""

      while (
        i < teksts.length &&
        /[0-9._]/.test(teksts[i])
      ) {
        vērtība += soli()
      }

      pievieno(
        "skaitlis",
        vērtība,
        sākums
      )

      continue
    }

    if (SĀKUMS.test(zīme)) {
      let vērtība = soli()

      while (
        i < teksts.length &&
        TURPINĀJUMS.test(teksts[i])
      ) {
        vērtība += soli()
      }

      const termins = vārdnīca.get(vērtība)

      if (termins) {
        pievieno(
          "termins",
          vērtība,
          sākums,
          termins
        )
      }
      else {
        pievieno(
          "identifikators",
          vērtība,
          sākums
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
        sākums
      )

      continue
    }

    if (PIETURZĪMES.has(zīme)) {
      pievieno(
        "pieturzīme",
        soli(),
        sākums
      )

      continue
    }

    pievieno(
      "nezināms",
      soli(),
      sākums
    )
  }

  return leksiskieElementi
}
