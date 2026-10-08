# AST v1 lauku audits

**Datums:** 2026-10-08  
**Pamats:** `main` @ `a997fcd4a4876be9d223b3b54da8e1d50ec7a665`  
**Apjoms:** 40 pašreizējie AST mezglu tipi

Šis dokuments ir faktiskā pašreizējā AST lauku inventarizācija pirms AST v1 lauku kontrakta definēšanas.

Tas **nav** AST v1 kontrakts. Šajā auditā neviens lauks vēl netiek pasludināts par obligātu, izvēles vai pārejas lauku. Netiek veikta neviena AST pārsaukšana vai strukturāla maiņa.

## Kopīgais stāvoklis

Visiem 40 pašreizējiem AST mezglu tipiem ir:

- `veids`
- `diapazons`

39 no 40 mezgliem papildus ir `rinda`. Vienīgais izņēmums ir `Programma`, kurai pašlaik ir tikai `veids`, `elementi` un `diapazons`.

`diapazons` visiem mezgliem izmanto pašreizējo pusatvērto `[sākums, beigas)` struktūru.

## Programma, deklarācijas, klase un parametri

| Mezgls | Pašreizējie semantiskie lauki | Pašreizējā tukšuma / nulles uzvedība | Piezīme |
|---|---|---|---|
| `Programma` | `elementi` | `elementi: []` tukšai programmai | Nav `rinda`; `diapazons` ir arī tukšai programmai |
| `Imports` | `vārdi`, `avots` | `vārdi` ir masīvs; parseris pieļauj arī tukšu `{}` | `avots` pašlaik saņem teksta leksiskā elementa pilno `vērtība`, nevis `Teksts.vērtība` formu |
| `Saskarsme` | `nosaukums`, `ķermeņaLeksiskieElementi` | ķermeņa lauks ir skaitlis | Lauka nosaukums izklausās pēc kolekcijas, bet faktiskā vērtība ir `saturs.length` |
| `Uzskaitījums` | `nosaukums`, `vērtības` | `vērtības: []`, ja nav identifikatoru | Vērtības pašlaik ir virkņu masīvs |
| `Klase` | `nosaukums`, `eksportēta`, `ķermeņaLeksiskoElementuSkaits`, `ķermenis`, `lauki`, `konstruktors`, `iegūšanas`, `metodes` | kolekcijas ir masīvi; `konstruktors: null`, ja tā nav | `ķermenis` satur klases lauku/konstruktora/iegūšanas/metodes mezglus |
| `Darbība` | `nosaukums`, `eksportēta`, `asinhrona`, `parametri`, `parametruLeksiskoElementuSkaits`, `atgriezesTips`, `ķermeņaLeksiskieElementi`, `ķermenis` | `parametri: []`; `atgriezesTips: ""`, ja tips nav norādīts; `ķermenis: []`, ja tukšs | `ķermeņaLeksiskieElementi` šeit ir skaitlis, nevis leksisko elementu masīvs |
| `KlasesLauks` | `nosaukums`, `pieejamība`, `nemaināms`, `tips` | `pieejamība: null`, ja nav modifikatora; `nemaināms` ir boolean; `tips` parserī nedrīkst būt tukšs | — |
| `Konstruktors` | `pieejamība`, `parametri`, `ķermenis`, `ķermeņaLeksiskieElementi` | `pieejamība: null`; `parametri: []`; `ķermenis` var būt `null`, ja klases analizators izsaukts bez priekšrakstu analizatora | `ķermeņaLeksiskieElementi` ir pilns leksisko elementu masīvs |
| `Iegūšana` | `nosaukums`, `pieejamība`, `atgriezesTips`, `ķermenis`, `ķermeņaLeksiskieElementi` | `pieejamība: null`; `atgriezesTips` parserī nedrīkst būt tukšs; `ķermenis` var būt `null` standalone klases analizatorā | `ķermeņaLeksiskieElementi` ir pilns leksisko elementu masīvs |
| `Metode` | `nosaukums`, `pieejamība`, `parametri`, `atgriezesTips`, `ķermenis`, `ķermeņaLeksiskieElementi` | `pieejamība: null`; `parametri: []`; `atgriezesTips: ""`, ja nav norādīts; `ķermenis` var būt `null` standalone klases analizatorā | `ķermeņaLeksiskieElementi` ir pilns leksisko elementu masīvs |
| `Parametrs` | `nosaukums`, `tips` | `tips` parserī nedrīkst būt tukšs | — |

