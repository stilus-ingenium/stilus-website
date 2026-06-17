# ============================================================
#  Lavera Frontend - Local Static Server
#  Run:  .\serve-frontend.ps1
#  Serves the site at http://localhost:8080
#  (Open via this URL, NOT file://, so API linking + CORS work)
# ============================================================
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "`n==> Serving site at http://localhost:8080" -ForegroundColor Cyan
Write-Host "  Open: http://localhost:8080/index.html" -ForegroundColor Magenta
Write-Host "  For API linking: run run-local.ps1 in 02-backend-laravel first" -ForegroundColor DarkGray
Write-Host "  (Stop with Ctrl+C)`n" -ForegroundColor DarkGray

# Prefer PHP (comes with XAMPP) - fallback to Python
$php = Get-Command php -ErrorAction SilentlyContinue
if ($php) {
    & php -S localhost:8080
} else {
    $py = Get-Command python -ErrorAction SilentlyContinue
    if ($py) { & python -m http.server 8080 }
    else { Write-Host "[X] No PHP or Python in PATH. Install one, or use VS Code Live Server." -ForegroundColor Red }
}
