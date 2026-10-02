import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");

const sourcePath = path.join(rootDir, "site", "index.html");
const outputDir = path.join(rootDir, "site", "en");
const outputPath = path.join(outputDir, "index.html");

let html = await readFile(sourcePath, "utf8");

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const replaceRequired = (source, from, to, label) => {
  if (!source.includes(from)) {
    throw new Error(`Missing source fragment: ${label}`);
  }

  return source.replace(from, to);
};

const replaceLooseRequired = (source, from, to) => {
  const pattern = from
    .trim()
    .split(/\s+/)
    .map(escapeRegExp)
    .join("\\s+");

  const check = new RegExp(pattern);

  if (!check.test(source)) {
    throw new Error(`Missing translation source: ${from}`);
  }

  return source.replace(new RegExp(pattern, "g"), to);
};

html = replaceRequired(
  html,
  '<html lang="lv">',
  '<html lang="en">',
  "html language"
);

html = replaceRequired(
  html,
  'href="./styles.css"',
  'href="../styles.css"',
  "stylesheet path"
);

html = replaceRequired(
  html,
  '<script src="./app.js" defer></script>',
  '<script src="../app.js" defer></script>',
  "app path"
);

html = replaceRequired(
  html,
  '<link rel="canonical" href="https://qvarcy.github.io/LatNe/">',
  '<link rel="canonical" href="https://qvarcy.github.io/LatNe/en/">',
  "English canonical"
);

html = replaceRequired(
  html,
  '<meta property="og:url" content="https://qvarcy.github.io/LatNe/">',
  '<meta property="og:url" content="https://qvarcy.github.io/LatNe/en/">',
  "English Open Graph URL"
);

html = replaceRequired(
  html,
  '<meta property="og:locale" content="lv_LV">',
  '<meta property="og:locale" content="en_US">',
  "English Open Graph locale"
);

html = replaceRequired(
  html,
  '<meta property="og:locale:alternate" content="en_US">',
  '<meta property="og:locale:alternate" content="lv_LV">',
  "English alternate locale"
);

html = replaceRequired(
  html,
  '"url": "https://qvarcy.github.io/LatNe/"',
  '"url": "https://qvarcy.github.io/LatNe/en/"',
  "structured data URL"
);

html = replaceRequired(
  html,
  '"inLanguage": "lv"',
  '"inLanguage": "en"',
  "structured data language"
);

const lvSwitch = `<div class="language-switch" aria-label="Valoda">
        <span
          class="language-current"
          aria-current="page"
        >
          LV
        </span>

        <span
          class="language-separator"
          aria-hidden="true"
        >
          /
        </span>

        <a
          href="./en/"
          hreflang="en"
          lang="en"
        >
          EN
        </a>
      </div>`;

const enSwitch = `<div class="language-switch" aria-label="Language">
        <a
          href="../"
          hreflang="lv"
          lang="lv"
        >
          LV
        </a>

        <span
          class="language-separator"
          aria-hidden="true"
        >
          /
        </span>

        <span
          class="language-current"
          aria-current="page"
        >
          EN
        </span>
      </div>`;

html = replaceRequired(
  html,
  lvSwitch,
  enSwitch,
  "language switch"
);

