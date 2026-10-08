# LatNe tehniskais žurnāls

Šis ir detalizētais, hronoloģiskais darba žurnāls.

## Ieraksta princips

Katram būtiskam darba blokam saglabā:
- mērķi;
- sākuma stāvokli;
- izpildītās darbības;
- izmantotās komandas;
- rezultātu;
- kļūdas;
- novērojumus;
- pieņemtos lēmumus;
- commit / branch / versiju;
- nākamo soli.

---

## 2026-09-30 — J0001 — Repozitorija sēkla un dokumentācijas sistēma

**Tips:** pamata infrastruktūra
**Statuss:** sākts

### Mērķis

Radīt pirmo LatNe repozitorija struktūru un nodrošināt, ka projekta vēsture tiek dokumentēta jau no pirmās dienas.

### Sākuma stāvoklis

Repozitorijs vēl nepastāv. Ir fiksēta LatNe identitāte, `.lat` paplašinājums, MIT licence un manifesta sākotnējā versija.

### Darbības

- Izveidota monorepo pamata struktūra.
- Izveidota dokumentācijas hierarhija.
- Izveidots hronikas fails.
- Izveidots tehniskais žurnāls.
- Izveidota ADR sistēma arhitektūras lēmumiem.
- Izveidots kļūdu un atklājumu reģistrs.
- Izveidoti dokumentācijas šabloni.
- Sagatavoti tukši valodas/compiler/CLI pakotņu pamati.
- Terminoloģijas reģistrs sākas tukšs: neviens latviskais atslēgvārds vēl netiek uzskatīts par apstiprinātu.

### Apzināti vēl nav darīts

- Nav ieviests leksiskais analizators.
- Nav ieviests sintaktiskais analizators.
- Nav fiksēta pirmā atslēgvārdu kopa.
- Nav radīts izpildāms `.lat` kods.
- Nav sākts web slānis.

### Rezultāts

LatNe projektam ir reproducējams sākuma punkts, kura centrā ir dokumentācija un izsekojamība.

### Nākamais solis

Inicializēt Git repozitoriju un izveidot vēsturisko pirmo commit.

---

## 2026-09-30 — J0002 — Pirmās repozitorija inicializācijas audits

**Tips:** bootstrap / kvalitāte
**Statuss:** pabeigts

### Konteksts

LatNe pirmā repozitorija inicializācija tika veikta ar `START-LATNE.ps1`.

Pirmais vēsturiskais commit:

`9fd9c18 chore: conceive LatNe project`

### Kas izdevās

- Git repozitorijs tika inicializēts.
- Noklusējuma zars tika nosaukts `main`.
- Visi sākotnējie projekta faili tika pievienoti Git.
- Tika izveidots LatNe pirmais vēsturiskais commit.
- Pēc inicializācijas darba koks bija tīrs.

### Atklātās problēmas

