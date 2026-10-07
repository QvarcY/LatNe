# Izmaiņu žurnāls

Šis fails seko produkta izmaiņu robežām.

Detalizētais projekta ceļš atrodas `docs/HRONIKA.md` un `docs/ZURNALS.md`.

## [Unreleased]

### Added
#### 2026-10-07
- ieviests strukturēts klases ķermeņa AST
- strukturēti klases lauki, pieejamības modifikatori, lauku tipi un `nemaināms` stāvoklis
- strukturēta konstruktora deklarācija un parametri
- strukturēta getter deklarācija un atgriezes tips
- ieviests `PiešķiršanasIzteiksme` AST
- pievienots vienkāršo un kombinēto piešķiršanas operatoru atbalsts
- pievienota piešķiršanas izteiksmju labējās asociativitātes un mērķa validācijas pārbaude
- pievienotas regresijas pārbaudes kanoniskajām konstruktora piešķiršanām
- strukturēts konstruktora ķermeņa priekšrakstu AST
- strukturēts gettera ķermeņa AST
- pievienots minimāls klases `Metode` AST
- klases metodei pievienota pieejamība, tipēti parametri, izvēles atgriezes tips un strukturēts ķermenis
- konstruktora, gettera un metodes ķermeņiem izmantota kopīgā priekšrakstu analizatora infrastruktūra
- pievienota klases metodes regresijas pārbaude, nemainot kanonisko pirmo `.lat` paraugu

#### 2026-10-02

- publiskā ceļa karte pārkārtota faktiskā izpildes secībā
- pievienota reproducējamas vides un CI kvalitātes fāze
- pievienots AST v1 stabilizācijas posms
- pievienota atsevišķa pirmās pilnās `.lat` izpildes fāze
- pievienots diagnostikas un developer experience plāns
- pievienots bilingvālas dokumentācijas un Education MVP plāns
- pieņemts ADR 0007 par AST v1 kā codegen kontraktu
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
- izveidots pirmais LatNe tokenizeris
- izveidots deklarāciju parseris un pirmais AST
- izveidots darbības ķermeņa statement parseris
- izveidots atsevišķs izteiksmju parseris
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
