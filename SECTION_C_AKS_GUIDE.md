# SECTION C: KUBERNETES ON AZURE (AKS) - Complete Guide

## 🎯 Overview
This guide will help you deploy your 3-tier application (Frontend + Backend + Database) on Azure Kubernetes Service (AKS).

---

## ✅ Prerequisites Checklist

- [ ] Azure account created (Free tier available)
- [ ] Azure CLI installed
- [ ] kubectl installed
- [ ] Docker images pushed to Docker Hub
- [ ] Kubernetes manifests ready

---

## 📦 TASK C1: Kubernetes Manifests & AKS Setup

### Step 1: Install Required Tools (10 minutes)

#### A. Install Azure CLI

**Windows (PowerShell as Administrator):**
```powershell
# Using winget
winget install Microsoft.AzureCLI

# OR download installer
# Visit: https://aka.ms/installazurecliwindows
```

**Verify installation:**
```powershell
az --version
```

#### B. Install kubectl

```powershell
az aks install-cli
```

**Verify installation:**
```powershell
kubectl version --client
```

---

### Step 2: Login to Azure (2 minutes)

```powershell
# Login to Azure
az login

# This will open browser - login with your Azure account
# After login, you'll see your subscriptions listed
```

**Set default subscription (if you have multiple):**
```powershell
# List subscriptions
az account list --output table

# Set default (replace with your subscription ID)
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

---

### Step 3: Create Resource Group (1 minute)

```powershell
# Create resource group
az group create \
  --name devops-lab-rg \
  --location eastus

# Verify
az group list --output table
```

---

### Step 4: Create AKS Cluster (15-20 minutes)

**Option A: Basic Cluster (Free tier compatible)**

```powershell
az aks create \
  --resource-group devops-lab-rg \
  --name devops-aks-cluster \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --generate-ssh-keys \
  --enable-managed-identity \
  --network-plugin azure
```

**Option B: Minimal Cluster (Faster creation)**

```powershell
az aks create \
  --resource-group devops-lab-rg \
  --name devops-aks-cluster \
  --node-count 1 \
  --node-vm-size Standard_B2s \
  --generate-ssh-keys
```

**This will take 15-20 minutes. Wait for completion.**

---

### Step 5: Connect to AKS Cluster (1 minute)

```powershell
# Get credentials
az aks get-credentials \
  --resource-group devops-lab-rg \
  --name devops-aks-cluster

# Verify connection
kubectl cluster-info
kubectl get nodes
```

**Expected output:**
```
NAME                                STATUS   ROLES   AGE   VERSION
aks-nodepool1-12345678-vmss000000   Ready    agent   5m    v1.28.x
aks-nodepool1-12345678-vmss000001   Ready    agent   5m    v1.28.x
```

---

### Step 6: Deploy Application to AKS (5 minutes)

#### A. Create Namespace

```powershell
kubectl apply -f kubernetes/namespace.yaml
```

#### B. Create Secrets

```powershell
kubectl apply -f kubernetes/secrets.yaml
```

#### C. Create ConfigMaps

```powershell
kubectl apply -f kubernetes/configmap.yaml
```

#### D. Deploy Backend

```powershell
kubectl apply -f kubernetes/backend-deployment.yaml
```

#### E. Deploy Frontend

```powershell
kubectl apply -f kubernetes/frontend-deployment.yaml
```

**OR deploy all at once:**

```powershell
kubectl apply -f kubernetes/ -n devops-app
```

---

### Step 7: Verify Deployment (2 minutes)

```powershell
# Check pods
kubectl get pods -n devops-app

# Check deployments
kubectl get deployments -n devops-app

# Check services
kubectl get services -n devops-app
```

**Wait for all pods to be Running (~2-3 minutes)**

---

### Step 8: Get Public IP Address (5-10 minutes)

```powershell
# Get frontend service details
kubectl get service frontend-service -n devops-app

# Watch for EXTERNAL-IP (takes 5-10 min)
kubectl get service frontend-service -n devops-app --watch
```

**Expected output:**
```
NAME               TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)
frontend-service   LoadBalancer   10.0.123.45    20.123.45.67     80:30123/TCP
```

**Your app URL:** `http://EXTERNAL-IP` (e.g., http://20.123.45.67)

---

## 📊 TASK C2: AKS Deployment Verification

### Verification 1: All Pods Running ✅

**Command:**
```powershell
kubectl get pods -n devops-app
```

**Expected output:**
```
NAME                                   READY   STATUS    RESTARTS   AGE
backend-deployment-xxxxx-xxxxx         1/1     Running   0          5m
backend-deployment-xxxxx-xxxxx         1/1     Running   0          5m
frontend-deployment-xxxxx-xxxxx        1/1     Running   0          5m
frontend-deployment-xxxxx-xxxxx        1/1     Running   0          5m
```