1. `START-LATNE.ps1` sākumā bija nejaušs `\` simbols.

   Windows PowerShell to mēģināja izpildīt kā komandu un izvadīja
   `CommandNotFoundException`.

   Tā kā kļūda radās pirms `$ErrorActionPreference = "Stop"`,
   pārējais skripts turpināja darbu.

2. `git diff --cached --check` atrada trailing whitespace vairākos failos.

   Windows PowerShell 5.1 automātiski nepārvērta Git nenulles exit code
   par PowerShell terminating error, tāpēc bootstrap turpinājās.

3. Git izvadīja LF → CRLF brīdinājumus.

   Projekta sākotnējie faili bija LF formātā, bet Windows Git konfigurācija
   paredzēja darba kopijas līniju beigu pārveidošanu.

4. `LatNe_Seed_2026-09-30.zip` nejauši tika iekļauts pirmajā commit.

   Arhīvs ir transporta artefakts, nevis repozitorija avota sastāvdaļa.

### Lēmumi

- Pirmo commit `9fd9c18` nepārrakstīt.
- Saglabāt kļūdas kā daļu no LatNe faktiskās vēstures.
- Bootstrap skriptā turpmāk eksplicīti pārbaudīt `$LASTEXITCODE`.
- Repozitorijā ieviest `.gitattributes`.
- Teksta failiem izmantot LF kā kanonisko līniju beigu formātu.
- Izņemt sākuma ZIP arhīvu no repozitorija.
- `git diff --check` kļūdas uzskatīt par bloķējošām.

### Mācība

LatNe dokumentācijas princips tika pārbaudīts jau pirmajā tehniskajā darbībā:
pat šķietami vienkārša repozitorija inicializācija radīja vairākus reproducējamus
secinājumus par Windows PowerShell, Git exit kodiem un failu normalizāciju.

Šie notikumi netiek slēpti vai pārrakstīti. Tie kļūst par projekta zināšanu bāzi.

### Nākamais solis

Pēc bootstrap sakārtošanas sākt LatNe terminoloģijas inventāru un
Vārdu kalves datu modeļa izveidi.
---

## 2026-09-30 — J0003 — Pirmais valodas terminoloģijas inventārs

**Tips:** valoda / terminoloģija
**Statuss:** pabeigts

### Mērķis

Izveidot pirmo dokumentēto kandidātu kopu LatNe sintakses terminoloģijas pārskatīšanai.

### Sākuma stāvoklis

Terminoloģijas reģistrs bija tukšs.

Nebija apstiprināts neviens latviskais atslēgvārds.

### Avoti

JavaScript kandidāti pārbaudīti pret MDN lexical grammar.

TypeScript kandidāti pārbaudīti pret TypeScript compiler `scanner.ts` keyword karti.

### Darbības

- reģistrēti 84 sintakses kandidāti
- pievienoti JavaScript un TypeScript slāņi
- kandidāti sadalīti pēc veida un jēgas
- katram terminam pievienota avotu izsekojamība
- reģistra shēma pacelta uz versiju 2
- izveidots validācijas skripts
- dokumentētas inventāra robežas
- roadmap sadalīts sintakses un API inventāros

### Svarīgs ierobežojums

Inventārs nav LatNe sintakses specifikācija.

Termina atrašanās reģistrā nenozīmē ka LatNe to pārņems vai tulkos.

### Rezultāts

LatNe pirmo reizi ir strukturēts izejmateriāls valodas dizainam.

Visi 84 kandidāti paliek `pending`.

### Nākamais solis

Izveidot Vārdu kalves MVP un sākt cilvēka vadītu terminu izvēli.
---

## 2026-09-30 — J0004 — Vārdu kalves karkass

**Tips:** tooling / terminoloģija
**Statuss:** pabeigts

### Mērķis

Izveidot pirmo Vārdu kalves projekta struktūru.

### Izveidots

- atsevišķa workspace pakotne
- TypeScript konfigurācija
- HTML ieejas punkts
- sākotnējais UI
- sākotnējais stils
- rīka dokumentācija

### Apzināti vēl nav

- terminoloģijas reģistra lasīšanas
- saglabāšanas
- filtru
- terminu rediģēšanas
- AI ieteikumu

### Rezultāts

LatNe ir pirmais sava izstrādes rīka karkass.

### Nākamais solis

Pieslēgt kanonisko terminoloģijas reģistru tikai lasīšanas režīmā.
---

## 2026-09-30 — J0006 — Pirmais GitHub push

**Tips:** GitHub / tooling
**Statuss:** pabeigts

### Notikumi

Vārdu kalves toolchain tika uzstādīts ar TypeScript un Vite.

Pirmais build atklāja CSS tipu deklarācijas problēmu.

Pēc `vite-env.d.ts` pievienošanas build veiksmīgi pabeidzās.

Terminoloģijas validators pēc toolchain izmaiņām palika zaļš:

- 84 termini
- 84 `pending`

### GitHub

Izveidots publisks repozitorijs:

`QvarcY/LatNe`

`main` pirmo reizi pushots uz GitHub.

Pirmajā push tika saglabāta visa LatNe vēsture no projekta sākuma commit līdz darbojošam Vārdu kalves karkasam.

### Rezultāts

LatNe vairs neeksistē tikai lokālajā datorā.

Projekta vēsture tagad ir saglabāta arī publiskajā Git repozitorijā.

### Nākamais solis

Pieslēgt kanonisko terminoloģijas reģistru Vārdu kalvei tikai lasīšanas režīmā.
---

## 2026-09-30 — J0007 — Vārdu kalve lasa kanonisko reģistru

**Tips:** tooling / terminoloģija
**Statuss:** pabeigts

### Mērķis

Pieslēgt Vārdu kalvei īsto LatNe terminoloģijas reģistru tikai lasīšanas režīmā.

### Izveidots

- tiešs `termini.json` imports
- 84 kandidātu saraksts
- termina detaļu skats
- meklēšana
- metadatu attēlošana
- read-only režīms

### Pārbaude

Production build veiksmīgs.

Terminoloģijas validators:

- 84 termini
- 84 `pending`

UI pārbaudīts pārlūkā ar reāliem reģistra datiem.

### Atklājums

TypeScript sākotnēji neuzskatīja DOM saknes elementu par garantēti pieejamu `render` funkcijā.

Saknes iegūšana pārvietota uz funkciju kas garantē `HTMLDivElement`.

### Rezultāts

Vārdu kalve pirmo reizi reāli izmanto LatNe kanonisko terminoloģijas reģistru.

### Nākamais solis

Pievienot kontrolētu terminu rediģēšanas un saglabāšanas plūsmu.
---

## 2026-09-30 — J0008 — Termina izmaiņu validācijas API

**Tips:** tooling / terminoloģija
**Statuss:** pabeigts

### Mērķis

Pirms Vārdu kalvei dot rakstīšanas tiesības izveidot drošu viena termina izmaiņu validācijas slāni.

### Izveidots

Lokāls Vite API galapunkts:

`POST /api/termini/validate-change`

API lasa kanonisko `termini.json` un pieņem tikai kontrolētus laukus:

- `latvian`
- `status`
- `notes`

Atļautie statusi:

- `pending`
- `approved`
- `rejected`
- `reserved`

### Drošības noteikumi

- termina `id` jāeksistē
- sistēmas laukus nevar mainīt
- statusam jābūt atļautam
- apstiprinātam terminam jābūt latviskajam variantam
- ievades izmērs ir ierobežots
- API šajā posmā neko nesaglabā

Atbildē tiek atgriezts:

`persisted: false`

### Pārbaude

Veikti pieci kontrolēti testi:

- derīga `pending` izmaiņa
- derīgs `approved` kandidāts
- nederīgs statuss
- aizliegta `source` lauka maiņa
- `approved` bez latviskā varianta

Visi testi izturēti.

### Reģistra integritāte

Pirms un pēc API testiem salīdzināts `termini.json` SHA-256.

Hash nemainījās.

Terminoloģijas validators pēc testiem:

- 84 termini
- 84 `pending`

### Rezultāts

Vārdu kalvei tagad ir validācijas robeža starp UI un kanonisko terminoloģijas reģistru.

Rakstīšana reģistrā vēl nav iespējota.

### Nākamais solis

Pievienot drošu saglabāšanas plūsmu ar atomisku faila rakstīšanu un validāciju pirms un pēc saglabāšanas.
---

## 2026-09-30 — J0009 — Pirmais apstiprinātais LatNe termins

**Tips:** terminoloģija / tooling
**Statuss:** pabeigts

### Vārdu kalve

Pievienota praktiska terminu rediģēšanas un saglabāšanas plūsma.

No UI iespējams mainīt:

- latvisko variantu
- statusu
- piezīmes

Saglabāšana notiek kanoniskajā `termini.json`.

### Pirmais lēmums

Pirmais ar Vārdu kalvi reāli apstiprinātais termins:

`class` → `klase`

Statuss:

`approved`

Piezīme:

`apstiprinu tiešu tulkojumu`

### Rezultāts

Terminoloģijas reģistrā:

- 84 termini
- 1 `approved`
- 83 `pending`

Vārdu kalve no pārlūkošanas rīka kļuva par praktisku terminoloģijas darba vidi.

---

## 2026-10-01 — J0010 — Pirmais LatNe tokenizators

**Tips:** valoda / leksiskā analīze
**Statuss:** pabeigts

### Mērķis

Izveidot pirmo LatNe avota koda apstrādes posmu.

### Sākuma stāvoklis

Terminoloģijas reģistrā bija 84 sintakses kandidāti.

Pēc cilvēka vadītas pārskatīšanas visi 84 termini tika apstiprināti.

### Izveidots

- `examples/pamata-paraugs.lat`
- `packages/valoda/src/tokenizer.mjs`
- `packages/valoda/scripts/tokenize-example.mjs`
- Unicode identifikatoru atbalsts
- teksta, skaitļu, operatoru un pieturzīmju leksiskie elementi
- komentāru izlaišana
- LatNe terminu atpazīšana no kanoniskā terminoloģijas reģistra
- tokenā saglabāta termina kanoniskā identitāte

### Pārbaude

Pirmais `.lat` paraugs:

- apstiprināti termini: 84
- leksiskie elementi: 196
- nezināmi simboli: 0

Piemēri:

- `importē` → `import`
- `no` → `from`
- `saskarsme` → `interface`
- `uzskaitījums` → `enum`
- `klase` → `class`

### Rezultāts

LatNe pirmo reizi spēj apstrādāt savu `.lat` avota failu.

Darbojošā ķēde:

`.lat → leksiskie elementi`

Commit:

`ba53d29 feat(valoda): pirmais LatNe tokenizators / first LatNe tokenizer`

### Nākamais solis

Izveidot minimālo sintaktisko analizatoru un pirmo LatNe AST.

Mērķa ķēde:

`.lat → leksiskie elementi → AST`

---

## 2026-10-01 — J0011 — Pirmais LatNe sintaktiskais analizators

**Tips:** valoda / sintaktiskā analīze / AST
**Statuss:** pabeigts

### Mērķis

Izveidot pirmo sintaktiskā analizatora posmu, kas no LatNe leksisko elementu plūsmas izveido strukturētu programmas AST.

### Sākuma stāvoklis

Darbojās pirmā apstrādes ķēde:

`.lat → leksiskie elementi`

Pirmais sintakses paraugs deva:

- 196 leksiskos elementus
- 0 nezināmu simbolu

### Izveidots

- `packages/valoda/src/parser.mjs`
- `packages/valoda/scripts/parse-example.mjs`

Sintaktiskais analizators pirmajā versijā atpazīst:

- importu
- saskarsmi
- uzskaitījumu
- klasi
- darbību
- `export` modifikatoru
- `async` modifikatoru
- darbības atgriezes tipu

### Arhitektūras lēmums

Sintaktiskais analizators nebalstās uz konkrēto latvisko termina tekstu.

Tokenizators katram LatNe terminam saglabā kanonisko `source` identitāti.

Piemēram:

- `importē` → `import`
- `saskarsme` → `interface`
- `uzskaitījums` → `enum`
- `klase` → `class`
- `darbība` → `function`

Sintaktiskais analizators strādā ar šo kanonisko identitāti.

Tas ļauj mainīt LatNe termina rakstību, nepārrakstot sintaktiskā analizatora gramatikas loģiku.

### Pārbaude

Pirmais `.lat` fails:

- leksiskie elementi: 196
- AST mezgli: 5

AST augšējais līmenis:

- `Imports`
- `Saskarsme`
- `Uzskaitījums`
- `Klase`
- `Darbība`

Darbība `ielādēLietotājus` korekti atpazīta kā:

- eksportēta
- asinhrona
- atgriezes tips `objekts[]`

### Ierobežojums

Klases un darbību ķermeņi šajā posmā vēl netiek pilnībā parsēti.

Tie tiek saglabāti kā leksisko elementu kopas.

Tas ir apzināts pirmā sintaktiskā analizatora posma ierobežojums.

### Rezultāts

LatNe pirmo reizi darbojas ķēde:

`.lat → leksiskie elementi → AST`

### Nākamais solis

Paplašināt sintaktisko analizatoru ar pirmajām iekšējām konstrukcijām:

- mainīgo deklarācijām
- nosacījumiem
- cikliem
- atgriešanu
- kļūdu apstrādi

---

## 2026-10-01 — J0012 — Darbības ķermeņa sintaktiskais analizators

**Tips:** valoda / sintaktiskā analīze / AST
**Statuss:** pabeigts

### Mērķis

Paplašināt pirmo LatNe sintaktisko analizatoru tā, lai darbības ķermenis vairs nebūtu tikai leksisko elementu kopa.

### Izveidots

Sintaktiskais analizators strukturēti atpazīst:

- `const`, `let` un `var` deklarācijas
- `if`
- `for`
- `return`
- `continue`
- `break`
- `throw`
- `try`
- `catch`
- `finally`
- `debugger`

LatNe sintaksē tas nozīmē:

- `nemainīgs`
- `lai`
- `mainīgs`
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

### Kam cikls

LatNe konstrukcija:

`kam (nemainīgs ieraksts ar dati)`

tiek atpazīta kā strukturēts cikls:

- deklarācija: `const`
- mainīgais: `ieraksts`
- operators: `of`
- kolekcija: `dati`

### Rezultāts

Darbības `ielādēLietotājus` augšējā līmenī ir viens `Mēģinājums` mezgls.

Tā `mēģini` daļā sintaktiskais analizators atpazīst:

- `nemainīgs dati`
- `lai lietotāji`
- `KamCikls`
- nosacījumu cikla iekšpusē
- `Turpināšana`
- `lai lietotājs`
- izteiksmi `lietotāji.push(...)`
- nosacījumu tukšam rezultātam
- divus atgriešanas ceļus

`ķer` daļā:

- parametrs `kļūda`
- `Metiens`

`beigās` daļā:

- `Atkļūdošana`

### Pašreizējais ierobežojums

Izteiksmes vēl netiek parsētas savā AST.

Tās tiek saglabātas kā leksisko elementu secības teksts.

Piemēri:

`ieraksts . vārds == nekas`

`jauns Lietotājs ( ieraksts . vārds , ieraksts . vecums )`

`lietotāji . push ( lietotājs )`

### Rezultāta ķēde

`.lat → leksiskie elementi → deklarāciju AST → priekšrakstu AST`

### Nākamais solis

Izveidot minimālo izteiksmju sintaktisko analizatoru.

Pirmajā versijā tam jāatpazīst:

- identifikatori
- literāļi
- īpašību piekļuve
- funkciju izsaukumi
- `jauns`
- binārie operatori
- masīvu literāļi

---

## 2026-10-01 — J0013 — Pirmais izteiksmju sintaktiskais analizators

**Tips:** valoda / sintaktiskā analīze / AST
**Statuss:** pabeigts

### Mērķis

Pārvērst līdzšinējās izteiksmju leksisko elementu virknes strukturētos AST mezglos.

### Izveidots

Jauns modulis:

`packages/valoda/src/expression-parser.mjs`

Tas atpazīst:

- identifikatorus
- skaitļus
- tekstu
- veidņu literāļus
- `nekas`
- `patiess`
- `nepatiess`
- `nenoteikts`
- `šis`
- masīvu literāļus
- grupētas izteiksmes
- īpašību piekļuvi
- funkciju izsaukumus
- `gaidi`
- `jauns`
- unāros operatorus
- bināros operatorus

### Operatoru prioritātes

Pirmajā versijā ieviestas prioritātes:

- `||`
- `??`
- `&&`
- `==`, `!=`, `===`, `!==`
- `<`, `<=`, `>`, `>=`
- `+`, `-`
- `*`, `/`, `%`

### Rezultāti

`gaidi lasiDatus("lietotaji.json")`

tiek parsēts kā:

`Gaidīšana`
→ `Izsaukums`
→ `Identifikators`
→ `Teksts`

`ieraksts.vārds == nekas`

tiek parsēts kā:

`BināraIzteiksme`
→ kreisā puse `Īpašība`
→ operators `==`
→ labā puse `Nekas`

`jauns Lietotājs(...)`

tiek parsēts kā `Jauns` ar strukturētiem argumentiem.

`lietotāji.push(lietotājs)`

tiek parsēts kā funkcijas izsaukums uz īpašības piekļuves mezgla.

`[]`

tiek parsēts kā tukšs `Masīvs`.

### Arhitektūra

Izteiksmju sintaktiskais analizators ir atdalīts no galvenā priekšrakstu un deklarāciju sintaktiskā analizatora.

Tas novērš viena monolīta sintaktiskā analizatora faila veidošanos un ļauj izteiksmju gramatiku attīstīt neatkarīgi.

### Pašreizējais ierobežojums

Veidņu literāļi pašlaik tiek saglabāti kā viens `Veidne` mezgls.

Interpolācijas vēl netiek parsētas atsevišķos AST mezglos.

Nav vēl ieviestas visas iespējamās piešķiršanas, loģikas un valodas konstrukcijas.

### Rezultāta ķēde

`.lat → leksiskie elementi → deklarāciju AST → priekšrakstu AST → izteiksmju AST`

### Nākamais solis

Paplašināt sintaktisko analizatoru ar nākamo sintakses kopu un pēc tam sagatavot pirmo koda ģenerēšanas posmu.

---

## 2026-10-01 — J0014 — Darba atsākšanas checkpoint

**Tips:** dokumentācija / arhitektūra / handoff
**Statuss:** pabeigts

### Mērķis

Noslēgt pirmo lielo valodas kodola darba sesiju tā, lai nākamo sesiju varētu sākt tikai no repozitorija un dokumentācijas.

### Stāvoklis pirms checkpoint

Aktīvais zars:

`feature/terminology-core-set`

Pirms dokumentācijas checkpoint pēdējais milestones:

`2cf5ff7 docs: pievienots LatNe API terminoloģijas plāns / add API terminology plan`

GitHub `main` tajā brīdī bija sešus commitus aiz aktīvā zara un nebija novirzījies savā virzienā.

### Valodas stāvoklis

- 84 apstiprināti termini
- 196 leksiskie elementi pirmajā `.lat` paraugā
- 0 nezināmu simbolu
- augšējā līmeņa AST
- priekšrakstu AST
- izteiksmju AST
- atsevišķs expression parser modulis

### Dokumentācijas sakārtošana

Pievienots:

`docs/ATSAKSANA.md`

Aktualizēti:

- `README.md`
- `docs/STATUSS.md`
- `docs/ARHITEKTURA.md`
- `docs/HRONIKA.md`
- `docs/LEMUMI.md`
- `docs/KLUDAS-UN-ATKLAJUMI.md`
- `CHANGELOG.md`

Pievienoti ADR:

- 0004 — sintaktiskais analizators izmanto kanonisko termina identitāti
- 0005 — izteiksmju sintaktiskais analizators ir atsevišķs modulis
- 0006 — API terminoloģija ir atsevišķs semantisks slānis

### Nākamais konkrētais uzdevums

Klases ķermeņa AST v1.

Pirmajā iterācijā strukturēt:

- laukus
- pieejamības modifikatorus
- `nemaināms`
- tipus
- konstruktoru un tā parametrus
- iegūšanu un atgriezes tipu

Konstruktora un iegūšanas ķermeņus vēl drīkst saglabāt kā leksisko elementu kopas.

### Apzināti atlikts

- pilna assignment AST
- pilni klases metožu ķermeņi
- koda ģenerators
- CLI
- pilna standarta API translācija
- plašāks `while` / `switch` pārklājums

### Atsākšana

Jaunā darba sesijā sākt ar:

`docs/ATSAKSANA.md`

---

## 2026-10-01 — J0015 — LatNe GitHub Pages v1

**Tips:** mājaslapa / publiskā identitāte / dokumentācija
**Statuss:** pabeigts

### Mērķis

Izveidot publisku LatNe projekta lapu, kas godīgi parāda gan jau strādājošās valodas daļas, gan ieplānoto turpinājumu.

### Izveidots

GitHub Pages v1:

- tumša LatNe projekta prezentācijas lapa
- reāls `.lat` koda piemērs
- aktīvas kartītes jau strādājošajām iespējām
- pelēkas un neaktīvas kartītes nākotnes iespējām
- valodas apstrādes ķēdes vizualizācija
- LatNe API nākotnes piemērs
- projekta principi
- progress pa ceļa kartes fāzēm
- līdzdarbības sadaļa
- GitHub atbalsta ceļš
- Buy Me a Coffee atbalsta ceļš

### Projekta progress

Lapas progress netiek uzturēts kā manuāli izdomāts procents.

`scripts/generate-site-status.mjs` lasa `ROADMAP.md` un ģenerē:

`site/project-status.json`

Checkpoint brīdī:

- pabeigti uzdevumi: 13
- definēti uzdevumi: 44
- attīstības rādītājs: 30%

Šis procents nozīmē pabeigto daļu no pašreiz definētās ceļa kartes, nevis gala produkta absolūtu gatavību.

### Aktīvais un plānotais

Gatavās projekta daļas lapā ir aktīvas un vizuāli izceltas.

Ieplānotās iespējas ir redzamas, bet apzināti pelēkas un neaktīvas.

Tās tiks aktivizētas tikai tad, kad attiecīgā funkcionalitāte reāli eksistēs projektā.

### Kopiena

Pievienots:

`CONTRIBUTING.md`

Lapa aicina:

- apskatīt repozitoriju
- līdzdarboties
- iesniegt idejas un kļūdas
- sekot projektam GitHub
- finansiāli atbalstīt projekta darbu

GitHub zvaigznes formulējums apzināti veidots neuzbāzīgs un bez pavēles formas.

### Publicēšana

GitHub Pages tiek publicēts no `site/` ar GitHub Actions workflow:

`.github/workflows/pages.yml`

Plānotā publiskā adrese:

`https://qvarcy.github.io/LatNe/`

