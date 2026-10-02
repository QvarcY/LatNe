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

## Kāpēc nākamais darbs ir klases ķermeņa AST v1

Fāze 0A ir pabeigta.

Projektam jau ir reproducējama Node.js un pnpm vide, GitHub Actions CI, terminoloģijas un valodas kodola pārbaudes, Vārdu kalves būvēšanas pārbaude un pirmā regresijas paraugu sistēma.

Tas nozīmē, ka valodas kodolu tagad var drošāk paplašināt, nepalielinot regresiju risku ar katru jaunu sintakses soli.

Pašreizējā lielākā AST robeža ir klases ķermenis.

## Nākamais izstrādes bloks

**Klases ķermeņa AST v1.**

Secība:

1. strukturēt klases laukus
2. strukturēt pieejamības modifikatorus
3. saglabāt `nemaināms` informāciju
4. strukturēt lauku tipus
5. strukturēt konstruktora deklarāciju
6. strukturēt konstruktora parametrus
7. strukturēt getter deklarāciju
8. strukturēt getter atgriezes tipu
9. pievienot regresijas paraugus jaunajai AST struktūrai
10. pārbaudīt, ka `examples/pamata-paraugs.lat` joprojām iziet pilno kvalitātes pārbaudi

Konstruktora un gettera ķermeņus šajā pirmajā iterācijā vēl drīkst saglabāt kā neapstrādātu leksisko elementu kopas.

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
0A kvalitātes pārbaudes — pabeigts
↓
klases AST ← pašreizējais darbs
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
corepack pnpm run check
git status --short
```

## Jaunas sarunas sākuma frāze

Pietiek ar:

> Apskati QvarcY/LatNe repozitorija `main` zaru. Izlasi README un `docs/ATSAKSANA.md`, pēc tam aktuālo statusu, ceļa karti un arhitektūru. Turpini ar dokumentācijā norādīto nākamo izstrādes uzdevumu.
