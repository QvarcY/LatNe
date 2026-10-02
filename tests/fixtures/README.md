# Testu fixtures

LatNe regresijas paraugi ir sadalīti četrās pamatgrupās:

- `valid/` — sintaksei jātokenizējas un jāparsējas
- `invalid/` — tokenizācija ir derīga, bet parserim paraugs jānoraida
- `edge-case/` — robežgadījumi
- `unicode/` — latviešu Unicode identifikatori un saturs

Pārbaude:

`corepack pnpm run check:fixtures`

Fixture runneris atrodas:

`tests/run-fixtures.mjs`