### Turpmāk

Lapai jāaug kopā ar projektu.

Kad roadmap funkcionalitāte kļūst reāli pieejama, attiecīgā pelēkā sadaļa tiek aktivizēta un saturs atjaunināts.

---

## 2026-10-02 — J0016 — Publiskās ceļa kartes un arhitektūras audits

**Tips:** plānošana / arhitektūra / kvalitāte
**Statuss:** pabeigts

### Mērķis

Pārveidot sākotnējo prototipa ceļa karti par secīgu plānu līdz kvalitatīvam LatNe produktam un sinhronizēt tehnisko dokumentāciju ar šo plānu.

### Sākuma stāvoklis

Pirms audita publiskajā `ROADMAP.md` bija 44 definēti checkbox uzdevumi.

Pabeigti bija 13.

GitHub Pages to rādīja kā 30% no toreiz definētās ceļa kartes.

Valodas kodols jau spēja:

- tokenizēt `.lat`
- veidot deklarāciju AST
- veidot priekšrakstu AST
- veidot izteiksmju AST

### Ceļa kartes audits

Jaunajā ceļa kartē izveidotas fāzes:

- Fāze 0 — identitāte un projekta pamats
- Fāze 0A — reproducējama vide un kvalitātes sliedes
- Fāze 1 — valodas kodols līdz AST v1
- Fāze 1A — LatNe iebūvētā API minimums
- Fāze 1B — pirmā izpildāmā LatNe
- Fāze 2 — diagnostika un izstrādātāja pieredze
- Fāze 3 — dokumentācija un mācīšanās ceļš
- Fāze 4 — Education MVP
- Fāze 5 — web un plašāka izstrādes vide

