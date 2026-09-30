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

Oficiālais reģistrs:

`packages/valoda/data/termini.json`

Compileris dokumentācija editoru tooling un testi nākotnē izmanto šo pašu datu avotu.

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

## Pašreizējais stāvoklis

Inventāra versijā 1 ir 84 kandidāti.

Visi sāk ar statusu `pending`.

Nevienam vēl nav fiksēts oficiāls latviskais variants.
