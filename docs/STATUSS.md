# LatNe statuss

**Atjaunots:** 2026-10-01
**Fāze:** 1 — valodas pamats

## Pašreizējā robeža

LatNe jau spēj nolasīt `.lat` avota failu un izveidot strukturētu AST līdz izteiksmju līmenim.

Darbojošā ķēde:

```text
.lat
→ tokeni
→ deklarāciju AST
→ statement AST
→ izteiksmju AST
```

Koda ģenerēšana un programmas izpilde vēl nav ieviesta.

## Pabeigts

Terminoloģija:

- 84 kandidāti izskatīti
- 84 termini `approved`
- terminoloģijas validators
- Vārdu kalves pārlūkošana, rediģēšana un saglabāšana

Valodas kodols:

- pirmais `.lat` sintakses paraugs
- Unicode tokenizeris
- kanoniskās termina identitātes saglabāšana tokenos
- augšējā līmeņa deklarāciju parseris
- darbības ķermeņa statement parseris
- atsevišķs izteiksmju parseris

Pašreizējais AST saprot:

- importu
- saskarsmi
- uzskaitījumu
- klasi augšējā līmenī
- darbību
- mainīgo deklarācijas
- `ja`
- `kam`
- `atgriez`
- `turpini`
- `beidz`
- `met`
- `mēģini`
- `ķer`
- `beigās`
- `atkļūdo`
- identifikatorus
- tekstu un skaitļus
- masīvus
- īpašību piekļuvi
- izsaukumus
- `gaidi`
- `jauns`
- loģiskās un nulles vērtības
- unārās izteiksmes
- pirmās bināro operatoru prioritātes

## Pārbaudītais pirmais paraugs

`examples/pamata-paraugs.lat`

Rezultāts:

- 196 tokeni
- 0 nezināmu simbolu
- 5 augšējā līmeņa AST mezgli
- strukturēts darbības ķermenis
- strukturētas izteiksmes

## Aktuālie ierobežojumi

Klases ķermenis vēl nav strukturēts AST.

Nav vēl:

- pilna piešķiršanas AST
- pilnas funkciju parametru struktūras
- veidņu interpolāciju AST
- stabilas AST v1 specifikācijas
- LatNe API semantiskās translācijas
- koda ģeneratora
- source maps
- CLI kompilēšanas
- `.lat` programmas izpildes

Pirmajā paraugā vēl ir zināmi ārējā API nosaukumi:

- `push`
- `length`

Tie ir reģistrēti kā nākotnes LatNe API slāņa darbs, nevis uzskatīti par gala LatNe sintaksi.

## Nākamais uzdevums

**Klases ķermeņa AST v1.**

Jāstrukturē:

- lauki
- pieejamības modifikatori
- `nemaināms`
- lauku tipi
- konstruktora deklarācija un parametri
- getter deklarācija un atgriezes tips

Konstruktora un gettera ķermeņus šajā pirmajā solī vēl drīkst saglabāt kā tokenu kopas.

Precīza darba robeža aprakstīta `docs/ATSAKSANA.md`.

## Ceļš līdz pirmajai palaišanai

Pēc klases AST:

```text
piešķiršanas AST
→ klases ķermeņu AST
→ API terminoloģijas minimums
→ AST v1
→ koda ģenerators
→ JS starprezultāts
→ CLI
→ pirmā palaistā .lat programma
```
