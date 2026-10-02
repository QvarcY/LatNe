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

- Nav implementēts tokenizeris.
- Nav implementēts parseris.
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

Pirmajā push tika saglabāta visa LatNe vēsture no ieņemšanas commit līdz darbojošam Vārdu kalves karkasam.

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

**Tips:** valoda / tokenizeris
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
- teksta, skaitļu, operatoru un pieturzīmju tokeni
- komentāru izlaišana
- LatNe terminu atpazīšana no kanoniskā terminoloģijas reģistra
- tokenā saglabāta termina kanoniskā identitāte

### Pārbaude

Pirmais `.lat` paraugs:

- apstiprināti termini: 84
- tokeni: 196
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

`.lat → tokeni`

Commit:

`ba53d29 feat(valoda): pirmais LatNe tokenizators / first LatNe tokenizer`

### Nākamais solis

Izveidot minimālo parseri un pirmo LatNe AST.

Mērķa ķēde:

`.lat → tokeni → AST`

---

## 2026-10-01 — J0011 — Pirmais LatNe parseris

**Tips:** valoda / parseris / AST
**Statuss:** pabeigts

### Mērķis

Izveidot pirmo parsera posmu, kas no LatNe tokenu plūsmas izveido strukturētu programmas AST.

### Sākuma stāvoklis

Darbojās pirmā apstrādes ķēde:

`.lat → tokeni`

Pirmais sintakses paraugs deva:

- 196 tokenus
- 0 nezināmu simbolu

### Izveidots

- `packages/valoda/src/parser.mjs`
- `packages/valoda/scripts/parse-example.mjs`

Parseris pirmajā versijā atpazīst:

- importu
- saskarsmi
- uzskaitījumu
- klasi
- darbību
- `export` modifikatoru
- `async` modifikatoru
- darbības atgriezes tipu

### Arhitektūras lēmums

Parseris nebalstās uz konkrēto latvisko termina tekstu.

Tokenizators katram LatNe terminam saglabā kanonisko `source` identitāti.

Piemēram:

- `importē` → `import`
- `saskarsme` → `interface`
- `uzskaitījums` → `enum`
- `klase` → `class`
- `darbība` → `function`

Parseris strādā ar šo kanonisko identitāti.

Tas ļauj mainīt LatNe termina rakstību, nepārrakstot parsera gramatikas loģiku.

### Pārbaude

Pirmais `.lat` fails:

- tokeni: 196
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

Tie tiek saglabāti kā tokenu kopas.

Tas ir apzināts pirmā parsera posma ierobežojums.

### Rezultāts

LatNe pirmo reizi darbojas ķēde:

`.lat → tokeni → AST`

### Nākamais solis

Paplašināt parseri ar pirmajām iekšējām konstrukcijām:

- mainīgo deklarācijām
- nosacījumiem
- cikliem
- atgriešanu
- kļūdu apstrādi

---

## 2026-10-01 — J0012 — Darbības ķermeņa parseris

**Tips:** valoda / parseris / AST
**Statuss:** pabeigts

### Mērķis

Paplašināt pirmo LatNe parseri tā, lai darbības ķermenis vairs nebūtu tikai tokenu kopa.

### Izveidots

Parseris strukturēti atpazīst:

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

Tā `mēģini` daļā parseris atpazīst:

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

Tās tiek saglabātas kā tokenu secības teksts.

Piemēri:

`ieraksts . vārds == nekas`

`jauns Lietotājs ( ieraksts . vārds , ieraksts . vecums )`

`lietotāji . push ( lietotājs )`

### Rezultāta ķēde

`.lat → tokeni → deklarāciju AST → statement AST`

### Nākamais solis

Izveidot minimālo izteiksmju parseri.

Pirmajā versijā tam jāatpazīst:

- identifikatori
- literāļi
- īpašību piekļuve
- funkciju izsaukumi
- `jauns`
- binārie operatori
- masīvu literāļi

---

## 2026-10-01 — J0013 — Pirmais izteiksmju parseris

**Tips:** valoda / parseris / AST
**Statuss:** pabeigts

### Mērķis

Pārvērst līdzšinējās izteiksmju tokenu virknes strukturētos AST mezglos.

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

Izteiksmju parseris ir atdalīts no galvenā statement un deklarāciju parsera.

Tas novērš viena monolīta parsera faila veidošanos un ļauj izteiksmju gramatiku attīstīt neatkarīgi.

### Pašreizējais ierobežojums

Veidņu literāļi pašlaik tiek saglabāti kā viens `Veidne` mezgls.

Interpolācijas vēl netiek parsētas atsevišķos AST mezglos.

Nav vēl ieviestas visas iespējamās piešķiršanas, loģikas un valodas konstrukcijas.

### Rezultāta ķēde

`.lat → tokeni → deklarāciju AST → statement AST → izteiksmju AST`

### Nākamais solis

Paplašināt parseri ar nākamo sintakses kopu un pēc tam sagatavot pirmo koda ģenerēšanas posmu.

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
- 196 tokeni pirmajā `.lat` paraugā
- 0 nezināmu simbolu
- augšējā līmeņa AST
- statement AST
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

- 0004 — parseris izmanto kanonisko termina identitāti
- 0005 — izteiksmju parseris ir atsevišķs modulis
- 0006 — API terminoloģija ir atsevišķs semantisks slānis

### Nākamais konkrētais uzdevums

Klases ķermeņa AST v1.

Pirmajā iterācijā strukturēt:

- laukus
- pieejamības modifikatorus
- `nemaināms`
- tipus
- konstruktoru un tā parametrus
- getteri un atgriezes tipu

Konstruktora un gettera ķermeņus vēl drīkst saglabāt kā tokenu kopas.

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
- veidot statement AST
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

Pirms nākamās lielās parsera paplašināšanas ieplānots:

- Node.js runtime kontrakts
- clean install pārbaude
- GitHub Actions CI
- terminoloģijas pārbaude CI
- tokenizera pārbaude CI
- parsera pārbaude CI
- Vārdu kalves check/build CI
- regresijas fixture sistēma

### Arhitektūras lēmums

Pievienots ADR 0007:

`AST v1 ir koda ģeneratora kontrakts`

Tas nosaka, ka codegen nedrīkst balstīties uz parsera nejaušām pagaidu struktūrām.

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
- atspoguļo AST v1 pirms codegen
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
