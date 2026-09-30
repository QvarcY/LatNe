\
$ErrorActionPreference = "Stop"

$Repo = $PSScriptRoot
Set-Location $Repo

Write-Host ""
Write-Host "=== LATNE — FIRST REPOSITORY INITIALIZATION ===" -ForegroundColor Cyan
Write-Host "Conception date: 2026-09-30"
Write-Host ""

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "STOP: Git nav pieejams PATH."
}

if (Test-Path ".git") {
    throw "STOP: .git jau eksistē. Šis skripts paredzēts tikai pirmajai inicializācijai."
}

$Required = @(
    "README.md",
    "MANIFESTS.md",
    "ROADMAP.md",
    "docs\00-IENEMSANA.md",
    "docs\HRONIKA.md",
    "docs\ZURNALS.md",
    "packages\valoda\data\termini.json"
)

foreach ($File in $Required) {
    if (-not (Test-Path $File)) {
        throw "STOP: trūkst obligātais fails: $File"
    }
}

Write-Host "Initializing Git..." -ForegroundColor Cyan
git init
git branch -M main

Write-Host ""
Write-Host "Staging seed..." -ForegroundColor Cyan
git add .

git diff --cached --check

Write-Host ""
Write-Host "Creating historical first commit..." -ForegroundColor Cyan
git commit `
  -m "chore: conceive LatNe project" `
  -m "LatNe conception date: 2026-09-30.`nInitialize the project with documentation-first structure, manifesto, terminology registry, architecture records, and package skeleton."

Write-Host ""
Write-Host "=== RESULT ===" -ForegroundColor Cyan
git status --short
git log -1 --decorate --oneline

Write-Host ""
Write-Host "LatNe repository initialized." -ForegroundColor Green
Write-Host "The Git commit timestamp records the exact local moment of the first commit."
