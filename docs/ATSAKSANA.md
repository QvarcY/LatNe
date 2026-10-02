# LatNe darba atsākšana

**Atjaunots:** 2026-10-02
**Stabilais zars:** `main`
**Aktīvais plānošanas zars:** `docs/roadmap-v2`
**Nākamā engineering fāze:** 0A — reproducējama vide un kvalitātes sliedes

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
tokenizeris
 ↓
deklarāciju parseris
 ↓
statement parseris
 ↓
izteiksmju parseris
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

Tokenizeris:

`packages/valoda/src/tokenizer.mjs`

Deklarāciju un statement parseris:

`packages/valoda/src/parser.mjs`

Izteiksmju parseris:

`packages/valoda/src/expression-parser.mjs`

Pirmais LatNe avota paraugs:

`examples/pamata-paraugs.lat`

Pārbaudes skripti:

`packages/valoda/scripts/tokenize-example.mjs`

`packages/valoda/scripts/parse-example.mjs`

Publiskā ceļa karte:

`ROADMAP.md`

## Pašreizējais pārbaudītais stāvoklis

Terminoloģijas reģistrā:

- 84 termini
- 84 `approved`
- 0 `pending`

Pirmais `.lat` paraugs:

- 196 tokeni
- 0 nezināmu simbolu
- 5 augšējā līmeņa AST mezgli

Parseris strukturēti saprot:

- importu
- saskarsmi
- uzskaitījumu
- klasi augšējā līmenī
- darbību
- mainīgo deklarācijas
- nosacījumus
- `kam` ciklu
- atgriešanu
- kļūdu apstrādi
- identifikatorus un literāļus
- īpašību piekļuvi
- funkciju izsaukumus
- `gaidi`
- `jauns`
- masīvus
- unārās izteiksmes
- binārās izteiksmes ar pirmajām operatoru prioritātēm

## Kāpēc nākamais darbs vairs nav uzreiz Class AST

Valodas kodols ir izaudzis pietiekami tālu, lai turpmākas parsera un codegen izmaiņas bez automatizētām kvalitātes sliedēm palielinātu regresiju risku.

Tāpēc pirms nākamās būtiskās parsera paplašināšanas tiek izpildīta `ROADMAP.md` fāze:

**0A — reproducējama vide un kvalitātes sliedes.**

Tas nav valodas attīstības apturēšana.

Tas ir īss infrastruktūras posms, lai nākamos valodas soļus varētu veikt droši.

## Nākamais engineering bloks

Secība:

1. fiksēt atbalstīto Node.js runtime
2. pārbaudīt clean install ar lockfile
3. izveidot `ci.yml`
4. CI pieslēgt esošās terminoloģijas, tokenizera un parsera pārbaudes
5. CI pieslēgt Vārdu kalves check/build
6. izveidot pirmo regresijas fixture sistēmu
7. pievienot pirmos valid, invalid, edge-case un Unicode paraugus

Pēc šī bloka atgriezties pie:

**Klases ķermeņa AST v1.**

## Nākamā valodas robeža

Klases `Lietotājs` ķermenis vēl netiek strukturēti parsēts.

Pirmajā klases AST iterācijā jāatpazīst:

- klases lauki
- `atvērts`, `aizsargāts`, `privāts`
- `nemaināms`
- lauka tips
- konstruktora deklarācija
- konstruktora parametri
- getter deklarācija `ņem`
- getter atgriezes tips

Konstruktora un gettera ķermeņus pirmajā iterācijā vēl drīkst saglabāt kā tokenu kopas.

### Gatavības kritērijs

`Klase Lietotājs` AST vairs nedrīkst būt tikai nosaukums un `kermenaTokeni`.

Tam jāatspoguļo četri lauki, konstruktors un getteris.

Esošajam `pamata-paraugs.lat` pēc izmaiņas joprojām jāparsējas veiksmīgi.

## Ceļš līdz pirmajai izpildei

```text
kvalitātes sliedes
↓
klases AST
↓
piešķiršanas AST
↓
pilnāki ķermeņi un parametri
↓
template interpolation
↓
source spans
↓
AST v1 kontrakts
↓
LatNe API minimums
↓
semantiskās transformācijas
↓
codegen
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
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-terminology.ps1
node .\packages\valoda\scripts\tokenize-example.mjs
node .\packages\valoda\scripts\parse-example.mjs
pnpm --filter @latne/vardu-kalve check
pnpm --filter @latne/vardu-kalve build
git status --short
```

## Jaunas sarunas sākuma frāze

Pietiek ar:

> Apskati QvarcY/LatNe repozitorija `main` zaru. Izlasi README un `docs/ATSAKSANA.md`, pēc tam aktuālo statusu, ceļa karti un arhitektūru. Turpini ar dokumentācijā norādīto nākamo engineering uzdevumu.
