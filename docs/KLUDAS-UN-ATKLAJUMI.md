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