const translations = [
  [
    "LatNe — latviešu programmēšanas valoda | Programmē latviski",
    "LatNe — Latvian programming language | Program in Latvian"
  ],
  [
    "LatNe ir neatkarīga atvērtā pirmkoda programmēšanas valoda latviešu valodā. Apskati valodas kodolu, ceļa karti, dokumentāciju un izstrādes progresu.",
    "LatNe is an independent open-source programming language built for Latvian. Explore the language core, roadmap, documentation and development progress."
  ],
  [
    "Neatkarīga atvērtā pirmkoda programmēšanas valoda latviešu valodā. Seko LatNe kodola, AST, CLI un izstrādes vides attīstībai.",
    "An independent open-source programming language built for Latvian. Follow the development of the LatNe core, AST, CLI and developer environment."
  ],
  [
    "Neatkarīga atvērtā pirmkoda programmēšanas valoda latviešu valodā.",
    "An independent open-source programming language built for Latvian."
  ],
  [
    "LatNe ir neatkarīga latviska programmēšanas valoda un topošā izstrādes vide, kur latviešu valoda nav dekorācija — tā ir programmēšanas pieredzes pamats.",
    "LatNe is an independent programming language and emerging development environment built for Latvian, where the language is not decoration — it is part of the programming experience."
  ],
  [
    "Procents rāda pabeigto daļu no šobrīd definētajiem ceļa kartes uzdevumiem. Paplašinot projekta robežas, kopējais uzdevumu skaits var pieaugt.",
    "The percentage shows completed work from the currently defined roadmap. As the project scope becomes more precise, the total number of tasks may grow."
  ],
  [
    "LatNe tiek veidota gan cilvēkiem, kuri programmēšanu vēl tikai apgūst, gan izstrādātājiem, kurus interesē pati valodas arhitektūra un tās rīki.",
    "LatNe is being built both for people learning programming and for developers interested in language architecture and tooling."
  ],
  [
    "Pēc valodas kodola un CLI minimuma taps pirmais mācību ceļš, skolēnu uzdevumi, skolotāja materiāli un vienkāršs playground.",
    "Once the language core and CLI minimum are ready, the first learning path, student exercises, teacher materials and a simple playground will follow."
  ],
  [
    "Sintaktiskie analizatori, AST, Unicode, terminoloģija, diagnostika, koda ģenerēšana un izstrādes rīki tiek veidoti kā atvērts tehnisks projekts.",
    "Parsers, AST, Unicode, terminology, diagnostics, code generation and developer tooling are being built as an open technical project."
  ],
  [
    "Te nav jāgaida, līdz valoda būs gatava. Noder kods, testēšana, dokumentācija, terminoloģijas argumenti, piemēri un labi formulētas idejas.",
    "You do not need to wait until the language is finished. Code, testing, documentation, terminology discussions, examples and well-framed ideas are all useful."
  ],
  [
    "Īpaši vērtīgi ir priekšlikumi, kas saglabā LatNe latvisku, dabisku un tehniski konsekventu.",
    "Proposals that keep LatNe natural in Latvian and technically consistent are especially valuable."
  ],
  [
    "Gatavie posmi ir dzīvi. Dzintara posms rāda pašreizējo izstrādes darbu, bet pelēkie posmi vēl ir priekšā.",
    "Working stages are shown as active. The amber stage marks the current engineering work, while the grey stages are still ahead."
  ],
  [
    "Pelēkie posmi ir publiski ieplānoti, bet netiek pasniegti kā gatavas LatNe iespējas. Aktīvs kļūst tikai tas, kas reāli darbojas.",
    "Grey stages are publicly planned, but they are not presented as finished LatNe features. A stage becomes active only when it actually works."
  ],
  [
    "Node.js izpildvides kontrakts, tīra atkarību instalācija, GitHub Actions CI un pirmā regresijas paraugu sistēma.",
    "Node.js runtime contract, clean install, GitHub Actions CI and the first regression fixture suite."
  ],
  [
    "Lauki, pieejamības modifikatori, konstruktors, parametri un getter struktūra.",
    "Fields, access modifiers, constructor, parameters and getter structure."
  ],
  [
    "Stabils mezglu, pirmkoda diapazona un sintaktiskā analizatora/koda ģenerēšanas robežas kontrakts pirms nopietnas koda ģenerēšanas.",
    "A stable contract for nodes, source spans and the parser/codegen boundary before substantial code generation."
  ],
  [
    "Pirmais semantiskais API slānis, kur operācijas tiek sasaistītas ar tipu un nozīmi, nevis pārsauktas tekstā.",
    "The first semantic API layer, where operations are bound to types and meaning instead of being renamed as text."
  ],
  [
    "Semantiskās transformācijas, JavaScript koda ģenerēšana un pirmā programma, kas iziet visu LatNe apstrādes ķēdi.",
    "Semantic transforms, JavaScript code generation and the first program to pass through the complete LatNe processing pipeline."
  ],
  [
    "Diagnostika, pirmkoda kartes, redaktoru rīki, mācību pieredze un tikai pēc tam plašāks LatNe web slānis.",
    "Diagnostics, source maps, editor tooling, learning experience and only then a broader LatNe web layer."
  ],
  [
    "Pirmajā paraugā jau pamanījām nākamo robežu: JavaScript standarta API nosaukumus. LatNe tos negrib vienkārši mehāniski pārsaukt.",
    "The first sample already exposed the next boundary: JavaScript standard API names. LatNe does not aim to rename them mechanically."
  ],
  [
    "Mērķis ir semantisks API slānis, kur tulkojums ir saistīts ar konkrētu tipu vai operāciju.",
    "The goal is a semantic API layer where a LatNe name is bound to a specific type or operation."
  ],
  [
    "LatNe tiek projektēta kā patstāvīga sistēma ar savu terminoloģiju, arhitektūru un attīstības vēsturi.",
    "LatNe is designed as an independent system with its own terminology, architecture and development history."
  ],
  [
    "Latviešu valoda ir programmēšanas pieredzes sākumpunkts, nevis dokumentācijas papildinājums.",
    "Latvian is the starting point of the programming experience, not an addition to the documentation."
  ],
  [
    "Ārēji rīki drīkst būt tehniski būvbloki, bet tie nenosaka LatNe identitāti vai publisko arhitektūru.",
    "External tools may be technical building blocks, but they do not define LatNe's identity or public architecture."
  ],
  [
    "Lēmumi, kļūdas un atklājumi tiek saglabāti, lai redzams būtu ne tikai rezultāts, bet arī ceļš līdz tam.",
    "Decisions, mistakes and discoveries are preserved so that both the result and the path to it remain visible."
  ],
  [
    "Skaitļi tiek ģenerēti tieši no `ROADMAP.md`. Procents ir pašreiz definētā plāna progress, nevis absolūta produkta gatavība.",
    "The numbers are generated directly from `ROADMAP.md`. The percentage measures progress through the currently defined plan, not absolute product readiness."
  ],
  [
    "Seko attīstībai, piedalies lēmumos, atzīmē projektu GitHub vai palīdz tam turpināt augt ar finansiālu atbalstu.",
    "Follow development, take part in discussions, star the project on GitHub or support the work financially."
  ],
  [
    "Ja LatNe šķiet interesants, GitHub zvaigzne ir vienkāršs veids, kā sekot projektam un palīdzēt tam kļūt pamanāmākam.",
    "If LatNe interests you, a GitHub star is a simple way to follow the project and help it become more visible."
  ],
  [
    "Šie projekta slāņi jau eksistē repozitorijā un ir izmantojami LatNe izstrādes procesā.",
    "These project layers already exist in the repository and are used in LatNe development."
  ],
  [
    "Kanonisks valodas terminu reģistrs ar cilvēka vadītu apstiprināšanas procesu.",
    "A canonical language terminology registry with a human-guided approval process."
  ],
  [
    "`.lat` avots tiek sadalīts strukturētos tokenos ar Unicode identifikatoru un kanoniskās termina identitātes atbalstu.",
    "`.lat` source code is split into structured tokens with Unicode identifier and canonical term identity support."
  ],
  [
    "Importi, deklarācijas, vadības plūsma, kļūdu apstrāde un darbības ķermeņa konstrukcijas jau iegūst strukturētu AST.",
    "Imports, declarations, control flow, error handling and function-body constructs already produce structured AST."
  ],
  [
    "LatNe saprot identifikatorus, literāļus, izsaukumus, īpašības, `gaidi`, `jauns`, masīvus un pirmās operatoru prioritātes.",
    "LatNe understands identifiers, literals, calls, properties, the `gaidi` and `jauns` constructs, arrays and the first operator-precedence rules."
  ],
  [
    "Terminoloģijas darba vide valodas vārdu pārlūkošanai, validēšanai, rediģēšanai un apstiprināšanai.",
    "A terminology workspace for reviewing, validating, editing and approving language terms."
  ],
  [
    "Statuss, lēmumi, tehniskais žurnāls, hronika un atklājumi dzīvo kopā ar kodu.",
    "Status, decisions, technical journal, project history and discoveries live alongside the code."
  ],
  [
    "Projektam vari palīdzēt arī bez nevienas koda rindas.",
    "You can help LatNe even without writing a line of code."
  ],
  [
    "Nākamais: reproducējama vide un kvalitātes sliedes",
    "Next: reproducible environment and quality gates"
  ],
  [
    "Fāze 0A — reproducējama vide un kvalitātes sliedes",
    "Phase 0A — reproducible environment and quality gates"
  ],
  [
    "LatNe mācībām un izstrādei.",
    "LatNe for learning and building."
  ],
  [
    "Programmēšanas jēdzieni dzimtajā valodā.",
    "Programming concepts in Latvian."
  ],
  [
    "Education MVP sāksies tikai tad, kad LatNe būs reāli palaižama.",
    "The Education MVP starts only after LatNe can actually be run."
  ],
  [
    "LatNe vari palīdzēt būvēt arī tu.",
    "You can help build LatNe."
  ],
  [
    "No `.lat` faila līdz programmai.",
    "From a `.lat` file to a running program."
  ],
  [
    "Latviskums nebeidzas pie atslēgvārdiem.",
    "Latvian-first goes beyond keywords."
  ],
  [
    "Ne tikai pārtulkots kods.",
    "More than translated code."
  ],
  [
    "Pievienojies, kamēr viss vēl top.",
    "Follow along while LatNe is being built."
  ],
  [
    "LatNe jau nav tikai ideja.",
    "LatNe is already more than an idea."
  ],
  [
    "LatNe koda piemērs",
    "LatNe code example"
  ],
  [
    "LatNe GitHub repozitorijs",
    "LatNe GitHub repository"
  ],
  [
    "LatNe ceļa kartes progress",
    "LatNe roadmap progress"
  ],
  [
    "Galvenā navigācija",
    "Main navigation"
  ],
  [
    "LatNe sākums",
    "LatNe home"
  ],
  [
    "Atvērtā pirmkoda projekts",
    "Open-source project"
  ],
  [
    "Patīk LatNe? GitHub ★",
    "LatNe on GitHub ★"
  ],
  [
    "Palīdzi LatNe augt",
    "Help LatNe grow"
  ],
  [
    "Ja projekts šķiet interesants",
    "If the project interests you"
  ],
  [
    "Brīvprātīgs atbalsts",
    "Voluntary support"
  ],
  [
    "% no pašreizējās ceļa kartes",
    "% of the current roadmap"
  ],
  [
    "definēti uzdevumi",
    "defined tasks"
  ],
  [
    "Balstīts uz ROADMAP.md",
    "Based on ROADMAP.md"
  ],
  [
    "Pieejams šobrīd",
    "Available now"
  ],
  [
    "termini apstiprināti",
    "terms approved"
  ],
  [
    "leksiskie elementi pirmajā paraugā",
    "tokens in the first sample"
  ],
  [
    "augšējā līmeņa AST mezgli",
    "top-level AST nodes"
  ],
  [
    "vairs nav tikai tokenu teksts",
    "no longer just token text"
  ],
  [
    "kanonisks patiesības avots",
    "canonical source of truth"
  ],
  [
    "lēmumiem ir saglabāts “kāpēc”",
    "decisions preserve the “why”"
  ],
  [
    "Divi LatNe virzieni",
    "Two LatNe paths"
  ],
  [
    "Valodas kodols top publiski.",
    "The language core is built in public."
  ],
  [
    "Darba plūsma un principi",
    "Workflow and principles"
  ],
  [
    "Issue, kļūda vai priekšlikums",
    "Issue, bug or proposal"
  ],
  [
    "Skaties aktuālo ceļa karti",
    "View the current roadmap"
  ],
  [
    "Ceļš līdz pirmajai izpildei",
    "Path to first execution"
  ],
  [
    "avota kods",
    "source code"
  ],
  [
    "sintaktiskie analizatori darbojas",
    "parsers working"
  ],
  [
    "stabils kontrakts",
    "stable contract"
  ],
  [
    "Izpildes secība",
    "Execution order"
  ],
  [
    "Kas ir nākamais.",
    "What comes next."
  ],
  [
    "Valodas nākamā robeža",
    "Next language boundary"
  ],
  [
    "LatNe API minimums",
    "LatNe API minimum"
  ],
  [
    "Pirmā `.lat` izpilde",
    "First `.lat` execution"
  ],
  [
    "Pilnāka izstrādes vide",
    "Broader development environment"
  ],
  [
    "Topošais API slānis",
    "Emerging API layer"
  ],
  [
    "Šobrīd paraugā",
    "Current sample"
  ],
  [
    "LatNe virziens",
    "LatNe direction"
  ],
  [
    "Neatkarīga sistēma",
    "Independent system"
  ],
  [
    "Dokumentēta evolūcija",
    "Documented evolution"
  ],
  [
    "Progress pa fāzēm.",
    "Progress by phase."
  ],
  [
    "Identitāte un projekta pamats",
    "Identity and project foundation"
  ],
  [
    "Reproducējama vide un kvalitātes sliedes",
    "Reproducible environment and quality gates"
  ],
  [
    "Valodas kodols līdz AST v1",
    "Language core through AST v1"
  ],
  [
    "LatNe iebūvētā API minimums",
    "Built-in LatNe API minimum"
  ],
  [
    "Pirmā izpildāmā LatNe",
    "First executable LatNe"
  ],
  [
    "Diagnostika un izstrādātāja pieredze",
    "Diagnostics and developer experience"
  ],
  [
    "Dokumentācija un mācīšanās ceļš",
    "Documentation and learning path"
  ],
  [
    "Web un plašāka izstrādes vide",
    "Web and broader development environment"
  ],
  [
    "LatNe aug publiski",
    "LatNe grows in public"
  ],
  [
    "Projekts uzsākts 30.09.2026",
    "Project started 2026-09-30"
  ],
  [
    "Programmē latviski.",
    "Program in Latvian."
  ],
  [
    "Programmē",
    "Program"
  ],
  [
    "latviski.",
    "in Latvian."
  ],
  [
    "Kas darbojas",
    "What's working"
  ],
  [
    "Virzieni",
    "Paths"
  ],
  [
    "Attīstība",
    "Progress"
  ],
  [
    "Līdzdarboties",
    "Contribute"
  ],
  [
    "Nākotne",
    "Roadmap"
  ],
  [
    "Atbalsti",
    "Support"
  ],
  [
    "Atbalstīt projektu",
    "Support the project"
  ],
  [
    "Atbalsti projektu",
    "Support the project"
  ],
  [
    "Skatīt kodu",
    "View code"
  ],
  [
    "Dokumentācija",
    "Documentation"
  ],
  [
    "Ceļa karte",
    "Roadmap"
  ],
  [
    "Leksiskais analizators",
    "Tokenizer"
  ],
  [
    "Sintaktiskais analizators",
    "Parser"
  ],
  [
    "Izpilde top",
    "Execution planned"
  ],
  [
    "Atbalstīt GitHub ★",
    "LatNe on GitHub ★"
  ],
  [
    "Līdzdarbojies",
    "Contribute"
  ],
  [
    "Kods, idejas, valoda",
    "Code, ideas, language"
  ],
  [
    "Projekta attīstība",
    "Project progress"
  ],
  [
    "DARBOJAS",
    "WORKING"
  ],
  [
    "Terminoloģija",
    "Terminology"
  ],
  [
    "Skatīt reģistru →",
    "View registry →"
  ],
  [
    "Skatīt leksisko analizatoru →",
    "View tokenizer →"
  ],
  [
    "Skatīt sintaktisko analizatoru →",
    "View parser →"
  ],
  [
    "Izteiksmju AST",
    "Expression AST"
  ],
  [
    "Skatīt izteiksmju sintaktisko analizatoru →",
    "View expression parser →"
  ],
  [
    "Skatīt Vārdu kalvi →",
    "View Vārdu kalve →"
  ],
  [
    "DZĪVS",
    "LIVE"
  ],
  [
    "Dokumentēta attīstība",
    "Documented development"
  ],
  [
    "Lasīt dokumentāciju →",
    "Read documentation →"
  ],
  [
    "PLĀNOTS",
    "PLANNED"
  ],
  [
    "Mācies ar LatNe",
    "Learn with LatNe"
  ],
  [
    "ATVĒRTS",
    "OPEN"
  ],
  [
    "Būvē ar LatNe",
    "Build with LatNe"
  ],
  [
    "Skatīt arhitektūru →",
    "View architecture →"
  ],
  [
    "Atvērts projekts",
    "Open project"
  ],
  [
    "Sāc līdzdarboties",
    "Contribute to LatNe"
  ],
  [
    "Piedāvā ideju",
    "Share an idea"
  ],
  [
    "Atrodi nākamo darbu",
    "Find the next task"
  ],
  [
    "Sekot projektam GitHub ★",
    "Project on GitHub ★"
  ],
  [
    "Leksiskie elementi",
    "Tokens"
  ],
  [
    "Koda ģenerēšana",
    "Codegen"
  ],
  [
    "ATSKAITES PUNKTS",
    "MILESTONE"
  ],
  [
    "leksiskais analizators",
    "tokenizer"
  ],
  [
    "AST pamats",
    "AST foundation"
  ],
  [
    "Kvalitāte",
    "Quality"
  ],
  [
    "NĀKAMAIS",
    "NEXT"
  ],
  [
    "PĒC TAM",
    "AFTER THAT"
  ],
  [
    "Klases ķermeņa AST",
    "Class body AST"
  ],
  [
    "VĒLĀK",
    "LATER"
  ],
  [
    "Principi",
    "Principles"
  ],
  [
    "Šobrīd paraugā",
    "Current sample"
  ],
  [
    "LatNe GitHub ★",
    "LatNe GitHub ★"
  ],
  [
    "Piedāvāt ideju",
    "Share an idea"
  ],
  [
    "☕ Atbalstīt",
    "☕ Support"
  ],
  [
    "Fāze",
    "Phase"
  ]
];

