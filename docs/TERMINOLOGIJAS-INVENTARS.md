# LatNe terminoloģijas inventārs

**Datums:** 2026-09-30
**Inventāra versija:** 1
**Statuss:** kandidātu kopa

## Mērķis

Pirms LatNe sintakses projektēšanas tiek fiksēts avota valodas terminu kopums.

Šis inventārs nav tulkojums.

Tas ir saraksts ar vārdiem kuriem apzināti jāizlemj:

- vai LatNe šo konstrukciju vispār vajag
- vai tai vajag latvisku vārdu
- kādam jābūt šim vārdam
- vai konstrukcija LatNe tiks veidota citādi

## Apjoms

Pirmajā inventārā ir 84 kandidāti.

No tiem:

- 53 ir saistīti ar JavaScript sintaksi
- 42 ir saistīti ar TypeScript sintaksi

Skaitļi pārklājas jo daļa vārdu pieder abiem slāņiem.

## Iekļauts

- rezervētie vārdi
- kontekstuālie vārdi
- literāļi
- tekstuālie operatori
- TypeScript tipu vārdi
- deklarāciju un modifikatoru vārdi

## Vēl nav iekļauts

- standarta globālie objekti
- `Array`
- `Promise`
- `Map`
- `Set`
- `console`
- DOM API
- Node API
- framework API
- CLI komandas
- operatoru simboli
- pieturzīmes

Šīm grupām būs atsevišķi inventāri.

## Avoti

### JavaScript

MDN JavaScript Lexical grammar

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar

Pārbaudīts 2026-09-30.

### TypeScript

TypeScript compiler `scanner.ts`

https://github.com/microsoft/TypeScript/blob/main/src/compiler/scanner.ts

Pārbaudīts 2026-09-30.

## Noteikums

Neviens kandidāts nekļūst par LatNe sintakses daļu tikai tāpēc ka tas atrodas šajā failā.

Oficiāls ir tikai termins ar statusu `approved`.

Pirmajā inventāra versijā visi 84 termini ir `pending`.
