# LatNe arhitektūra

**Atjaunots:** 2026-10-01

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

Plānotā turpinājuma ķēde:

```text
AST
 ↓
transformācijas
 ↓
koda ģenerēšana
 ↓
source maps
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

## Klases slānis

Klase pašlaik tiek atpazīta augšējā līmenī, bet tās ķermenis vēl nav pilnībā strukturēts.

Nākamā arhitektūras robeža ir klases ķermeņa AST.

Pirmajā iterācijā jāstrukturē lauki, modifikatori, konstruktors un getteris, vēl neuzņemoties pilnu metožu ķermeņu parsēšanu.

## LatNe iebūvētais API

Valodas sintakses terminoloģija un runtime / standarta API terminoloģija ir divas atšķirīgas problēmas.

Piemēram:

```text
Array.push
Array.length
```

nav valodas atslēgvārdi.

Plānotie LatNe kandidāti:

```text
pievieno
garums
```

Šādu API nedrīkst realizēt ar globālu teksta aizvietošanu.

Tulkojumam jābūt sasaistītam ar konkrētu tipu vai semantisko operāciju.

API slānis ir dokumentēts `ROADMAP.md` fāzē 1A.

## Web slānis

LatNe web slānis tiks sākts tikai pēc tam, kad valodas kodols ir reāli lietojams un pārbaudāms.

Web slānis nedrīkst noteikt valodas identitāti vai piespiest valodas kodolu konkrētai framework arhitektūrai.
