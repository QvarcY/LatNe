# LatNe ceļa karte

## Fāze 0 — identitāte un pamati

- [x] Fiksēt nosaukumu **LatNe**
- [x] Fiksēt `.lat` avota failu paplašinājumu
- [x] Fiksēt MIT licenci
- [x] Uzrakstīt manifestu v0.1
- [x] Ieviest dokumentācijas sistēmu
- [ ] Rezervēt `latne.lv`
- [ ] Rezervēt GitHub namespace
- [ ] Rezervēt npm `latne` / `@latne/*`

## Fāze 1 — valodas pamats

- [x] Izveidot JS/TS sintakses terminu kandidātu inventāru
- [x] Izveidot Vārdu kalves MVP
- [x] Apstiprināt pirmo LatNe atslēgvārdu kopu
- [x] Izveidot tokenizera pamatu
- [x] Izveidot parsera PoC
- [x] Definēt pirmo minimālo AST
- [x] Izveidot darbības ķermeņa statement AST
- [x] Izveidot pirmo izteiksmju AST
- [ ] Parsēt klases ķermeni
- [ ] Parsēt funkciju parametrus
- [ ] Parsēt piešķiršanas izteiksmes
- [ ] Paplašināt ciklu un vadības konstrukciju atbalstu
- [ ] Parsēt veidņu literāļu interpolācijas
- [ ] Stabilizēt pirmo AST specifikāciju
- [ ] Izveidot pirmo JS starprezultātu
- [ ] Palaist pirmo `.lat` programmu

## Fāze 1A — LatNe iebūvētais API slānis

LatNe standarta API terminoloģiju uzturēt atsevišķi no valodas
atslēgvārdu un sintakses terminoloģijas.

API nosaukumus nedrīkst ieviest kā aklu globālu teksta aizvietošanu.
Tulkojumiem jābūt sasaistītiem ar konkrētu tipu vai semantisko operāciju.

- [ ] Inventarizēt JavaScript runtime un standarta API svešķermeņus pirmajā `.lat` paraugā
- [ ] Definēt atsevišķu LatNe API terminoloģijas reģistru
- [ ] Definēt API termina datu modeli un sasaisti ar tipu
- [ ] Inventarizēt masīvu API
- [ ] Inventarizēt teksta API
- [ ] Inventarizēt skaitļu API
- [ ] Inventarizēt objektu API
- [ ] Inventarizēt kolekciju API
- [ ] Inventarizēt globālos objektus un funkcijas
- [ ] Izlemt, kuri ārējā runtime API nosaukumi LatNe kodā paliek netulkoti
- [ ] Pievienot API terminoloģijas pārbaudi Vārdu kalvei vai atsevišķam rīkam
- [ ] Nodrošināt semantisku API translāciju koda ģenerēšanas laikā

### Pirmie konstatētie kandidāti

- [ ] `Array.push` → `pievieno`
- [ ] `Array.length` → `garums`

Pirms pirmā koda ģeneratora pabeigšanas pārbaudīt visu
`examples/pamata-paraugs.lat`, lai tajā nepaliktu nejauši JavaScript
standarta API nosaukumi.

## Fāze 2 — izstrādātāja pieredze

- [ ] `latne palaist`
- [ ] Source maps
- [ ] Latviska diagnostika
- [ ] Formattera pamats
- [ ] VS Code sintakses izcelšana
- [ ] Testu fixture sistēma

## Fāze 3 — web slānis

Sākt tikai pēc tam, kad valodas kodols ir reāli lietojams un pārbaudāms.
