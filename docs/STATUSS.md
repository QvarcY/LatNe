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
- pirmais LatNe parseris
- pirmais LatNe AST
- augšējā līmeņa importa, saskarsmes, uzskaitījuma, klases un darbības atpazīšana
- darbības `eksportēta` un `asinhrona` pazīmju atpazīšana

## Pašlaik

LatNe spēj nolasīt `.lat` avota failu, tokenizēt to un izveidot pirmo strukturēto AST.

Darbojošā apstrādes ķēde:

`.lat → tokeni → AST`

Pirmais paraugs:

- 196 tokeni
- 0 nezināmu simbolu
- 5 augšējā līmeņa AST mezgli

Terminoloģijas reģistrā:

- 84 termini
- 84 `approved`
- 0 `pending`

Parseris pašlaik saprot programmas augšējā līmeņa struktūru.

Klases un darbību ķermeņi vēl tiek saglabāti kā tokenu kopas un netiek sadalīti dziļākos AST mezglos.

## Tuvākais mērķis

Paplašināt parseri ar pirmo iekšējo konstrukciju kopu:

- mainīgo deklarācijas
- `ja`
- `kam`
- `atgriez`
- `mēģini`
- `ķer`
- `beigās`

Pēc tam sākt izteiksmju parseri.

## Vēl nav

- pilna valodas gramatika
- pilns statement parseris
- izteiksmju parseris
- stabila AST specifikācija
- koda ģenerators
- source maps
- compilera gala ķēde
- CLI kompilēšana
- darbojošās `.lat` programmas izpilde
