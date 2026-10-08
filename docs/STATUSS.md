# LatNe statuss

**Atjaunots:** 2026-10-08
**Pašreizējais valodas stāvoklis:** strukturēts AST līdz vienotam parametru kontraktam un veidņu aizpildījumiem
**Nākamā izstrādes fāze:** 1 — AST v1 lauku kontrakts

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
- strukturētas veidņu literāļu aizpildījumi
- definēta vienota `diapazons.sākums / diapazons.beigas` pirmkoda atrašanās vietas struktūra
- leksiskajiem elementiem saglabāti `rinda`, `kolonna` un 0-bāzēta `nobīde` diapazonā
- pirmie AST diapazoni ieviesti `Identifikators`, `Parametrs` un `Atgriešana` mezgliem
- salikto izteiksmju diapazoni ieviesti `Īpašība`, `Izsaukums`, `BināraIzteiksme` un `PiešķiršanasIzteiksme` mezgliem
- augšējā līmeņa deklarāciju diapazoni ieviesti `Imports`, `Saskarsme`, `Uzskaitījums`, `Klase` un `Darbība` mezgliem
- klases iekšējo mezglu diapazoni ieviesti `KlasesLauks`, `Konstruktors`, `Iegūšana` un `Metode` mezgliem
- pabeigts visu 40 pašreizējo AST mezglu tipu pirmkoda diapazonu pārklājums
- regresijas audits pārbauda katra zināmā AST mezgla `diapazons` esamību un bērnu robežas
- normalizēta LatNe leksiskā analizatora, sintaktiskā analizatora, leksisko elementu un AST identifikatoru rakstība ar pilnām latviešu diakritiskajām zīmēm
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
- veidņu aizpildījumi ar pilnu izteiksmju AST

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
- 2 strukturēti kanoniskās iegūšanas aizpildījumi

## Aktuālie ierobežojumi

Augšējā līmeņa `Darbība`, konstruktors un klases metode tagad izmanto vienu kopīgu `Parametrs` AST kontraktu.

Veidņu literāļi tagad satur:

- `VeidnesTeksts`
- `VeidnesAizpildījums`
- pilnu aizpildījuma izteiksmes AST
- sākotnējo `pieraksts` veidnes vērtību

Regresijas pārbaudes sedz arī bināru izteiksmi aizpildījumā un escapotu `\${...}` marķieri.

Konstruktora, iegūšanas un metodes neapstrādātie ķermeņa leksiskie elementi pagaidām tiek saglabāti kā pārejas lauki.

Nav vēl:

- noklusējuma parametru vērtību AST
- plašāka klases metožu modifikatoru atbalsta, piemēram, `async` un `static`
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

**AST mezglu obligāto un izvēles lauku kontrakts.**

Pirmkoda diapazonu darbs ir pabeigts visiem pašreizējiem AST mezglu tipiem.

Audits aptver:

- 11 programmas, deklarāciju, klases un parametru mezglu tipus
- 10 priekšrakstu mezglu tipus
- 19 izteiksmju un veidņu mezglu tipus

Katram zināmajam AST mezglam regresijas pārbaude pieprasa derīgu `diapazons` struktūru un pārbauda, ka bērna mezgla diapazons neiziet ārpus vecāka mezgla robežām. Tukšai `Programma` saknei tiek lietots nulles garuma diapazons `1:1 / nobīde 0`.

AST v1 lauku auditā `rinda` ir apstiprināts kā pārejas lauks, bet `ķermeņaLeksiskieElementi`, `ķermeņaLeksiskoElementuSkaits` un `parametruLeksiskoElementuSkaits` ir apstiprināti kā pārejas / iekšēji lauki ārpus stabilā AST v1 publiskā kontrakta. Apstiprināta arī vienota tukšuma semantika: kolekcijas lieto `[]`, neesoša viena vērtība lieto `null`, `""` netiek izmantota kā neesošas vērtības marķieris, bet diskriminētu variantu svešie lauki netiek izveidoti. `Nosacījums.citādi` saglabā `null` / `[]` / satura masīva atšķirību. `Darbība.atgriezesTips` un `Metode.atgriezesTips` tagad izmanto `null`, ja atgriezes tips nav norādīts, tādējādi parseris ir saskaņots ar apstiprināto izvēles vienas vērtības semantiku. `KārtasCikls` tagad atbalsta gan kolekcijas ciklu, gan klasisku trīsdaļīgu skaitītāja ciklu. Skaitītāja variants izmanto apstiprinātos laukus `sākums`, `nosacījums`, `solis` un `variants: "skaitītājs"`; iepriekšējais `variants: "vispārīgs"` starpstāvoklis ir noņemts. Kolekcijas variants publiskajā AST tagad ir semantiskais `variants: "kolekcija"`, nevis avota identitāte `"of"`. `PirmsIzteiksme.operators` LatNe `veids` operatoram tagad ir `"veids"`, nevis `"typeof"`, un AST specifikācijas tipa pierakstā lietojam LatNe `teksts`, `loģisks` un `skaitlis`, nevis `string`, `boolean` un `Number`. Neatrisinātas paliek deklarāciju `const` / `let` / `var` semantiskās vērtības, `Nosacījums.citādi`, `Mēģinājums.ķer` un `Imports.avots` forma.

## Ceļš līdz pirmajai palaišanai

```text
kvalitātes sliedes
→ klases AST ✓
→ piešķiršanas AST ✓
→ konstruktora ķermeņa AST ✓
→ iegūšanas un metožu minimums ✓
→ funkciju parametru AST ✓
→ veidņu aizpildījumi ✓
→ pirmkoda diapazoni ✓
→ AST v1 lauku kontrakts ← pašreizējais darbs
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
