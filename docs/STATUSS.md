# LatNe statuss

**Atjaunots:** 2026-10-02
**Pašreizējais valodas stāvoklis:** strukturēts AST līdz izteiksmju līmenim
**Nākamā izstrādes fāze:** 1 — klases ķermeņa AST v1

## Pašreizējā robeža

LatNe jau spēj nolasīt `.lat` avota failu un izveidot strukturētu AST līdz izteiksmju līmenim.

Darbojošā ķēde:

```text
.lat
→ leksiskie elementi
→ deklarāciju AST
→ priekšrakstu AST
→ izteiksmju AST
```

Koda ģenerēšana un programmas izpilde vēl nav ieviesta.

## Pabeigts

Terminoloģija:

- 84 kandidāti izskatīti
- 84 termini `approved`
- terminoloģijas validators
- Vārdu kalves pārlūkošana, rediģēšana un saglabāšana

Valodas kodols:

- pirmais `.lat` sintakses paraugs
- Unicode leksiskais analizators
- kanoniskās termina identitātes saglabāšana leksiskajos elementos
- augšējā līmeņa deklarāciju sintaktiskais analizators
- darbības ķermeņa priekšrakstu sintaktiskais analizators
- atsevišķs izteiksmju sintaktiskais analizators

Publiskā infrastruktūra:

- GitHub repozitorijs
- GitHub Pages projekta lapa ar LV/EN versijām
- publiskais ROADMAP
- dokumentācijas sistēma
- ADR sistēma
- contributor ceļš

Pašreizējais AST saprot:

- importu
- saskarsmi
- uzskaitījumu
- klasi augšējā līmenī
- darbību
- mainīgo deklarācijas
- `ja`
- `kam`
- `atgriez`
- `turpini`
- `beidz`
- `met`
- `mēģini`
- `ķer`
- `beigās`
- `atkļūdo`
- identifikatorus
- tekstu un skaitļus
- masīvus
- īpašību piekļuvi
- izsaukumus
- `gaidi`
- `jauns`
- loģiskās un nulles vērtības
- unārās izteiksmes
- pirmās bināro operatoru prioritātes

## Pārbaudītais pirmais paraugs

`examples/pamata-paraugs.lat`

Rezultāts:

- 196 leksiskie elementi
- 0 nezināmu simbolu
- 5 augšējā līmeņa AST mezgli
- strukturēts darbības ķermenis
- strukturētas izteiksmes

## Aktuālie ierobežojumi

Klases ķermenis vēl nav strukturēts AST.

Nav vēl:

- pilna piešķiršanas AST
- pilnas funkciju parametru struktūras
- veidņu interpolāciju AST
- pirmkoda diapazona kontrakta AST līmenī
- stabilas AST v1 specifikācijas
- LatNe API semantiskās translācijas
- koda ģeneratora
- pirmkoda kartes
- CLI kompilēšanas
- `.lat` programmas izpildes

Pirmajā paraugā vēl ir zināmi ārējā API nosaukumi:

- `push`
- `length`

Tie ir reģistrēti kā nākotnes LatNe API slāņa darbs, nevis gala LatNe API.

## Kvalitātes robeža

Fāze 0A ir pabeigta. Pirms nākamās lielākās sintaktiskā analizatora paplašināšanas ir nostiprināts reproducējamas vides un CI minimums.

Tas ietver:

- Node.js 24 LTS kā oficiāli atbalstīto izpildvides līniju (`>=24 <25`)
- tīra atkarību instalācija pārbaudīta ar pnpm 12.6.0 un frozen lockfile
- GitHub Actions CI darbojas uz Linux
- terminoloģijas validācija darbojas CI
- leksiskās analīzes pārbaude darbojas CI
- sintaktiskās analīzes pārbaude darbojas CI
- Vārdu kalves pārbaude un būvēšana darbojas CI
- regresijas paraugu sistēma
- derīgi, nederīgi, robežgadījumu un Unicode paraugi

## Nākamais valodas uzdevums pēc kvalitātes sliedēm

**Klases ķermeņa AST v1.**

Jāstrukturē:

- lauki
- pieejamības modifikatori
- `nemaināms`
- lauku tipi
- konstruktora deklarācija un parametri
- getter deklarācija un atgriezes tips

Konstruktora un gettera ķermeņus pirmajā iterācijā vēl drīkst saglabāt kā tokenu kopas.

## Ceļš līdz pirmajai palaišanai

```text
kvalitātes sliedes
→ klases AST
→ piešķiršanas AST
→ pilnāki ķermeņi
→ pirmkoda diapazoni
→ AST v1
→ API minimums
→ semantiskās transformācijas
→ koda ģenerators
→ JS starprezultāts
→ pirmā .lat izpilde
→ CLI
→ latne palaist
```

## Publiskais progress

Paplašinot ROADMAP no sākotnējā prototipa plāna līdz pilnam produkta ceļam, publiskā progresa procents samazinās.

Tas nenozīmē zaudētu progresu.

Tas nozīmē, ka projekta pabeigšanas robeža tagad ir aprakstīta precīzāk.