Pēc audita:

- definēti uzdevumi: 130
- pabeigti uzdevumi: 15
- publiskais progress: 12%

Procents rāda pabeigto daļu no pašreiz definētās ceļa kartes, nevis absolūtu produkta gatavību.

### Kvalitātes sliedes

Pirms nākamās lielās sintaktiskā analizatora paplašināšanas ieplānots:

- Node.js runtime kontrakts
- clean install pārbaude
- GitHub Actions CI
- terminoloģijas pārbaude CI
- tokenizera pārbaude CI
- sintaktiskā analizatora pārbaude CI
- Vārdu kalves check/build CI
- regresijas fixture sistēma

### Arhitektūras lēmums

Pievienots ADR 0007:

`AST v1 ir koda ģeneratora kontrakts`

Tas nosaka, ka koda ģenerēšana nedrīkst balstīties uz sintaktiskā analizatora nejaušām pagaidu struktūrām.

### Dokumentācijas sinhronizācija

Aktualizēti:

- `docs/ATSAKSANA.md`
- `docs/STATUSS.md`
- `docs/ARHITEKTURA.md`
- `docs/LEMUMI.md`
- `docs/HRONIKA.md`
- `docs/ZURNALS.md`
- `CHANGELOG.md`

### Nākamais engineering posms

