# AKS Deployment - Automated Script
# Section C: DevOps Final Lab Exam

param(
    [string]$ResourceGroup = "devops-final-lab-rg",
    [string]$ClusterName = "devops-final-lab-cluster",
    [string]$Location = "centralindia",
    [int]$NodeCount = 2
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AKS Deployment - Automated Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login to Azure
Write-Host "[1/10] Logging in to Azure..." -ForegroundColor Yellow
az login
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Azure login failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Azure login successful" -ForegroundColor Green
Write-Host ""

# Step 2: Create Resource Group
Write-Host "[2/10] Creating Resource Group: $ResourceGroup in $Location..." -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Resource group creation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Resource group created" -ForegroundColor Green
Write-Host ""

# Step 3: Create AKS Cluster
Write-Host "[3/10] Creating AKS Cluster: $ClusterName (This will take 2-3 minutes)..." -ForegroundColor Yellow
az aks create `
    --resource-group $ResourceGroup `
    --name $ClusterName `
    --location $Location `
    --node-count $NodeCount `
    --node-vm-size Standard_B2s `
    --enable-managed-identity `
    --generate-ssh-keys `
    --network-plugin azure `
    --load-balancer-sku standard

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ AKS cluster creation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ AKS cluster created successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Get AKS Credentials
Write-Host "[4/10] Configuring kubectl..." -ForegroundColor Yellow
az aks get-credentials --resource-group $ResourceGroup --name $ClusterName --overwrite-existing
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to get AKS credentials!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ kubectl configured" -ForegroundColor Green
Write-Host ""

# Step 5: Verify Cluster
Write-Host "[5/10] Verifying cluster connectivity..." -ForegroundColor Yellow
kubectl get nodes
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cluster connectivity failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Cluster is ready" -ForegroundColor Green
Write-Host ""

# Step 6: Deploy Namespace
Write-Host "[6/10] Deploying namespace..." -ForegroundColor Yellow
kubectl apply -f kubernetes/namespace.yaml
Start-Sleep -Seconds 2
Write-Host "✅ Namespace created" -ForegroundColor Green
Write-Host ""

# Step 7: Deploy Secrets and ConfigMap
Write-Host "[7/10] Deploying secrets and configmap..." -ForegroundColor Yellow
kubectl apply -f kubernetes/secrets.yaml
kubectl apply -f kubernetes/configmap.yaml
Start-Sleep -Seconds 2
Write-Host "✅ Secrets and ConfigMap deployed" -ForegroundColor Green
Write-Host ""

# Step 8: Deploy Backend and Frontend
Write-Host "[8/10] Deploying backend and frontend..." -ForegroundColor Yellow
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
Write-Host "✅ Deployments created" -ForegroundColor Green
Write-Host ""

# Step 9: Wait for LoadBalancer IPs
Write-Host "[9/10] Waiting for LoadBalancer External IPs (this may take 2-3 minutes)..." -ForegroundColor Yellow
Write-Host "Waiting for backend service..." -ForegroundColor Cyan

$backendIP = ""
$frontendIP = ""
$maxAttempts = 60
$attempt = 0

while ([string]::IsNullOrEmpty($backendIP) -and $attempt -lt $maxAttempts) {
    $backendIP = kubectl get svc backend-service -n devops-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
    if ([string]::IsNullOrEmpty($backendIP)) {
        Write-Host "." -NoNewline -ForegroundColor Cyan
        Start-Sleep -Seconds 5
        $attempt++
    }
}

Write-Host ""
Write-Host "Waiting for frontend service..." -ForegroundColor Cyan

$attempt = 0
while ([string]::IsNullOrEmpty($frontendIP) -and $attempt -lt $maxAttempts) {
    $frontendIP = kubectl get svc frontend-service -n devops-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>$null
    if ([string]::IsNullOrEmpty($frontendIP)) {
        Write-Host "." -NoNewline -ForegroundColor Cyan
        Start-Sleep -Seconds 5
        $attempt++
    }
}

Write-Host ""

if ([string]::IsNullOrEmpty($backendIP) -or [string]::IsNullOrEmpty($frontendIP)) {
    Write-Host "⚠️  External IPs not assigned yet. Run 'kubectl get svc -n devops-app' to check status." -ForegroundColor Yellow
} else {
    Write-Host "✅ External IPs assigned" -ForegroundColor Green
    Write-Host "   Backend IP: $backendIP" -ForegroundColor Cyan
    Write-Host "   Frontend IP: $frontendIP" -ForegroundColor Cyan
    
    # Step 10: Update ConfigMap with Backend IP
    Write-Host ""
    Write-Host "[10/10] Updating ConfigMap with backend public IP..." -ForegroundColor Yellow
    
    $patchData = @{
        data = @{
            VITE_API_URL = "http://${backendIP}:5000"
        }
    } | ConvertTo-Json -Compress
    
    kubectl patch configmap app-config -n devops-app --type merge -p $patchData
    
    Write-Host "✅ ConfigMap updated" -ForegroundColor Green
    Write-Host ""
    
    # Restart frontend to pick up new config
    Write-Host "Restarting frontend deployment..." -ForegroundColor Yellow
    kubectl rollout restart deployment/frontend-deployment -n devops-app
    kubectl rollout status deployment/frontend-deployment -n devops-app --timeout=120s
    Write-Host "✅ Frontend restarted" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Show Pods
Write-Host "📦 Pods Status:" -ForegroundColor Yellow
kubectl get pods -n devops-app
Write-Host ""

# Show Services
Write-Host "🌐 Services:" -ForegroundColor Yellow
kubectl get svc -n devops-app
Write-Host ""

if (![string]::IsNullOrEmpty($backendIP) -and ![string]::IsNullOrEmpty($frontendIP)) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Application URLs" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔗 Frontend: http://$frontendIP" -ForegroundColor Green
    Write-Host "🔗 Backend API: http://${backendIP}:5000" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Opening frontend in browser..." -ForegroundColor Cyan
    Start-Process "http://$frontendIP"
}

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📸 Next Steps for Submission:" -ForegroundColor Yellow
Write-Host "1. Take screenshot of: kubectl get pods -n devops-app" -ForegroundColor White
Write-Host "2. Take screenshot of: kubectl get svc -n devops-app" -ForegroundColor White
Write-Host "3. Take screenshot of the running application in browser" -ForegroundColor White
Write-Host ""
Write-Host "🧹 To cleanup after submission:" -ForegroundColor Yellow
Write-Host "   az aks delete --name $ClusterName --resource-group $ResourceGroup --yes --no-wait" -ForegroundColor White
Write-Host "   az group delete --name $ResourceGroup --yes --no-wait" -ForegroundColor White
Write-Host ""
