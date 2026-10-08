# LatNe hronika

Šis ir cilvēkam lasāmais LatNe stāsts.

Te nekrājam katru komandrindas izvadi. Te saglabājam projekta nozīmīgos pagriezienus — idejas, vilšanās, atradumus, arhitektūras maiņas, pirmos panākumus un iemeslus, kāpēc projekts kļuva tāds, kāds tas ir.

---

## 2026-09-30 — Projekta sākums

LatNe pārstāja būt tikai sarunas ideja un kļuva par projektu.

Nosaukums **LatNe** tika izvēlēts pēc vairāku latvisku identitāšu meklēšanas. `.lat` tika fiksēts kā avota failu paplašinājums. Tika nolemts, ka projekta galvenā vērtība nebūs tikai latviska sintakse, bet pilnīgi latviska izstrādātāja pieredze.

Pirms pirmās koda rindas tika pieņemts vēl viens būtisks lēmums: **dokumentācija būs tikpat svarīga kā pats kods**.

Tāpēc LatNe sākas nevis ar compileri, bet ar atmiņu.

Mēs gribam, lai pēc gadiem ir iespējams izlasīt ne tikai gala dokumentāciju, bet visu cīņu — kas nestrādāja, ko pārpratām, ko izmetām, ko atklājām un kāpēc katrs svarīgais lēmums tika pieņemts.

Nākamais posms: repozitorija pamats, terminoloģijas sistēma un pirmais valodas kodols.
---

## 2026-09-30 — Pirmais valodas materiāls

Pēc repozitorija sakārtošanas LatNe pirmo reizi pieskārās pašai valodai.

Netika uzrakstīts neviens atslēgvārda tulkojums.

Tā vietā tika savākti 84 JavaScript un TypeScript sintakses kandidāti un katrs no tiem apzināti atstāts gaidīšanas stāvoklī.

Tas nostiprināja vienu no projekta pamatprincipiem: LatNe sintakse netiks radīta ar masveida vārdu aizvietošanu.

Katram vārdam un katrai konstrukcijai būs jāiztur atsevišķs lēmums.
---

## 2026-09-30 — LatNe nonāk GitHub

LatNe projekta sākuma dienas vakarā projekts pirmo reizi tika publicēts GitHub.

Repozitorijs netika publicēts tukšs.

Tajā jau bija projekta manifests dokumentēšanas sistēma terminoloģijas inventārs un pirmais Vārdu kalves karkass.

Pirms pirmās publicēšanas tika atrastas arī pirmās toolchain problēmas.

Corepack pieprasīja precīzu pnpm versiju un TypeScript sākotnēji nepazina Vite CSS importu.

Abas problēmas tika saglabātas projekta vēsturē nevis izdzēstas no tās.
---

## 2026-09-30 — Pirmais LatNe vārds tiek apstiprināts

Vārdu kalve pirmo reizi tika izmantota nevis testa datiem bet reālam LatNe terminoloģijas lēmumam.

JavaScript/TypeScript kandidāts `class` tika apstiprināts ar LatNe variantu `klase`.

Tas kļuva par pirmo kanoniskajā terminoloģijas reģistrā apstiprināto LatNe terminu.

---

## 2026-10-01 — No vārdiem līdz strukturētam AST

Vienas dienas laikā LatNe pārgāja no terminoloģijas projekta uz pirmo reāli strādājošo valodas apstrādes ķēdi.

Visi 84 sintakses kandidāti tika cilvēka vadīti izskatīti un apstiprināti. Pēc tam pirmais `.lat` paraugs tika izlaists caur LatNe leksisko analizatoru, kas izveidoja 196 leksiskos elementus bez neviena nezināma simbola.

Tam sekoja pirmais sintaktiskais analizators. Sākumā tas saprata tikai programmas augšējo struktūru — importu, saskarsmi, uzskaitījumu, klasi un darbību. Pēc tam darbības ķermenis tika sadalīts mainīgajos, nosacījumos, ciklos, atgriešanā un kļūdu apstrādē.

Nākamajā solī izteiksmes pārstāja būt tikai tokenu teksts.

`ieraksts.vārds == nekas` kļuva par bināru AST izteiksmi. `gaidi lasiDatus(...)` kļuva par gaidīšanas un izsaukuma mezgliem. `jauns Lietotājs(...)` ieguva konstruktora un argumentu struktūru.

LatNe vēl nevar palaist programmu, bet pirmo reizi tā jau spēj strukturēti saprast ievērojamu daļu sava pirmā avota faila.

---

## 2026-10-01 — Parādās otrais valodas slānis

Pārskatot pirmo strukturēto AST, kļuva redzams, ka latviska sintakse viena pati vēl neveido pilnīgi latvisku programmēšanas pieredzi.

Paraugā palika `push` un `length`.

Tie nav LatNe atslēgvārdi. Tie ir ārējā runtime standarta API nosaukumi.

Tas noveda pie atsevišķa LatNe API terminoloģijas slāņa idejas.

`push` pirmais kandidāts ir `pievieno`, bet `length` — `garums`.

Svarīgākais lēmums bija tos netulkot ar aklu teksta aizvietošanu. LatNe būs jāzina, ar kāda tipa objektu operācija tiek veikta.

Tādējādi projekts ieguva jaunu robežu starp valodas sintaksi un latvisku standarta API.

---

## 2026-10-02 — Ceļa karte kļūst par produkta plānu

Pēc pirmā valodas kodola un publiskās projekta lapas izveides LatNe sasniedza punktu, kur ar vienkāršu funkciju sarakstu vairs nepietika.

Sākotnējā ceļa karte bija veidota, lai pēc iespējas ātrāk pierādītu galveno ideju: vai `.lat` avotu iespējams tokenizēt un pārvērst strukturētā AST. Šis mērķis tika sasniegts.

Nākamajā pārskatā kļuva skaidrs, ka ceļš no darbojoša prototipa līdz kvalitatīvai programmēšanas valodai ietver daudz vairāk nekā parsera funkcijas vien.

Ceļa kartē tika pievienotas reproducējamas vides prasības, CI, regresijas paraugi, AST v1 kontrakts, diagnostikas arhitektūra, pirmais pilnais koda ģenerēšanas ceļš, bilingvāla dokumentācija un Education MVP.

Tāpēc publiskais progresa rādītājs samazinājās no iepriekšējā prototipa plāna procenta.

LatNe nezaudēja jau paveikto.

Vienkārši kļuva precīzāka pati finiša līnija.

Tika pieņemts arī svarīgs arhitektūras lēmums: pirms nopietnas koda ģenerēšanas AST v1 kļūs par dokumentētu kontraktu starp parseri un turpmākajiem kompilācijas posmiem.

Nākamais tehniskais darbs ir īss kvalitātes infrastruktūras posms, pēc kura turpināsies klases ķermeņa AST.