Visiem šīs tabulas mezgliem, izņemot `Programma`, papildus ir `rinda` un `diapazons`.

## Priekšraksti

| Mezgls | Pašreizējie semantiskie lauki | Pašreizējā tukšuma / nulles uzvedība | Piezīme |
|---|---|---|---|
| `Mainīgais` | `deklarācija`, `nosaukums`, `tips`, `vērtība` | `tips: null`, ja nav tipa; `vērtība: null`, ja nav sākuma vērtības | `deklarācija` pašlaik glabā avota identitāti `const` / `let` / `var` |
| `Nosacījums` | `nosacījums`, `ķermenis`, `citādi` | `ķermenis: []`, ja tukšs; `citādi: null`, ja nav `citādi`; tukšs `citādi {}` dod `[]` | `citādi ja` pašlaik tiek glabāts kā viena `Nosacījums` mezgla masīvs |
| `KārtasCikls` | kopīgi: `variants`, `ķermenis`; atkarībā no varianta: `deklarācija`, `mainīgais`, `kolekcija` **vai** `izteiksme` | varianta specifiskie lauki netiek izveidoti kā `null`; tie vienkārši nav otrā varianta objektā | Pašreizējie varianti ir `"of"` un `"vispārīgs"` |
| `Atgriešana` | `vērtība` | `vērtība: null`, ja nav atgriežamās izteiksmes | — |
| `Metiens` | `vērtība` | parseris sagaida izteiksmi | — |
| `Mēģinājums` | `mēģina`, `ķer`, `beigas` | `mēģina: []`; `ķer: null`, ja nav `ķer`; `beigas: null`, ja nav `beigās` | `ķer` ir iekšējs objekts ar `parametrs` un `ķermenis`, nevis atsevišķs AST mezgls |
| `Turpināšana` | nav papildu semantisko lauku | — | Tikai kopīgie metadati |
| `Pārtraukšana` | nav papildu semantisko lauku | — | Tikai kopīgie metadati |
| `Atkļūdošana` | nav papildu semantisko lauku | — | Tikai kopīgie metadati |
| `Izteiksme` | `izteiksme` | — | Priekšraksts aptver vienu izteiksmes AST |

Visiem 10 priekšrakstu mezgliem papildus ir `rinda` un `diapazons`.

### `KārtasCikls` faktiskās formas

`variants: "of"`:

```text
veids
variants
deklarācija
mainīgais
kolekcija
ķermenis
rinda
diapazons
```

`variants: "vispārīgs"`:

```text
veids
variants
izteiksme
ķermenis
rinda
diapazons
```

### `Mēģinājums.ķer` faktiskā forma

Ja `ķer` pastāv, tas pašlaik ir:

```text
{
  parametrs: string | null,
  ķermenis: Priekšraksts[]
}
```

Šim objektam pašlaik nav `veids`, `rinda` vai `diapazons`.

## Izteiksmes un veidnes

