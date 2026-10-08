# Izmaiņu žurnāls

Šis fails seko produkta izmaiņu robežām.

Detalizētais projekta ceļš atrodas `docs/HRONIKA.md` un `docs/ZURNALS.md`.

## [Unreleased]

### Added
#### 2026-10-08
- `Mainīgais.deklarācija` un `KārtasCikls.deklarācija` izmanto semantiskās vērtības `"konstante"`, `"mainīgais"` un `"funkcijasMainīgais"` avota `const`, `let` un `var` vietā
- `KārtasCikls` kolekcijas variants AST izmanto semantisko `"kolekcija"`, nevis avota identitāti `"of"`
- `PirmsIzteiksme.operators` LatNe `veids` operatoram izmanto semantisko `"veids"`, nevis `"typeof"`
- AST specifikācijas tipa pierakstā `string`, `boolean` un `Number` aizstāti ar LatNe `teksts`, `loģisks` un `skaitlis`
- `Darbība.atgriezesTips` un `Metode.atgriezesTips` neesošai vērtībai tagad izmanto `null`, nevis tukšu virkni
- `KārtasCikls` papildināts ar strukturētu `variants: "skaitītājs"` galveni un laukiem `sākums`, `nosacījums`, `solis`
- noņemts nepabeigtais `KārtasCikls` `variants: "vispārīgs"` starpstāvoklis
- AST `VeidnesInterpolācija` pārsaukta par apstiprināto `VeidnesAizpildījums`
- AST `KamCikls` pārsaukts par apstiprināto `KārtasCikls`
- `PiešķiršanasIzteiksme` apstiprināts kā kanoniskais AST nosaukums
- `ApstākļaCikls` rezervēts nākotnes `kamēr` AST mezglam
- AST `UnāraIzteiksme` pārsaukta par apstiprināto `PirmsIzteiksme`
- AST `Getteris` un `getteri` pārsaukti par `Iegūšana` un `iegūšanas`
- AST `raw` lauks pārsaukts par `pieraksts`
- kvalitātes pārbaude nepieļauj `getter` un `raw` atgriešanos LatNe kodolā
- projekta terminoloģijas politika papildināta ar principu dot priekšroku vienam skaidram latviešu vārdam, ja tas ir pietiekams
- definēts vienots AST pirmkoda diapazona kontrakts ar `sākums`, `beigas`, `rinda`, `kolonna` un `nobīde`
- leksiskajiem elementiem pievienoti pusatvērti pirmkoda diapazoni
- pirmajā AST diapazonu iterācijā pārklāti `Identifikators`, `Parametrs` un `Atgriešana`
- diapazoni paplašināti uz saliktām izteiksmēm: `Īpašība`, `Izsaukums`, `BināraIzteiksme` un `PiešķiršanasIzteiksme`
- diapazoni pievienoti augšējā līmeņa deklarācijām: `Imports`, `Saskarsme`, `Uzskaitījums`, `Klase` un `Darbība`
- diapazoni pievienoti klases iekšējiem mezgliem: `KlasesLauks`, `Konstruktors`, `Iegūšana` un `Metode`
- pabeigts pirmkoda diapazonu pārklājums visiem 40 pašreizējiem AST mezglu tipiem
- atlikušajiem izteiksmju mezgliem pievienoti diapazoni, tostarp `Masīvs`, `Veidne`, `Grupa`, `Gaidīšana`, `Jauns` un `PirmsIzteiksme`
- atlikušajiem priekšrakstu mezgliem pievienoti diapazoni, tostarp `Mainīgais`, `Nosacījums`, `KārtasCikls`, `Mēģinājums`, `Metiens` un vienkāršie vadības priekšraksti
- `Programma` saknei definēts arī tukša avota nulles garuma diapazons
- pievienots pilns AST diapazonu audits, kas pārbauda visu zināmo mezglu tipu pārklājumu un bērnu robežas
- pievienotas pirmkoda diapazonu regresijas pārbaudes, tostarp veidnes aizpildījuma absolūtajai nobīdei, salikto izteiksmju, pilnu deklarāciju un klases iekšējo mezglu robežām
- normalizēti LatNe leksiskā analizatora, sintaktiskā analizatora, leksisko elementu un AST latviskie identifikatori uz pareizu rakstību ar diakritiskajām zīmēm
- publiskie parsera eksporti pārdēvēti uz `izveidoVārdnīcu`, `analizēLeksiski`, `analizēIzteiksmi`, `analizēPriekšrakstus`, `analizēSintaksi`, `analizēKlasesĶermeni` un `analizēParametrus`
- tokenu un AST lauki, tostarp `vērtība`, `daļas`, `deklarācija`, `mainīgais`, `nosacījums`, `ķermenis`, `pieejamība`, `nemaināms`, `kreisā`, `labā` un `mērķis`, nostiprināti ar pareizu latviešu ortogrāfiju
- pievienota pastāvīga `check:identifikatori` kvalitātes pārbaude pret transliterētu LatNe identifikatoru atgriešanos

