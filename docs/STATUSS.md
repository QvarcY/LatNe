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
- pirmais darbības ķermeņa statement parseris
- mainīgo deklarāciju parsēšana
- `ja` nosacījumu parsēšana
- `kam` ciklu parsēšana
- `atgriez`, `turpini`, `beidz` un `met` parsēšana
- `mēģini`, `ķer` un `beigās` kļūdu plūsmas parsēšana
- `atkļūdo` parsēšana

## Pašlaik

LatNe spēj nolasīt `.lat` avota failu, tokenizēt to un izveidot strukturētu AST gan programmas augšējam līmenim, gan pirmajai darbības ķermeņa konstrukciju kopai.

Darbojošā apstrādes ķēde:

`.lat → tokeni → AST`

Pirmais paraugs:

- 196 tokeni
- 0 nezināmu simbolu
- 5 augšējā līmeņa AST mezgli
- darbības ķermenī atpazīts `mēģini` bloks
- `mēģini` blokā strukturēti mainīgie, cikls, nosacījumi un atgriešana
- strukturēti `ķer` un `beigās` bloki

Terminoloģijas reģistrā:

- 84 termini
- 84 `approved`
- 0 `pending`

Izteiksmes pašlaik tiek saglabātas kā tokenu teksts.

Piemēram:

`ieraksts . vārds == nekas`

un:

`jauns Lietotājs ( ieraksts . vārds , ieraksts . vecums )`

## Tuvākais mērķis

Izveidot pirmo izteiksmju parseri.

Tam jāsāk strukturēti atpazīt:

- identifikatorus
- literāļus
- īpašību piekļuvi
- funkciju izsaukumus
- `jauns`
- salīdzināšanas operatorus
- masīvu literāļus

Mērķis:

izteiksmes vairs netiek glabātas tikai kā teksts, bet kļūst par AST mezgliem.

## Vēl nav

- pilna valodas gramatika
- pilns statement parseris
- pilns izteiksmju parseris
- stabila AST specifikācija
- koda ģenerators
- source maps
- compilera gala ķēde
- CLI kompilēšana
- darbojošās `.lat` programmas izpilde