| Mezgls | Pašreizējie semantiskie lauki | Pašreizējā tukšuma / nulles uzvedība | Piezīme |
|---|---|---|---|
| `Identifikators` | `nosaukums` | — | — |
| `Skaitlis` | `vērtība`, `pieraksts` | — | `vērtība` ir Number; `pieraksts` saglabā sākotnējo skaitļa rakstību |
| `Teksts` | `vērtība`, `pieraksts` | — | `vērtība` ir bez ārējām pēdiņām; `pieraksts` saglabā pilno literāli |
| `Veidne` | `daļas`, `pieraksts` | `daļas: []`, ja leksiskajam elementam nav strukturētu daļu | `daļas` satur `VeidnesTeksts` un `VeidnesAizpildījums` mezglus |
| `VeidnesTeksts` | `vērtība` | — | — |
| `VeidnesAizpildījums` | `izteiksme` | — | `${...}` iekšējā izteiksme ir pilns izteiksmes AST |
| `Nekas` | nav papildu semantisko lauku | — | — |
| `Loģisks` | `vērtība` | — | boolean |
| `Nenoteikts` | nav papildu semantisko lauku | — | — |
| `Šis` | nav papildu semantisko lauku | — | — |
| `Masīvs` | `elementi` | `elementi: []` tukšam masīvam | — |
| `Grupa` | `izteiksme` | — | — |
| `Īpašība` | `objekts`, `nosaukums` | — | — |
| `Izsaukums` | `izsaucamais`, `argumenti` | `argumenti: []`, ja argumentu nav | — |
| `Gaidīšana` | `izteiksme` | — | — |
| `Jauns` | `konstruktors`, `argumenti` | `argumenti: []`, ja iekavu/argumentu nav | — |
| `PirmsIzteiksme` | `operators`, `izteiksme` | — | Tekstuālais `veids` operators AST pašlaik tiek glabāts kā `"typeof"` |
| `BināraIzteiksme` | `operators`, `kreisā`, `labā` | — | — |
| `PiešķiršanasIzteiksme` | `operators`, `mērķis`, `vērtība` | — | — |

Visiem 19 šīs grupas mezgliem papildus ir `rinda` un `diapazons`.

## Nulles un tukšu vērtību faktiskā semantika

Pašreizējais kods nav pilnīgi vienots, bet tam jau ir vairāki skaidri modeļi:

- neesoša viena semantiska vērtība bieži tiek glabāta kā `null`: `Mainīgais.tips`, `Mainīgais.vērtība`, `Nosacījums.citādi`, `Klase.konstruktors`, `Mēģinājums.ķer`, `Mēģinājums.beigas`, `pieejamība`;
- kolekcijas parasti pastāv vienmēr un tukšā stāvoklī ir `[]`;
- izvēles atgriezes tips `Darbība` un `Metode` mezglā pašlaik ir `""`, nevis `null`;
- `Iegūšana.atgriezesTips`, `Parametrs.tips` un `KlasesLauks.tips` parserī nedrīkst būt tukši;
- `KārtasCikls` varianta lauki ir nosacīti **neesoši**, nevis klātesoši ar `null`;
- `Nosacījums.citādi` izmanto `null`, `[]` un masīvu ar vienu `Nosacījums` mezglu trim dažādām situācijām.

## Leksisko elementu lauku faktiskā nevienādība

Pašreiz AST sastopamas trīs dažādas pieejas:

1. `Klase.ķermeņaLeksiskoElementuSkaits` — skaitlis.
2. `Darbība.ķermeņaLeksiskieElementi` un `Saskarsme.ķermeņaLeksiskieElementi` — arī skaitlis, lai gan nosaukums nepasaka “skaits”.
3. `Konstruktors.ķermeņaLeksiskieElementi`, `Iegūšana.ķermeņaLeksiskieElementi`, `Metode.ķermeņaLeksiskieElementi` — pilni leksisko elementu masīvi.

Papildus `Darbība.parametruLeksiskoElementuSkaits` jau ir skaidri nosaukts kā skaits.

Regresijas AST diapazonu audits apzināti neiet iekšā `ķermeņaLeksiskieElementi`, jo tur var atrasties leksiskie elementi, nevis AST mezgli.

## Lauku vērtības, kurās saglabāta avota identitāte

Pašreiz daži AST lauki glabā nevis LatNe rakstību, bet terminoloģijas reģistra avota identitāti:

