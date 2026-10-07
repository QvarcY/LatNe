# Terminoloģijas politika

LatNe valodas vārdi netiek izvēlēti ar automātisku tulkošanu.

## Statusi

`pending`

Termins vēl nav izskatīts.

`approved`

Latviskais variants ir apstiprināts un drīkst kļūt par LatNe sintakses daļu.

`rejected`

Konkrētais variants vai konstrukcija ir noraidīta.

`reserved`

Lēmums atlikts un kandidāts saglabāts turpmākai izpētei.

## Viens avots

Oficiālais valodas terminoloģijas reģistrs:

`packages/valoda/data/termini.json`

Kompilators, dokumentācija, redaktoru rīki un testi izmanto šo pašu datu avotu.

## Vārdu kalve

Vārdu kalve nedrīkst uzturēt savu atsevišķu terminu kopiju.

Tā lasa un raksta kanonisko reģistru.

## Tulkošanas princips

LatNe neveido mehānisku JavaScript vai TypeScript tulkojumu.

Katram kandidātam atsevišķi jāizlemj:

- vai konstrukcija LatNe ir vajadzīga
- vai vārds ir tulkojams
- vai latviešu valodā dabiskāka ir cita konstrukcija
- vai kandidāts jāsadala vairākās LatNe konstrukcijās
- vai vairākus avota vārdus var apvienot vienā LatNe jēdzienā

## Rakstība koda identifikatoros

LatNe-owned publiskie un iekšējie identifikatori, ja tie ir latviešu vārdi, tiek rakstīti pilnā latviešu ortogrāfijā ar diakritiskajām zīmēm.

Piemēri:

- `vērtība`, nevis `vertiba`
- `ķermenis`, nevis `kermenis`
- `pieejamība`, nevis `pieejamiba`
- `analizēSintaksi`, nevis `analizeSintaksi`
- `sākums`, nevis `sakums`
- `nobīde`, nevis `nobide`

Šis princips attiecas uz lexer/parser API, tokenu kontraktu, AST laukiem un LatNe iekšējiem latviskajiem identifikatoriem.

Ārēju formātu, trešo pušu API, URL, pakotņu ekosistēmu un citu tehniski noteiktu nosaukumu transliterācija vai angļu forma netiek automātiski pārdēvēta bez atsevišķa lēmuma.

Transliterētu LatNe identifikatoru atgriešanos bloķē `check:identifikatori`.

## Pašreizējais stāvoklis

Inventāra versijā 1 ir 84 kandidāti.

Pašlaik:

- 84 termini ir `approved`
- 0 termini ir `pending`

Visiem 84 kandidātiem ir apstiprināts LatNe variants.

LatNe projekta iekšējā tehniskā terminoloģija tiek uzturēta atsevišķi:

`docs/PROJEKTA-TERMINOLOGIJA.md`
