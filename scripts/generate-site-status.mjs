import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");

const roadmapPath = path.join(rootDir, "ROADMAP.md");
const outputPath = path.join(rootDir, "site", "project-status.json");

const roadmap = await readFile(roadmapPath, "utf8");

const phasePattern = /^## Fāze ([^—\n]+)\s*—\s*(.+)$/gm;
const matches = [...roadmap.matchAll(phasePattern)];

const phases = [];

for (let index = 0; index < matches.length; index += 1) {
  const match = matches[index];
  const start = match.index + match[0].length;
  const end = matches[index + 1]?.index ?? roadmap.length;
  const body = roadmap.slice(start, end);

  const tasks = [...body.matchAll(/^- \[([ xX])\] .+$/gm)];
  const done = tasks.filter(
    (task) => task[1].toLowerCase() === "x"
  ).length;

  const total = tasks.length;

  phases.push({
    id: match[1].trim(),
    name: match[2].trim(),
    done,
    total,
    percent: total === 0 ? null : Math.round((done / total) * 100)
  });
}

const countedPhases = phases.filter((phase) => phase.total > 0);

const done = countedPhases.reduce(
  (sum, phase) => sum + phase.done,
  0
);

const total = countedPhases.reduce(
  (sum, phase) => sum + phase.total,
  0
);

const status = {
  source: "ROADMAP.md",
  overall: {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100)
  },
  phases
};

await writeFile(
  outputPath,
  `${JSON.stringify(status, null, 2)}\n`,
  "utf8"
);

console.log(
  `LatNe site status: ${status.overall.done}/${status.overall.total} (${status.overall.percent}%)`
);

for (const phase of phases) {
  const value =
    phase.total === 0
      ? "planned"
      : `${phase.done}/${phase.total} (${phase.percent}%)`;

  console.log(`- Fāze ${phase.id}: ${value}`);
}
