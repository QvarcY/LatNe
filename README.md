# LatNe

**Programmē latviski.**

LatNe ir neatkarīgs, atvērtā pirmkoda projekts ar mērķi izveidot latvisku programmēšanas valodu un vēlāk pilna cikla tīmekļa izstrādes vidi.

- Projekta nosaukums: **LatNe**
- Avota failu paplašinājums: **`.lat`**
- CLI nosaukums: **`latne`**
- Ieņemšanas datums: **2026-09-30**
- Licence: **MIT**
- Projekta lapa: **https://qvarcy.github.io/LatNe/**

> LatNe dokumentācija ir daļa no projekta arhitektūras. Būtiski lēmumi, eksperimenti, kļūdas, atklājumi un panākumi tiek saglabāti kopā ar kodu.

## Pašreizējais mērķis

Panākt, ka pirmā `.lat` programma iziet pilnu LatNe apstrādes ķēdi un tiek palaista ar LatNe CLI.

Mērķa komanda:

```text
latne palaist sveika.lat
```

## Atsākt darbu

Ja pie projekta atgriezies pēc pārtraukuma vai sāc jaunu darba sesiju, vispirms izlasi:

[`docs/ATSAKSANA.md`](docs/ATSAKSANA.md)

Tur ir aktuālais stāvoklis, pārbaudes komandas, zināmie ierobežojumi un viens konkrēts nākamais uzdevums.

## Dokumentācija

- [`docs/ATSAKSANA.md`](docs/ATSAKSANA.md) — darba atsākšanas punkts.
- [`docs/STATUSS.md`](docs/STATUSS.md) — aktuālais tehniskais stāvoklis.
- [`ROADMAP.md`](ROADMAP.md) — projekta ceļa karte.
- [`docs/ARHITEKTURA.md`](docs/ARHITEKTURA.md) — pašreizējā valodas arhitektūra.
- [`docs/HRONIKA.md`](docs/HRONIKA.md) — cilvēkam lasāms projekta stāsts.
- [`docs/ZURNALS.md`](docs/ZURNALS.md) — detalizēts tehniskais žurnāls.
- [`docs/LEMUMI.md`](docs/LEMUMI.md) — arhitektūras lēmumu indekss.
- [`docs/KLUDAS-UN-ATKLAJUMI.md`](docs/KLUDAS-UN-ATKLAJUMI.md) — kļūdas un mācības.
- [`docs/00-IENEMSANA.md`](docs/00-IENEMSANA.md) — vēsturiskais projekta sākuma ieraksts.

## Galvenais princips

LatNe tiek projektēta kā neatkarīga sistēma.

Ārējas bibliotēkas un runtime komponentes tiek izmantotas kā tehniski būvbloki, nevis kā projekta arhitektūras vai identitātes pamats.
