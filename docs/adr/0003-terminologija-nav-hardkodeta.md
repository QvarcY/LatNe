# ADR-0003 — Terminoloģija nav hardkodēta compilerī

**Datums:** 2026-09-30  
**Statuss:** Pieņemts

## Konteksts

LatNe galvenā īpatnība ir apzināti izvēlēta latviska sintakse. Vārdu izvēle būs iteratīva un katrs būtiskais termins tiks manuāli pārskatīts.

## Lēmums

Compileris nedrīkst būt vienīgā vieta, kur definēti latviskie atslēgvārdi.

Terminoloģija tiek glabāta strukturētā reģistrā, kas kļūst par vienu patiesības avotu compilerim, dokumentācijai, editoru tooling un testiem.

## Sekas

- Terminus var pārskatīt centralizēti.
- Vārdu kalve var strādāt ar to pašu datu avotu.
- Tests var pārbaudīt, ka compileris nepieņem neapstiprinātus terminus.
