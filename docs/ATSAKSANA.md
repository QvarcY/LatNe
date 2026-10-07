# LatNe darba atsākšana

**Atjaunots:** 2026-10-07
**Stabilais zars:** `main`
**Darba sākumpunkts:** `main`
**Nākamā izstrādes fāze:** 1 — pirmkoda diapazoni AST mezgliem

Šis fails ir pirmais lasāmais dokuments, sākot jaunu LatNe darba sesiju.

## Lasīšanas secība

1. `README.md`
2. `docs/ATSAKSANA.md`
3. `docs/STATUSS.md`
4. `ROADMAP.md`
5. `docs/ARHITEKTURA.md`
6. `docs/LEMUMI.md`
7. jaunākie ieraksti `docs/ZURNALS.md`
8. `examples/pamata-paraugs.lat`

Nav nepieciešams rekonstruēt projekta stāvokli no vecām sarunām.

Repozitorijam un dokumentācijai jābūt pietiekamiem.

## Pašreizējā valodas ķēde

```text
.lat
 ↓
terminoloģijas reģistrs
 ↓
leksiskais analizators
 ↓
deklarāciju sintaktiskais analizators
 ↓
priekšrakstu sintaktiskais analizators
 ↓
izteiksmju sintaktiskais analizators
 ↓
strukturēts AST
```

Pašlaik vēl nav:

```text
stabils AST v1
 ↓
semantiskās transformācijas
 ↓
koda ģenerators
 ↓
JavaScript starprezultāts
 ↓
izpilde
 ↓
CLI
```

## Pašreizējie galvenie faili

Terminoloģija:

`packages/valoda/data/termini.json`

Leksiskais analizators:

`packages/valoda/src/leksiskais-analizators.mjs`

Deklarāciju un priekšrakstu sintaktiskais analizators:

`packages/valoda/src/sintaktiskais-analizators.mjs`

Izteiksmju sintaktiskais analizators:

`packages/valoda/src/izteiksmju-sintaktiskais-analizators.mjs`

Pirmais LatNe avota paraugs:

`examples/pamata-paraugs.lat`

Pārbaudes skripti:

`packages/valoda/scripts/parbaudit-leksisko-analizi.mjs`

`packages/valoda/scripts/parbaudit-sintaktisko-analizi.mjs`

Publiskā ceļa karte:

`ROADMAP.md`

## Pašreizējais pārbaudītais stāvoklis

Terminoloģijas reģistrā:

- 84 termini
- 84 `approved`
- 0 `pending`

Pirmais `.lat` paraugs:

- 196 leksiskie elementi
- 0 nezināmu simbolu
- 5 augšējā līmeņa AST mezgli
- 6 strukturēti klases ķermeņa mezgli
- 4 klases lauki
- 2 konstruktora parametri
- 4 konstruktora priekšraksti
- 1 getteris
- 1 gettera priekšraksts
- 4 kanoniskā gettera veidnes AST daļas
- 2 kanoniskā gettera interpolācijas

Sintaktiskais analizators strukturēti saprot arī:

- klases laukus un pieejamības modifikatorus
- `nemaināms` lauku informāciju un tipus
- konstruktora deklarāciju un parametrus
- konstruktora ķermeņa priekšrakstus
- getter deklarāciju, atgriezes tipu un ķermeni
- minimālu klases metodes deklarāciju
- metodes pieejamību
- metodes tipētos parametrus
- metodes atgriezes tipu
- metodes strukturētu ķermeni
- piešķiršanas izteiksmes
- vienkāršo un kombinētos piešķiršanas operatorus
- labēji asociatīvas piešķiršanas izteiksmes
- derīga piešķiršanas mērķa pārbaudi
- strukturētus augšējā līmeņa `Darbība` parametrus
- vienotu `Parametrs` AST konstruktoram, metodei un darbībai
- strukturētas veidņu teksta daļas
- strukturētas veidņu interpolācijas ar pilnu izteiksmju AST

