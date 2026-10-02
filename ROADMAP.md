# LatNe ceļa karte

Šī ceļa karte rāda publisko LatNe izstrādes secību.

Uzdevumi ir sakārtoti pēc faktiskās prioritātes: vispirms tiek nostiprināts valodas kodols un tā kvalitātes robežas, pēc tam tiek sasniegta pirmā pilnā `.lat` programmas izpilde, un tikai tad tiek paplašināta izstrādātāja, mācību un tīmekļa pieredze.

Ceļa karte ir dzīvs dokuments. Ja projekta robežas kļūst precīzākas, kopējais uzdevumu skaits var mainīties.

---

## Fāze 0 — identitāte un projekta pamats

- [x] Fiksēt nosaukumu **LatNe**
- [x] Fiksēt `.lat` avota failu paplašinājumu
- [x] Fiksēt MIT licenci
- [x] Uzrakstīt manifestu v0.1
- [x] Ieviest dokumentācijas sistēmu
- [x] Publicēt LatNe repozitoriju GitHub
- [x] Izveidot LatNe GitHub Pages v1
- [ ] Rezervēt `latne.lv`
- [ ] Rezervēt GitHub organizācijas vai projekta namespace
- [ ] Rezervēt npm `latne` / `@latne/*`

---

## Fāze 0A — reproducējama vide un kvalitātes sliedes

Šīs pārbaudes tiek ieviestas pirms straujas parsera un codegen paplašināšanas.

- [ ] Fiksēt oficiāli atbalstīto Node.js versiju vai versiju diapazonu
- [ ] Fiksēt runtime prasības projekta konfigurācijā
- [ ] Pārbaudīt clean install ar fiksēto pnpm un lockfile
- [ ] Izveidot GitHub Actions `ci.yml`
- [ ] CI palaist terminoloģijas validāciju
- [ ] CI palaist tokenizera pārbaudi
- [ ] CI palaist parsera pārbaudi
- [ ] CI palaist Vārdu kalves TypeScript pārbaudi un build
- [ ] Izveidot pirmo regresijas fixture sistēmu
- [ ] Pievienot valid, invalid, edge-case un Unicode paraugus

Sākotnējais obligātais CI mērķis ir Linux.

Windows pārbaudi pievienot tad, kad pamatķēde ir stabila un sākas CLI izplatīšanas darbs.

---

## Fāze 1 — valodas kodols līdz AST v1

### Pabeigtais pamats

- [x] Izveidot JS/TS sintakses terminu kandidātu inventāru
- [x] Izveidot Vārdu kalves MVP
- [x] Apstiprināt pirmo LatNe atslēgvārdu kopu
- [x] Izveidot tokenizera pamatu
- [x] Izveidot parsera PoC
- [x] Definēt pirmo minimālo AST
- [x] Izveidot darbības ķermeņa statement AST
- [x] Izveidot pirmo izteiksmju AST

### Nākamā izpildes secība

- [ ] Izveidot klases ķermeņa AST v1
- [ ] Strukturēt klases laukus un pieejamības modifikatorus
- [ ] Strukturēt konstruktoru un tā parametrus
- [ ] Strukturēt getter deklarāciju un atgriezes tipu
- [ ] Izveidot piešķiršanas izteiksmju AST
- [ ] Strukturēt konstruktora ķermeņa statements
- [ ] Strukturēt getter un metožu ķermeņu minimumu
- [ ] Paplašināt funkciju parametru AST
- [ ] Parsēt veidņu literāļu interpolācijas
- [ ] Pievienot source span informāciju AST mezgliem
- [ ] Definēt AST mezglu obligātos un izvēles laukus
- [ ] Publicēt pirmo `spec/ast-v1.md`
- [ ] Pievienot AST v1 fixture pārbaudes
- [ ] Stabilizēt AST v1 kontraktu

Plašāks `kamēr`, `pārslēdz` un citu konstrukciju pārklājums tiks turpināts pēc pirmās pilnās LatNe izpildes, ja tas nav nepieciešams pirmajam end-to-end paraugam.

---

## Fāze 1A — LatNe iebūvētā API minimums

LatNe standarta API terminoloģija ir atsevišķa no valodas atslēgvārdu un sintakses terminoloģijas.

API nosaukumus nedrīkst ieviest ar aklu globālu teksta aizvietošanu. Tulkojumam jābūt sasaistītam ar konkrētu tipu vai semantisku operāciju.

### Pirmajai izpildei nepieciešamais minimums

- [ ] Inventarizēt JavaScript runtime un standarta API svešķermeņus pirmajā `.lat` paraugā
- [ ] Definēt LatNe API terminoloģijas reģistra formātu
- [ ] Definēt API termina kanonisko identitāti
- [ ] Definēt API termina sasaisti ar tipu
- [ ] Definēt semantiskās operācijas sasaisti ar codegen
- [ ] Izskatīt `Array.push` → `pievieno`
- [ ] Izskatīt `Array.length` → `garums`
- [ ] Ieviest pirmo semantisko API translāciju
- [ ] Pārbaudīt, ka pirmajā LatNe paraugā nav nejauši palikušu neatļautu JavaScript standarta API nosaukumu

### Pēc pirmās izpildes

- [ ] Inventarizēt masīvu API
- [ ] Inventarizēt teksta API
- [ ] Inventarizēt skaitļu API
- [ ] Inventarizēt objektu API
- [ ] Inventarizēt kolekciju API
- [ ] Inventarizēt globālos objektus un funkcijas
- [ ] Izlemt, kuri ārējā runtime API nosaukumi LatNe kodā apzināti paliek netulkoti
- [ ] Integrēt API terminoloģijas pārbaudi Vārdu kalvē vai atsevišķā rīkā

---

