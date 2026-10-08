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
| `Darbība` | `nosaukums`, `eksportēta`, `asinhrona`, `parametri`, `parametruLeksiskoElementuSkaits`, `atgriezesTips`, `ķermeņaLeksiskieElementi`, `ķermenis` | `parametri: []`; `atgriezesTips: null`, ja tips nav norādīts; `ķermenis: []`, ja tukšs | `ķermeņaLeksiskieElementi` šeit ir skaitlis, nevis leksisko elementu masīvs |
| `KlasesLauks` | `nosaukums`, `pieejamība`, `nemaināms`, `tips` | `pieejamība: null`, ja nav modifikatora; `nemaināms` ir `loģisks`; `tips` parserī nedrīkst būt tukšs | — |
| `Konstruktors` | `pieejamība`, `parametri`, `ķermenis`, `ķermeņaLeksiskieElementi` | `pieejamība: null`; `parametri: []`; `ķermenis` var būt `null`, ja klases analizators izsaukts bez priekšrakstu analizatora | `ķermeņaLeksiskieElementi` ir pilns leksisko elementu masīvs |
| `Iegūšana` | `nosaukums`, `pieejamība`, `atgriezesTips`, `ķermenis`, `ķermeņaLeksiskieElementi` | `pieejamība: null`; `atgriezesTips` parserī nedrīkst būt tukšs; `ķermenis` var būt `null` standalone klases analizatorā | `ķermeņaLeksiskieElementi` ir pilns leksisko elementu masīvs |
| `Metode` | `nosaukums`, `pieejamība`, `parametri`, `atgriezesTips`, `ķermenis`, `ķermeņaLeksiskieElementi` | `pieejamība: null`; `parametri: []`; `atgriezesTips: null`, ja nav norādīts; `ķermenis` var būt `null` standalone klases analizatorā | `ķermeņaLeksiskieElementi` ir pilns leksisko elementu masīvs |
| `Parametrs` | `nosaukums`, `tips` | `tips` parserī nedrīkst būt tukšs | — |

Visiem šīs tabulas mezgliem, izņemot `Programma`, papildus ir `rinda` un `diapazons`.

## Priekšraksti

| Mezgls | Pašreizējie semantiskie lauki | Pašreizējā tukšuma / nulles uzvedība | Piezīme |
|---|---|---|---|
| `Mainīgais` | `deklarācija`, `nosaukums`, `tips`, `vērtība` | `tips: null`, ja nav tipa; `vērtība: null`, ja nav sākuma vērtības | `deklarācija` ir `"konstante"` / `"mainīgais"` / `"funkcijasMainīgais"` |
| `Nosacījums` | `nosacījums`, `ķermenis`, `citādi` | `ķermenis: []`, ja tukšs; `citādi: null`, ja nav `citādi`; tukšs `citādi {}` dod `[]` | `citādi ja` ir `citādi` masīvs ar vienu iegultu `Nosacījums` mezglu |
| `KārtasCikls` | kopīgi: `variants`, `ķermenis`; kolekcijas variantam: `deklarācija`, `mainīgais`, `kolekcija`; skaitītāja variantam: `sākums`, `nosacījums`, `solis` | varianta specifiskie lauki netiek izveidoti kā `null`; tie vienkārši nav otra varianta objektā | Varianti ir `"kolekcija"` un `"skaitītājs"` |
| `Atgriešana` | `vērtība` | `vērtība: null`, ja nav atgriežamās izteiksmes | — |
| `Metiens` | `vērtība` | parseris sagaida izteiksmi | — |
| `Mēģinājums` | `mēģina`, `ķer`, `beigas` | `mēģina: []`; `ķer: null`, ja nav `ķer`; `beigas: null`, ja nav `beigās` | `ķer` ir iekšējs objekts ar `parametrs` un `ķermenis`, nevis atsevišķs AST mezgls |
| `Turpināšana` | nav papildu semantisko lauku | — | Tikai kopīgie metadati |
| `Pārtraukšana` | nav papildu semantisko lauku | — | Tikai kopīgie metadati |
| `Atkļūdošana` | nav papildu semantisko lauku | — | Tikai kopīgie metadati |
| `Izteiksme` | `izteiksme` | — | Priekšraksts aptver vienu izteiksmes AST |

Visiem 10 priekšrakstu mezgliem papildus ir `rinda` un `diapazons`.

### `KārtasCikls` faktiskās formas

