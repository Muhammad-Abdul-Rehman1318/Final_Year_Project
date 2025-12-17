# Ansible Configuration Management - DevOps Lab

## Overview
This Ansible configuration automates the setup and configuration of web servers (frontend) and application servers (backend) for the DevOps Lab project deployed on Azure AKS.

## Directory Structure
```
ansible/
├── ansible.cfg          # Ansible configuration
├── hosts.ini           # Inventory file with server definitions
├── playbook.yml        # Main playbook for server configuration
└── README.md           # This file
```

## Inventory (hosts.ini)

### Server Groups:
1. **webservers** - Frontend servers running React application
   - frontend-server (4.224.133.62)

2. **appservers** - Backend servers running Node.js API
   - backend-server (98.70.247.91)

3. **kubernetes** - Combined group for all K8s-related servers

## Playbook Tasks

### Play 1: Configure Web Servers (Frontend)
- Update system packages
- Install Docker and Docker Compose
- Install and configure Nginx as reverse proxy
- Install Node.js 18
- Verify all installations

### Play 2: Configure Application Servers (Backend)
- Update system packages
- Install Docker and Docker Compose
- Install Node.js 18
- Install PM2 process manager
- Install Python monitoring tools
- Create application directory
- Configure firewall rules
- Verify all installations

### Play 3: Configure Monitoring (All Servers)
- Install system monitoring tools (htop, iotop, sysstat, nethogs)
- Enable sysstat service
- Create custom monitoring script
- Display system information

## Prerequisites

### 1. Install Ansible (on your local machine)
```bash
# Windows (using WSL or Git Bash)
pip install ansible

# Or using Chocolatey
choco install ansible
```

### 2. SSH Access Setup
You need SSH access to the AKS nodes. Since these are LoadBalancer IPs, you'll need to:

**Option A: Use Azure Bastion or Jump Host**
```bash
# Connect through Azure Bastion
az network bastion ssh --name <bastion-name> --resource-group devops-lab-rg-ci --target-resource-id <vm-id> --auth-type ssh-key --username azureuser
```

**Option B: Use kubectl port-forward (Recommended for AKS)**
```bash
# Get pod name
kubectl get pods -n devops-app

# Port forward to access pod
kubectl port-forward -n devops-app <pod-name> 2222:22
```

**Option C: Update hosts.ini with actual node IPs**
```bash
# Get AKS node IPs
kubectl get nodes -o wide

# Update hosts.ini with internal IPs
```

## Running the Playbook

### 1. Test Connectivity
```bash
cd ansible
ansible all -m ping
```

### 2. Run Full Playbook
```bash
ansible-playbook playbook.yml
```

### 3. Run Specific Tags
```bash
# Only install Docker
ansible-playbook playbook.yml --tags docker

# Only setup monitoring
ansible-playbook playbook.yml --tags monitoring

# Verify installations only
ansible-playbook playbook.yml --tags verify
```

### 4. Run on Specific Hosts
```bash
# Only web servers
ansible-playbook playbook.yml --limit webservers

# Only app servers
ansible-playbook playbook.yml --limit appservers
```

### 5. Dry Run (Check Mode)
```bash
ansible-playbook playbook.yml --check
```

## Alternative Approach for AKS

Since direct SSH to LoadBalancer IPs might not work, here's an alternative approach:

### Create a DaemonSet for Configuration
Instead of using external Ansible, you can:
1. Create a Kubernetes DaemonSet that runs Ansible locally on each node
2. Use Ansible-pull to fetch and run playbooks from Git

### Use Azure VM Scale Sets
If you need direct access:
1. Create a separate VM in the same VNet as AKS
2. Use that as Ansible control node
3. Access AKS nodes via internal IPs

## Expected Output

When you run the playbook successfully, you should see:

```
PLAY [Configure Web Servers (Frontend)] ************************************

TASK [Gathering Facts] *****************************************************
ok: [frontend-server]

TASK [Update apt package cache] ********************************************
changed: [frontend-server]

TASK [Install required system packages] ************************************
changed: [frontend-server]

...

PLAY RECAP *****************************************************************
frontend-server    : ok=15   changed=12   unreachable=0    failed=0
backend-server     : ok=16   changed=13   unreachable=0    failed=0
```

## Troubleshooting

### Connection Issues
```bash
# Test SSH connection manually
ssh -i ~/.ssh/id_rsa azureuser@4.224.133.62

# Increase verbosity
ansible-playbook playbook.yml -vvv
```

### Permission Issues
```bash
# Ensure SSH key has correct permissions
chmod 600 ~/.ssh/id_rsa

# Test with password authentication
ansible-playbook playbook.yml --ask-pass --ask-become-pass
```

## Screenshots Required for Submission

1. **Inventory file** (hosts.ini)
2. **Playbook file** (playbook.yml)
3. **Successful playbook execution** showing:
   - All tasks completed
   - Play recap with no failures
   - Verification output

## Tags Reference

| Tag | Description |
|-----|-------------|
| setup | System setup tasks |
| packages | Package installation |
| docker | Docker installation and configuration |
| nginx | Nginx installation and configuration |
| nodejs | Node.js installation |
| pm2 | PM2 process manager |
| monitoring | Monitoring tools setup |
| firewall | Firewall configuration |
| verify | Verification tasks |
| info | Display system information |

## Notes

- All tasks are idempotent (can be run multiple times safely)
- Playbook uses `become: yes` for sudo privileges
- Handlers are used for service reloads
- Facts are gathered for system information
- Tags allow selective execution of tasks

## Author
Muhammad Owais - DevOps Lab Project
