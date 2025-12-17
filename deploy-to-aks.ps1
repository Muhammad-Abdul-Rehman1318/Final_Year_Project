# SECTION C - COMPLETE AUTOMATION SCRIPT
# This script will do EVERYTHING for Section C automatically
# You just need to run it and login to Azure when prompted

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SECTION C: AKS DEPLOYMENT AUTOMATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$RESOURCE_GROUP = "devops-lab-rg"
$CLUSTER_NAME = "devops-aks-cluster"
$LOCATION = "southeastasia"  # Changed to Southeast Asia (usually available for students)
$NODE_COUNT = 2
$NODE_SIZE = "Standard_B2s"

# Step 1: Check if Azure CLI is installed
Write-Host "Step 1: Checking Azure CLI..." -ForegroundColor Yellow
try {
    $azVersion = az --version
    Write-Host "✅ Azure CLI is installed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI not found. Installing..." -ForegroundColor Red
    Write-Host "Installing Azure CLI..." -ForegroundColor Yellow
    winget install Microsoft.AzureCLI
    Write-Host "✅ Azure CLI installed! Please restart PowerShell and run this script again." -ForegroundColor Green
    exit
}
Write-Host ""

# Step 2: Login to Azure
Write-Host "Step 2: Azure Login..." -ForegroundColor Yellow
Write-Host "A browser window will open. Please login with your Azure account." -ForegroundColor Cyan
az login
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Azure login failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Azure login successful!" -ForegroundColor Green
Write-Host ""

# Step 3: Create Resource Group
Write-Host "Step 3: Creating Resource Group..." -ForegroundColor Yellow
Write-Host "Resource Group: $RESOURCE_GROUP" -ForegroundColor Gray
Write-Host "Location: $LOCATION" -ForegroundColor Gray

az group create --name $RESOURCE_GROUP --location $LOCATION --output table

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Resource group creation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Resource group created!" -ForegroundColor Green
Write-Host ""

# Step 4: Create AKS Cluster
Write-Host "Step 4: Creating AKS Cluster..." -ForegroundColor Yellow
Write-Host "⚠️  This will take 15-20 minutes. Please wait..." -ForegroundColor Yellow
Write-Host "Cluster Name: $CLUSTER_NAME" -ForegroundColor Gray
Write-Host "Node Count: $NODE_COUNT" -ForegroundColor Gray
Write-Host "Node Size: $NODE_SIZE" -ForegroundColor Gray
Write-Host ""