Fāze 0A:

**reproducējama vide un kvalitātes sliedes.**

Pēc tās:

**Klases ķermeņa AST v1.**

---

## 2026-10-02 — J0017 — GitHub Pages v2 sinhronizācija

**Tips:** mājaslapa / publiskā komunikācija / roadmap
**Statuss:** pabeigts

### Mērķis

Sinhronizēt LatNe publisko projekta lapu ar pārkārtoto ceļa karti un dokumentācijas arhitektūru.

### Izmaiņas

GitHub Pages v2:

- rāda 15 no 130 pašreiz definētajiem ROADMAP uzdevumiem
- rāda 12% pašreizējās ceļa kartes progresu
- atspoguļo visas deviņas publiskās izpildes fāzes
- kā nākamo engineering darbu rāda reproducējamu vidi un kvalitātes sliedes
- klases AST saglabā kā nākamo valodas darbu pēc kvalitātes posma
- atspoguļo AST v1 pirms koda ģenerēšanas
- pievieno "Mācies ar LatNe" virzienu
- pievieno "Būvē ar LatNe" virzienu
- saglabā vizuālu atšķirību starp jau strādājošu un tikai plānotu funkcionalitāti

### Progress

Iepriekšējais Pages v1 attīstības rādītājs bija balstīts uz sākotnējo 44 uzdevumu ceļa karti.

Pages v2 izmanto paplašināto `ROADMAP.md`:

- pabeigti: 15
- definēti: 130
- progress: 12%

Tas nav absolūts produkta gatavības procents.

### Privātās stratēģijas robeža

Publiskajā lapā netiek atklātas neapstiprinātas biznesa, finansējuma, partneru vai tehnoloģiju komercializācijas hipotēzes.

### Nākamais solis

Vizuāli pārbaudīt Pages v2 lokāli.

Pēc apstiprināšanas mergot dokumentācijas zaru uz `main` un publicēt GitHub Pages.

---

## 2026-10-02 — J0018 — Divvalodu Pages un SEO pamats

**Tips:** mājaslapa / SEO / internacionalizācija
**Statuss:** pabeigts

### Mērķis

Padarīt LatNe publisko projekta lapu saprotamu arī angļu valodas auditorijai un izveidot korektu tehniskā SEO pamatu.

