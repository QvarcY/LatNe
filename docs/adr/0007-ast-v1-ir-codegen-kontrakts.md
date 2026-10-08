# ADR 0007 — AST v1 ir koda ģeneratora kontrakts

**Datums:** 2026-10-02
**Statuss:** Pieņemts

## Konteksts

LatNe parseris jau veido strukturētu deklarāciju, statement un izteiksmju AST.

Nākamajos posmos AST kļūs ievērojami plašāks:

- klases ķermenis
- piešķiršanas izteiksmes
- pilnāki parametri
- veidņu interpolācijas
- source spans
- LatNe API semantika

Ja koda ģenerators tiktu būvēts tieši uz parsera pagaidu iekšējām struktūrām, katra parsera izmaiņa varētu nekontrolēti mainīt codegen uzvedību.

## Lēmums

Pirms nopietnas koda ģenerēšanas LatNe definē un stabilizē pirmo AST v1 kontraktu.

Koda ģenerators strādā ar dokumentētu AST v1, nevis ar parsera nejaušām iekšējām detaļām.

AST v1 jādefinē:

- mezglu tipi
- obligātie lauki
- izvēles lauki
- source span forma
- kanoniskās identitātes lauki, kur tie nepieciešami
- robeža starp strukturētu AST un pagaidu neapstrādātiem leksiskajiem elementiem

Neapstrādātu leksisko elementu kopas drīkst palikt tikai apzināti dokumentētos pārejas mezglos.

## Sekas

Pozitīvi:

- parseri var attīstīt neatkarīgāk no codegen
- codegen saņem stabilāku ievadi
- AST var testēt atsevišķi
- diagnostikai un editor tooling ir skaidra avota struktūra
- nākotnes transformācijas var balstīties uz vienotu kontraktu

Izmaksas:

- pirms codegen jāiegulda laiks AST specifikācijā
- daži pašreizējie pagaidu mezgli būs jāpārstrukturē
- AST izmaiņas pēc v1 būs jāveic apzināti

## Nav pieņemts

Šis lēmums nenozīmē, ka AST v1 būs gala AST uz visiem laikiem.

Līdz LatNe 1.0 AST drīkst attīstīties.

Tomēr izmaiņām pēc AST v1 jābūt dokumentētām un pārbaudāmām.
