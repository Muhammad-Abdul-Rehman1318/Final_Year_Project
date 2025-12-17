# ✅ SECTION C - QUICK START CHECKLIST

## 🚀 Step-by-Step (Total Time: ~40-50 minutes)

### ☐ STEP 1: Install Tools (10 min)

```powershell
# Install Azure CLI
winget install Microsoft.AzureCLI

# Install kubectl
az aks install-cli

# Verify
az --version
kubectl version --client
```

---

### ☐ STEP 2: Azure Login (2 min)

```powershell
az login
```

Browser will open - login with your Azure account

---

### ☐ STEP 3: Create Resource Group (1 min)

```powershell
az group create --name devops-lab-rg --location eastus
```

---

### ☐ STEP 4: Create AKS Cluster (15-20 min)

```powershell
az aks create \
  --resource-group devops-lab-rg \
  --name devops-aks-cluster \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --generate-ssh-keys
```

**Wait for completion (~15-20 minutes)**

---

### ☐ STEP 5: Connect to Cluster (1 min)

```powershell
az aks get-credentials --resource-group devops-lab-rg --name devops-aks-cluster

kubectl get nodes
```

Should show 2 nodes in Ready state

---

### ☐ STEP 6: Deploy Application (5 min)

```powershell
cd d:\sampletest

kubectl apply -f kubernetes/
```

---

### ☐ STEP 7: Verify Pods (2 min)

```powershell
kubectl get pods -n devops-app --watch
```

Wait for all pods to show "Running"

---

### ☐ STEP 8: Get Public IP (5-10 min)

```powershell
kubectl get service frontend-service -n devops-app --watch
```

Wait for EXTERNAL-IP to appear

---

### ☐ STEP 9: Test Application (2 min)

Open browser:
```
http://EXTERNAL-IP
```

Your app should be running!

---

### ☐ STEP 10: Take Screenshots (10 min)

```powershell
# 1. Nodes
kubectl get nodes

# 2. Pods
kubectl get pods -n devops-app

# 3. Services
kubectl get services -n devops-app

# 4. Deployments
kubectl get deployments -n devops-app

# 5. Backend logs
kubectl logs -n devops-app deployment/backend-deployment --tail=50

# 6. All resources
kubectl get all -n devops-app
```

Take screenshot of each!

---

## 📸 SCREENSHOT CHECKLIST

Required screenshots:

- [ ] Azure Portal - AKS cluster page
- [ ] `kubectl get nodes` output
- [ ] `kubectl get pods -n devops-app` output
- [ ] `kubectl get services -n devops-app` output
- [ ] `kubectl get deployments -n devops-app` output
- [ ] External IP in service details
- [ ] Application running in browser
- [ ] Backend pod logs (MongoDB connected)
- [ ] `kubectl get all -n devops-app` output
- [ ] `kubectl describe pods -n devops-app` output

---

## 🔗 QUICK LINKS

**Azure Portal:**  
👉 https://portal.azure.com

**Full Guide:**  
👉 See SECTION_C_AKS_GUIDE.md

---

## ⚠️ IMPORTANT NOTES

1. **Free Trial:** Use Azure free trial ($200 credit)
2. **Cost:** AKS will cost ~$1-2 per day
3. **After Exam:** Delete cluster to stop charges:
   ```powershell
   az group delete --name devops-lab-rg --yes
   ```

---

## ✅ SUCCESS INDICATORS

You're done when:

- ✅ 4 pods running (2 backend, 2 frontend)
- ✅ Services have EXTERNAL-IP
- ✅ App accessible in browser
- ✅ Backend logs show "MongoDB Connected"
- ✅ All 10 screenshots taken

---

**Total Time:** ~40-50 minutes  
**Difficulty:** Medium  
**Marks:** 12/12

**Start NOW!** Open PowerShell and run Step 1! 🚀
