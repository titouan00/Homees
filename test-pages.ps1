# Script de test des pages essentielles
$pages = @("/", "/contact", "/login", "/signup")
$port = "3002"

Write-Host "🔍 Test des pages Homees..." -ForegroundColor Cyan

foreach ($page in $pages) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port$page" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $page - OK" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $page - Code: $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ $page - Erreur: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Test terminé !" -ForegroundColor Cyan 