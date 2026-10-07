# Kļūdas un atklājumi

Šeit glabājam lietas, kuras bija pietiekami svarīgas, lai tās vairs nevajadzētu atklāt no jauna.

---

## 2026-09-30 — K0001 — Vizuālā identitāte nav projekta bloķētājs

**Novērojums:** vairāki hero SVG eksperimenti nespēja pārliecinoši nodot latvisku identitāti.

**Atklājums:** projekta sākumu nevajag aizkavēt, mēģinot priekšlaicīgi noslēgt vizuālo identitāti.

**Lēmums:** hero/logo darbs tiek atlikts. Valodas kodols un dokumentācija ir prioritāte.

**Mācība:** zīmola vizuālā forma var nobriest kopā ar pašu projektu.

---

## 2026-09-30 — K0002 — Git procesa exit code nav PowerShell kļūda

**Novērojums:** Windows PowerShell 5.1 turpināja `START-LATNE.ps1` pēc tam,
kad `git diff --cached --check` atrada whitespace kļūdas.

**Iemesls:** ārējas programmas nenulles exit code nav automātiski
PowerShell terminating error.

**Lēmums:** LatNe PowerShell automatizācijā kritiskiem ārējo procesu
izsaukumiem eksplicīti jāpārbauda `$LASTEXITCODE`.

**Mācība:** `$ErrorActionPreference = "Stop"` viena pati nav pietiekama
Git/Node/pnpm un citu native procesu drošības garantija.
---

## 2026-09-30 — K0003 — Corepack nepieņem nepilnu pnpm versiju

**Novērojums:** Vārdu kalves dependency instalācija apstājās pirms darba sākšanas.

**Kļūda:** `packageManager` bija norādīts kā `pnpm@10`.

**Iemesls:** Corepack sagaida pilnu semver versiju.

**Lēmums:** repozitorijā tiek fiksēta precīza pnpm versija.

**Mācība:** toolchain versijām jābūt reproducējamām un precīzi fiksētām.
---

## 2026-09-30 — K0004 — pnpm var izveidot lockfile arī bez dependency instalācijas

**Novērojums:** `pnpm-lock.yaml` parādījās pēc pnpm versijas pārbaudes.

**Sekas:** drošības pārbaude pareizi bloķēja nākamo build soli.

**Lēmums:** pēc toolchain komandām pārbaudīt ne tikai exit code bet arī Git darba koku.

**Mācība:** pat šķietami nekaitīga toolchain komanda var mainīt repozitoriju.
---

## 2026-09-30 — K0005 — TypeScript nepazina Vite CSS importu

**Novērojums:** pirmais Vārdu kalves build apstājās ar `TS2882`.

**Iemesls:** TypeScript nebija pieslēgti Vite klienta tipi.

**Labojums:** pievienots `src/vite-env.d.ts`.

**Rezultāts:** TypeScript pārbaude un Vite production build izdevās.

**Mācība:** frontend toolchain tipiem jābūt deklarētiem eksplicīti.
---

## 2026-09-30 — K0006 — PowerShell vienas rindas izvadi var pārvērst par scalar string

**Novērojums:** drošības pārbaude apstājās lai gan `git status --porcelain` rādīja tieši vienu paredzēto failu.

**Iemesls:** Windows PowerShell vienas rindas komandas izvadi piešķīra kā `String` nevis masīvu.

Tāpēc `$Status[0]` nozīmēja pirmo simbolu nevis pirmo statusa rindu.

**Labojums:** ārējo komandu izvadi kas paredzēta kā saraksts ietīt `@(...)`.

**Mācība:** PowerShell skriptos nevar pieņemt ka vienas un vairāku rindu native command izvadei vienmēr būs vienāda kolekcijas semantika.

---

## 2026-10-01 — K0007 — System.IO relatīvie ceļi var neatbilst PowerShell atrašanās vietai

**Novērojums:** pēc `Set-Location` uz LatNe repozitoriju `System.IO.File.WriteAllText` ar relatīvu ceļu mēģināja rakstīt zem `C:\Users\qvarc`, nevis repozitorijā.

**Labojums:** failu operācijām, kas izmanto `System.IO.File`, veidot absolūtos ceļus ar `Join-Path $Repo ...`.

**Mācība:** PowerShell atrašanās vieta un .NET failu API procesa darba direktorija nav droši uzskatāmas par vienu un to pašu.

---

## 2026-10-01 — K0008 — String.replace ar teksta meklējumu aizstāj tikai pirmo sakritību

**Novērojums:** expression parsera pieslēgšanas patch skripts nomainīja tikai pirmo identisko `izteiksmesTeksts(...)` fragmentu.

Drošības pārbaude apturēja patch pirms bojāta `parser.mjs` saglabāšanas.

**Iemesls:** JavaScript `String.prototype.replace` ar string meklējuma argumentu aizstāj tikai pirmo sakritību.

**Labojums:** vietās, kur paredzamas vairākas identiskas sakritības, izmantot kontrolētu visu sakritību aizstāšanu un pēc patch pārbaudīt, ka vecā konstrukcija vairs nepastāv.

**Mācība:** teksta patch skriptiem jāvalidē ne tikai paredzētā jaunā konstrukcija, bet arī vecās konstrukcijas pilnīga pazušana.

---

## 2026-10-08 — K0009 — Latviskie identifikatori tika transliterēti pirms AST v1

**Novērojums:** AST v1 sagatavošanas laikā tika pamanīts, ka jaunajam pirmkoda diapazona kontraktam bija piedāvātas formas `sakums` un `nobide` pareizo `sākums` un `nobīde` vietā.

**Audits:** pārbaudot esošo lexer/parser/AST kodolu, tika atrasti 327 kritiski transliterētu identifikatoru lietojumi 25 formām.

**Iemesls:** iepriekšējos parsera attīstības soļos JavaScript identifikatori tika rakstīti bez latviešu diakritiskajām zīmēm, lai gan LatNe projektam nebija tehniska iemesla šo ierobežojumu ieviest.

**Sekas:** ja AST v1 tiktu stabilizēts šādā formā, transliterētie lauku un API nosaukumi kļūtu par ilgtermiņa saderības parādu.

**Labojums:** normalizēti lexer/parser eksporti, tokenu un AST lauki, kā arī saistītie iekšējie identifikatori. Repo-wide pārbaude pēc labojuma neatrod vecos publiskos transliterētos identifikatorus.

**Aizsardzība:** pilnajai kvalitātes ķēdei pievienota `check:identifikatori` pārbaude, kas rekursīvi pārbauda LatNe valodas kodolu un testus.

**Mācība:** LatNe-owned latvisks identifikators nav "tehnisks ASCII nosaukums". Ja JavaScript atbalsta vajadzīgo Unicode identifikatoru, jāizmanto pareiza latviešu rakstība jau pirms publiskā kontrakta stabilizācijas.
