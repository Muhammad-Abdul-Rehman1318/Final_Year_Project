# CLEANUP SCRIPT - Delete AKS Resources
# Run this AFTER submission to stop Azure charges

Write-Host "========================================" -ForegroundColor Red
Write-Host "AKS CLEANUP SCRIPT" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

$RESOURCE_GROUP = "devops-lab-rg"
$CLUSTER_NAME = "devops-aks-cluster"

Write-Host "⚠️  WARNING: This will DELETE all AKS resources!" -ForegroundColor Yellow
Write-Host "Resource Group: $RESOURCE_GROUP" -ForegroundColor White
Write-Host "Cluster Name: $CLUSTER_NAME" -ForegroundColor White
Write-Host ""

$confirmation = Read-Host "Type 'DELETE' to confirm"

if ($confirmation -ne "DELETE") {
    Write-Host "❌ Cleanup cancelled." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Deleting AKS cluster..." -ForegroundColor Red

# Delete the entire resource group (includes cluster and all resources)
az group delete --name $RESOURCE_GROUP --yes --no-wait

Write-Host "✅ Deletion started (running in background)" -ForegroundColor Green
Write-Host ""
Write-Host "Resources will be deleted in 5-10 minutes." -ForegroundColor Yellow
Write-Host "No more charges will be incurred." -ForegroundColor Green
Write-Host ""
Write-Host "Verify deletion at: https://portal.azure.com" -ForegroundColor Cyan
