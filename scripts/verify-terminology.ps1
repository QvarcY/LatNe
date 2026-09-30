$ErrorActionPreference = "Stop"

$Repo = Split-Path -Parent $PSScriptRoot
$Path = Join-Path $Repo "packages\valoda\data\termini.json"

if (-not (Test-Path $Path)) {
    throw "Terminoloģijas reģistrs nav atrasts"
}

$Registry = Get-Content -Raw $Path | ConvertFrom-Json
$Terms = @($Registry.terms)

if ($Registry.schemaVersion -ne 2) {
    throw "Neatbalstīta shēmas versija"
}

if ($Terms.Count -eq 0) {
    throw "Terminoloģijas reģistrs ir tukšs"
}

$DuplicateIds = $Terms |
    Group-Object id |
    Where-Object Count -gt 1

if ($DuplicateIds) {
    throw "Atrasti dublēti id"
}

$DuplicateSources = $Terms |
    Group-Object source |
    Where-Object Count -gt 1

if ($DuplicateSources) {
    throw "Atrasti dublēti source termini"
}

$Allowed = @(
    "pending"
    "approved"
    "rejected"
    "reserved"
)

$ExpectedOrder = 1

foreach ($Term in $Terms) {
    if ($Term.order -ne $ExpectedOrder) {
        throw "Nederīga secība pie $($Term.source)"
    }

    if ($Term.status -notin $Allowed) {
        throw "Nederīgs statuss pie $($Term.source)"
    }

    if (
        $Term.status -eq "approved" -and
        [string]::IsNullOrWhiteSpace($Term.latvian)
    ) {
        throw "Apstiprinātam terminam trūkst latviskā varianta"
    }

    if (@($Term.sourceRefs).Count -eq 0) {
        throw "Terminā trūkst avota $($Term.source)"
    }

    $ExpectedOrder++
}

Write-Host ""
Write-Host "LatNe terminology registry OK" -ForegroundColor Green
Write-Host "Terms: $($Terms.Count)"

$Terms |
    Group-Object status |
    Sort-Object Name |
    ForEach-Object {
        Write-Host "$($_.Name): $($_.Count)"
    }