### Valodu struktūra

Publiskās adreses:

- latviešu: `https://qvarcy.github.io/LatNe/`
- angļu: `https://qvarcy.github.io/LatNe/en/`

Abām versijām pievienots:

- savs `lang`
- savs canonical URL
- `hreflang="lv"`
- `hreflang="en"`
- `hreflang="x-default"`
- valodu pārslēdzējs

### SEO

Pievienots:

- precizēts `<title>`
- precizēts meta description
- robots meta
- Open Graph metadata
- Twitter metadata
- `SoftwareSourceCode` JSON-LD
- `sitemap.xml`

`robots.txt` netiek pievienots GitHub Pages projekta apakšceļam, jo šādam failam jāatrodas hosta saknē.

### Angļu versija

Angļu lapa tiek ģenerēta no latviešu lapas ar kontrolētu tulkojumu karti:

`scripts/generate-site-en.mjs`

Ģenerators pārbauda tulkojumu avotus, nepieļauj konfliktējošus dublikātus un apstājas, ja angļu lapā paliek acīmredzams netulkots latviešu saturs.

### Publicēšana

Pages workflow pirms publicēšanas ģenerē angļu versiju no aktuālā latviešu avota.

### Nākamais solis

Lokāli vizuāli pārbaudīt abas valodu versijas.

Pēc apstiprināšanas mergot `docs/roadmap-v2` uz `main`.

---

## 2026-10-02 — J0019 — Phase 0A runtime kontrakts un clean install

**Tips:** kvalitāte / runtime / reproducējamība
**Statuss:** pabeigts

### Izveidots

- oficiālā Node.js līnija: 24 LTS
- `package.json` runtime prasība: `>=24 <25`
- pnpm prasība: `12.6.0`
- `.node-version`
- clean install pārbaude ar `--frozen-lockfile`

### Pārbaude

Vide:

- Node.js `v24.18.0`
- pnpm `12.6.0`

Clean install laikā `pnpm-lock.yaml` nemainījās.

Pēc instalācijas veiksmīgi izpildīts:

- Vārdu kalves TypeScript `check`
- Vārdu kalves production `build`

### Rezultāts

Phase 0A pirmie trīs reproducējamās vides uzdevumi ir izpildīti.

### Nākamais solis

Izveidot GitHub Actions `ci.yml` un pieslēgt esošās projekta pārbaudes.

---

## 2026-10-02 — J0020 — Phase 0A Linux CI

**Tips:** kvalitāte / CI
**Statuss:** pabeigts

GitHub Actions Linux CI ir izveidots un veiksmīgi pārbaudīts.

CI pārbauda:

- clean install ar frozen lockfile
- terminoloģijas reģistru
- tokenizeri
- sintaktisko analizatoru
- Vārdu kalves TypeScript check
- Vārdu kalves production build

GitHub Actions run: `37009681073`

Phase 0A progress: `8/10`.

Nākamais solis: regresijas fixture sistēma ar valid, invalid, edge-case un Unicode paraugiem.

---

## 2026-10-02 — J0021 — Phase 0A pabeigta

**Tips:** kvalitāte / regresijas testi
**Statuss:** pabeigts

Izveidota pirmā LatNe regresijas fixture sistēma.

Pārbaudītās grupas:

- `valid`
- `invalid`
- `edge-case`
- `unicode`

Lokāli un GitHub Linux CI veiksmīgi izpildās pilnā kvalitātes ķēde.

Fixture commit:

`4ecdaa2`

GitHub Actions run:

`37012802127`

Phase 0A rezultāts:

`10/10`

Nākamais engineering uzdevums:

**Klases ķermeņa AST v1.**

---

## 2026-10-07 — J0022 — Klases ķermeņa AST v1

**Tips:** sintaktiskā analīze / AST
**Statuss:** pabeigts

Klases `Lietotājs` ķermenis vairs nav tikai neapstrādāta leksisko elementu kopa.

Ieviests:

- strukturēti `KlasesLauks` mezgli
- pieejamības modifikatori
- `nemaināms` stāvoklis
- lauku tipi
- `Konstruktors` mezgls
- konstruktora parametri
- `Iegūšana` mezgls
- iegūšanas atgriezes tips

Kanoniskajā paraugā tiek iegūti:

- 6 klases ķermeņa mezgli
- 4 lauki
- 2 konstruktora parametri
- 1 iegūšana

Konstruktora un iegūšanas ķermeņi šajā checkpointā apzināti vēl palika kā neapstrādātas leksisko elementu kopas.

Checkpoint:

`8195515`

---

## 2026-10-07 — J0023 — Piešķiršanas izteiksmju AST

**Tips:** sintaktiskā analīze / AST / regresijas pārbaudes
**Statuss:** pabeigts

Izteiksmju sintaktiskais analizators papildināts ar strukturētu `PiešķiršanasIzteiksme` mezglu.

Ieviests:

- `=`
- `+=`
- `-=`
- `*=`
- `/=`
- `%=`
- `**=`
- `&&=`
- `||=`
- `??=`
- labējā asociativitāte
- piešķiršanas mērķa validācija
- piešķiršanas parsēšana grupētās izteiksmēs, argumentos un masīvos

Regresijas pārbaudes sedz četras kanoniskā `Lietotājs` konstruktora piešķiršanas, visus atbalstītos piešķiršanas operatorus, `a = b = 1` un nederīgu mērķi `1 = vērtība`.

Pilnā kvalitātes ķēde pēc izmaiņas ir zaļa.

Checkpoint:

`1d73f5d`

Nākamais engineering uzdevums:

**Konstruktora ķermeņa priekšrakstu AST.**

---

## 2026-10-07 — J0024 — Konstruktora ķermeņa priekšrakstu AST

**Tips:** sintaktiskā analīze / AST
**Statuss:** pabeigts

Konstruktora ķermenis savienots ar esošo priekšrakstu analizatora infrastruktūru.

Kanoniskajā `Lietotājs` konstruktorā tagad tiek iegūti četri strukturēti `Izteiksme` priekšraksti, kuru izteiksmes ir `PiešķiršanasIzteiksme` mezgli.

Iepriekšējā piešķiršanas izteiksmju regresijas pārbaude vairs nepārlasa neapstrādātos leksiskos elementus pa rindām, bet pārbauda īsto `Konstruktors.ķermenis` AST ceļu.

