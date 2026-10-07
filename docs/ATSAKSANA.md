# LatNe darba atsākšana

**Atjaunots:** 2026-10-02
**Stabilais zars:** `main`
**Darba sākumpunkts:** `main`
**Nākamā izstrādes fāze:** 1 — klases ķermeņa AST v1

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
- 1 getteris

Sintaktiskais analizators strukturēti saprot arī:

- klases laukus un pieejamības modifikatorus
- `nemaināms` lauku informāciju un tipus
- konstruktora deklarāciju un parametrus
- getter deklarāciju un atgriezes tipu
- piešķiršanas izteiksmes
- vienkāršo un kombinētos piešķiršanas operatorus
- labēji asociatīvas piešķiršanas izteiksmes
- derīga piešķiršanas mērķa pārbaudi

Tehniskie checkpointi:

- `8195515` — strukturēts klases ķermeņa AST
- `1d73f5d` — strukturēts piešķiršanas AST

Pilnais `corepack pnpm run check` pēc `1d73f5d` ir zaļš.

## Pašreizējā robeža

Konstruktora un gettera ķermeņi vēl glabājas kā neapstrādātas leksisko elementu kopas.

Kanoniskajā `Lietotājs` konstruktorā ir četras piešķiršanas:

```lat
šis.vārds = vārds
šis.vecums = vecums
šis.aktīvs = patiess
šis.loma = Loma.lietotājs
```

Izteiksmju analizators tās jau spēj pārvērst `PiešķiršanasIzteiksme` AST mezglos, bet konstruktora ķermenis vēl nav savienots ar priekšrakstu AST.

## Nākamais izstrādes bloks

**Konstruktora ķermeņa priekšrakstu AST.**

Mērķis:

1. pārtraukt konstruktora ķermeņa uzturēšanu tikai kā raw tokenu kopu
2. izmantot esošo priekšrakstu un izteiksmju parsera infrastruktūru
3. iegūt četrus strukturētus konstruktora priekšrakstus
4. saglabāt vai skaidri dokumentēt raw tokenu pārejas lauku, ja tas vēl nepieciešams
5. pievienot regresijas pārbaudes
6. palaist pilno `corepack pnpm run check`

Pēc tam:

- strukturēt getter un metožu ķermeņu minimumu
- paplašināt funkciju parametru AST
- parsēt veidņu interpolācijas
- pievienot pirmkoda diapazonus
- nostiprināt AST v1 kontraktu

## Ceļš līdz pirmajai izpildei

```text
0A kvalitātes pārbaudes — pabeigts
↓
klases AST — pabeigts
↓
piešķiršanas AST — pabeigts
↓
konstruktora ķermeņa AST ← pašreizējais darbs
↓
getter un metožu ķermeņi
↓
pilnāki parametri
↓
template interpolation
↓
pirmkoda diapazoni
↓
AST v1 kontrakts
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
