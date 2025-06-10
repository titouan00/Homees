#!/usr/bin/env pwsh
# Script de test pour l'API Groq Chatbot Homees

Write-Host "🤖 Test de l'API Groq Chatbot - Homees" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Fonction pour tester un port
function Test-Port {
    param($Port)
    $result = Test-NetConnection -ComputerName "localhost" -Port $Port -WarningAction SilentlyContinue
    return $result.TcpTestSucceeded
}

# Rechercher le bon port (3000-3005)
$ports = @(3000, 3001, 3002, 3003, 3004, 3005)
$serverPort = $null

Write-Host "🔍 Recherche du serveur Next.js..." -ForegroundColor Yellow

foreach ($port in $ports) {
    if (Test-Port -Port $port) {
        Write-Host "✅ Serveur trouvé sur le port $port" -ForegroundColor Green
        $serverPort = $port
        break
    }
}

if (-not $serverPort) {
    Write-Host "❌ Aucun serveur Next.js trouvé sur les ports 3000-3005" -ForegroundColor Red
    Write-Host "💡 Démarrez le serveur avec: npm run dev" -ForegroundColor Yellow
    exit 1
}

# Test de l'API
$apiUrl = "http://localhost:$serverPort/api/chat"
Write-Host "🧪 Test de l'API: $apiUrl" -ForegroundColor Yellow

$testMessage = @{
    message = "Bonjour, comment fonctionne Homees ?"
    conversationHistory = @()
} | ConvertTo-Json -Depth 3

try {
    Write-Host "📡 Envoi de la requête..." -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri $apiUrl -Method POST -Body $testMessage -ContentType "application/json" -TimeoutSec 30
    
    Write-Host "✅ Réponse reçue avec succès !" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor White
    Write-Host $response.response -ForegroundColor White
    Write-Host "================================" -ForegroundColor White
    
    if ($response.success) {
        Write-Host "🎉 API Groq fonctionnelle !" -ForegroundColor Green
    } elseif ($response.fallback) {
        Write-Host "⚠️  Fallback utilisé (API Groq indisponible)" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Erreur lors du test:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Message -match "404") {
        Write-Host "💡 L'endpoint /api/chat n'existe pas ou n'est pas accessible" -ForegroundColor Yellow
    } elseif ($_.Exception.Message -match "timeout") {
        Write-Host "💡 Timeout - l'API Groq met du temps à répondre" -ForegroundColor Yellow
    }
}

Write-Host "`n🔗 Pour tester manuellement:" -ForegroundColor Cyan
Write-Host "http://localhost:$serverPort" -ForegroundColor White
Write-Host "Ouvrez la page et utilisez le chatbot en bas à droite" -ForegroundColor Gray 