Klases metodes minimums tiek pārbaudīts ar atsevišķu sintakses regresijas paraugu, nemainot kanonisko `examples/pamata-paraugs.lat`.

Tehniskie checkpointi:

- `8195515` — strukturēts klases ķermeņa AST
- `1d73f5d` — strukturēts piešķiršanas AST
- `5e5e741` — strukturēts konstruktora ķermeņa AST
- `6bf5ace` — strukturēts gettera ķermeņa AST
- `91356b6` — minimāls klases metodes AST
- `fe4ab65` — strukturēts darbības parametru AST
- `c617074` — strukturēts veidņu interpolāciju AST

Pilnais `corepack pnpm run check` pēc `c617074` ir zaļš.

## Pašreizējā robeža

Konstruktors, klases metode un augšējā līmeņa `Darbība` izmanto kopīgu parametru analizatoru un vienotu `Parametrs` AST formu.

Veidņu literāļi tiek sadalīti `VeidnesTeksts` un `VeidnesInterpolācija` mezglos. Interpolācijas tiek analizētas ar pilno izteiksmju parseri.

Konstruktora, gettera un minimālas klases metodes ķermeņi ir strukturēti ar kopīgo priekšrakstu analizatoru.

Raw ķermeņa leksiskie elementi pagaidām tiek saglabāti kā pārejas lauki.

AST mezgliem vēl nav vienota sākuma/beigu pirmkoda diapazona kontrakta.

## Nākamais izstrādes bloks

**Pirmkoda diapazona informācija AST mezgliem.**

Mērķis:

1. definēt minimālo diapazona formu AST v1
2. saglabāt sākuma un beigu pozīciju konsekventā formā
3. sākt ar reprezentatīviem deklarāciju, priekšrakstu un izteiksmju mezgliem
4. nepazaudēt pašreizējo `rinda` informāciju pārejas laikā
5. pievienot regresijas pārbaudes
6. palaist pilno `corepack pnpm run check`

Pēc tam:

- definēt AST mezglu obligātos un izvēles laukus
- publicēt pirmo `spec/ast-v1.md`
- pievienot AST v1 paraugu pārbaudes
- nostiprināt AST v1 kontraktu

## Ceļš līdz pirmajai izpildei

```text
0A kvalitātes pārbaudes — pabeigts
↓
klases AST — pabeigts
↓
piešķiršanas AST — pabeigts
↓
konstruktora ķermeņa AST — pabeigts
↓
getter un metožu minimums — pabeigts
↓
funkciju parametru AST — pabeigts
↓
veidņu interpolācijas — pabeigts
↓
pirmkoda diapazoni ← pašreizējais darbs
↓
AST v1 lauku kontrakts
↓
AST v1 specifikācija
↓
LatNe API minimums
↓
semantiskās transformācijas
↓
koda ģenerēšana
↓
JavaScript starprezultāts
↓
pirmā .lat izpilde
↓
latne palaist
```

## API terminoloģijas piezīme

Pirmajā paraugā pašlaik vēl ir:

```lat
lietotāji.push(lietotājs)
lietotāji.length
```

Tie ir zināmi JavaScript API svešķermeņi.

Plānotie pirmie LatNe API kandidāti:

```text
Array.push   → pievieno
Array.length → garums
```

Tie vēl nav jāuzskata par kanoniski apstiprinātu publisko API.

API translāciju nedrīkst realizēt ar globālu teksta aizvietošanu.

Tai jābūt sasaistītai ar tipu un semantisko operāciju.

## Ātrā pārbaude pirms darba

No repozitorija saknes:

```powershell
corepack pnpm run check
git status --short
```

## Jaunas sarunas sākuma frāze

Pietiek ar:

> Apskati QvarcY/LatNe repozitorija `main` zaru. Izlasi README un `docs/ATSAKSANA.md`, pēc tam aktuālo statusu, ceļa karti un arhitektūru. Turpini ar dokumentācijā norādīto nākamo izstrādes uzdevumu.
