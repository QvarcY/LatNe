# LatNe darba atsākšana

**Atjaunots:** 2026-10-01
**Stabilais zars:** `main`
**Fāze:** 1 — valodas pamats

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
AST
 ↓
koda ģenerators
 ↓
izpildāms starprezultāts
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

## Zināmais lielais caurums

Klases `Lietotājs` ķermenis vēl netiek strukturēti parsēts.

Šobrīd klase tiek atpazīta, bet tās iekšējais saturs joprojām tiek saglabāts galvenokārt kā tokenu kopa.

Tas ir nākamais darbs.

## Nākamais konkrētais uzdevums

**Klases ķermeņa AST v1.**

Šajā vienā solī jāatpazīst:

- klases lauki
- `atvērts`, `aizsargāts`, `privāts`
- `nemaināms`
- lauka tips
- konstruktora deklarācija
- konstruktora parametri
- getter deklarācija `ņem`
- getter atgriezes tips

Pirmajā klases parsera versijā konstruktora un gettera ķermeņus vēl drīkst saglabāt kā tokenu kopas.

Šajā solī vēl nevajag:

- pilnu piešķiršanas izteiksmju parseri
- pilnībā parsēt konstruktora ķermeni
- sākt koda ģeneratoru
- sākt CLI
- risināt visu JavaScript standarta API

### Gatavības kritērijs

`Klase Lietotājs` AST vairs nedrīkst būt tikai nosaukums un `kermenaTokeni`.

Tam jāatspoguļo četri lauki, konstruktors un getteris.

Esošajam `pamata-paraugs.lat` pēc izmaiņas joprojām jāparsējas veiksmīgi.

## Pēc klases AST v1

Plānotā aktīvā secība līdz pirmajai programmas palaišanai:

1. piešķiršanas AST un klases metožu ķermeņu parsēšana
2. pilnāka funkciju parametru struktūra
3. nepieciešamās veidņu interpolācijas
4. LatNe iebūvētā API terminoloģijas pirmais slānis
5. `push` / `length` svešķermeņu aizstāšana ar semantiski korektu LatNe API
6. pirmās AST specifikācijas stabilizēšana
7. pirmais JS starprezultāts
8. pirmā `.lat` programmas palaišana
9. CLI ceļš līdz `latne palaist`

`while`, `switch` un plašāks valodas konstrukciju pārklājums paliek ceļa kartē, bet tiem nav jābloķē pirmā pilnā LatNe programmas ķēde.

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

Tos nedrīkst realizēt ar globālu teksta aizvietošanu.

API tulkojumam jābūt sasaistītam ar tipu vai semantisko operāciju.

Skatīt `ROADMAP.md` fāzi **1A — LatNe iebūvētais API slānis**.

## Ātrā pārbaude pirms darba

No repozitorija saknes:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-terminology.ps1
node .\packages\valoda\scripts\tokenize-example.mjs
node .\packages\valoda\scripts\parse-example.mjs
git status --short
```

Ja šīs pārbaudes ir veiksmīgas un darba koks ir tīrs, var sākt nākamo uzdevumu.

## Jaunas sarunas sākuma frāze

Pietiek ar:

> Apskati QvarcY/LatNe repozitorija `main` zaru. Izlasi README un `docs/ATSAKSANA.md`, pēc tam aktuālo statusu, ceļa karti un arhitektūru. Turpini ar dokumentācijā norādīto nākamo uzdevumu.