## Fāze 1B — pirmā izpildāmā LatNe

Šīs fāzes mērķis ir pirmā pilnā LatNe apstrādes ķēde.

```text
.lat
↓
tokenizeris
↓
parseris
↓
AST
↓
semantiskās transformācijas
↓
koda ģenerators
↓
JavaScript starprezultāts
↓
izpilde
```

### Transformācijas un codegen

- [ ] Definēt AST transformāciju robežu
- [ ] Izveidot pirmo koda ģeneratora moduli
- [ ] Ģenerēt programmas pamatstruktūru
- [ ] Ģenerēt importus
- [ ] Ģenerēt mainīgo deklarācijas
- [ ] Ģenerēt izteiksmes
- [ ] Ģenerēt nosacījumus
- [ ] Ģenerēt ciklus
- [ ] Ģenerēt funkcijas
- [ ] Ģenerēt klases
- [ ] Ģenerēt `return`
- [ ] Ģenerēt `try/catch/finally`
- [ ] Saglabāt ģenerēto JavaScript apskatāmu un izskaidrojamu

### Pirmā izpilde

- [ ] Izveidot pirmo JavaScript starprezultātu
- [ ] Palaist ģenerēto JavaScript
- [ ] Palaist pirmo `.lat` programmu caur pilnu LatNe ķēdi

Šis ir pirmais lielais LatNe valodas milestone.

### CLI minimums

- [ ] Izveidot CLI bootstrap
- [ ] Ielādēt `.lat` failu no CLI
- [ ] Savienot CLI ar kompilācijas ķēdi
- [ ] Izvadīt diagnostiku CLI
- [ ] Palaist ģenerēto programmu
- [ ] Definēt pamata exit codes
- [ ] Panākt darbību komandai `latne palaist sveika.lat`

---

## Fāze 2 — diagnostika un izstrādātāja pieredze

### Diagnostikas pamats

- [ ] Definēt LatNe diagnostikas kodu formātu
- [ ] Definēt kļūdas smagumu
- [ ] Savienot diagnostiku ar source span
- [ ] Rādīt failu, rindu un kolonnu
- [ ] Izveidot pirmos latviskos parsera kļūdu ziņojumus
- [ ] Pievienot diagnostikas fixtures
- [ ] Dokumentēt diagnostikas kontraktu

### Izstrādātāja rīki

- [ ] Source maps
- [ ] Formattera pamats
- [ ] VS Code sintakses izcelšana
- [ ] Editor diagnostics
- [ ] Autocomplete minimums
- [ ] Izvērtēt valodas servera nepieciešamību

### Kvalitāte un drošība

- [ ] Pievienot Windows CI
- [ ] Izveidot `SECURITY.md`
- [ ] Ieviest dependency ievainojamību uzraudzību
- [ ] Dokumentēt kritisko ārējo atkarību robežas

---

## Fāze 3 — dokumentācija un mācīšanās ceļš

### Latviešu dokumentācija

- [ ] Izveidot pirmo Quickstart
- [ ] Izveidot sintakses reference
- [ ] Izveidot CLI reference
- [ ] Izveidot diagnostikas reference
- [ ] Izveidot LatNe API reference
- [ ] Izveidot vairākus pilnus `.lat` piemērus

### Angļu dokumentācija

- [ ] Izveidot projekta tehnisko overview
- [ ] Dokumentēt arhitektūru angliski
- [ ] Dokumentēt compiler modeli angliski
- [ ] Izveidot angļu Contribution Guide
- [ ] Izveidot tehnisko reference starptautiskai auditorijai

Latviešu valoda paliek LatNe primārā produkta pieredze.

Angļu dokumentācija nodrošina projekta saprotamību starptautiskai tehniskajai auditorijai.

---

## Fāze 4 — Education MVP

Mērķis ir pārbaudīt LatNe ne tikai kā tehnisku valodu, bet kā reālu mācību rīku.

- [ ] Izveidot 10–15 minūšu pirmo LatNe programmu
- [ ] Izveidot skolēna darba lapu
- [ ] Izveidot skolotāja rokasgrāmatu
- [ ] Izveidot pirmo uzdevumu komplektu
- [ ] Parādīt pāreju no LatNe terminiem uz universāliem programmēšanas jēdzieniem
- [ ] Izveidot vienkāršu playground
- [ ] Izveidot classroom starter
- [ ] Atrast pirmo pilotlietotāju vai pilotgrupu
- [ ] Savākt strukturētu atgriezenisko saiti
- [ ] Pēc pilota koriģēt mācību materiālus un produkta robežu

---

## Fāze 5 — web un plašāka izstrādes vide

Web slāni sākt tikai tad, kad valodas kodols ir reāli lietojams ārpus projekta autora darba vides.

Pirms šīs fāzes jābūt izpildītam:

- [ ] darbojas `latne palaist`
- [ ] darbojas diagnostikas minimums
- [ ] ir publisks Quickstart
- [ ] ir vairāki reāli `.lat` piemēri
- [ ] ir vismaz pirmā ārējā lietošanas pieredze

Pēc šo priekšnosacījumu sasniegšanas:

- [ ] definēt LatNe web slāņa robežas
- [ ] definēt pirmo lietotnes modeli
- [ ] saglabāt valodas kodolu neatkarīgu no web implementācijas
- [ ] izveidot pirmo web PoC
- [ ] izvērtēt pilna cikla LatNe izstrādes vides nākamo posmu

---

## Publiskās ceļa kartes princips

Ceļa karte rāda to, ko projekts reāli plāno piegādāt.

Tajā netiek publicētas neapstiprinātas biznesa hipotēzes, partneru sarunas, finansējuma taktika vai citas stratēģiskas idejas, kas nav nepieciešamas LatNe publiskās tehniskās attīstības izpratnei.