`variants: "kolekcija"`:

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

`variants: "skaitītājs"`:

```text
veids
variants
sākums
nosacījums
solis
ķermenis
rinda
diapazons
```

Skaitītāja variantā `sākums` ir `Mainīgais` mezgls, `nosacījums` ir izteiksmes AST un `solis` ir izteiksmes AST. Pašreizējā regresijas pārbaude sedz `solis` kā `PiešķiršanasIzteiksme` ar `+=`.

### `Nosacījums.citādi` stabilā forma

`Nosacījums.citādi` AST v1 tips ir:

```text
null | Priekšraksts[]
```

Semantika:

- `null` — avotā nav `citādi`;
- `[]` — avotā ir tukšs `citādi {}`;
- netukšs `Priekšraksts[]` — `citādi` ķermeņa AST.

`citādi ja (...)` nav atsevišķs lauks vai AST mezgla variants. Tas tiek attēlots kā `citādi` ķermenis ar vienu iegultu `Nosacījums` mezglu:

```text
citādi: [
  Nosacījums {
    nosacījums: ...
    ķermenis: [...]
    citādi: ...
  }
]
```

Garāka `citādi ja` ķēde veidojas rekursīvi pēc tā paša principa. Šī forma ir apstiprināta kā stabilā AST v1 semantika.

### `Mēģinājums.ķer` stabilā forma

`Mēģinājums.ķer` AST v1 tips ir:

```text
null | {
  parametrs: teksts | null,
  ķermenis: Priekšraksts[]
}
```

`null` nozīmē, ka `ķer` bloka nav. Ja `ķer` pastāv, tas ir strukturēts `Mēģinājums` iekšējais objekts, nevis patstāvīgs AST mezgls.

Šim objektam nav `veids`, `rinda` vai `diapazons`. Tukšam parametram tiek izmantots `parametrs: null`, bet tukšam `ķer` ķermenim — `ķermenis: []`.

## Izteiksmes un veidnes

| Mezgls | Pašreizējie semantiskie lauki | Pašreizējā tukšuma / nulles uzvedība | Piezīme |
|---|---|---|---|
| `Identifikators` | `nosaukums` | — | — |
| `Skaitlis` | `vērtība`, `pieraksts` | — | `vērtība` ir `skaitlis`; `pieraksts` saglabā sākotnējo skaitļa rakstību |
| `Teksts` | `vērtība`, `pieraksts` | — | `vērtība` ir bez ārējām pēdiņām; `pieraksts` saglabā pilno literāli |
| `Veidne` | `daļas`, `pieraksts` | `daļas: []`, ja leksiskajam elementam nav strukturētu daļu | `daļas` satur `VeidnesTeksts` un `VeidnesAizpildījums` mezglus |
| `VeidnesTeksts` | `vērtība` | — | — |
| `VeidnesAizpildījums` | `izteiksme` | — | `${...}` iekšējā izteiksme ir pilns izteiksmes AST |
| `Nekas` | nav papildu semantisko lauku | — | — |
| `Loģisks` | `vērtība` | — | `loģisks` |
| `Nenoteikts` | nav papildu semantisko lauku | — | — |
| `Šis` | nav papildu semantisko lauku | — | — |
| `Masīvs` | `elementi` | `elementi: []` tukšam masīvam | — |
| `Grupa` | `izteiksme` | — | — |
| `Īpašība` | `objekts`, `nosaukums` | — | — |
| `Izsaukums` | `izsaucamais`, `argumenti` | `argumenti: []`, ja argumentu nav | — |
| `Gaidīšana` | `izteiksme` | — | — |
| `Jauns` | `konstruktors`, `argumenti` | `argumenti: []`, ja iekavu/argumentu nav | — |
| `PirmsIzteiksme` | `operators`, `izteiksme` | — | LatNe `veids` operators AST tiek glabāts semantiski kā `"veids"` |
| `BināraIzteiksme` | `operators`, `kreisā`, `labā` | — | — |
| `PiešķiršanasIzteiksme` | `operators`, `mērķis`, `vērtība` | — | — |

Visiem 19 šīs grupas mezgliem papildus ir `rinda` un `diapazons`.

## Nulles un tukšu vērtību faktiskā semantika

Pašreizējais kods nav pilnīgi vienots, bet tam jau ir vairāki skaidri modeļi:

