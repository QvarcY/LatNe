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
