# LatNe statuss

**Atjaunots:** 2026-10-07
**Pašreizējais valodas stāvoklis:** strukturēts AST līdz klases konstruktoru, getteru un metožu ķermeņu minimumam
**Nākamā izstrādes fāze:** 1 — funkciju parametru AST paplašināšana

## Pašreizējā robeža

LatNe jau spēj nolasīt `.lat` avota failu un izveidot strukturētu deklarāciju, priekšrakstu, izteiksmju un klases ķermeņa AST.

Darbojošā ķēde:

```text
.lat
→ leksiskie elementi
→ deklarāciju AST
→ priekšrakstu AST
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
- Unicode leksiskais analizators
- kanoniskās termina identitātes saglabāšana leksiskajos elementos
- augšējā līmeņa deklarāciju sintaktiskais analizators
- darbības ķermeņa priekšrakstu sintaktiskais analizators
- atsevišķs izteiksmju sintaktiskais analizators
- strukturēts klases ķermeņa AST
- strukturētas piešķiršanas izteiksmes
- strukturēts konstruktora ķermeņa AST
- strukturēts gettera ķermeņa AST
- minimāls klases metodes AST

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
- piešķiršanas izteiksmes
- klases laukus
- pieejamības modifikatorus
- `nemaināms` lauku informāciju
- konstruktora deklarāciju un parametrus
- getter deklarāciju, atgriezes tipu un ķermeni
- konstruktora ķermeņa priekšrakstus
- klases metodes deklarāciju
- klases metodes pieejamību
- klases metodes tipētos parametrus
- klases metodes atgriezes tipu
- klases metodes strukturētu ķermeni

## Pārbaudītais pirmais paraugs

`examples/pamata-paraugs.lat`

Rezultāts:

- 196 leksiskie elementi
- 0 nezināmu simbolu
- 5 augšējā līmeņa AST mezgli
- strukturēts darbības ķermenis
- strukturētas izteiksmes
- 4 strukturēti konstruktora priekšraksti
- 1 strukturēts gettera priekšraksts

## Aktuālie ierobežojumi

Konstruktora un gettera ķermeņi tagad ir strukturēti ar kopīgo priekšrakstu analizatoru.

Klases metodei ir ieviests pirmais minimālais AST ar:

- pieejamību
- nosaukumu
- tipētiem parametriem
- izvēles atgriezes tipu
- strukturētu ķermeni

Konstruktora, gettera un metodes raw leksiskie elementi pagaidām tiek saglabāti kā pārejas lauki.

Nav vēl:

- pilnas augšējā līmeņa funkciju parametru AST struktūras
- noklusējuma parametru vērtību AST
- plašāka klases metožu modifikatoru atbalsta, piemēram, `async` un `static`
- veidņu interpolāciju AST
- pirmkoda diapazona kontrakta AST līmenī
- stabilas AST v1 specifikācijas
- LatNe API semantiskās translācijas
- koda ģeneratora
- pirmkoda kartes
- CLI kompilēšanas
- `.lat` programmas izpildes

Pirmajā paraugā vēl ir zināmi ārējā API nosaukumi:

- `push`
- `length`

Tie ir reģistrēti kā nākotnes LatNe API slāņa darbs, nevis gala LatNe API.

## Kvalitātes robeža

Fāze 0A ir pabeigta. Pirms nākamās lielākās sintaktiskā analizatora paplašināšanas ir nostiprināts reproducējamas vides un CI minimums.

Tas ietver:

- Node.js 24 LTS kā oficiāli atbalstīto izpildvides līniju (`>=24 <25`)
- tīra atkarību instalācija pārbaudīta ar pnpm 12.6.0 un frozen lockfile
- GitHub Actions CI darbojas uz Linux
- terminoloģijas validācija darbojas CI
- leksiskās analīzes pārbaude darbojas CI
- sintaktiskās analīzes pārbaude darbojas CI
- Vārdu kalves pārbaude un būvēšana darbojas CI
- regresijas paraugu sistēma
- derīgi, nederīgi, robežgadījumu un Unicode paraugi

## Nākamais valodas uzdevums

**Funkciju parametru AST paplašināšana.**

Klases konstruktora, gettera un metodes ķermeņu minimums ir strukturēts.

Klases konstruktoru un metožu parametri jau tiek attēloti kā `Parametrs` mezgli, bet augšējā līmeņa `Darbība` deklarācija pašlaik vēl saglabā tikai parametru leksisko elementu skaitu.

Nākamajā solī augšējā līmeņa funkciju parametri jāpārvērš strukturētā AST, saglabājot vienotu parametru kontraktu ar klases konstruktoru un metodi.

## Ceļš līdz pirmajai palaišanai

```text
kvalitātes sliedes
→ klases AST ✓
→ piešķiršanas AST ✓
→ konstruktora ķermeņa AST ✓
→ getter un metožu minimums ✓
→ funkciju parametru AST ← pašreizējais darbs
→ veidņu interpolācijas
→ pirmkoda diapazoni
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
