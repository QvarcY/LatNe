# ADR 0008 — LatNe iekšējā tehniskā terminoloģija ir latviska

**Datums:** 2026-10-02
**Statuss:** Pieņemts

## Konteksts

LatNe mērķis ir latviska programmēšanas pieredze.

Projektā tomēr bija saglabājušies angliski vai latviskoti tehniskie nosaukumi,
piemēram `token`, `tokenizer`, `parser`, `fixture`, `runtime` un `codegen`.

Tie parādījās gan dokumentācijā, gan paša LatNe kodola nosaukumos.

## Lēmums

LatNe paša kontrolētajai tehniskajai terminoloģijai izmanto latviešu terminus.

Pamatpāri:

- `token` → leksiskais elements
- `tokenizer` → leksiskais analizators
- `parser` → sintaktiskais analizators
- `statement` → priekšraksts
- `fixture` → testa paraugs
- `runtime` → izpildvide vai izpildlaiks
- `codegen` → koda ģenerēšana

Pilnais kanoniskais saraksts tiek uzturēts:

`docs/PROJEKTA-TERMINOLOGIJA.md`

## Robeža

Ārējo sistēmu obligātie nosaukumi un tehniskie īpašvārdi netiek pārdēvēti.

Piemēram:

- JavaScript
- Node.js
- GitHub Actions
- pnpm
- Unicode
- API
- CLI
- CI
- AST

## Sekas

Dokumentācija un LatNe paša kods tiek pakāpeniski sinhronizēti ar kanonisko terminoloģiju.

Refaktoram nedrīkst mainīt valodas uzvedību.

Pēc katras pārdēvēšanas jāiziet pilnajai kvalitātes pārbaudei un CI.
