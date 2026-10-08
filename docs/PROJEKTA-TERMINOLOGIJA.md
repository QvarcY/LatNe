# LatNe projekta terminoloģija

**Statuss:** kanoniska
**Atjaunots:** 2026-10-08

Šis dokuments nosaka LatNe projekta iekšējo tehnisko terminoloģiju.

Tas nav tas pats, kas programmēšanas valodas atslēgvārdu reģistrs
`packages/valoda/data/termini.json`.

## Princips

To, ko LatNe pats nosauc un kontrolē, nosauc latviski.

Ārējo sistēmu obligātie nosaukumi un starptautiski tehniskie īpašvārdi netiek mākslīgi tulkoti.

Ja jēdzienu var precīzi nosaukt ar vienu skaidru latviešu vārdu, priekšroka dodama tam, nevis mākslīgi veidotam saliktenim.

## Kanoniskie termini

| Angļu termins | LatNe termins |
|---|---|
| token | leksiskais elements |
| tokens | leksiskie elementi |
| tokenizer | leksiskais analizators |
| tokenization | leksiskā analīze |
| parser | sintaktiskais analizators |
| parsing | sintaktiskā analīze |
| statement | priekšraksts |
| statement parser | priekšrakstu sintaktiskais analizators |
| expression parser | izteiksmju sintaktiskais analizators |
| fixture | testa paraugs / regresijas paraugs |
| runtime | izpildvide / izpildlaiks |
| build | būvējums |
| build process | būvēšana |
| source span | pirmkoda diapazons |
| source map | pirmkoda karte |
| codegen | koda ģenerēšana |
| checkpoint | kontrolpunkts |
| workflow | darbplūsma |
| engineering | izstrāde |
| developer experience | izstrādātāja pieredze |
| quality checks / quality rails | kvalitātes pārbaudes |
| clean install | tīra atkarību instalācija |
| raw tokens | neapstrādāti leksiskie elementi |
| raw value / raw literal | pieraksts |
| getter / accessor | iegūšana |
| milestone | atskaites punkts |

## AST

Pirmajā lietojumā:

**abstraktās sintakses koks (AST)**

Pēc tam dokumentācijā un kodā drīkst lietot `AST`.

## Nosaukumi, kurus netulkojam

Piemēri:

- JavaScript
- TypeScript
- Node.js
- pnpm
- Git
- GitHub
- GitHub Actions
- Unicode
- JSON
- API
- CLI
- CI
- AST

Ārējo sistēmu atslēgvārdi, piemēram `push`, `pull_request` un `workflow_dispatch`,
paliek tādi, kādus tos nosaka attiecīgā sistēma.

## Koda princips

LatNe paša moduļiem, funkcijām, mainīgajiem un testu struktūrai jāizmanto šī pati terminoloģija.

Piemēri:

`tokenizer.mjs` → `leksiskais-analizators.mjs`

`parser.mjs` → `sintaktiskais-analizators.mjs`

`expression-parser.mjs` → `izteiksmju-sintaktiskais-analizators.mjs`

`tokeni` → `leksiskieElementi`

`tests/fixtures` → `tests/paraugi`

`raw` → `pieraksts`

`Getteris` → `Iegūšana`

Šīs pārejas tiek veiktas kontrolētā refaktorā ar pilnu CI pārbaudi.