- neesoša viena semantiska vērtība bieži tiek glabāta kā `null`: `Mainīgais.tips`, `Mainīgais.vērtība`, `Nosacījums.citādi`, `Klase.konstruktors`, `Mēģinājums.ķer`, `Mēģinājums.beigas`, `pieejamība`;
- kolekcijas parasti pastāv vienmēr un tukšā stāvoklī ir `[]`;
- izvēles atgriezes tips `Darbība` un `Metode` mezglā pašlaik ir `null`;
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

## Semantiskās AST vērtības

Publiskais AST v1 neizvada deklarāciju JavaScript avota identitāti.

Gan `Mainīgais.deklarācija`, gan kolekcijas `KārtasCikls.deklarācija` izmanto:

- `"konstante"` — avota `const`;
- `"mainīgais"` — avota `let`;
- `"funkcijasMainīgais"` — avota `var`.

`funkcijasMainīgais` saglabā būtisko atšķirību no `let`: šī deklarācijas forma atbilst `var` funkcijas tvēruma uzvedībai. LatNe jaunā kodā šo formu nav ieteicams izmantot; tā paliek parserī saderībai.

`KārtasCikls.variants` kolekcijas forma izmanto semantisko vērtību `"kolekcija"`, nevis avota identitāti `"of"`.

`PirmsIzteiksme.operators` LatNe `veids` gadījumā izmanto semantisko vērtību `"veids"`, nevis avota identitāti `"typeof"`.

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
5. **`Nosacījums.citādi` stabilais tips ir `null | Priekšraksts[]`:** `null` nozīmē, ka `citādi` nav; `[]` nozīmē tukšu `citādi {}`; netukšs masīvs satur `citādi` ķermeņa AST; `citādi ja` ir viena iegulta `Nosacījums` mezgla masīvs.

`Darbība.atgriezesTips` un `Metode.atgriezesTips` ir saskaņoti ar šo noteikumu: ja atgriezes tips nav norādīts, to vērtība ir `null`. Norādīts atgriezes tips joprojām ir virkne.

`Iegūšana.atgriezesTips` paliek obligāts un parserī nedrīkst būt tukšs.

### Latviskas un semantiskas AST vērtības

AST v1 publiskajā kontraktā terminoloģijas reģistra avota identitāte netiek izmantota kā publiska AST vērtība, ja LatNe semantikai jau ir apstiprināts latvisks nosaukums.

Apstiprināts un ieviests:

- `KārtasCikls.variants: "kolekcija"` iepriekšējā `"of"` vietā;
- `PirmsIzteiksme.operators: "veids"` iepriekšējā `"typeof"` vietā;
- AST specifikācijas tipa pierakstā izmanto LatNe tipus, piemēram `teksts`, `loģisks` un `skaitlis`, nevis TypeScript / JavaScript `string`, `boolean` un `Number`;
- deklarāciju AST vērtības ir `konstante`, `mainīgais` un `funkcijasMainīgais`, nevis `const`, `let` un `var`.

Leksiskais un sintaktiskais analizators drīkst iekšēji turpināt izmantot terminoloģijas reģistra `source` identitāti konstrukciju atpazīšanai. Šī iekšējā identitāte nav AST v1 publiskā semantika.

## Apstiprinātais KārtasCikls tvērums

`KārtasCikls` AST v1 atbalsta abas LatNe `kam` formas:

- secīgu iešanu pa kolekciju ar `variants: "kolekcija"`;
- klasisku trīsdaļīgu skaitītāja cikla galveni ar `variants: "skaitītājs"`.

Skaitītāja cikla apstiprinātie lauki ir `sākums`, `nosacījums` un `solis`. Parseris sadala galveni trīs augšējā līmeņa daļās, `sākums` analizē kā vienu `Mainīgais` deklarāciju, bet `nosacījums` un `solis` analizē ar pilno izteiksmju analizatoru.

Iepriekšējais `variants: "vispārīgs"` starpstāvoklis vairs netiek veidots.

## Atlikušie jautājumi AST v1 kontraktam

Pēc faktiskā lauku audita vēl jāpieņem lēmumi par:

1. `Imports.avots` formu pretstatā `Teksts.vērtība` / `Teksts.pieraksts`.

Tikai pēc šo punktu apstiprināšanas drīkst pabeigt visu lauku statusu kā **obligāts**, **izvēles** vai **pārejas** un pēc tam virzīties uz `spec/ast-v1.md`.
