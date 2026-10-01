# ADR 0006 — LatNe API terminoloģija ir atsevišķs semantisks slānis

**Datums:** 2026-10-01
**Statuss:** Pieņemts

## Konteksts

Pirmajā `.lat` paraugā tika pamanīti JavaScript standarta API nosaukumi:

```text
push
length
```

Tie nav valodas atslēgvārdi un nepieder sintakses terminoloģijas reģistram.

Aklā globālā pārsaukšana būtu nedroša, jo lietotāja paša objektam var būt tāda paša nosaukuma īpašība vai metode.

## Lēmums

LatNe standarta API terminoloģija tiek veidota kā atsevišķs slānis.

API tulkojumam jābūt piesaistītam konkrētam tipam vai semantiskai operācijai.

Pirmie kandidāti:

```text
Array.push   → pievieno
Array.length → garums
```

## Sekas

Sintakses terminoloģija un runtime API terminoloģija netiek sajauktas vienā vārdnīcā.

Koda ģenerēšanas laikā būs nepieciešama pietiekama semantiskā informācija, lai API translācija būtu korekta.