Neapstrādātie ķermeņa leksiskie elementi pagaidām saglabāti kā pārejas lauks.

Checkpoint:

`5e5e741`

---

## 2026-10-07 — J0025 — Iegūšanas ķermeņa AST

**Tips:** sintaktiskā analīze / AST
**Statuss:** pabeigts

Iegūšanas ķermenis savienots ar to pašu priekšrakstu analizatora infrastruktūru.

Kanoniskās iegūšanas `apraksts` ķermenis tagad satur vienu strukturētu `Atgriešana` priekšrakstu.

Atgriešanas vērtība šajā posmā paliek `Veidne` mezgls. Veidņu interpolāciju strukturēšana apzināti atlikta uz atsevišķu AST v1 soli.

Neapstrādātie iegūšanas ķermeņa elementi pagaidām saglabāti kā pārejas lauks.

Checkpoint:

`6bf5ace`

---

## 2026-10-07 — J0026 — Minimāls klases metodes AST

**Tips:** sintaktiskā analīze / AST / regresijas pārbaudes
**Statuss:** pabeigts

Klases parserim pievienots pirmais `Metode` mezgls.

Minimālais metodes AST satur:

- nosaukumu
- pieejamību
- tipētus parametrus
- izvēles atgriezes tipu
- strukturētu ķermeni
- pārejas neapstrādātos ķermeņa elementus

Metodes ķermenis izmanto esošo priekšrakstu analizatoru.

Atsevišķs regresijas paraugs pārbauda:

```lat
klase MetodesParaugs {
  atvērts darbība sveic(vārds: teksts): teksts {
    atgriez vārds
  }
}
```

Kanoniskais `examples/pamata-paraugs.lat` netika mainīts, tāpēc tā 196 leksisko elementu un 5 augšējā līmeņa mezglu baseline saglabājas.

Checkpoint:

`91356b6`

Nākamais engineering uzdevums:

**Funkciju parametru AST paplašināšana.**

---

## 2026-10-07 — J0027 — Darbības parametru AST

**Tips:** sintaktiskā analīze / AST / refaktorēšana
**Statuss:** pabeigts

Augšējā līmeņa `Darbība` deklarācijām pievienots strukturēts `parametri` masīvs.

Konstruktors, klases metode un augšējā līmeņa darbība tagad izmanto vienu kopīgu parametru analizatoru un vienotu mezgla formu:

```text
Parametrs
├─ veids
├─ nosaukums
├─ tips
└─ rinda
```

Saglabāts pārejas lauks `parametruLeksiskoElementuSkaits`, bet vecais neviennozīmīgais `parametruLeksiskieElementi` lauks vairs netiek izmantots.

Regresijas pārbaude sedz darbību ar diviem tipētiem parametriem.

Checkpoint:

`fe4ab65`

---

## 2026-10-07 — J0028 — Veidņu interpolāciju AST

**Tips:** leksiskā analīze / sintaktiskā analīze / AST / regresijas pārbaudes
**Statuss:** pabeigts

`veidne` leksiskais elements saglabā vienu ārējo leksisko elementu, bet tagad satur strukturētas daļas.

Izteiksmju AST izmanto:

- `VeidnesTeksts`
- `VeidnesInterpolācija`

Interpolācijas saturs tiek atkārtoti leksiski analizēts ar LatNe terminoloģijas vārdnīcu un nodots pilnajam izteiksmju parserim.

Kanoniskās iegūšanas veidne satur 4 AST daļas un 2 interpolācijas.

Papildu regresijas pārbaudes sedz:

- bināru izteiksmi `${vērtība + 1}`
- escapotu `\${...}` marķieri

Kanoniskais leksiskās analīzes atskaites stāvoklis saglabājas 196 leksiskie elementi.

Checkpoint:

`c617074`

---

## 2026-10-07 — J0029 — LatNe logotips publiskajā identitātē

**Tips:** publiskā identitāte / README / GitHub Pages
**Statuss:** pabeigts

Projektam pievienots jaunais LatNe logotips kā kanonisks publiskais attēls:

`site/assets/latne-logo.png`

Tas tiek izmantots:

- GitHub README augšdaļā
- GitHub Pages hero sadaļā līdzās dzīvajam LatNe koda piemēram

Pages galvenes mazā zīme paliek vienkārša un salasāma mazos izmēros.

Nākamais engineering uzdevums:

**Pirmkoda diapazona informācija AST mezgliem.**

---

## 2026-10-08 — J0030 — Latviešu identifikatoru normalizācijas recovery

**Tips:** sintaktiskā analīze / AST / kvalitāte / tehniskais parāds
**Statuss:** pabeigts

Pirms pirmkoda diapazonu AST darba tika apturēta turpmāka implementācija, jo jaunajam kontraktam bija izmantotas transliterētas formas `sakums` un `nobide`.

Paplašināts audits atklāja, ka tā pati problēma jau pastāv esošajā leksiskās analīzes / sintaktiskās analīzes / AST kodolā.

Audita sākuma rezultāts:

- 327 kritiski lietojumi
- 25 kritiskas transliterētas formas

Normalizēti:

- leksiskā un sintaktiskā analizatora publiskie eksporti
- leksisko elementu publiskie lauki
- AST publiskie lauki
- saistītie iekšējie latviskie identifikatori
- sintakses un regresijas pārbaudes

Piemēri:

```text
izveidoVardnicu  → izveidoVārdnīcu
analizeSintaksi  → analizēSintaksi
vertiba          → vērtība
kermenis         → ķermenis
pieejamiba       → pieejamība
merkis           → mērķis
```

Pievienots pastāvīgs quality gate:

`corepack pnpm run check:identifikatori`

Pēc normalizācijas:

- repo-wide veco publisko transliterēto identifikatoru atlikums: 0
- otrajā neatkarīgajā auditā izlabots arī `mēģinaLeksiskieElementi` un quality-gate skripta paša transliterētie iekšējie identifikatori
- identifikatoru guards pārbauda arī pats savu izpildāmo kodu
- terminoloģija: 84/84 approved
- kanoniskais leksiskās analīzes atskaites stāvoklis: 196
- nezināmi leksiskie elementi: 0
- augšējā līmeņa AST mezgli: 5
- klases ķermeņa mezgli: 6
- veidnes daļas: 4
- veidnes interpolācijas: 2
- regresijas paraugi: 4/4 atbilstoši gaidītajam
- Vārdu kalves TypeScript check un production build: zaļš