**Screenshot:** `screenshots/section-c/pods-running.png`

---

### Verification 2: Services Created ✅

**Command:**
```powershell
kubectl get services -n devops-app
```

**Expected output:**
```
NAME               TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)
backend-service    ClusterIP      10.0.x.x       <none>           5000/TCP
frontend-service   LoadBalancer   10.0.x.x       20.x.x.x         80:xxxxx/TCP
```

**Screenshot:** `screenshots/section-c/services-created.png`

---

### Verification 3: Deployments Status ✅

**Command:**
```powershell
kubectl get deployments -n devops-app
```

**Expected output:**
```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
backend-deployment    2/2     2            2           5m
frontend-deployment   2/2     2            2           5m
```

**Screenshot:** `screenshots/section-c/deployments-status.png`

---

### Verification 4: Pod Logs ✅

**Backend logs:**
```powershell
kubectl logs -n devops-app deployment/backend-deployment --tail=50
```

**Expected output:**
```
MongoDB Connected
Server running on port 5000
```

**Frontend logs:**
```powershell
kubectl logs -n devops-app deployment/frontend-deployment --tail=50
```

**Screenshot:** `screenshots/section-c/pod-logs.png`

---

### Verification 5: Frontend-Backend Connection ✅

**Test from browser:**
```
http://YOUR-EXTERNAL-IP
```

**Should show:** Your application homepage loading correctly

**Test API endpoint:**
```powershell
# Get external IP
$EXTERNAL_IP = kubectl get service frontend-service -n devops-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# Test backend through frontend
curl http://$EXTERNAL_IP
```

**Screenshot:** `screenshots/section-c/app-running-browser.png`

---

### Verification 6: Backend-Database Connection ✅

**Check backend logs for MongoDB connection:**
```powershell
kubectl logs -n devops-app deployment/backend-deployment | Select-String "MongoDB"
```

**Expected output:**
```
MongoDB Connected
```

**Test database query (optional):**
```powershell
# Execute command in backend pod
kubectl exec -n devops-app deployment/backend-deployment -- curl http://localhost:5000/api/universities
```

**Screenshot:** `screenshots/section-c/backend-database-connection.png`

---

### Verification 7: Detailed Pod Information ✅

**Get detailed pod info:**
```powershell
kubectl describe pods -n devops-app | Select-String -Pattern "Status|Ready|IP|Age"
```

**Get pod resource usage:**
```powershell
kubectl top pods -n devops-app
```

**Screenshot:** `screenshots/section-c/pod-details.png`

---

## 📸 SCREENSHOTS FOR SUBMISSION

Create folder: `screenshots/section-c/`

### Required Screenshots:

1. **azure-portal-aks.png**
   - Azure Portal showing AKS cluster
   - URL: https://portal.azure.com

2. **kubectl-get-nodes.png**
   - Command: `kubectl get nodes`
   - Shows: 2 nodes in Ready state

3. **pods-running.png**
   - Command: `kubectl get pods -n devops-app`
   - Shows: All 4 pods Running (2 backend, 2 frontend)

4. **services-created.png**
   - Command: `kubectl get services -n devops-app`
   - Shows: backend-service and frontend-service

5. **deployments-status.png**
   - Command: `kubectl get deployments -n devops-app`
   - Shows: Both deployments 2/2 ready

6. **external-ip.png**
   - Command: `kubectl get service frontend-service -n devops-app`
   - Shows: EXTERNAL-IP address

7. **app-running-browser.png**
   - Browser showing app at EXTERNAL-IP
   - Shows: Application working correctly

8. **pod-logs-backend.png**
   - Backend pod logs
   - Shows: "MongoDB Connected" message

9. **pod-logs-frontend.png**
   - Frontend pod logs
   - Shows: Nginx serving files

10. **kubectl-describe-pods.png**
    - Command: `kubectl describe pods -n devops-app`
    - Shows: Detailed pod information

---

## 🔧 TROUBLESHOOTING

### Issue 1: Pods Not Running

**Check pod status:**
```powershell
kubectl get pods -n devops-app
kubectl describe pod POD-NAME -n devops-app
```

**Common fixes:**
- Wait 2-3 minutes for images to pull
- Check image names in deployment files
- Verify Docker Hub images exist

---

### Issue 2: External IP Pending

**Wait longer:**
```powershell
kubectl get service frontend-service -n devops-app --watch
```

**Takes 5-10 minutes for Azure to provision LoadBalancer**

---

### Issue 3: Backend Can't Connect to MongoDB

**Check secrets:**
```powershell
kubectl get secrets -n devops-app
kubectl describe secret app-secrets -n devops-app
```