#### 2026-10-07
- ieviests strukturēts klases ķermeņa AST
- strukturēti klases lauki, pieejamības modifikatori, lauku tipi un `nemaināms` stāvoklis
- strukturēta konstruktora deklarācija un parametri
- strukturēta iegūšanas deklarācija un atgriezes tips
- ieviests `PiešķiršanasIzteiksme` AST
- pievienots vienkāršo un kombinēto piešķiršanas operatoru atbalsts
- pievienota piešķiršanas izteiksmju labējās asociativitātes un mērķa validācijas pārbaude
- pievienotas regresijas pārbaudes kanoniskajām konstruktora piešķiršanām
- strukturēts konstruktora ķermeņa priekšrakstu AST
- strukturēts iegūšanas ķermeņa AST
- pievienots minimāls klases `Metode` AST
- klases metodei pievienota pieejamība, tipēti parametri, izvēles atgriezes tips un strukturēts ķermenis
- konstruktora, iegūšanas un metodes ķermeņiem izmantota kopīgā priekšrakstu analizatora infrastruktūra
- pievienota klases metodes regresijas pārbaude, nemainot kanonisko pirmo `.lat` paraugu
- augšējā līmeņa `Darbība` parametri strukturēti kā `Parametrs` AST mezgli
- konstruktoram, klases metodei un darbībai ieviests kopīgs parametru analizators
- veidņu literāļiem pievienotas strukturētas `VeidnesTeksts` un `VeidnesAizpildījums` daļas
- veidņu aizpildījumi izmanto pilno izteiksmju AST
- pievienotas regresijas pārbaudes saliktai aizpildījuma izteiksmei un escapotam aizpildījuma marķierim
- README un GitHub Pages pievienots jaunais LatNe logotips

#### 2026-10-02

- publiskā ceļa karte pārkārtota faktiskā izpildes secībā
- pievienota reproducējamas vides un CI kvalitātes fāze
- pievienots AST v1 stabilizācijas posms
- pievienota atsevišķa pirmās pilnās `.lat` izpildes fāze
- pievienots diagnostikas un developer experience plāns
- pievienots bilingvālas dokumentācijas un Education MVP plāns
- pieņemts ADR 0007 par AST v1 kā koda ģeneratora kontraktu
- sinhronizēta atsākšanas, statusa un arhitektūras dokumentācija
- GitHub Pages sinhronizēta ar 130 uzdevumu ROADMAP v2
- publiskajā lapā pievienoti "Mācies ar LatNe" un "Būvē ar LatNe" virzieni
- Pages progress pārslēgts uz 15/130 jeb 12% no pašreiz definētās ceļa kartes
- pievienota pilna angļu GitHub Pages versija zem `/en/`
- pievienots LV/EN valodu pārslēdzējs
- pievienoti canonical, hreflang, Open Graph un JSON-LD metadati
- pievienots `sitemap.xml`

#### 2026-10-01

- visi 84 LatNe terminoloģijas kandidāti izskatīti un apstiprināti
- pievienots pirmais `.lat` sintakses paraugs
- izveidots pirmais LatNe leksiskais analizators
- izveidots deklarāciju sintaktiskais analizators un pirmais AST
- izveidots darbības ķermeņa priekšrakstu sintaktiskais analizators
- izveidots atsevišķs izteiksmju sintaktiskais analizators
- ieviesti pirmie literāļu, izsaukumu, īpašību, `gaidi`, `jauns`, masīvu un bināro operatoru AST mezgli
- dokumentēts atsevišķs LatNe iebūvētā API terminoloģijas slānis
- pievienots darba atsākšanas dokuments
- izveidota LatNe GitHub Pages v1 projekta prezentācijas lapa
- projekta progress lapā tiek ģenerēts no `ROADMAP.md`
- pievienoti līdzdarbības, GitHub un Buy Me a Coffee atbalsta ceļi

#### 2026-09-30

- izveidots pirmais 84 JS/TS sintakses kandidātu terminoloģijas inventārs
- pievienota terminoloģijas reģistra validācija
- izveidota Vārdu kalve
- izveidota LatNe projekta sākotnējā struktūra
- ieviesta dokumentācijas un lēmumu reģistrēšanas sistēma