const uniqueTranslations = new Map();

for (const [from, to] of translations) {
  if (
    uniqueTranslations.has(from) &&
    uniqueTranslations.get(from) !== to
  ) {
    throw new Error(
      `Conflicting translations for source: ${from}`
    );
  }

  if (!uniqueTranslations.has(from)) {
    uniqueTranslations.set(from, to);
  }
}

[...uniqueTranslations.entries()]
  .sort((a, b) => b[0].length - a[0].length)
  .forEach(([from, to]) => {
    html = replaceLooseRequired(html, from, to);
  });

const visibleText = html
  .replace(/<pre[\s\S]*?<\/pre>/gi, " ")
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/Vārdu kalve/g, " ")
  .replace(/\s+/g, " ")
  .trim();

if (/[āčēģīķļņšūžĀČĒĢĪĶĻŅŠŪŽ]/.test(visibleText)) {
  throw new Error(
    `English page still contains untranslated Latvian diacritics: ${visibleText}`
  );
}

const forbidden = [
  "Leksiskais analizators",
  "Sintaktiskais analizators",
  "Principi",
  "Darbojas",
  "Atbalsti projektu",
  "Līdzdarboties",
  "Ceļa karte",
  "Projekta attīstība"
];

for (const value of forbidden) {
  if (visibleText.includes(value)) {
    throw new Error(`English page still contains Latvian text: ${value}`);
  }
}

if (!html.includes('<html lang="en">')) {
  throw new Error("English lang attribute missing");
}

if (
  !html.includes(
    '<link rel="canonical" href="https://qvarcy.github.io/LatNe/en/">'
  )
) {
  throw new Error("English canonical URL missing");
}

if (!html.includes('href="../styles.css"')) {
  throw new Error("English stylesheet path missing");
}

if (!html.includes('src="../app.js"')) {
  throw new Error("English app path missing");
}

await mkdir(outputDir, { recursive: true });

await writeFile(
  outputPath,
  `${html.trimEnd()}\n`,
  "utf8"
);

console.log("LatNe English site generated: site/en/index.html");
