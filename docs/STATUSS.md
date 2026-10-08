# LatNe statuss

**Atjaunots:** 2026-10-08
**Pašreizējais valodas stāvoklis:** strukturēts AST līdz vienotam parametru kontraktam un veidņu interpolācijām
**Nākamā izstrādes fāze:** 1 — pirmkoda diapazoni AST mezgliem

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
- strukturēts iegūšanas ķermeņa AST
- minimāls klases metodes AST
- strukturēti augšējā līmeņa `Darbība` parametri
- vienots `Parametrs` AST konstruktoram, metodei un darbībai
- strukturētas veidņu literāļu interpolācijas
- definēta vienota `diapazons.sākums / diapazons.beigas` pirmkoda atrašanās vietas struktūra
- leksiskajiem elementiem saglabāti `rinda`, `kolonna` un 0-bāzēta `nobīde` diapazonā
- pirmie AST diapazoni ieviesti `Identifikators`, `Parametrs` un `Atgriešana` mezgliem
- salikto izteiksmju diapazoni ieviesti `Īpašība`, `Izsaukums`, `BināraIzteiksme` un `PiešķiršanasIzteiksme` mezgliem
- augšējā līmeņa deklarāciju diapazoni ieviesti `Imports`, `Saskarsme`, `Uzskaitījums`, `Klase` un `Darbība` mezgliem
- normalizēta LatNe-owned lexer, parsera, tokenu un AST identifikatoru rakstība ar pilnām latviešu diakritiskajām zīmēm
- ieviests pastāvīgs transliterētu LatNe identifikatoru quality gate

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
- iegūšanas deklarāciju, atgriezes tipu un ķermeni
- konstruktora ķermeņa priekšrakstus
- klases metodes deklarāciju
- klases metodes pieejamību
- klases metodes tipētos parametrus
- klases metodes atgriezes tipu
- klases metodes strukturētu ķermeni
- augšējā līmeņa darbības tipētos parametrus
- veidņu teksta daļas
- veidņu interpolācijas ar pilnu izteiksmju AST

## Pārbaudītais pirmais paraugs

`examples/pamata-paraugs.lat`

Rezultāts:

- 196 leksiskie elementi
- 0 nezināmu simbolu
- 5 augšējā līmeņa AST mezgli
- strukturēts darbības ķermenis
- strukturētas izteiksmes
- 4 strukturēti konstruktora priekšraksti
- 1 strukturēts iegūšanas priekšraksts
- 4 strukturētas kanoniskās iegūšanas veidnes daļas
- 2 strukturētas kanoniskās iegūšanas interpolācijas

## Aktuālie ierobežojumi

Augšējā līmeņa `Darbība`, konstruktors un klases metode tagad izmanto vienu kopīgu `Parametrs` AST kontraktu.

Veidņu literāļi tagad satur:

- `VeidnesTeksts`
- `VeidnesInterpolācija`
- pilnu interpolācijas izteiksmes AST
- sākotnējo `pieraksts` veidnes vērtību

Regresijas pārbaudes sedz arī bināru izteiksmi interpolācijā un escapotu `\${...}` marķieri.

Konstruktora, iegūšanas un metodes neapstrādātie ķermeņa leksiskie elementi pagaidām tiek saglabāti kā pārejas lauki.

Nav vēl:

- noklusējuma parametru vērtību AST
- plašāka klases metožu modifikatoru atbalsta, piemēram, `async` un `static`
- pilna pirmkoda diapazonu pārklājuma visiem AST mezgliem
- definēta AST mezglu obligāto un izvēles lauku specifikācija
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
- LatNe identifikatoru ortogrāfijas pārbaude darbojas pilnajā kvalitātes ķēdē
- leksiskās analīzes pārbaude darbojas CI
- sintaktiskās analīzes pārbaude darbojas CI
- Vārdu kalves pārbaude un būvēšana darbojas CI
- regresijas paraugu sistēma
- derīgi, nederīgi, robežgadījumu un Unicode paraugi

## Nākamais valodas uzdevums

**Pirmkoda diapazona informācija AST mezgliem.**

Minimālais diapazona kontrakts tagad ir definēts un nostiprināts ar regresijas pārbaudēm.

Pirmā iterācija pārklāja trīs reprezentatīvus mezglus:

- `Identifikators`
- `Parametrs`
- `Atgriešana`

Otrā iterācija pārklāj saliktās izteiksmes:

- `Īpašība`
- `Izsaukums`
- `BināraIzteiksme`
- `PiešķiršanasIzteiksme`

Trešā iterācija pārklāj augšējā līmeņa deklarācijas:

- `Imports`
- `Saskarsme`
- `Uzskaitījums`
- `Klase`
- `Darbība`

Kontrakts izmanto pusatvērtu `[sākums, beigas)` intervālu, 1-bāzētu `rinda` un `kolonna`, kā arī 0-bāzētu `nobīde`.

Nākamajā apakšsolī diapazons jāpaplašina uz klases iekšējiem AST mezgliem. ROADMAP uzdevums paliek nepabeigts, līdz pārklājums ir pietiekams AST v1 stabilizācijai.

Jaunie AST lauki joprojām jāveido tikai ar pilnu latviešu rakstību.

## Ceļš līdz pirmajai palaišanai

```text
kvalitātes sliedes
→ klases AST ✓
→ piešķiršanas AST ✓
→ konstruktora ķermeņa AST ✓
→ iegūšanas un metožu minimums ✓
→ funkciju parametru AST ✓
→ veidņu interpolācijas ✓
→ pirmkoda diapazoni ← pašreizējais darbs
→ AST v1 lauku kontrakts
→ AST v1 specifikācija
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
