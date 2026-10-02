$ErrorActionPreference = "Stop"

$Repo = Split-Path -Parent $PSScriptRoot
$Cels = Join-Path $Repo "packages\valoda\data\termini.json"

if (-not (Test-Path $Cels)) {
    throw "Terminoloģijas reģistrs nav atrasts"
}

$Registrs = Get-Content -Raw $Cels | ConvertFrom-Json
$Termini = @($Registrs.terms)

if ($Registrs.schemaVersion -ne 2) {
    throw "Neatbalstīta shēmas versija"
}

if ($Termini.Count -eq 0) {
    throw "Terminoloģijas reģistrs ir tukšs"
}

$DublejosiId = $Termini |
    Group-Object id |
    Where-Object Count -gt 1

if ($DublejosiId) {
    throw "Atrasti dublēti id"
}

$DublejosiAvoti = $Termini |
    Group-Object source |
    Where-Object Count -gt 1

if ($DublejosiAvoti) {
    throw "Atrasti dublēti source termini"
}

$AtlautieStatusi = @(
    "pending"
    "approved"
    "rejected"
    "reserved"
)

$SagaidamaSeciba = 1

foreach ($Termins in $Termini) {
    if ($Termins.order -ne $SagaidamaSeciba) {
        throw "Nederīga secība pie $($Termins.source)"
    }

    if ($Termins.status -notin $AtlautieStatusi) {
        throw "Nederīgs statuss pie $($Termins.source)"
    }

    if (
        $Termins.status -eq "approved" -and
        [string]::IsNullOrWhiteSpace($Termins.latvian)
    ) {
        throw "Apstiprinātam terminam trūkst latviskā varianta"
    }

    if (@($Termins.sourceRefs).Count -eq 0) {
        throw "Terminā trūkst avota $($Termins.source)"
    }

    $SagaidamaSeciba++
}

Write-Host ""
Write-Host "LatNe terminoloģijas reģistrs OK" -ForegroundColor Green
Write-Host "Termini: $($Termini.Count)"

$Termini |
    Group-Object status |
    Sort-Object Name |
    ForEach-Object {
        Write-Host "$($_.Name): $($_.Count)"
    }
