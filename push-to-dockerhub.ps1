# Docker Build and Push Script
# This script builds and pushes Docker images to Docker Hub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Docker Build & Push Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$DOCKER_USERNAME = "muhammadowais11"
$BACKEND_IMAGE = "$DOCKER_USERNAME/sampletest-backend"
$FRONTEND_IMAGE = "$DOCKER_USERNAME/sampletest-frontend"

# Step 1: Build Backend Image
Write-Host "Step 1: Building Backend Image..." -ForegroundColor Yellow
Write-Host "Location: backendsample/" -ForegroundColor Gray
docker build -t $BACKEND_IMAGE`:latest ./backendsample
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend image built successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Build Frontend Image
Write-Host "Step 2: Building Frontend Image..." -ForegroundColor Yellow
Write-Host "Location: frontendsample/" -ForegroundColor Gray
docker build -t $FRONTEND_IMAGE`:latest ./frontendsample
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend image built successfully!" -ForegroundColor Green
Write-Host ""

# Step 3: Tag Images
Write-Host "Step 3: Tagging Images..." -ForegroundColor Yellow
docker tag $BACKEND_IMAGE`:latest $BACKEND_IMAGE`:v1.0
docker tag $FRONTEND_IMAGE`:latest $FRONTEND_IMAGE`:v1.0
Write-Host "✅ Images tagged!" -ForegroundColor Green
Write-Host ""

# Step 4: Push Backend Image
Write-Host "Step 4: Pushing Backend Image to Docker Hub..." -ForegroundColor Yellow
docker push $BACKEND_IMAGE`:latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend push failed!" -ForegroundColor Red
    Write-Host "Please make sure you're logged in: docker login" -ForegroundColor Yellow
    exit 1
}
docker push $BACKEND_IMAGE`:v1.0
Write-Host "✅ Backend image pushed successfully!" -ForegroundColor Green
Write-Host ""

# Step 5: Push Frontend Image
Write-Host "Step 5: Pushing Frontend Image to Docker Hub..." -ForegroundColor Yellow
docker push $FRONTEND_IMAGE`:latest
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend push failed!" -ForegroundColor Red
    exit 1
}
docker push $FRONTEND_IMAGE`:v1.0
Write-Host "✅ Frontend image pushed successfully!" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ ALL IMAGES PUSHED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend Image: $BACKEND_IMAGE`:latest" -ForegroundColor White
Write-Host "Backend Image: $BACKEND_IMAGE`:v1.0" -ForegroundColor White
Write-Host "Frontend Image: $FRONTEND_IMAGE`:latest" -ForegroundColor White
Write-Host "Frontend Image: $FRONTEND_IMAGE`:v1.0" -ForegroundColor White
Write-Host ""
Write-Host "View on Docker Hub:" -ForegroundColor Yellow
Write-Host "https://hub.docker.com/r/$DOCKER_USERNAME/devops-backend" -ForegroundColor Cyan
Write-Host "https://hub.docker.com/r/$DOCKER_USERNAME/devops-frontend" -ForegroundColor Cyan
Write-Host ""

# List local images
Write-Host "Local Docker Images:" -ForegroundColor Yellow
docker images | Select-String "devops-"
