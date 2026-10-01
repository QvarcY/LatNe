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
- pirmais LatNe parseris un AST
- augšējā līmeņa deklarāciju parsēšana
- darbības ķermeņa statement AST
- mainīgo deklarācijas
- `ja` nosacījumi
- `kam` cikli
- `atgriez`, `turpini`, `beidz` un `met`
- `mēģini`, `ķer` un `beigās`
- pirmais izteiksmju parseris
- identifikatoru AST
- teksta un skaitļu literāļu AST
- masīvu literāļu AST
- īpašību piekļuves AST
- funkciju izsaukumu AST
- `gaidi` izteiksmju AST
- `jauns` izteiksmju AST
- bināro operatoru AST ar prioritātēm
- `nekas`, loģisko un nenoteikto vērtību AST

## Pašlaik

LatNe spēj nolasīt `.lat` avota failu un izveidot strukturētu AST līdz izteiksmju līmenim.

Darbojošā ķēde:

`.lat → tokeni → deklarāciju AST → statement AST → izteiksmju AST`

Pirmais paraugs:

- 196 tokeni
- 5 augšējā līmeņa AST mezgli
- strukturēts darbības ķermenis
- strukturēti nosacījumi un cikli
- strukturēti funkciju izsaukumi
- strukturēti `gaidi` un `jauns`
- strukturēta īpašību piekļuve
- strukturētas binārās izteiksmes

Piemēram:

`ieraksts.vārds == nekas`

tagad kļūst par:

`BināraIzteiksme → Īpašība + Nekas`

un:

`gaidi lasiDatus("lietotaji.json")`

kļūst par:

`Gaidīšana → Izsaukums → Identifikators + Teksts`

## Tuvākais mērķis

Paplašināt AST ārpus pašreizējā parauga.

Nākamie kandidāti:

- piešķiršanas izteiksmes
- `while`
- `switch`
- pilnāka tipu struktūra
- klases ķermeņa parsēšana
- funkciju parametru parsēšana
- veidņu literāļu interpolācijas

Pēc tam sākt pirmo koda ģenerēšanas slāni.

## Vēl nav

- pilna valodas gramatika
- pilns statement parseris
- pilns izteiksmju parseris
- pilns klases parseris
- stabila AST specifikācija
- koda ģenerators
- source maps
- compilera gala ķēde
- CLI kompilēšana
- darbojošās `.lat` programmas izpilde
