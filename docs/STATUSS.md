# LatNe statuss

**Atjaunots:** 2026-10-02
**Pašreizējais valodas stāvoklis:** strukturēts AST līdz izteiksmju līmenim
**Nākamā engineering fāze:** 1 — klases ķermeņa AST v1

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

Publiskā infrastruktūra:

- GitHub repozitorijs
- GitHub Pages projekta lapa ar LV/EN versijām
- publiskais ROADMAP
- dokumentācijas sistēma
- ADR sistēma
- contributor ceļš

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
- source span kontrakta AST līmenī
- stabilas AST v1 specifikācijas
- LatNe API semantiskās translācijas
- koda ģeneratora
- source maps
- CLI kompilēšanas
- `.lat` programmas izpildes

Pirmajā paraugā vēl ir zināmi ārējā API nosaukumi:

- `push`
- `length`

Tie ir reģistrēti kā nākotnes LatNe API slāņa darbs, nevis gala LatNe API.

## Kvalitātes robeža

Fāze 0A ir pabeigta. Pirms nākamās lielākās parsera paplašināšanas ir nostiprināts reproducējamas vides un CI minimums.

Tas ietver:

- Node.js 24 LTS kā oficiāli atbalstīto runtime līniju (`>=24 <25`)
- clean install pārbaudīts ar pnpm 12.6.0 un frozen lockfile
- GitHub Actions CI darbojas uz Linux
- terminoloģijas validācija darbojas CI
- tokenizera pārbaude darbojas CI
- parsera pārbaude darbojas CI
- Vārdu kalves check/build darbojas CI
- regresijas fixture sistēma
- valid, invalid, edge-case un Unicode fixture paraugi

## Nākamais valodas uzdevums pēc kvalitātes sliedēm

**Klases ķermeņa AST v1.**

Jāstrukturē:

- lauki
- pieejamības modifikatori
- `nemaināms`
- lauku tipi
- konstruktora deklarācija un parametri
- getter deklarācija un atgriezes tips

Konstruktora un gettera ķermeņus pirmajā iterācijā vēl drīkst saglabāt kā tokenu kopas.

## Ceļš līdz pirmajai palaišanai

```text
kvalitātes sliedes
→ klases AST
→ piešķiršanas AST
→ pilnāki ķermeņi
→ source spans
→ AST v1
→ API minimums
→ semantiskās transformācijas
→ koda ģenerators
→ JS starprezultāts
→ pirmā .lat izpilde
→ CLI
→ latne palaist
```

## Publiskais progress

Paplašinot ROADMAP no sākotnējā prototipa plāna līdz pilnam produkta ceļam, publiskā progresa procents samazinās.

Tas nenozīmē zaudētu progresu.

Tas nozīmē, ka projekta pabeigšanas robeža tagad ir aprakstīta precīzāk.
