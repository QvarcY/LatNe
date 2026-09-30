\
param(
    [Parameter(Mandatory = $true)]
    [string]$Title,

    [string]$Type = "darbs"
)

$ErrorActionPreference = "Stop"

$Repo = Split-Path -Parent $PSScriptRoot
$Journal = Join-Path $Repo "docs\ZURNALS.md"

if (-not (Test-Path $Journal)) {
    throw "Žurnāls nav atrasts: $Journal"
}

$Date = Get-Date -Format "yyyy-MM-dd"
$Time = Get-Date -Format "HH:mm:ss"
$Id = "J" + (Get-Date -Format "yyyyMMdd-HHmmss")

$Entry = @"

---

## $Date — $Id — $Title

**Tips:** $Type
**Sākts:** $Time
**Statuss:** sākts

### Mērķis

### Sākuma stāvoklis

### Darbības

### Komandas / pierādījumi

### Kļūdas

### Novērojumi

### Lēmumi

### Rezultāts

### Git

- Branch:
- Commit:
- Testi:

### Nākamais solis

"@

Add-Content -Path $Journal -Value $Entry -Encoding utf8

Write-Host "Pievienots žurnāla ieraksts:" -ForegroundColor Green
Write-Host "  $Id — $Title"
Write-Host "  $Journal"
