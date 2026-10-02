# LatNe arhitektūra

**Atjaunots:** 2026-10-02

LatNe tiek projektēta kā neatkarīga sistēma.

Ārējas bibliotēkas un runtime komponentes tiek izmantotas kā tehniski būvbloki, nevis kā projekta arhitektūras vai identitātes pamats.

## Valodas kodola ķēde

Pašreizējā realizētā ķēde:

```text
.lat avots
   ↓
terminoloģijas reģistrs
   ↓
tokenizeris
   ↓
deklarāciju parseris
   ↓
statement parseris
   ↓
izteiksmju parseris
   ↓
AST
```

Plānotā pilnā ķēde:

```text
.lat avots
   ↓
terminoloģijas reģistrs
   ↓
tokenizeris
   ↓
parseri
   ↓
AST v1
   ↓
semantiskās transformācijas
   ↓
koda ģenerators
   ↓
JavaScript starprezultāts
   ↓
runtime / izpilde
   ↓
CLI
```

## Terminoloģijas slānis

Kanoniskais terminoloģijas avots:

`packages/valoda/data/termini.json`

Compileris nebalstās uz nejauši hardkodētiem latviskajiem atslēgvārdiem.

Tokenizeris atpazītam terminam saglabā arī kanonisko avota identitāti.

Piemēram:

```text
klase   → class
darbība → function
kam     → for
gaidi   → await
```

Parseris gramatikas lēmumus pieņem pēc šīs kanoniskās identitātes.

Tas ļauj terminoloģiju attīstīt, nepārrakstot visu parsera loģiku.

## Tokenizeris

Fails:

`packages/valoda/src/tokenizer.mjs`

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

## Deklarāciju un statement parseris

Fails:

`packages/valoda/src/parser.mjs`

Atbild par:

- programmas augšējā līmeņa konstrukcijām
- darbību ķermeņu konstrukcijām
- vadības plūsmu
- kļūdu apstrādes blokiem

Izteiksmju gramatika netiek turēta šajā pašā modulī.

## Izteiksmju parseris

Fails:

`packages/valoda/src/expression-parser.mjs`

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

Tas ir apzināti atdalīts no statement parsera, lai parseris nekļūtu par vienu monolītu failu.

## AST kā publisks iekšējais kontrakts

AST nav tikai parsera pagaidu rezultāts.

Pirms nopietnas koda ģenerēšanas tiek stabilizēts AST v1 kontrakts.

AST v1 definē:

- stabilus mezglu tipus
- obligātos laukus
- izvēles laukus
- source span informāciju
- kanonisko termina identitāti, kur tā nepieciešama
- robežu starp strukturētu AST un pagaidu raw tokeniem

Koda ģeneratoram jāstrādā ar dokumentētu AST kontraktu, nevis parsera nejaušām iekšējām detaļām.

Skatīt ADR 0007.

## Source spans un diagnostika

Avota pozīcija tiek uzskatīta par arhitektūras sastāvdaļu.

Tā nepieciešama:

- latviskai diagnostikai
- faila, rindas un kolonnas norādei
- source maps
- editor tooling
- kļūdas sasaistīšanai ar oriģinālo `.lat` failu

Diagnostikas sistēma tiks veidota virs strukturētas source span informācijas, nevis tikai teksta kļūdu ziņojumiem.

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

Valodas sintakses terminoloģija un runtime / standarta API terminoloģija ir divas atšķirīgas problēmas.

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

Starp AST un codegen paredzēta skaidra transformāciju robeža.

Tā nepieciešama, lai:

- API semantiku neieceptu parserī
- parseris nekļūtu atkarīgs no JavaScript izvada
- codegen nebūtu spiests interpretēt raw LatNe sintaksi
- nākotnē varētu mainīt vai papildināt izvada slāni

Pirmajā versijā transformāciju slānim jāpaliek mazam un izskaidrojamam.

## Koda ģenerēšana

Pirmais mērķa starprezultāts ir JavaScript.

Tas ir tehnisks būvbloks, ne LatNe identitātes pamats.

Pirmajam codegen prioritāte ir:

1. pareizība
2. caurspīdīgums
3. testējamība

Nevis optimizācija vai sarežģīta bundling sistēma.

Ģenerētajam starprezultātam jābūt apskatāmam.

## Reproducējamība un CI

LatNe turpmākā arhitektūras attīstība balstās uz reproducējamu vidi.

Pirms straujas parsera un codegen paplašināšanas jābūt:

- fiksētai runtime prasībai
- lockfile
- clean install pārbaudei
- CI
- regresijas fixtures

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