**Verify MONGO_URI is correct in secrets.yaml**

---

### Issue 4: Image Pull Errors

**Check if images exist:**
```powershell
docker pull muhammadowais11/sampletest-backend:latest
docker pull muhammadowais11/sampletest-frontend:latest
```

**If fail, push images again:**
```powershell
cd d:\sampletest
.\push-to-dockerhub.ps1
```

---

## 📋 SUBMISSION CHECKLIST

### Files to Submit:

- [ ] Kubernetes manifests (5 files in kubernetes/ folder)
- [ ] Screenshots folder (10 screenshots)
- [ ] AKS cluster details (resource group, cluster name)
- [ ] Public IP address and working link

### Verification Checklist:

- [ ] AKS cluster created
- [ ] kubectl connected to cluster
- [ ] All pods in Running state
- [ ] Services created with EXTERNAL-IP
- [ ] Frontend accessible via browser
- [ ] Backend connecting to MongoDB
- [ ] All screenshots captured
- [ ] Application working end-to-end

---

## 📝 FOR YOUR REPORT

### Section C Summary:

```
SECTION C: KUBERNETES ON AZURE (AKS)

Task C1: Kubernetes Manifests
----------------------------------
✅ Created Azure Kubernetes Cluster
   - Resource Group: devops-lab-rg
   - Cluster Name: devops-aks-cluster
   - Location: East US
   - Node Count: 2
   - Node Size: Standard_B2s

✅ Deployed Containerized Application
   - Backend Image: muhammadowais11/sampletest-backend:latest
   - Frontend Image: muhammadowais11/sampletest-frontend:latest
   - Namespace: devops-app
   - Replicas: 2 per service

✅ Exposed App with Public IP
   - Service Type: LoadBalancer
   - External IP: [YOUR-EXTERNAL-IP]
   - Application URL: http://[EXTERNAL-IP]

Task C2: Deployment Verification
----------------------------------
✅ All Pods Running
   - Backend pods: 2/2 Running
   - Frontend pods: 2/2 Running
   - Total pods: 4/4 healthy

✅ Services Created Successfully
   - backend-service: ClusterIP (internal)
   - frontend-service: LoadBalancer (public)

✅ Frontend-Backend Connection
   - API calls working correctly
   - Data fetching successful

✅ Backend-Database Connection
   - MongoDB Atlas connected
   - Database queries working

Screenshots: 10 screenshots in screenshots/section-c/
Deployment Time: ~25-30 minutes
Status: ✅ FULLY OPERATIONAL
```

---

## 🎯 USEFUL COMMANDS

### Quick Status Check:
```powershell
# All-in-one status check
kubectl get all -n devops-app
```

### Watch Deployment:
```powershell
# Watch pods come up
kubectl get pods -n devops-app --watch
```

### Access Logs:
```powershell
# Stream backend logs
kubectl logs -f -n devops-app deployment/backend-deployment

# Stream frontend logs
kubectl logs -f -n devops-app deployment/frontend-deployment
```

### Delete and Redeploy:
```powershell
# Delete all resources
kubectl delete namespace devops-app

# Redeploy everything
kubectl apply -f kubernetes/
```

---

## 💰 COST MANAGEMENT

### Free Tier Limits:
- AKS control plane: FREE
- VM nodes: Charged (Standard_B2s ~$30/month)
- LoadBalancer: ~$5/month

### To Minimize Costs:

**Stop cluster when not in use:**
```powershell
az aks stop --resource-group devops-lab-rg --name devops-aks-cluster
```

**Start cluster when needed:**
```powershell
az aks start --resource-group devops-lab-rg --name devops-aks-cluster
```

**Delete cluster after submission:**
```powershell
az aks delete --resource-group devops-lab-rg --name devops-aks-cluster --yes
```

**Delete entire resource group:**
```powershell
az group delete --name devops-lab-rg --yes
```

---

## 🔗 HELPFUL LINKS

- **Azure Portal:** https://portal.azure.com
- **AKS Documentation:** https://learn.microsoft.com/en-us/azure/aks/
- **kubectl Cheat Sheet:** https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- **Free Azure Account:** https://azure.microsoft.com/free/

---

## ✅ SUCCESS CRITERIA

Section C is complete when:

1. ✅ AKS cluster is running
2. ✅ All 4 pods are in Running state
3. ✅ Services have EXTERNAL-IP assigned
4. ✅ Application accessible via browser
5. ✅ Backend connects to MongoDB
6. ✅ All screenshots captured
7. ✅ Documentation complete

---

**Created:** December 17, 2025  
**For:** DevOps Lab Exam - Section C  
**Student:** Muhammad Owais  
**Marks:** 12/12
