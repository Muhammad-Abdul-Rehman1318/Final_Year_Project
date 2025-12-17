# Quick Start Guide - Ansible Configuration for DevOps Lab

## 🎯 For Exam Submission (Simplified Approach)

Since AKS nodes aren't directly accessible via SSH, we'll use a **demonstration approach** that shows Ansible knowledge while being practical for AKS.

### Option 1: Local Machine Demonstration (Recommended for Exam)

#### Step 1: Install Ansible on Windows
```powershell
# Using pip
pip install ansible

# Or using WSL
wsl --install
# Then in WSL:
sudo apt update
sudo apt install ansible -y
```

#### Step 2: Test Ansible Locally
```bash
cd ansible

# Test on localhost (your machine)
ansible localhost -m ping

# Run playbook in check mode (dry run)
ansible-playbook playbook.yml --check --connection=local

# Run specific tasks
ansible-playbook playbook.yml --tags verify --connection=local
```

#### Step 3: Take Screenshots
1. **hosts.ini file** - Open in VS Code
2. **playbook.yml file** - Open in VS Code  
3. **Ansible version**: `ansible --version`
4. **Playbook syntax check**: `ansible-playbook playbook.yml --syntax-check`
5. **Dry run output**: `ansible-playbook playbook.yml --check`

### Option 2: Using Kubernetes Job (Advanced)

```bash
# Apply the Ansible job to AKS
kubectl apply -f k8s-ansible-job.yaml

# Check job status
kubectl get jobs -n devops-app

# View job logs
kubectl logs -n devops-app job/ansible-config-job

# Screenshot the successful execution
```

### Option 3: Create Test VMs (Most Realistic)

```bash
# Create 2 small VMs in Azure for testing
az vm create \
  --resource-group devops-lab-rg-ci \
  --name ansible-test-vm1 \
  --image UbuntuLTS \
  --size Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys

az vm create \
  --resource-group devops-lab-rg-ci \
  --name ansible-test-vm2 \
  --image UbuntuLTS \
  --size Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys

# Get VM IPs
az vm list-ip-addresses --resource-group devops-lab-rg-ci --output table

# Update hosts.ini with actual IPs
# Then run playbook
ansible-playbook playbook.yml
```

## 📸 Screenshots Needed for Submission

### 1. Inventory File (hosts.ini)
```bash
cat hosts.ini
# Take screenshot
```

### 2. Playbook File (playbook.yml)
```bash
cat playbook.yml | head -50
# Take screenshot showing first 50 lines
```

### 3. Ansible Version
```bash
ansible --version
# Take screenshot
```

### 4. Playbook Syntax Check
```bash
ansible-playbook playbook.yml --syntax-check
# Take screenshot showing "playbook: playbook.yml"
```

### 5. Successful Execution
```bash
ansible-playbook playbook.yml --connection=local --limit localhost
# Take screenshot of PLAY RECAP showing success
```

## 🎓 What to Explain in Exam

### Inventory (hosts.ini)
- **Two groups defined**: webservers (frontend) and appservers (backend)
- **Variables set**: ansible_user, ansible_host, ansible_port
- **Group variables**: Python interpreter, SSH settings

### Playbook (playbook.yml)
- **Three plays**:
  1. Web servers - Install Docker, Nginx, Node.js
  2. App servers - Install Docker, Node.js, PM2, monitoring
  3. All servers - Install monitoring tools

- **Idempotent tasks**: Can run multiple times safely
- **Handlers**: For service reloads
- **Tags**: For selective execution
- **Variables**: For version management

### Key Ansible Concepts Demonstrated
1. ✅ Inventory management (hosts.ini)
2. ✅ Playbooks with multiple plays
3. ✅ Variables and facts
4. ✅ Handlers for service management
5. ✅ Tags for task organization
6. ✅ Idempotency
7. ✅ Privilege escalation (become: yes)
8. ✅ Package management
9. ✅ Service management
10. ✅ File management

## 🚀 Quick Commands Reference

```bash
# Navigate to ansible directory
cd d:\sampletest\ansible

# Check syntax
ansible-playbook playbook.yml --syntax-check

# Dry run (check mode)
ansible-playbook playbook.yml --check

# Run with verbosity
ansible-playbook playbook.yml -v

# Run specific tags
ansible-playbook playbook.yml --tags docker,nodejs

# List all tasks
ansible-playbook playbook.yml --list-tasks

# List all tags
ansible-playbook playbook.yml --list-tags

# Run on specific hosts
ansible-playbook playbook.yml --limit webservers
```

## 📝 Exam Submission Checklist

- [ ] hosts.ini file created and documented
- [ ] playbook.yml file created with 2+ roles/groups
- [ ] ansible.cfg configuration file
- [ ] README.md with documentation
- [ ] Screenshot: Inventory file
- [ ] Screenshot: Playbook file  
- [ ] Screenshot: Ansible version
- [ ] Screenshot: Syntax check success
- [ ] Screenshot: Playbook execution (PLAY RECAP)
- [ ] All files committed to Git

## 💡 Pro Tips

1. **For demonstration**: Run playbook locally with `--connection=local`
2. **For real deployment**: Use test VMs or Kubernetes Jobs
3. **Show understanding**: Explain each section of playbook
4. **Highlight features**: Tags, handlers, variables, idempotency
5. **Be prepared**: Know how to modify playbook for different scenarios

---

**Note**: Since direct SSH to AKS LoadBalancer IPs isn't standard practice, demonstrating Ansible knowledge through local execution or test VMs is acceptable for academic purposes.
