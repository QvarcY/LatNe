# LatNe

**Programmē latviski.**

LatNe ir neatkarīga atvērtā pirmkoda programmēšanas valoda un topošā izstrādes vide, kur latviešu valoda nav tikai dokumentācijas slānis — tā ir pašas programmēšanas pieredzes daļa.

LatNe tiek veidota kā patstāvīga sistēma ar savu terminoloģiju, parseri, AST, diagnostiku un izstrādes rīkiem.

> Projekts ir aktīvā izstrādē. LatNe vēl nav gatava gala lietošanai, bet valodas kodols jau reāli apstrādā `.lat` avota kodu.

[Projekta lapa](https://qvarcy.github.io/LatNe/) ·
[Ceļa karte](ROADMAP.md) ·
[Pašreizējais statuss](docs/STATUSS.md) ·
[Līdzdarboties](CONTRIBUTING.md)

---

## Kas jau darbojas

Pašreizējā LatNe ķēde:

```text
.lat avots
↓
terminoloģijas reģistrs
↓
Unicode tokenizeris
↓
deklarāciju parseris
↓
statement parseris
↓
izteiksmju parseris
↓
strukturēts AST
```

Šobrīd projektā jau ir:

- 84 cilvēka vadīti un apstiprināti LatNe termini;
- kanonisks terminoloģijas reģistrs;
- Vārdu kalve terminoloģijas pārvaldībai;
- Unicode tokenizeris;
- augšējā līmeņa deklarāciju parseris;
- darbību ķermeņu statement parseris;
- atsevišķs izteiksmju parseris;
- pirmie strukturētie AST mezgli;
- publiska arhitektūras un ADR sistēma;
- reproducējams projekta attīstības žurnāls un hronika.

Pirmais pilnais `.lat` paraugs pašlaik tiek tokenizēts kā:

```text
196 tokeni
0 nezināmu simbolu
5 augšējā līmeņa AST mezgli
```

---

## Kā izskatās LatNe

```lat
eksportē asinhroni darbība ielādēLietotājus(): objekts[] {
  mēģini {
    nemainīgs dati = gaidi lasiDatus("lietotaji.json")
    lai lietotāji: objekts[] = []

    kam (nemainīgs ieraksts ar dati) {
      ja (ieraksts.vārds == nekas) {
        turpini
      }

      lai lietotājs = jauns Lietotājs(
        ieraksts.vārds,
        ieraksts.vecums
      )

      lietotāji.push(lietotājs)
    }

    atgriez lietotāji
  }
  ķer (kļūda) {
    met jauns Kļūda(`Neizdevās ielādēt lietotājus: ${kļūda}`)
  }
}
```

`push` un citi ārējā runtime API nosaukumi šobrīd vēl ir zināmi pārejas elementi.

LatNe standarta API slānis tiks veidots semantiski — nevis ar aklu teksta aizvietošanu.

---

## Pašreizējais darbs

Pirms nākamās lielās parsera paplašināšanas LatNe nostiprina projekta kvalitātes pamatu.

Aktīvā nākamā fāze:

**0A — reproducējama vide un kvalitātes sliedes**

Tajā ietilpst:

- oficiāla Node.js runtime prasība;
- clean install pārbaude;
- GitHub Actions CI;
- terminoloģijas, tokenizera un parsera pārbaudes CI;
- Vārdu kalves check/build;
- pirmā regresijas fixture sistēma.

Pēc šī īsā infrastruktūras posma nākamais valodas darbs ir:

**Klases ķermeņa AST v1.**

---

## Galvenais tuvākais mērķis

Panākt pirmo pilno LatNe programmas izpildes ķēdi:

```text
.lat
↓
tokenizeris
↓
parseris
↓
AST v1
↓
semantiskās transformācijas
↓
koda ģenerators
↓
JavaScript starprezultāts
↓
izpilde
↓
LatNe CLI
```

Mērķa komanda:

```text
latne palaist sveika.lat
```

Brīdis, kad pirmā `.lat` programma tiks palaista caur šo ķēdi, būs viens no galvenajiem LatNe projekta milestone.

---

## AST nav tikai starprezultāts

LatNe AST tiek veidots kā dokumentēts kontrakts starp parseri un nākamajiem kompilācijas posmiem.

Pirms nopietnas koda ģenerēšanas tiks stabilizēts **AST v1**, kas definēs:

- mezglu tipus;
- obligātos un izvēles laukus;
- source spans;
- kanoniskās identitātes robežas;
- strukturēta AST un pagaidu raw tokenu robežu.

Skatīt:

[`ADR 0007 — AST v1 ir koda ģeneratora kontrakts`](docs/adr/0007-ast-v1-ir-codegen-kontrakts.md)

---

## LatNe API

Latviska programmēšanas pieredze nebeidzas pie atslēgvārdiem.

Piemēram, pašreizējā paraugā vēl sastopami:

```text
Array.push
Array.length
```

Pirmie izskatāmie LatNe API kandidāti ir:

```text
pievieno
garums
```

Tie netiks ieviesti ar globālu string replacement.

API terminam jābūt sasaistītam ar konkrētu tipu un semantisku operāciju.

---

## Mācies ar LatNe

LatNe ilgtermiņa mērķis ir padarīt programmēšanas pamatjēdzienus pieejamākus arī cilvēkiem, kuri tos pirmo reizi apgūst latviešu valodā.

Plānotais mācību virziens ietver:

- īsu pirmās programmas ceļu;
- skolēnu uzdevumus;
- skolotāja materiālus;
- publisku playground;
- sasaisti starp LatNe terminiem un universāliem programmēšanas jēdzieniem.

**Šis vēl nav gatavs produkts.**

Education MVP tiks sākts pēc tam, kad valodas kodols, CLI un dokumentācijas minimums būs reāli lietojams.

---

## Būvē ar LatNe

LatNe ir arī atvērts tehnisks projekts cilvēkiem, kurus interesē:

- programmēšanas valodu izstrāde;
- parseri un AST;
- compiler arhitektūra;
- Unicode;
- programmēšanas terminoloģija;
- developer tooling;
- diagnostika;
- valodu tehnoloģijas.

Projekta arhitektūras mērķis ir saglabāt skaidras robežas starp terminoloģiju, parseri, semantiku, codegen un izstrādes rīkiem.

Skatīt:

[`docs/ARHITEKTURA.md`](docs/ARHITEKTURA.md)

---

## Projekta ceļa karte

Aktuālais publiskais plāns:

[`ROADMAP.md`](ROADMAP.md)

Tas ir sakārtots faktiskā izpildes secībā:

```text
projekta pamats
↓
kvalitātes sliedes
↓
AST v1
↓
LatNe API minimums
↓
pirmā .lat izpilde
↓
CLI un diagnostika
↓
developer experience
↓
bilingvāla dokumentācija
↓
Education MVP
↓
web un plašāka izstrādes vide
```

Publiskais progresa procents tiek rēķināts no pašreiz definētajiem `ROADMAP.md` uzdevumiem.

Paplašinoties projekta izpratnei, kopējais uzdevumu skaits var mainīties.

Tas nav absolūts “LatNe ir gatava X%” vērtējums.

---

## Projekta principi

### Latvian-first

Latviešu valoda ir projekta sākumpunkts, nevis vēlāk pievienots tulkojums.

### Neatkarīga sistēma

Ārējas bibliotēkas un runtime komponentes drīkst būt tehniski būvbloki, bet tās nenosaka LatNe identitāti vai publisko arhitektūru.

### Semantika pirms teksta aizvietošanas

LatNe nav veidota kā masveida JavaScript atslēgvārdu pārtulkošana.

Terminoloģija, parseris un nākotnes API tiek modelēti strukturēti.

### Dokumentēta evolūcija

Būtiski lēmumi, kļūdas, atklājumi un pagriezieni tiek saglabāti kopā ar kodu.

---

## Dokumentācija

Sāc šeit:

[`docs/ATSAKSANA.md`](docs/ATSAKSANA.md)

Galvenie dokumenti:

- [`docs/STATUSS.md`](docs/STATUSS.md) — faktiskais tehniskais stāvoklis;
- [`ROADMAP.md`](ROADMAP.md) — publiskā izpildes secība;
- [`docs/ARHITEKTURA.md`](docs/ARHITEKTURA.md) — valodas arhitektūra;
- [`docs/LEMUMI.md`](docs/LEMUMI.md) — ADR indekss;
- [`docs/HRONIKA.md`](docs/HRONIKA.md) — cilvēkam lasāmais projekta stāsts;
- [`docs/ZURNALS.md`](docs/ZURNALS.md) — detalizētais tehniskais žurnāls;
- [`docs/KLUDAS-UN-ATKLAJUMI.md`](docs/KLUDAS-UN-ATKLAJUMI.md) — kļūdas un mācības;
- [`CHANGELOG.md`](CHANGELOG.md) — izmaiņu robežas.

---

## Līdzdarboties

LatNe vēl ir agrīnā stadijā, tāpēc vērtīgs ir ne tikai kods.

Noder:

- parsera un compiler ieguldījumi;
- testi un fixtures;
- dokumentācija;
- terminoloģijas argumenti;
- piemēri;
- kļūdu apraksti;
- arhitektūras diskusijas.

Darba principi un pirmie soļi:

[`CONTRIBUTING.md`](CONTRIBUTING.md)

GitHub Issues:

[github.com/QvarcY/LatNe/issues](https://github.com/QvarcY/LatNe/issues)

---

## Atbalsts

Ja LatNe šķiet interesants, projektu vari atzīmēt GitHub un sekot tā attīstībai.

Finansiāli projekta izstrādes laiku iespējams atbalstīt arī šeit:

[Buy Me a Coffee](https://buymeacoffee.com/craftin)

---

## Projekta identitāte

| | |
|---|---|
| Nosaukums | **LatNe** |
| Avota faili | **`.lat`** |
| CLI | **`latne`** |
| Licence | **MIT** |
| Ieņemšanas datums | **2026-09-30** |
| Projekta lapa | **https://qvarcy.github.io/LatNe/** |
| GitHub | **QvarcY/LatNe** |

---

**Programmē latviski.**
