# LatNe arhitektūra

**Atjaunots:** 2026-10-02

LatNe tiek projektēta kā neatkarīga sistēma.

Ārējas bibliotēkas un izpildvides komponentes tiek izmantotas kā tehniski būvbloki, nevis kā projekta arhitektūras vai identitātes pamats.

## Valodas kodola ķēde

Pašreizējā realizētā ķēde:

```text
.lat avots
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
AST
```

Plānotā pilnā ķēde:

```text
.lat avots
   ↓
terminoloģijas reģistrs
   ↓
leksiskais analizators
   ↓
sintaktiskie analizatori
   ↓
AST v1
   ↓
semantiskās transformācijas
   ↓
koda ģenerators
   ↓
JavaScript starprezultāts
   ↓
izpildvide / izpilde
   ↓
CLI
```

## Terminoloģijas slānis

Kanoniskais terminoloģijas avots:

`packages/valoda/data/termini.json`

Kompilators nebalstās uz nejauši iekodētiem latviskajiem atslēgvārdiem.

Leksiskais analizators atpazītam terminam saglabā arī kanonisko avota identitāti.

Piemēram:

```text
klase   → class
darbība → function
kam     → for
gaidi   → await
```

Sintaktiskais analizators gramatikas lēmumus pieņem pēc šīs kanoniskās identitātes.

Tas ļauj terminoloģiju attīstīt, nepārrakstot visu sintaktiskā analizatora loģiku.

## Leksiskais analizators

Fails:

`packages/valoda/src/leksiskais-analizators.mjs`

Atbild par:

- Unicode identifikatoriem
- apstiprināto LatNe terminu atpazīšanu
- tekstiem
- veidnēm
- skaitļiem
- operatoriem
- pieturzīmēm
- komentāru izlaišanu
- rindas un kolonnas saglabāšanu

## Deklarāciju un priekšrakstu sintaktiskais analizators

Fails:

`packages/valoda/src/sintaktiskais-analizators.mjs`

Atbild par:

- programmas augšējā līmeņa konstrukcijām
- darbību ķermeņu konstrukcijām
- vadības plūsmu
- kļūdu apstrādes blokiem

Izteiksmju gramatika netiek turēta šajā pašā modulī.

## Izteiksmju sintaktiskais analizators

Fails:

`packages/valoda/src/izteiksmju-sintaktiskais-analizators.mjs`

Atbild par:

- literāļiem
- identifikatoriem
- īpašību piekļuvi
- funkciju izsaukumiem
- `gaidi`
- `jauns`
- masīviem
- unāriem operatoriem
- bināriem operatoriem
- operatoru prioritātēm

Tas ir apzināti atdalīts no priekšrakstu sintaktiskā analizatora, lai sintaktiskais analizators nekļūtu par vienu monolītu failu.

## AST kā publisks iekšējais kontrakts

AST nav tikai sintaktiskā analizatora pagaidu rezultāts.

Pirms nopietnas koda ģenerēšanas tiek stabilizēts AST v1 kontrakts.

AST v1 definē:

- stabilus mezglu tipus
- obligātos laukus
- izvēles laukus
- pirmkoda diapazona informāciju
- kanonisko termina identitāti, kur tā nepieciešama
- robežu starp strukturētu AST un pagaidu raw tokeniem

Koda ģeneratoram jāstrādā ar dokumentētu AST kontraktu, nevis sintaktiskā analizatora nejaušām iekšējām detaļām.

Skatīt ADR 0007.

## Pirmkoda diapazoni un diagnostika

Avota pozīcija tiek uzskatīta par arhitektūras sastāvdaļu.

Tā nepieciešama:

- latviskai diagnostikai
- faila, rindas un kolonnas norādei
- pirmkoda kartes
- redaktoru rīki
- kļūdas sasaistīšanai ar oriģinālo `.lat` failu

Diagnostikas sistēma tiks veidota virs strukturētas pirmkoda diapazona informācijas, nevis tikai teksta kļūdu ziņojumiem.

AST v1 diapazona minimālais kontrakts:

```text
diapazons
├─ sākums
│  ├─ rinda
│  ├─ kolonna
│  └─ nobīde
└─ beigas
   ├─ rinda
   ├─ kolonna
   └─ nobīde
```

Semantika:

- diapazons ir pusatvērts: `[sākums, beigas)`
- `rinda` un `kolonna` ir 1-bāzētas
- `nobīde` ir 0-bāzēta JavaScript virknes pozīcija
- esošais mezgla `rinda` lauks pārejas laikā tiek saglabāts
- diapazons tiek veidots no leksisko elementu diapazoniem ar kopīgu `izveidoDiapazonu` palīgfunkciju

