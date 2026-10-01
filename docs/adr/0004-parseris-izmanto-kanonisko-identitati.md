# ADR 0004 — Parseris izmanto kanonisko termina identitāti

**Datums:** 2026-10-01
**Statuss:** Pieņemts

## Konteksts

LatNe terminoloģijas latviskie varianti var attīstīties.

Ja parsera gramatika būtu tieši piesaistīta konkrētām latviešu vārdu virknēm, terminoloģijas maiņa prasītu mainīt parsera loģiku.

## Lēmums

Tokenizeris apstiprinātam terminam saglabā kanonisko avota identitāti.

Parseris gramatikas lēmumus pieņem pēc šīs identitātes, nevis pēc konkrētā latviskā teksta.

Piemēram:

```text
klase → class
kam → for
darbība → function
```

## Sekas

LatNe virsmas terminoloģiju var attīstīt neatkarīgāk no parsera iekšējās gramatikas.

Terminoloģijas reģistrs paliek viens patiesības avots.