az aks create `
    --resource-group $RESOURCE_GROUP `
    --name $CLUSTER_NAME `
    --node-count $NODE_COUNT `
    --node-vm-size $NODE_SIZE `
    --generate-ssh-keys `
    --enable-managed-identity `
    --output table

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ AKS cluster creation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ AKS cluster created successfully!" -ForegroundColor Green
Write-Host ""

# Step 5: Get AKS Credentials
Write-Host "Step 5: Getting AKS Credentials..." -ForegroundColor Yellow
az aks get-credentials --resource-group $RESOURCE_GROUP --name $CLUSTER_NAME --overwrite-existing

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to get credentials!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Credentials configured!" -ForegroundColor Green
Write-Host ""

# Step 6: Verify Connection
Write-Host "Step 6: Verifying Cluster Connection..." -ForegroundColor Yellow
kubectl cluster-info
kubectl get nodes
Write-Host "✅ Connected to cluster!" -ForegroundColor Green
Write-Host ""

# Step 7: Deploy Application
Write-Host "Step 7: Deploying Application to AKS..." -ForegroundColor Yellow
Write-Host "Deploying Kubernetes manifests..." -ForegroundColor Gray

# Deploy all manifests
kubectl apply -f kubernetes/

Write-Host "✅ Application deployed!" -ForegroundColor Green
Write-Host ""

# Step 8: Wait for Pods
Write-Host "Step 8: Waiting for Pods to be Ready..." -ForegroundColor Yellow
Write-Host "This may take 2-3 minutes..." -ForegroundColor Gray

$retries = 0
$maxRetries = 30

while ($retries -lt $maxRetries) {
    $podsReady = kubectl get pods -n devops-app --no-headers 2>$null | Select-String "Running" | Measure-Object | Select-Object -ExpandProperty Count
    
    if ($podsReady -eq 4) {
        Write-Host "✅ All pods are running!" -ForegroundColor Green
        break
    }
    
    Write-Host "Waiting... ($podsReady/4 pods ready)" -ForegroundColor Gray
    Start-Sleep -Seconds 10
    $retries++
}

if ($retries -eq $maxRetries) {
    Write-Host "⚠️  Timeout waiting for pods. Check manually." -ForegroundColor Yellow
}
Write-Host ""

# Step 9: Get External IP
Write-Host "Step 9: Getting External IP..." -ForegroundColor Yellow
Write-Host "This may take 5-10 minutes..." -ForegroundColor Gray

$retries = 0
$maxRetries = 60
$EXTERNAL_IP = $null

while ($retries -lt $maxRetries) {
    $EXTERNAL_IP = kubectl get service frontend-service -n devops-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
    
    if ($EXTERNAL_IP -and $EXTERNAL_IP -ne "<pending>") {
        Write-Host "✅ External IP assigned!" -ForegroundColor Green
        break
    }
    
    Write-Host "Waiting for external IP... (Attempt $retries/$maxRetries)" -ForegroundColor Gray
    Start-Sleep -Seconds 10
    $retries++
}

if (-not $EXTERNAL_IP) {
    Write-Host "⚠️  External IP not assigned yet. Check manually later." -ForegroundColor Yellow
    $EXTERNAL_IP = "PENDING"
}
Write-Host ""

# Step 10: Display Results
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ SECTION C DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== CLUSTER INFORMATION ===" -ForegroundColor Yellow
Write-Host "Resource Group: $RESOURCE_GROUP" -ForegroundColor White
Write-Host "Cluster Name: $CLUSTER_NAME" -ForegroundColor White
Write-Host "Location: $LOCATION" -ForegroundColor White
Write-Host ""

Write-Host "=== DEPLOYMENT STATUS ===" -ForegroundColor Yellow
kubectl get all -n devops-app
Write-Host ""

Write-Host "=== PODS STATUS ===" -ForegroundColor Yellow
kubectl get pods -n devops-app
Write-Host ""

Write-Host "=== SERVICES ===" -ForegroundColor Yellow
kubectl get services -n devops-app
Write-Host ""

Write-Host "=== APPLICATION URL ===" -ForegroundColor Yellow
if ($EXTERNAL_IP -ne "PENDING") {
    Write-Host "Frontend: http://$EXTERNAL_IP" -ForegroundColor Cyan
    Write-Host "Backend API: http://$EXTERNAL_IP/api" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Open this in your browser!" -ForegroundColor Green
} else {
    Write-Host "⚠️  External IP still pending. Run this command to check:" -ForegroundColor Yellow
    Write-Host "kubectl get service frontend-service -n devops-app" -ForegroundColor Cyan
}
Write-Host ""

# Step 11: Create Screenshots Directory
Write-Host "=== CREATING SCREENSHOTS DIRECTORY ===" -ForegroundColor Yellow
$screenshotsDir = "screenshots/section-c"
New-Item -ItemType Directory -Force -Path $screenshotsDir | Out-Null
Write-Host "✅ Created: $screenshotsDir" -ForegroundColor Green
Write-Host ""

# Step 12: Save Verification Commands
Write-Host "=== VERIFICATION COMMANDS ===" -ForegroundColor Yellow
Write-Host "Run these commands and take screenshots:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. kubectl get nodes" -ForegroundColor White
Write-Host "2. kubectl get pods -n devops-app" -ForegroundColor White
Write-Host "3. kubectl get services -n devops-app" -ForegroundColor White
Write-Host "4. kubectl get deployments -n devops-app" -ForegroundColor White
Write-Host "5. kubectl logs -n devops-app deployment/backend-deployment --tail=50" -ForegroundColor White
Write-Host "6. kubectl logs -n devops-app deployment/frontend-deployment --tail=50" -ForegroundColor White
Write-Host "7. kubectl get all -n devops-app" -ForegroundColor White
Write-Host "8. kubectl describe pods -n devops-app" -ForegroundColor White
Write-Host ""

# Save commands to file
$commandsFile = "section-c-verification-commands.txt"
@"
SECTION C VERIFICATION COMMANDS
================================

1. Get Nodes:
   kubectl get nodes

2. Get Pods:
   kubectl get pods -n devops-app

3. Get Services:
   kubectl get services -n devops-app

4. Get Deployments:
   kubectl get deployments -n devops-app

5. Backend Logs:
   kubectl logs -n devops-app deployment/backend-deployment --tail=50

6. Frontend Logs:
   kubectl logs -n devops-app deployment/frontend-deployment --tail=50

7. All Resources:
   kubectl get all -n devops-app

8. Detailed Pod Info:
   kubectl describe pods -n devops-app

9. External IP (if still pending):
   kubectl get service frontend-service -n devops-app --watch

APPLICATION URL:
http://$EXTERNAL_IP

AZURE PORTAL:
https://portal.azure.com
Navigate to: Resource Groups > $RESOURCE_GROUP > $CLUSTER_NAME

"@ | Out-File -FilePath $commandsFile -Encoding UTF8

Write-Host "✅ Verification commands saved to: $commandsFile" -ForegroundColor Green
Write-Host ""

# Final Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS FOR SUBMISSION:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. ✅ Run verification commands above" -ForegroundColor White
Write-Host "2. ✅ Take 10 screenshots" -ForegroundColor White
Write-Host "3. ✅ Test application in browser: http://$EXTERNAL_IP" -ForegroundColor White
Write-Host "4. ✅ Save screenshots in: $screenshotsDir" -ForegroundColor White
Write-Host "5. ✅ Complete documentation" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT: After submission, delete cluster to stop charges:" -ForegroundColor Yellow
Write-Host "   az group delete --name $RESOURCE_GROUP --yes" -ForegroundColor Red
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 SECTION C AUTOMATION COMPLETE! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
