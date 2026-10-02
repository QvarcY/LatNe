# LatNe darba atsākšana

**Atjaunots:** 2026-10-02
**Stabilais zars:** `main`
**Aktīvais plānošanas zars:** `docs/roadmap-v2`
**Nākamā izstrādes fāze:** 0A — reproducējama vide un kvalitātes pārbaudes

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

Sintaktiskais analizators strukturēti saprot:

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

Valodas kodols ir izaudzis pietiekami tālu, lai turpmākas sintaktiskā analizatora un koda ģenerēšanas izmaiņas bez automatizētām kvalitātes pārbaudēm palielinātu regresiju risku.

Tāpēc pirms nākamās būtiskās sintaktiskā analizatora paplašināšanas tiek izpildīta `ROADMAP.md` fāze:

**0A — reproducējama vide un kvalitātes sliedes.**

Tas nav valodas attīstības apturēšana.

Tas ir īss infrastruktūras posms, lai nākamos valodas soļus varētu veikt droši.

## Nākamais izstrādes bloks

Secība:

1. fiksēt atbalstīto Node.js izpildvidi
2. pārbaudīt tīru atkarību instalāciju ar lockfile
3. izveidot `ci.yml`
4. CI pieslēgt esošās terminoloģijas, leksiskās analīzes un sintaktiskās analīzes pārbaudes
5. CI pieslēgt Vārdu kalves pārbaudi un būvēšanu
6. izveidot pirmo regresijas paraugu sistēmu
7. pievienot pirmos derīgos, nederīgos, robežgadījumu un Unicode paraugus

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
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\parbaudit-terminologiju.ps1
node .\packages\valoda\scripts\parbaudit-leksisko-analizi.mjs
node .\packages\valoda\scripts\parbaudit-sintaktisko-analizi.mjs
pnpm --filter @latne/vardu-kalve check
pnpm --filter @latne/vardu-kalve build
git status --short
```

## Jaunas sarunas sākuma frāze

Pietiek ar:

> Apskati QvarcY/LatNe repozitorija `main` zaru. Izlasi README un `docs/ATSAKSANA.md`, pēc tam aktuālo statusu, ceļa karti un arhitektūru. Turpini ar dokumentācijā norādīto nākamo izstrādes uzdevumu.