Nākamais engineering uzdevums paliek:

**Pirmkoda diapazona informācija AST mezgliem**, izmantojot pareizu latviešu rakstību, tostarp `sākums` un `nobīde`.

---

## 2026-10-08 — J0031 — Pirmkoda diapazonu AST bāze

**Tips:** leksiskā analīze / sintaktiskā analīze / AST / diagnostikas pamats
**Statuss:** pabeigts

Definēts vienots pirmkoda diapazona kontrakts:

```text
diapazons
├─ sākums { rinda, kolonna, nobīde }
└─ beigas { rinda, kolonna, nobīde }
```

Semantika:

- pusatvērts intervāls `[sākums, beigas)`
- `rinda` un `kolonna` ir 1-bāzētas
- `nobīde` ir 0-bāzēta JavaScript virknes pozīcija
- esošais `rinda` lauks pārejas laikā netiek noņemts

Pievienots kopīgs palīgs:

`packages/valoda/src/pirmkoda-diapazons.mjs`

Leksiskais analizators tagad saglabā diapazonu katram leksiskajam elementam. Veidņu interpolāciju iekšējie leksiskie elementi tiek pārbīdīti uz absolūtajām avota pozīcijām.

Pirmā reprezentatīvā AST iterācija:

- `Identifikators`
- `Parametrs`
- `Atgriešana`

Regresijas pārbaudes nostiprina:

- viena leksiskā elementa pusatvērto diapazonu
- vairāku leksisko elementu `Parametrs` diapazonu
- `Atgriešana` diapazonu no atslēgvārda līdz izteiksmes beigām
- veidnes interpolācijas absolūto `nobīde`

ROADMAP pirmkoda diapazonu uzdevums vēl nav atzīmēts kā pabeigts. Nākamais apakšsolis ir pārklājuma paplašināšana uz saliktām izteiksmēm, deklarācijām un klases mezgliem.

---

## 2026-10-08 — J0032 — Salikto izteiksmju pirmkoda diapazoni

**Tips:** sintaktiskā analīze / AST / diagnostikas pamats
**Statuss:** pabeigts

Pirmkoda diapazonu kontrakts paplašināts uz četriem salikto izteiksmju mezgliem:

- `Īpašība`
- `Izsaukums`
- `BināraIzteiksme`
- `PiešķiršanasIzteiksme`

Diapazoni sedz visu konkrētās konstrukcijas avota fragmentu:

- īpašības piekļuve — no objekta sākuma līdz īpašības nosaukuma beigām
- izsaukums — līdz aizverošajai `)`
- binārā izteiksme — no kreisās puses sākuma līdz labās puses beigām
- piešķiršana — no mērķa sākuma līdz pilnas vērtības beigām

Sintaktiskais analizators robežas veido no patērētajiem leksiskajiem elementiem, nevis pieprasa, lai visiem bērnu mezgliem jau būtu diapazons. Tas ļauj diapazonu pārklājumu paplašināt pakāpeniski.

Regresijas pārbaudes sedz atsevišķu īpašības piekļuvi, izsaukumu ar argumentiem, bināru izteiksmi un piešķiršanu, kuras labā puse pati ir bināra izteiksme.

Nākamais apakšsolis:

**augšējā līmeņa deklarāciju un klases AST mezglu diapazoni**.

---

## 2026-10-08 — J0033 — Augšējā līmeņa deklarāciju pirmkoda diapazoni

**Tips:** sintaktiskā analīze / AST / diagnostikas pamats
**Statuss:** pabeigts

Pirmkoda diapazonu kontrakts paplašināts uz visām piecām pašreiz atbalstītajām augšējā līmeņa deklarācijām:

- `Imports`
- `Saskarsme`
- `Uzskaitījums`
- `Klase`
- `Darbība`

Robežas:

- `Imports` sākas pie `importē` un beidzas aiz avota teksta literāļa
- `Saskarsme`, `Uzskaitījums` un `Klase` beidzas aiz aizverošās `}`
- `Darbība` beidzas aiz darbības ķermeņa aizverošās `}`
- `Klase` un `Darbība` sākas pie pirmā modifikatora, ja deklarācijai ir `eksportē` vai `asinhroni`

Esošais `rinda` lauks nav mainīts. Tas turpina norādīt pašas deklarācijas atslēgvārda rindu, kamēr `diapazons.sākums` apraksta pilnu deklarāciju kopā ar modifikatoriem.

Kanoniskais `examples/pamata-paraugs.lat` regresijas tests pārbauda visu piecu deklarāciju avota robežas pret faktisko parauga tekstu.

ROADMAP pirmkoda diapazonu uzdevums vēl paliek atvērts.

Nākamais apakšsolis:

**klases iekšējo AST mezglu diapazoni**.

---

## 2026-10-08 — J0034 — Terminoloģijas recovery #2

**Tips:** AST / terminoloģija / kvalitāte
**Statuss:** pabeigts

Pirms klases iekšējo mezglu pirmkoda diapazonu darba iztīrīti divi LatNe-owned anglicismi.

Kanoniskās pārejas:

```text
Getteris  → Iegūšana
getteri   → iegūšanas
raw       → pieraksts
```

LatNe sintakses termins `ņem` nemainās.

`pieraksts` glabā sākotnējo literāļa vai veidnes pirmkoda pierakstu, piemēram, `1_000` vai pilnu veidnes tekstu.

Neapstrādāti ķermeņa leksiskie elementi dokumentācijā turpmāk tiek saukti tieši par neapstrādātiem leksiskajiem elementiem, nevis `raw`.

Identifikatoru kvalitātes pārbaude tagad aiztur arī `getter` un `raw` atgriešanos LatNe kodolā un testos.

Terminoloģijas politikā nostiprināts princips: ja jēdzienu precīzi var nosaukt ar vienu skaidru latviešu vārdu, tam dod priekšroku pār mākslīgi veidotu salikteni.

Nākamais engineering solis:

**klases iekšējo AST mezglu pirmkoda diapazoni**.

