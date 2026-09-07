# DevOps, AWS, Kubernetes & CI/CD Comprehensive Interview Guide

A structured, practical, real-world interview preparation guide covering **DevOps Principles, AWS Cloud Architecture, Docker & Containerization, Kubernetes (K8s), CI/CD Pipelines, Infrastructure as Code (Terraform), and Observability/Monitoring**.

---

## 📑 Table of Contents

1. [DevOps Fundamentals & Culture](#1-devops-fundamentals--culture)
2. [Linux & Networking Essentials for DevOps](#2-linux--networking-essentials-for-devops)
3. [Docker & Containerization](#3-docker--containerization)
4. [Kubernetes (K8s) Architecture & Questions](#4-kubernetes-k8s-architecture--questions)
5. [AWS Cloud Architecture & Key Services](#5-aws-cloud-architecture--key-services)
6. [CI/CD Pipelines & GitOps](#6-cicd-pipelines--gitops)
7. [Infrastructure as Code (IaC) & Terraform](#7-infrastructure-as-code-iac--terraform)
8. [Monitoring, Logging, & Observability (SRE)](#8-monitoring-logging--observability-sre)
9. [DevSecOps & Cloud Security](#9-devsecops--cloud-security)
10. [Scenario-Based Real-World Interview Questions](#10-scenario-based-real-world-interview-questions)

---

## 1. DevOps Fundamentals & Culture

### Q1: What is DevOps and what core problem does it solve?
**Answer:**
DevOps is a set of practices, cultural philosophies, and tools that combine **Software Development (Dev)** and **IT Operations (Ops)**.
- **Problem solved**: Traditionally, developers threw code "over the wall" to operations teams who were responsible for stability, causing deployment delays, finger-pointing, and downtime.
- **Core pillars (CALMS)**:
  - **C**ulture: Shared responsibility between Dev & Ops.
  - **A**utomation: CI/CD, IaC, automated testing.
  - **L**ean: Eliminating waste, small batch sizes, rapid feedback loops.
  - **M**easurement: MTTR (Mean Time to Resolution), Deployment Frequency, Lead Time for Changes, Change Failure Rate (the 4 DORA metrics).
  - **S**haring: Transparent blameless post-mortems and knowledge sharing.

---

### Q2: What are the 4 DORA Metrics used to measure DevOps performance?
**Answer:**
1. **Deployment Frequency (DF)**: How often code is deployed to production.
2. **Lead Time for Changes (LTTC)**: Time from code commit to code running in production.
3. **Change Failure Rate (CFR)**: Percentage of deployments causing a failure/outage in production.
4. **Mean Time to Recovery / Restore (MTTR)**: Time required to restore service after an incident.

---

### Q3: What is the difference between Continuous Integration (CI), Continuous Delivery (CD), and Continuous Deployment (CD)?
**Answer:**
- **Continuous Integration (CI)**: Developers merge code changes frequently into a shared repository. Every commit automatically triggers builds and automated unit/integration tests.
- **Continuous Delivery (CD)**: Extends CI by automating the release process up to staging/pre-production so any build can be deployed to production safely at any time with a **single manual click/approval**.
- **Continuous Deployment (CD)**: Eliminates manual approval. Every change that passes automated tests and pipeline gates automatically deploys directly to **production**.

---

## 2. Linux & Networking Essentials for DevOps

### Q4: Which Linux commands do you use to troubleshoot CPU, memory, and disk issues?
**Answer:**
- **CPU Troubleshooting**:
  - `top` / `htop`: Real-time system monitor showing load average and per-process CPU usage.
  - `uptime`: Check 1-min, 5-min, 15-min system load averages. (If load average > number of CPU cores, system is overloaded).
  - `mpstat -P ALL 1`: Multi-processor stats per core.
- **Memory Troubleshooting**:
  - `free -m` / `free -h`: Check total, used, free, and cached/buff memory.
  - `vmstat 1 5`: Check swap usage (`si`/`so` - swap in/out). High swap activity indicates memory exhaustion.
- **Disk I/O Troubleshooting**:
  - `df -h`: Filesystem disk space usage.
  - `du -sh *`: Disk space consumed by specific folders.
  - `iostat -xz 1`: Disk I/O bottlenecks and wait percentage (`%util`, `await`).
  - `lsof -i :<port>`: See which process is using a specific port.

---

### Q5: How do you troubleshoot network connectivity issues between servers?
**Answer:**
1. **ICMP Layer**: `ping <host>` (Checks basic IP reachability).
2. **Routing / Hops**: `traceroute <host>` (or `mtr <host>`) to detect which network hop fails.
3. **DNS Resolution**: `nslookup <domain>` or `dig +trace <domain>`.
4. **TCP Port Connectivity**: `nc -zv <host> <port>` or `telnet <host> <port>` or `curl -vk https://<host>:<port>`.
5. **Active sockets/listeners**: `netstat -tulnp` or `ss -tulpn`.
6. **Packet Inspection**: `tcpdump -i eth0 port 80 -w capture.pcap`.

---

## 3. Docker & Containerization

### Q6: What is the difference between a Container and a Virtual Machine (VM)?
**Answer:**
| Feature | Virtual Machine (VM) | Container (Docker) |
|---|---|---|
| **Architecture** | Runs Hypervisor (Type 1 or 2) + Full Guest OS per VM | Shares Host OS Kernel via Linux Namespaces & cgroups |
| **Resource Overhead** | Heavy (Gigabytes of RAM & Disk per VM) | Ultra-lightweight (Megabytes, near zero overhead) |
| **Startup Time** | Minutes | Milliseconds to Seconds |
| **Isolation** | Hardware-level isolation (Very secure) | Process-level isolation via kernel features |
| **Portability** | Hypervisor dependent | Runs identically anywhere Docker runtime exists |

---

### Q7: Explain Linux Namespaces and cgroups in Docker.
**Answer:**
- **Namespaces (Isolation)**: Provide isolated workspaces for each container.
  - `pid` (process IDs)
  - `net` (network interfaces & routing)
  - `mnt` (filesystem mounts)
  - `ipc` (inter-process communication)
  - `uts` (hostname)
  - `user` (user IDs)
- **cgroups / Control Groups (Resource Limiting)**: Control and limit physical hardware resources (CPU shares, RAM limits, Block I/O, Network bandwidth) allocated to a container.

---

### Q8: What are Multi-Stage Docker builds and why are they important?
**Answer:**
Multi-stage builds allow using multiple `FROM` instructions in a single `Dockerfile`. You can use a heavy image with compilers/SDKs for building assets, then copy only the compiled binaries/artifacts into a minimal production runtime image (e.g., Alpine or Distroless).

**Example:**
```dockerfile
# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production runtime stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
```
**Benefits**:
1. Dramatic reduction in image size (e.g., from 1.2 GB down to 80 MB).
2. Enhanced security: Build tools, package managers, and secret keys are stripped from the final production container.
3. Faster pull/push times in CI/CD and production auto-scaling.

---

### Q9: What is the difference between `CMD` and `ENTRYPOINT` in Dockerfile?
**Answer:**
- `ENTRYPOINT`: Sets the primary executable command for the container that is intended not to be overridden easily.
- `CMD`: Provides default arguments for the `ENTRYPOINT` (or default executable if no `ENTRYPOINT` is defined). It can be easily overridden via CLI arguments when running `docker run <image> <new_cmd>`.

**Best Practice Pattern:**
```dockerfile
ENTRYPOINT ["node", "server.js"]
CMD ["--port", "8080"]
# Running 'docker run my-image' executes: node server.js --port 8080
# Running 'docker run my-image --port 9000' executes: node server.js --port 9000
```

---

## 4. Kubernetes (K8s) Architecture & Questions

### Q10: Describe the Master (Control Plane) and Worker Node architecture of Kubernetes.
**Answer:**

```
+-------------------------------------------------------------+
|                      CONTROL PLANE                          |
|  +-------------+  +------------+  +----------------------+  |
|  | kube-apiserver |  | etcd (db)  |  | kube-controller-mgr  |  |
|  +-------------+  +------------+  +----------------------+  |
|         ^                                                   |
|         |         +-----------------------+                 |
|         +-------> | kube-scheduler        |                 |
|                   +-----------------------+                 |
+-------------------------------------------------------------+
                             |
       +---------------------+---------------------+
       v                                           v
+-----------------------+               +-----------------------+
|      WORKER NODE 1    |               |      WORKER NODE 2    |
| +-------------------+ |               | +-------------------+ |
| | kubelet           | |               | | kubelet           | |
| +-------------------+ |               | +-------------------+ |
| | kube-proxy        | |               | | kube-proxy        | |
| +-------------------+ |               | +-------------------+ |
| | Container Runtime | |               | | Container Runtime | |
| | (containerd/CRI-O)| |               | | (containerd/CRI-O)| |
| +-------------------+ |               | +-------------------+ |
| | Pods & Containers | |               | | Pods & Containers | |
| +-------------------+ |               | +-------------------+ |
+-----------------------+               +-----------------------+
```

#### Control Plane Components:
1. **kube-apiserver**: Central REST gateway and communication hub for all K8s operations. Only component that talks directly to etcd.
2. **etcd**: Highly available, distributed key-value store holding the complete cluster state and configuration.
3. **kube-scheduler**: Watches for unscheduled Pods and assigns them to optimal worker nodes based on resource requests, taints/tolerations, affinity, etc.
4. **kube-controller-manager**: Runs controllers that regulate state (Node Controller, Replication Controller, Endpoints Controller, Namespace Controller).
5. **cloud-controller-manager**: Integrates with cloud provider APIs (AWS, GCP, Azure) to provision load balancers, volumes, and node instances.

#### Worker Node Components:
1. **kubelet**: Agent on each node ensuring that containers described in `PodSpecs` are running and healthy.
2. **kube-proxy**: Network proxy maintaining IP packet filters (`iptables` / `IPVS`) for K8s Service abstraction and load balancing.
3. **Container Runtime**: Software that executes containers (e.g., `containerd`, `CRI-O`).

---

### Q11: Explain the difference between Pod, Deployment, StatefulSet, and DaemonSet.
**Answer:**
- **Pod**: Smallest deployable unit in K8s, encapsulates one or more co-located containers sharing localhost and network namespace.
- **Deployment**: Best for **stateless** workloads. Manages declarative rollout, scaling, rollback, and self-healing of ReplicaSets.
- **StatefulSet**: Best for **stateful** workloads (Databases, Kafka, Redis, Elasticsearch). Provides unique, stable network identifiers (`pod-0`, `pod-1`), persistent storage identity (`PVC` templates), and ordered graceful deployment/termination.
- **DaemonSet**: Ensures that **all (or selected) worker nodes run exactly one copy** of a Pod. Ideal for node-level log collectors (Fluentd, Promtail) and monitoring agents (Datadog, Prometheus node-exporter).

---

### Q12: Explain K8s Service types: ClusterIP, NodePort, LoadBalancer, and Ingress.
**Answer:**
1. **ClusterIP (Default)**: Exposes the Service on an internal cluster-only IP. Accessible only within the Kubernetes cluster.
2. **NodePort**: Allocates a static port (default range: 30000-32767) on each Node's external IP (`<NodeIP>:<NodePort>`).
3. **LoadBalancer**: Provisions an external cloud provider load balancer (e.g., AWS Network Load Balancer / ALB) routing directly to the NodePorts.
4. **Ingress**: Not a service itself, but an API object managing external HTTP/HTTPS routing, SSL/TLS termination, and path-based routing (`example.com/api` -> Service A, `example.com/web` -> Service B) managed by an Ingress Controller (e.g., NGINX Ingress, AWS ALB Ingress Controller).

---

### Q13: What are Liveness, Readiness, and Startup Probes?
**Answer:**
- **Startup Probe**: Determines if the application inside the container has initialized. All other probes are disabled until startup succeeds. Crucial for legacy/slow-booting apps.
- **Readiness Probe**: Determines if the container is ready to accept incoming user traffic. If it fails, the Pod's IP is removed from Service endpoints (no traffic routed), but the container is **not restarted**.
- **Liveness Probe**: Determines if the container is running and healthy. If it fails, `kubelet` terminates and **restarts** the container according to its `restartPolicy`.

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  periodSeconds: 5
```

---

### Q14: What is Horizontal Pod Autoscaler (HPA) vs Vertical Pod Autoscaler (VPA) vs Cluster Autoscaler (CA)?
**Answer:**
- **HPA (Horizontal Pod Autoscaler)**: Scales the **number of replicas** up or down based on CPU/memory usage or custom Prometheus metrics.
- **VPA (Vertical Pod Autoscaler)**: Adjusts the **CPU and memory requests/limits** of existing containers dynamically (requires Pod restart unless using in-place resize).
- **Cluster Autoscaler (CA) / Karpenter**: Scales the **number of underlying physical or cloud VM instances (Worker Nodes)** when Pods cannot be scheduled due to insufficient cluster capacity.

---

### Q15: How do you troubleshoot a Pod stuck in `CrashLoopBackOff`, `Pending`, or `ImagePullBackOff`?
**Answer:**
1. **`ImagePullBackOff` / `ErrImagePull`**:
   - Run `kubectl describe pod <pod-name>`
   - Check image name, tag typo, or missing container registry credentials (`imagePullSecrets`).
2. **`Pending`**:
   - Run `kubectl describe pod <pod-name>`
   - Usually caused by insufficient CPU/Memory requests on worker nodes, node taints without matching tolerations, or unsatisfied PersistentVolumeClaims (PVC).
3. **`CrashLoopBackOff`**:
   - Step 1: `kubectl logs <pod-name> --previous` to see why the previous container crashed.
   - Step 2: `kubectl describe pod <pod-name>` to check exit code (e.g., Exit 137 = OOMKilled / Out of Memory; Exit 1 = Application runtime error).
   - Step 3: Verify environment variables, missing database connection secrets, or missing volume mounts.

---

## 5. AWS Cloud Architecture & Key Services

### Q16: Explain the architecture of a secure AWS VPC (Virtual Private Cloud).
**Answer:**
A production-ready AWS VPC setup consists of:
- **CIDR Block**: e.g., `10.0.0.0/16`
- **Availability Zones (AZs)**: Spanning at least 2 to 3 AZs for High Availability.
- **Public Subnets**:
  - Attached to an **Internet Gateway (IGW)** with route table `0.0.0.0/0 -> igw-id`.
  - Hosts public-facing Application Load Balancers (ALB) and NAT Gateways.
- **Private Subnets (Application Tier)**:
  - Route table points `0.0.0.0/0 -> nat-gateway-id` (outbound-only Internet access for patching/updates).
  - Hosts backend compute instances (EKS worker nodes, EC2, ECS tasks).
- **Isolated / Database Subnets (Data Tier)**:
  - No route to Internet or NAT Gateway.
  - Hosts Aurora/RDS, ElastiCache, Secrets.
- **Security Layers**:
  - **Security Groups (Stateful)**: Applied at the EC2/ENI level.
  - **Network ACLs (Stateless)**: Subnet boundary firewall.

---

### Q17: What is the difference between IAM Roles, Users, Groups, and Policies?
**Answer:**
- **IAM User**: An identity with permanent long-term credentials (username/password or Access Key ID / Secret Access Key) for a person or service.
- **IAM Group**: A collection of IAM Users to assign shared permissions.
- **IAM Role**: An identity with temporary security credentials (via AWS STS) that can be assumed by trusted entities (EC2 instances, Lambda functions, EKS Service Accounts via IRSA, or cross-account users).
- **IAM Policy**: A JSON document that explicitly declares `Effect` (Allow/Deny), `Action` (e.g., `s3:GetObject`), `Resource` (e.g., `arn:aws:s3:::my-bucket/*`), and `Condition`.

---

### Q18: What is IAM Roles for Service Accounts (IRSA) in AWS EKS?
**Answer:**
Instead of granting broad AWS permissions to entire EKS EC2 worker nodes, **IRSA** integrates AWS IAM with Kubernetes ServiceAccounts using OIDC (OpenID Connect).
- K8s injects a signed JSON Web Token (JWT) into the Pod.
- Pod uses AWS SDK which calls `sts:AssumeRoleWithWebIdentity` to receive short-lived AWS temporary credentials.
- **Benefit**: Principle of Least Privilege — only the specific Pod needing S3/DynamoDB access receives it.

---

### Q19: Compare S3 storage classes: Standard, Intelligent-Tiering, Glacier Flexible, and Glacier Deep Archive.
**Answer:**
- **S3 Standard**: High durability (99.999999999%), low latency, frequent access.
- **S3 Intelligent-Tiering**: Automatically moves objects between frequent, infrequent, and archive tiers without retrieval fees based on access patterns.
- **S3 Glacier Instant / Flexible Retrieval**: Cost-effective archive. Retrieval times range from milliseconds (Instant) to 1-5 minutes (Expedited) or 3-5 hours (Standard).
- **S3 Glacier Deep Archive**: Lowest cost cloud storage designed for long-term compliance retention (retrieval time: 12-48 hours).

---

### Q20: Explain AWS Lambda execution lifecycle and how to minimize Cold Starts.
**Answer:**
- **Lifecycle Phases**:
  1. **Init**: Downloads code, initializes runtime, executes initialization code outside the handler (DB connections, library imports).
  2. **Invoke**: Executes handler logic with event payload.
  3. **Shutdown**: Cleans up execution environment.
- **Mitigating Cold Starts**:
  - Keep deployment packages small (strip unused dependencies).
  - Initialize database connection pools and SDK clients **outside** the handler function to reuse across warm invocations.
  - Use lightweight runtimes (Go, Rust, Node.js) over heavy JVM/Python runtimes when ultra-low cold start is needed.
  - Enable **Provisioned Concurrency** for latency-critical APIs.

---

## 6. CI/CD Pipelines & GitOps

### Q21: What is the difference between Blue/Green, Canary, and Rolling Deployments?
**Answer:**

```
+--------------------+---------------------------------------------------------------+-----------------------------------------+
| Strategy           | How it Works                                                  | Pros / Cons                             |
+--------------------+---------------------------------------------------------------+-----------------------------------------+
| Rolling Deployment | Replaces old pods/instances incrementally one by one          | + No downtime, low resource overhead    |
|                    | until all instances are on the new version.                   | - Old & new versions run simultaneously |
+--------------------+---------------------------------------------------------------+-----------------------------------------+
| Blue/Green         | Deploys identical new environment (Green), tests it,          | + Instant rollback (switch router/DNS)  |
| Deployment         | then switches 100% traffic from Blue to Green.                | - Requires double infrastructure cost   |
+--------------------+---------------------------------------------------------------+-----------------------------------------+
| Canary             | Routes small % of real traffic (e.g. 5%) to new version,      | + Minimizes blast radius of bugs        |
| Deployment         | observes error rates/APM, then gradually ramps to 100%.       | - Requires advanced routing (Argo/Istio)|
+--------------------+---------------------------------------------------------------+-----------------------------------------+
```

---

### Q22: What is GitOps and how do tools like ArgoCD / Flux work?
**Answer:**
**GitOps** is a deployment framework where Git is the **single source of truth** for declarative infrastructure and application state.
- **Pull vs. Push Model**:
  - Traditional CI/CD (**Push**): CI server holds production cluster credentials and pushes changes via `kubectl apply`. (Security risk if CI is compromised).
  - GitOps (**Pull**): An agent (like **ArgoCD** or **Flux**) runs inside the Kubernetes cluster, monitors Git for commits, and continuously synchronizes cluster state with Git.
- **Key Advantages**:
  - Built-in audit trail (every deployment is a Git commit).
  - Rollback is simply `git revert`.
  - Eliminates the need to expose cluster API endpoints or credentials to external CI tools.
  - Automatic drift detection (alerts or auto-heals if someone manually edits K8s resources).

---

### Q23: Write a complete GitHub Actions CI/CD pipeline example for Docker + AWS ECR/EKS.
**Answer:**
```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # Required for AWS OIDC authentication
      contents: read

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Configure AWS Credentials (OIDC - No long-lived keys)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsDeploymentRole
          aws-region: us-east-1

      - name: Log in to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push Docker image to Amazon ECR
        env:
          REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          REPOSITORY: my-app
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $REGISTRY/$REPOSITORY:$IMAGE_TAG -t $REGISTRY/$REPOSITORY:latest .
          docker push $REGISTRY/$REPOSITORY:$IMAGE_TAG
          docker push $REGISTRY/$REPOSITORY:latest

      - name: Update Kubeconfig
        run: aws eks update-kubeconfig --region us-east-1 --name prod-cluster

      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/my-app-deployment my-app=${{ steps.login-ecr.outputs.registry }}/my-app:${{ github.sha }} -n production
          kubectl rollout status deployment/my-app-deployment -n production --timeout=120s
```

---

## 7. Infrastructure as Code (IaC) & Terraform

### Q24: How does Terraform manage State and why is Remote State locking essential?
**Answer:**
- **Terraform State (`terraform.tfstate`)**: Maps declared resources in code to real-world infrastructure IDs and metadata in the cloud provider.
- **Why Remote State & Locking is Essential**:
  - In a team environment, local state leads to divergence, race conditions, and accidental resource deletion.
  - **AWS S3 + DynamoDB pattern**: S3 stores encrypted state files with versioning enabled; DynamoDB provides distributed locking (`LockID`) so two team members or CI jobs cannot run `terraform apply` concurrently.

```hcl
terraform {
  backend "s3" {
    bucket         = "company-tf-state-prod"
    key            = "vpc/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

---

### Q25: Explain Terraform `count` vs `for_each`, and Terraform Modules.
**Answer:**
- `count`: Provisions multiple resources based on an integer index (`count.index`).
  - *Risk*: If an item is deleted from the middle of a list, Terraform will destroy and recreate all subsequent resources.
- `for_each`: Iterates over maps or sets using unique keys. Safe against middle-element removal.
- **Terraform Modules**: Reusable, parameterized packages of Terraform configuration that promote DRY (Don't Repeat Yourself) architecture (e.g., standardizing VPC or EKS cluster creations across environments).

---

## 8. Monitoring, Logging, & Observability (SRE)

### Q26: What are the 3 Pillars of Observability?
**Answer:**
1. **Metrics**: Numeric aggregated data over time (CPU %, request count, error rate, p99 latency). High speed, low storage cost. (Tools: Prometheus, Datadog).
2. **Logs**: Timestamped structured/unstructured records of individual events. (Tools: ELK Stack / OpenSearch, Loki, CloudWatch).
3. **Distributed Traces**: Tracks the lifecycle and latency of a single user request across multiple microservices. (Tools: OpenTelemetry, Jaeger, AWS X-Ray).

---

### Q27: What is the Golden Signals of SRE monitoring?
**Answer:**
Defined by Google SRE handbook:
1. **Latency**: Time taken to service a request (differentiate successful request latency vs error latency).
2. **Traffic**: Demand placed on system (HTTP requests per second, I/O rate).
3. **Errors**: Rate of requests that fail (HTTP 500s, explicit failure codes).
4. **Saturation**: How full the service is (memory utilization, DB connection pool saturation).

---

## 9. DevSecOps & Cloud Security

### Q28: How do you implement "Shift-Left Security" in a CI/CD pipeline?
**Answer:**
1. **Static Application Security Testing (SAST)**: Scanning source code for vulnerabilities and bad patterns (e.g., SonarQube, Semgrep).
2. **Software Composition Analysis (SCA)**: Scanning third-party dependencies/npm packages for known CVEs (e.g., Snyk, Trivy, npm audit).
3. **Secret Scanning**: Preventing hardcoded tokens/passwords from reaching Git (e.g., GitGuardian, TruffleHog, pre-commit hooks).
4. **Container Image Scanning**: Scanning Docker image base layers for OS vulnerabilities (e.g., Trivy, AWS ECR enhanced scanning, Clair).
5. **Dynamic Application Security Testing (DAST)**: Scanning live staging environment for runtime vulnerabilities (e.g., OWASP ZAP).

---

## 10. Scenario-Based Real-World Interview Questions

### Q29: Scenario: Production service is throwing HTTP 504 Gateway Timeout errors. Walk through your step-by-step troubleshooting plan.
**Answer:**
1. **Understand 504**: A 504 Gateway Timeout means the reverse proxy/Load Balancer (ALB, NGINX) waited for a response from the upstream backend server, but the backend didn't respond before the timeout threshold.
2. **Step 1: Check Load Balancer & Edge**:
   - Check AWS CloudWatch / NGINX access logs: Are requests reaching the ALB? Check `TargetResponseTime` metric.
3. **Step 2: Inspect Backend Pods/Instances**:
   - Check if backend pods are alive: `kubectl get pods -n prod` (Look for restarts or OOMKilled).
   - Check CPU/Memory saturation on backend instances.
4. **Step 3: Downstream Dependencies**:
   - Is the database experiencing high CPU, deadlocks, or exhausted connection pool?
   - Is an external 3rd-party API down or hanging without a timeout?
5. **Step 4: Check Logs & Tracing**:
   - Inspect APM (Datadog/Jaeger distributed traces) to isolate which function or SQL query took > 30s.

---

### Q30: Scenario: How do you design a Zero-Downtime database migration during a CI/CD deployment?
**Answer:**
Use the **Expand and Contract (Parallel Change) Pattern**:
1. **Phase 1 (Expand)**: Add the new column/table in the DB as nullable. Old code and new code can both safely run.
2. **Phase 2 (Dual Write / App Update)**: Deploy new app version that writes to both old and new columns, reading from old if needed.
3. **Phase 3 (Backfill)**: Run a background migration script to sync old historical data into the new column.
4. **Phase 4 (Switch Read)**: Update app to read exclusively from the new column.
5. **Phase 5 (Contract)**: Drop old column/table in the next release.

---
*(Created for comprehensive interview preparation covering DevOps, AWS, Kubernetes, and CI/CD)*