- `Mainīgais.deklarācija`: `"const"`, `"let"`, `"var"`;
- `KārtasCikls.deklarācija`: `"const"`, `"let"`, `"var"`;
- `KārtasCikls.variants`: viens no pašreizējiem variantiem ir `"of"`;
- `PirmsIzteiksme.operators`: LatNe `veids` gadījumā pašlaik ir `"typeof"`.

Šajā auditā šīs vērtības netiek mainītas. Pirms AST v1 iesaldēšanas jāizlemj, vai šī ir apzināta AST v1 semantika.

## Apstiprinātie AST v1 lauku lēmumi

### `rinda`

`rinda` ir **pārejas lauks**.

Tas pagaidām paliek pašreizējā AST saderības dēļ, bet nav stabilās AST v1 publiskās semantikas daļa. Stabilā atrašanās vietas informācija ir `diapazons`.

Šis lēmums pats par sevi vēl nenozīmē `rinda` izņemšanu no parsera.

### Leksisko elementu palīglauki

Šie lauki ir **pārejas / iekšēji** un neietilpst stabilajā AST v1 publiskajā kontraktā:

- `ķermeņaLeksiskieElementi`
- `ķermeņaLeksiskoElementuSkaits`
- `parametruLeksiskoElementuSkaits`

Tie pagaidām netiek dzēsti, kamēr nav pārbaudīts, ka neviens pārejas tests vai iekšējais solis uz tiem nebalstās.

### Nulles, tukšuma un neesošu lauku semantika

Apstiprināti šādi AST v1 noteikumi:

1. **Kolekcijas lauks vienmēr eksistē.** Ja elementu nav, vērtība ir `[]`.
2. **Izvēles viena vērtība vienmēr eksistē.** Ja vērtības nav, lauks ir `null`.
3. **Tukša virkne `""` neapzīmē neesošu vērtību.** Tā ir derīga tikai tad, ja tukša virkne pati ir semantiska vērtība, piemēram `Teksts.vērtība`.
4. **Diskriminētu variantu lauki netiek piepildīti ar `null`.** Ja mezgla forma ir noteikta ar diskriminatoru, konkrētā varianta lauki ir obligāti, bet cita varianta lauki objektā neeksistē.
5. **`Nosacījums.citādi` saglabā pašreizējo trīsstāvokļu nozīmi:** `null` nozīmē, ka `citādi` nav; `[]` nozīmē tukšu `citādi {}`; netukšs masīvs satur `citādi` ķermeņa AST.

No šiem noteikumiem izriet, ka pašreizējie `Darbība.atgriezesTips: ""` un `Metode.atgriezesTips: ""` neatbilst apstiprinātajai AST v1 semantikai. Pirms kontrakta pabeigšanas tie jāsaskaņo ar izvēles vienas vērtības noteikumu, izmantojot `null`, ja atgriezes tips nav norādīts.

Šajā auditā parsera uzvedība vēl netiek mainīta.

## Atlikušie jautājumi AST v1 kontraktam

Pēc faktiskā lauku audita vēl jāpieņem lēmumi par:

1. `KārtasCikls` abu variantu precīzo obligāto lauku formu; varianta lauku neesamības princips jau ir apstiprināts;
2. `Nosacījums.citādi` precīzo satura formu `citādi ja` gadījumā; `null` / `[]` / satura masīva semantika jau ir apstiprināta;
3. `Mēģinājums.ķer` statusu — parasts iekšējs objekts vai patstāvīga strukturēta AST daļa;
4. avota identitātes vērtības `const`, `let`, `var`, `of`, `typeof` AST laukos;
5. `Imports.avots` formu pretstatā `Teksts.vērtība` / `Teksts.pieraksts`.

Tikai pēc šo punktu apstiprināšanas drīkst pabeigt visu lauku statusu kā **obligāts**, **izvēles** vai **pārejas** un pēc tam virzīties uz `spec/ast-v1.md`.