Pirmā reprezentatīvā iterācija pārklāj:

- `Identifikators` — viena leksiskā elementa izteiksmes mezglu
- `Parametrs` — vairāku leksisko elementu strukturētu mezglu
- `Atgriešana` — priekšrakstu no atslēgvārda līdz izteiksmes beigām

Šī ir pamata infrastruktūra, ne pilns AST v1 diapazonu pārklājums.

## Klases slānis

Klase pašlaik tiek atpazīta augšējā līmenī, bet tās ķermenis vēl nav pilnībā strukturēts.

Nākamā valodas arhitektūras robeža pēc kvalitātes sliežu ieviešanas ir klases ķermeņa AST.

Pirmajā iterācijā jāstrukturē:

- lauki
- modifikatori
- konstruktors
- konstruktora parametri
- getteris
- getter atgriezes tips

Pilna metožu ķermeņu parsēšana nav pirmās iterācijas prasība.

## LatNe iebūvētais API

Valodas sintakses terminoloģija un izpildvides / standarta API terminoloģija ir divas atšķirīgas problēmas.

Piemēram:

```text
Array.push
Array.length
```

nav valodas atslēgvārdi.

Pirmie izskatāmie LatNe kandidāti:

```text
pievieno
garums
```

Šādu API nedrīkst realizēt ar globālu teksta aizvietošanu.

Tulkojumam jābūt sasaistītam ar:

- konkrētu tipu
- semantisku operāciju
- koda ģeneratora mapping

API slānis ir dokumentēts `ROADMAP.md` fāzē 1A.

## Semantisko transformāciju robeža

Starp AST un koda ģenerēšanu paredzēta skaidra transformāciju robeža.

Tā nepieciešama, lai:

- API semantiku neieceptu sintaktiskajā analizatorā
- sintaktiskais analizators nekļūtu atkarīgs no JavaScript izvada
- koda ģenerēšana nebūtu spiesta interpretēt neapstrādātu LatNe sintaksi
- nākotnē varētu mainīt vai papildināt izvada slāni

Pirmajā versijā transformāciju slānim jāpaliek mazam un izskaidrojamam.

## Koda ģenerēšana

Pirmais mērķa starprezultāts ir JavaScript.

Tas ir tehnisks būvbloks, ne LatNe identitātes pamats.

Pirmajā koda ģenerēšanas posmā prioritāte ir:

1. pareizība
2. caurspīdīgums
3. testējamība

Nevis optimizācija vai sarežģīta bundling sistēma.

Ģenerētajam starprezultātam jābūt apskatāmam.

## Reproducējamība un CI

LatNe turpmākā arhitektūras attīstība balstās uz reproducējamu vidi.

Pirms straujas sintaktiskā analizatora un koda ģenerēšanas paplašināšanas jābūt:

- fiksētai izpildvides prasībai
- lockfile
- tīras atkarību instalācijas pārbaudei
- CI
- regresijas paraugi

Sākotnējais obligātais CI mērķis ir Linux.

Windows pārbaude tiek pievienota pirms CLI izplatīšanas posma.

## Ārējo atkarību robeža

Ārēja atkarība drīkst palīdzēt LatNe, bet nedrīkst noteikt tās identitāti.

Kritiskai ārējai atkarībai jāatrodas aiz skaidras LatNe iekšējās robežas, lai tās aizstāšana neizjauktu publisko valodas modeli.

## Dokumentācijas slānis

Dokumentācija ir daļa no LatNe sistēmas.

Publiskie arhitektūras lēmumi tiek saglabāti ADR.

`ROADMAP.md` nosaka publisko izpildes secību.

`docs/STATUSS.md` apraksta faktiski sasniegto stāvokli.

`docs/ATSAKSANA.md` nosaka vienu aktuālo darba sākuma punktu.

## Web slānis

LatNe web slānis tiks sākts tikai pēc tam, kad valodas kodols ir reāli lietojams ārpus projekta autora darba vides.

Pirms web slāņa jābūt:

- darbojošam CLI
- diagnostikas minimumam
- publiskam Quickstart
- vairākiem pilniem `.lat` piemēriem
- vismaz pirmajai ārējai lietošanas pieredzei

Web slānis nedrīkst noteikt valodas identitāti vai piespiest valodas kodolu konkrētai web arhitektūrai.
