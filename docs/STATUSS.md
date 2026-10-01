# LatNe statuss

**Atjaunots:** 2026-10-01
**Fāze:** 1 — valodas pamats

## Pabeigts

- projekta bootstrap
- publisks GitHub repozitorijs
- 84 terminu kandidātu inventārs
- terminoloģijas validators
- Vārdu kalves pārlūkošana un meklēšana
- termina izmaiņu validācijas API
- Vārdu kalves rediģēšanas un saglabāšanas plūsma
- visi 84 terminoloģijas kandidāti izskatīti un apstiprināti
- pirmais `.lat` sintakses paraugs
- pirmais LatNe tokenizators
- Unicode identifikatoru atbalsts
- LatNe terminu sasaite ar kanonisko termina identitāti
- tokenizācijas pārbaude: 196 tokeni, 0 nezināmu simbolu

## Pašlaik

LatNe spēj nolasīt pirmo `.lat` avota failu un pārvērst to strukturētā tokenu plūsmā.

Apstrādes ķēde:

`.lat → tokeni`

Terminoloģijas reģistrā:

- 84 termini
- 84 `approved`
- 0 `pending`

## Tuvākais mērķis

Izveidot pirmo minimālo parseri un AST.

Mērķa ķēde:

`.lat → tokeni → AST`

## Vēl nav

- pilna valodas gramatika
- pilns parseris
- stabila AST specifikācija
- koda ģenerators
- source maps
- compilera gala ķēde
- CLI kompilēšana
- darbojošās `.lat` programmas izpilde
