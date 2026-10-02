# Testu paraugi

LatNe regresijas paraugi ir sadalīti četrās pamatgrupās:

- `derigi/` — leksiskajai un sintaktiskajai analīzei jāizdodas
- `nederigi/` — leksiskā analīze izdodas, bet sintaktiskajai analīzei paraugs jānoraida
- `robezgadijumi/` — robežgadījumi
- `unicode/` — latviešu Unicode identifikatori un saturs

Pārbaude:

`corepack pnpm run check:paraugi`

Paraugu pārbaudes skripts atrodas:

`tests/parbaudit-paraugus.mjs`
