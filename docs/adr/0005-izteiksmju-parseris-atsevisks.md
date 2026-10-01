# ADR 0005 — Izteiksmju parseris ir atsevišķs modulis

**Datums:** 2026-10-01
**Statuss:** Pieņemts

## Konteksts

Pēc statement parsera izveides izteiksmju gramatika sāka strauji augt.

Tās turēšana vienā failā ar deklarāciju un vadības plūsmas parseri veidotu monolītu parseri.

## Lēmums

Izteiksmju parsēšana tiek uzturēta atsevišķā modulī:

`packages/valoda/src/expression-parser.mjs`

Deklarāciju un statement parseris izmanto šo moduli, kad nepieciešams izveidot izteiksmes AST.

## Sekas

Operatoru prioritātes, izsaukumi, īpašību piekļuve un citi izteiksmju noteikumi var attīstīties neatkarīgi no augšējā līmeņa gramatikas.
