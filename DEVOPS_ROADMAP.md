# 🚀 DevOps Roadmap với dự án Booking (MERN Stack)

> Tài liệu này hướng dẫn bạn học DevOps **từ con số 0 đến triển khai thực tế** dựa trên chính dự án Booking của bạn (React + Node.js + MongoDB).
>
> **Triết lý học:** Học bằng cách làm. Mỗi giai đoạn bạn sẽ áp dụng trực tiếp vào dự án này.

---

## 📋 Mục lục

- [Tổng quan lộ trình](#tổng-quan-lộ-trình)
- [Giai đoạn 0: Chuẩn bị nền tảng (1 tuần)](#giai-đoạn-0-chuẩn-bị-nền-tảng-1-tuần)
- [Giai đoạn 1: Docker & Containerization (1-2 tuần)](#giai-đoạn-1-docker--containerization-1-2-tuần)
- [Giai đoạn 2: Git & GitHub chuyên nghiệp (3-5 ngày)](#giai-đoạn-2-git--github-chuyên-nghiệp-3-5-ngày)
- [Giai đoạn 3: CI/CD với GitHub Actions (1-2 tuần)](#giai-đoạn-3-cicd-với-github-actions-1-2-tuần)
- [Giai đoạn 4: Triển khai lên Cloud (2-3 tuần)](#giai-đoạn-4-triển-khai-lên-cloud-2-3-tuần)
- [Giai đoạn 5: Infrastructure as Code - Terraform (2 tuần)](#giai-đoạn-5-infrastructure-as-code---terraform-2-tuần)
- [Giai đoạn 6: Kubernetes (3-4 tuần)](#giai-đoạn-6-kubernetes-3-4-tuần)
- [Giai đoạn 7: Monitoring & Logging (1-2 tuần)](#giai-đoạn-7-monitoring--logging-1-2-tuần)
- [Giai đoạn 8: Security & Best Practices (1 tuần)](#giai-đoạn-8-security--best-practices-1-tuần)
- [Tài liệu tham khảo](#tài-liệu-tham-khảo)

---

## Tổng quan lộ trình

```
┌─────────────────────────────────────────────────────────────────┐
│                     LỘ TRÌNH DEVOPS 3-4 THÁNG                   │
├─────────────────────────────────────────────────────────────────┤
│  Tuần 1     │ Linux + Networking + Bash cơ bản                  │
│  Tuần 2-3   │ Docker + Docker Compose (đã có sẵn dự án)         │
│  Tuần 4     │ Git workflow + GitHub                             │
│  Tuần 5-6   │ CI/CD với GitHub Actions                          │
│  Tuần 7-9   │ Cloud (AWS hoặc Azure) - EC2, S3, RDS             │
│  Tuần 10-11 │ Terraform (Infrastructure as Code)                │
│  Tuần 12-15 │ Kubernetes (Minikube → EKS/AKS)                   │
│  Tuần 16-17 │ Monitoring (Prometheus + Grafana + ELK)           │
│  Tuần 18    │ Security, DevSecOps, tổng kết                     │
└─────────────────────────────────────────────────────────────────┘
```

**Nguyên tắc:** Đừng nhảy cóc. Mỗi giai đoạn đều có "**Bài tập checkpoint**" — chỉ chuyển sang giai đoạn sau khi đã làm xong.

---

## Giai đoạn 0: Chuẩn bị nền tảng (1 tuần)

### 🎯 Mục tiêu
Hiểu môi trường Linux, mạng, và shell — vì 90% công việc DevOps làm trên Linux server.

### 📚 Kiến thức cần học

#### 1. Linux cơ bản
- Cài WSL2 (Ubuntu) trên Windows: `wsl --install`
- Lệnh cơ bản: `cd`, `ls`, `pwd`, `mkdir`, `rm`, `cp`, `mv`, `cat`, `grep`, `find`, `chmod`, `chown`
- Quản lý process: `ps`, `top`, `htop`, `kill`
- Quản lý package: `apt update`, `apt install`
- Soạn file: `nano`, `vim` (cơ bản đủ để chỉnh config)
- Phân quyền user và file (rwx, sudo)

#### 2. Networking cơ bản
- IP, port, DNS, HTTP/HTTPS
- Sự khác nhau giữa `localhost`, `127.0.0.1`, `0.0.0.0`
- Lệnh: `ping`, `curl`, `wget`, `netstat`, `ss`, `nslookup`
- Hiểu firewall và security group

#### 3. Bash scripting
- Biến, vòng lặp, if/else
- Viết được script đơn giản tự động hóa task

### ✅ Bài tập checkpoint
- [ ] Cài WSL2, tạo file script `setup.sh` tự động cài Node.js + Git + Docker
- [ ] Dùng `curl` gọi backend API của dự án này khi chạy local
- [ ] Hiểu được đoạn `EXPOSE 5000` trong `backend/Dockerfile` nghĩa là gì

### 📖 Tài liệu
- [Linux Journey](https://linuxjourney.com/) (miễn phí, tiếng Anh dễ)
- [Bash scripting tutorial](https://www.shellscript.sh/)

---

## Giai đoạn 1: Docker & Containerization (1-2 tuần)

> 🎉 **Tin vui:** Dự án của bạn đã có sẵn `Dockerfile` và `docker-compose.yml`. Giai đoạn này sẽ giúp bạn **hiểu sâu** thay vì copy-paste.

### 🎯 Mục tiêu
- Hiểu container là gì, khác VM thế nào
- Tự viết được Dockerfile tối ưu (multi-stage, cache layer)
- Sử dụng Docker Compose orchestrate nhiều service
- Hiểu volume, network, environment variables

### 📚 Kiến thức cần học

#### 1.1. Docker concepts
- Image vs Container
- Layer & cache
- Registry (Docker Hub)
- Volume (persistent data) vs Bind mount
- Network bridge

#### 1.2. Phân tích Dockerfile hiện có

**Backend Dockerfile (`backend/Dockerfile`):**
```dockerfile
FROM node:20-alpine          # ← Base image siêu nhẹ
WORKDIR /app                 # ← Thư mục làm việc trong container
COPY package*.json ./        # ← Copy trước để tận dụng cache
RUN npm install              # ← Cài deps (chỉ chạy lại khi package.json đổi)
COPY . .                     # ← Copy source code
EXPOSE 5000                  # ← Khai báo port (không tự mở)
CMD ["npm", "start"]         # ← Lệnh chạy khi container start
```

**Frontend Dockerfile (`frontend/Dockerfile`):** dùng **multi-stage build**
- Stage 1: dùng Node để build static files
- Stage 2: dùng Nginx nhẹ để serve → image cuối nhỏ hơn rất nhiều

### 🛠️ Bài thực hành theo từng bước

#### Bước 1: Chạy thử dự án bằng Docker Compose
```bash
# Tại thư mục booking/
docker compose up --build -d

# Kiểm tra container đang chạy
docker ps

# Xem log
docker compose logs -f backend-app
docker compose logs -f frontend-app

# Truy cập: http://localhost:5173 (frontend) và http://localhost:5001/api (backend)
```

#### Bước 2: Cải tiến `backend/Dockerfile` - production-ready
Tạo file mới `backend/Dockerfile.prod`:
```dockerfile
# ---- Stage 1: Dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ---- Stage 2: Runtime ----
FROM node:20-alpine
WORKDIR /app
# Tạo user non-root cho bảo mật
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
USER app
EXPOSE 5001
CMD ["node", "src/server.js"]
```

**Tại sao cần cải tiến?**
- `npm ci` thay `npm install` → cài chính xác từ lock file, nhanh và ổn định hơn
- `--only=production` → bỏ devDependencies, image nhỏ hơn
- Tạo user non-root → bảo mật tốt hơn
- Multi-stage → image cuối không chứa file thừa

#### Bước 3: Sửa lỗi cấu hình hiện tại
Trong `backend/Dockerfile` đang `EXPOSE 5000` nhưng `docker-compose.yml` map cổng `5001:5001`. **Sửa lại cho đồng nhất:**

```dockerfile
# backend/Dockerfile
EXPOSE 5001
```

Đồng thời kiểm tra `backend/.env` xem `PORT=5001` chưa.

#### Bước 4: Health check
Thêm vào `docker-compose.yml`:
```yaml
backend-app:
  # ... các config cũ
  healthcheck:
    test: ["CMD", "wget", "-q", "--spider", "http://localhost:5001/api/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

> Bạn cần thêm route `/api/health` trong backend trả về 200 OK.

#### Bước 5: Network riêng và phụ thuộc
```yaml
services:
  backend-app:
    networks:
      - booking-net
    depends_on:
      database-app:
        condition: service_started

  frontend-app:
    networks:
      - booking-net
    depends_on:
      backend-app:
        condition: service_healthy

  database-app:
    networks:
      - booking-net

networks:
  booking-net:
    driver: bridge
```

### ✅ Bài tập checkpoint
- [ ] Chạy được toàn bộ stack với 1 lệnh `docker compose up`
- [ ] Vào được container backend bằng `docker exec -it booking-backend sh`
- [ ] Xem log realtime: `docker compose logs -f`
- [ ] Push image lên Docker Hub:
  ```bash
  docker tag booking_backend-app yourname/booking-backend:v1
  docker push yourname/booking-backend:v1
  ```
- [ ] Viết Dockerfile tối ưu < 200MB cho backend
- [ ] Hiểu sự khác nhau giữa `CMD` và `ENTRYPOINT`

### 📖 Tài liệu
- [Docker Official Tutorial](https://docs.docker.com/get-started/)
- [Play with Docker](https://labs.play-with-docker.com/) (sandbox online)

---

## Giai đoạn 2: Git & GitHub chuyên nghiệp (3-5 ngày)

### 🎯 Mục tiêu
Sử dụng Git như một DevOps engineer thực thụ — branching strategy, PR workflow.

### 📚 Kiến thức cần học

#### Git workflow chuẩn (Git Flow đơn giản)
```
main          ────●──────●──────●──── (production, luôn ổn định)
                  │      │      │
develop       ────●──●───●──●───●──── (tích hợp feature)
                     │      │
feature/xxx   ───────●──────│
                            │
hotfix/yyy    ──────────────●
```

#### Lệnh cần thuộc
```bash
git checkout -b feature/add-payment      # Tạo nhánh feature
git add .
git commit -m "feat: add payment module"
git push origin feature/add-payment
# → Tạo Pull Request trên GitHub → review → merge vào develop
```

#### Conventional Commits
```
feat: thêm tính năng mới
fix: sửa bug
docs: sửa docs
refactor: refactor code, không thay đổi behavior
chore: việc lặt vặt (cập nhật deps...)
ci: thay đổi CI config
```

### 🛠️ Bài thực hành

#### Bước 1: Setup repo GitHub
```bash
# Tại thư mục booking/
git remote add origin https://github.com/<username>/booking.git
git push -u origin main
```

#### Bước 2: Bảo vệ nhánh main
Trên GitHub: **Settings → Branches → Add rule** cho `main`:
- ✅ Require pull request before merging
- ✅ Require status checks to pass (sẽ dùng ở Giai đoạn 3)
- ✅ Do not allow force push

#### Bước 3: Tạo file `.gitignore` đầy đủ ở root
```gitignore
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
.vscode/
```

#### Bước 4: Tạo PR template
Tạo `.github/pull_request_template.md`:
```markdown
## Mô tả
<!-- PR này làm gì? -->

## Loại thay đổi
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Đã test
- [ ] Test thủ công
- [ ] Đã chạy `docker compose up` thành công

## Screenshot (nếu có UI)
```

### ✅ Bài tập checkpoint
- [ ] Push dự án lên GitHub
- [ ] Tạo nhánh `develop`, tạo 1 feature branch, mở PR và merge
- [ ] Viết được `.gitignore` chuẩn

---
- các lệnh cần biết
git checkout -b develop: tạo và chuyển qua nhánh này
git push -u origin develop: : Đẩy nhánh develop mới này lên server GitHub

tạo pull request: Pull Request bản chất là một lời "đề nghị gộp code". Bạn đang gửi một thông báo tới hệ thống với nội dung: "Tôi đã làm xong tính năng này ở nhánh feature/setup-pr rồi, hãy cho phép tôi gộp nó vào nhánh develop nhé", Merge pull request → Confirm merge, GitHub sẽ chính thức đổ toàn bộ code từ nhánh tính năng hòa chung vào dòng chảy của nhánh develop trên hệ thống đám mây.

xong thì nên
git checkout main: chuyển bạn về tính năng main
git pull origin main: Kéo (tải) toàn bộ code mới nhất đã được gộp trên GitHub về máy tính của bạn. Lúc này, thư mục .github lập tức xuất hiện ở nhánh develop trên máy bạn.
## Giai đoạn 3: CI/CD với GitHub Actions (1-2 tuần)

### 🎯 Mục tiêu
Mỗi khi push code → tự động: lint → test → build Docker image → push lên registry.

### 📚 Khái niệm cốt lõi

- **CI (Continuous Integration):** Mỗi commit tự động build & test
- **CD (Continuous Delivery/Deployment):** Tự động deploy lên môi trường

### 🛠️ Bài thực hành

#### Bước 1: Workflow CI cho backend
Tạo `.github/workflows/backend-ci.yml`:
```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run lint (nếu có)
        run: npm run lint --if-present

      - name: Run tests (nếu có)
        run: npm test --if-present

      - name: Build Docker image
        run: docker build -t booking-backend:${{ github.sha }} .
```

#### Bước 2: Workflow CI cho frontend
Tạo `.github/workflows/frontend-ci.yml`:
```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'frontend/**'

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: frontend-dist
          path: frontend/dist
```

#### Bước 3: Push image lên Docker Hub khi merge vào main
Tạo `.github/workflows/docker-publish.yml`:
```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [main]

jobs:
  push-images:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/booking-backend:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/booking-backend:${{ github.sha }}

      - name: Build and push frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/booking-frontend:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/booking-frontend:${{ github.sha }}
```

#### Bước 4: Setup secrets trên GitHub
**Settings → Secrets and variables → Actions → New repository secret:**
- `DOCKERHUB_USERNAME`: username Docker Hub
- `DOCKERHUB_TOKEN`: tạo access token tại Docker Hub → Account Settings → Security

### ✅ Bài tập checkpoint
- [ ] Mỗi PR đều chạy CI tự động và hiển thị status check
- [ ] Khi merge vào `main`, image mới tự động được push lên Docker Hub
- [ ] Hiểu cách dùng `secrets`, `cache`, `matrix build`

### 📖 Tài liệu
- [GitHub Actions docs](https://docs.github.com/en/actions)
- [awesome-actions](https://github.com/sdras/awesome-actions)

---

## Giai đoạn 4: Triển khai lên Cloud (2-3 tuần)

### 🎯 Mục tiêu
Đưa dự án lên cloud thực sự để Internet truy cập được. Chọn **AWS** (phổ biến nhất) hoặc **Azure**.

### Lộ trình AWS (đề xuất cho người mới)

#### Tuần 1: AWS cơ bản (Free Tier 12 tháng)
- Đăng ký AWS Free Tier
- Học IAM (user, role, policy) - **CỰC KỲ QUAN TRỌNG**
- VPC, Subnet, Security Group
- EC2 (máy ảo)
- S3 (lưu trữ object)
- RDS hoặc DocumentDB (database)

#### Tuần 2: Deploy thủ công lên EC2
**Bước 1:** Tạo EC2 instance (Ubuntu 22.04, t2.micro free tier)

**Bước 2:** SSH vào EC2:
```bash
ssh -i your-key.pem ubuntu@<EC2-Public-IP>
```

**Bước 3:** Cài Docker:
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
sudo apt install docker-compose-plugin
```

**Bước 4:** Pull và chạy:
```bash
git clone https://github.com/<username>/booking.git
cd booking
# Tạo file .env cho backend
docker compose up -d
```

**Bước 5:** Cấu hình Security Group mở port 80, 443, 5173, 5001

**Bước 6:** Mua domain (Namecheap, GoDaddy) → trỏ về EC2 IP

**Bước 7:** Cài Nginx reverse proxy + Let's Encrypt SSL:
```bash
sudo apt install nginx certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

#### Tuần 3: Auto-deploy qua GitHub Actions
Thêm vào `.github/workflows/deploy.yml`:
```yaml
name: Deploy to EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: [push-images]   # Chạy sau khi đã push image
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/booking
            git pull origin main
            docker compose pull
            docker compose up -d --remove-orphans
            docker image prune -f
```

### ✅ Bài tập checkpoint
- [ ] Truy cập được dự án qua domain `https://yourdomain.com`
- [ ] Có chứng chỉ SSL (HTTPS)
- [ ] Mỗi lần push lên `main` → auto deploy
- [ ] Database dùng MongoDB Atlas (cloud-managed) thay vì container tự host

### 📖 Tài liệu
- [AWS Free Tier](https://aws.amazon.com/free/)
- [AWS Skill Builder](https://skillbuilder.aws/) (miễn phí)

---

## Giai đoạn 5: Infrastructure as Code - Terraform (2 tuần)

### 🎯 Mục tiêu
Thay vì click chuột tạo EC2/VPC/Security Group → viết code mô tả hạ tầng. Có thể tạo lại y hệt trong 5 phút.

### 📚 Kiến thức

#### Terraform là gì?
- Tool định nghĩa hạ tầng bằng code (HCL syntax)
- Hỗ trợ: AWS, Azure, GCP, DigitalOcean, K8s...
- 4 lệnh chính: `init`, `plan`, `apply`, `destroy`

### 🛠️ Bài thực hành

#### Bước 1: Cài Terraform & AWS CLI
```bash
# Cài Terraform
choco install terraform   # Windows
# hoặc tải binary tại terraform.io

# Cài AWS CLI và config
aws configure
```

#### Bước 2: Tạo project Terraform
Tạo thư mục `infrastructure/` ở root với các file:

**`infrastructure/main.tf`:**
```hcl
terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "booking_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = { Name = "booking-vpc" }
}

# Subnet công khai
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.booking_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"
  tags = { Name = "booking-public-subnet" }
}

# Security Group
resource "aws_security_group" "booking_sg" {
  name   = "booking-sg"
  vpc_id = aws_vpc.booking_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 instance
resource "aws_instance" "booking_app" {
  ami                    = "ami-0c7217cdde317cfec"  # Ubuntu 22.04 us-east-1
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.booking_sg.id]
  key_name               = var.key_pair_name

  user_data = <<-EOF
    #!/bin/bash
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker ubuntu
  EOF

  tags = { Name = "booking-app" }
}
```

**`infrastructure/variables.tf`:**
```hcl
variable "aws_region" {
  default = "us-east-1"
}

variable "key_pair_name" {
  description = "EC2 Key Pair name"
  type        = string
}
```

**`infrastructure/outputs.tf`:**
```hcl
output "instance_public_ip" {
  value = aws_instance.booking_app.public_ip
}
```

#### Bước 3: Chạy Terraform
```bash
cd infrastructure
terraform init                                # Khởi tạo
terraform plan -var="key_pair_name=my-key"    # Xem trước thay đổi
terraform apply -var="key_pair_name=my-key"   # Áp dụng
terraform destroy                             # Xóa toàn bộ (tránh tốn tiền)
```

### ✅ Bài tập checkpoint
- [ ] Tạo được toàn bộ hạ tầng Booking bằng `terraform apply`
- [ ] Hiểu remote state (lưu state vào S3 + DynamoDB lock)
- [ ] Tách module (modules/vpc, modules/ec2)
- [ ] Hiểu khái niệm `terraform import`

---

## Giai đoạn 6: Kubernetes (3-4 tuần)

### 🎯 Mục tiêu
Khi app cần scale, tự healing, rolling update — đó là lúc cần K8s.

### 📚 Concepts cần học theo thứ tự
1. **Pod** - đơn vị nhỏ nhất chạy container
2. **Deployment** - quản lý nhiều pod
3. **Service** - expose pod ra ngoài (ClusterIP, NodePort, LoadBalancer)
4. **ConfigMap / Secret** - quản lý config và secret
5. **Ingress** - reverse proxy + routing
6. **Volume / PersistentVolume** - lưu trữ
7. **Namespace** - phân vùng logic

### 🛠️ Bài thực hành

#### Bước 1: Cài Minikube (K8s local)
```bash
choco install minikube
minikube start --driver=docker
kubectl get nodes
```

#### Bước 2: Tạo manifests
Tạo thư mục `k8s/`:

**`k8s/backend-deployment.yaml`:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: booking-backend
  labels: { app: booking-backend }
spec:
  replicas: 2
  selector:
    matchLabels: { app: booking-backend }
  template:
    metadata:
      labels: { app: booking-backend }
    spec:
      containers:
        - name: backend
          image: yourname/booking-backend:latest
          ports:
            - containerPort: 5001
          env:
            - name: PORT
              value: "5001"
            - name: MONGO_URI
              valueFrom:
                secretKeyRef:
                  name: booking-secrets
                  key: mongo-uri
          resources:
            limits:
              memory: "256Mi"
              cpu: "200m"
            requests:
              memory: "128Mi"
              cpu: "100m"
          livenessProbe:
            httpGet:
              path: /api/health
              port: 5001
            initialDelaySeconds: 30
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: booking-backend
spec:
  selector: { app: booking-backend }
  ports:
    - port: 80
      targetPort: 5001
  type: ClusterIP
```

**`k8s/frontend-deployment.yaml`:** tương tự nhưng map cổng 80.

**`k8s/secret.yaml`:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: booking-secrets
type: Opaque
stringData:
  mongo-uri: "mongodb+srv://..."
```

**`k8s/ingress.yaml`:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: booking-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: booking.local
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: booking-backend
                port: { number: 80 }
          - path: /
            pathType: Prefix
            backend:
              service:
                name: booking-frontend
                port: { number: 80 }
```

#### Bước 3: Apply
```bash
kubectl apply -f k8s/
kubectl get pods
kubectl get services
kubectl logs -f <pod-name>
kubectl scale deployment booking-backend --replicas=5
```

#### Bước 4: Helm (sau khi quen K8s)
Helm = "package manager" cho K8s. Đóng gói toàn bộ manifests vào 1 chart, dùng template để deploy nhiều môi trường (dev/staging/prod).

### ✅ Bài tập checkpoint
- [ ] Deploy thành công lên Minikube
- [ ] Scale lên 5 replicas, kill 1 pod thấy K8s tự tạo lại
- [ ] Thực hiện rolling update không downtime
- [ ] Deploy lên EKS (AWS) hoặc AKS (Azure) thực
- [ ] Tạo Helm chart cho toàn bộ app

### 📖 Tài liệu
- [Kubernetes Official Tutorial](https://kubernetes.io/docs/tutorials/)
- [Killercoda](https://killercoda.com/) - playground miễn phí

---

## Giai đoạn 7: Monitoring & Logging (1-2 tuần)

### 🎯 Mục tiêu
Khi app chạy production, bạn phải biết:
- App có sống không? (uptime)
- CPU/RAM có cao không? (metrics)
- Có lỗi gì không? (logs)

### 📚 Stack chuẩn

| Mục đích    | Tool                      |
| ----------- | ------------------------- |
| Metrics     | **Prometheus** + **Grafana** |
| Logs        | **Loki** hoặc **ELK** (Elasticsearch + Logstash + Kibana) |
| Tracing     | **Jaeger**                |
| Alerting    | **AlertManager**          |
| Uptime      | **UptimeRobot** (miễn phí) |

### 🛠️ Bài thực hành

#### Bước 1: Thêm Prometheus + Grafana vào Docker Compose
Tạo `monitoring/docker-compose.yml`:
```yaml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports: ["9090:9090"]

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports: ["3001:3000"]
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana

  node-exporter:
    image: prom/node-exporter:latest
    ports: ["9100:9100"]

volumes:
  grafana-data:
```

**`monitoring/prometheus.yml`:**
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'booking-backend'
    static_configs:
      - targets: ['booking-backend:5001']
    metrics_path: /metrics
```

#### Bước 2: Thêm metrics endpoint vào backend
Cài `prom-client` trong Node.js:
```js
// src/middlewares/metrics.js
import client from 'prom-client';
const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const metricsMiddleware = async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};
// Trong server.js: app.get('/metrics', metricsMiddleware);
```

#### Bước 3: Tạo dashboard Grafana
- Truy cập `http://localhost:3001` (admin/admin)
- Add data source: Prometheus → URL `http://prometheus:9090`
- Import dashboard ID `1860` (Node Exporter Full)

### ✅ Bài tập checkpoint
- [ ] Có dashboard Grafana hiển thị CPU/RAM/Network của server
- [ ] Setup alert: CPU > 80% → gửi email
- [ ] Centralize log với Loki (xem tất cả log container ở 1 nơi)

---

## Giai đoạn 8: Security & Best Practices (1 tuần)

### 🎯 Mục tiêu
Bảo mật cơ bản — đừng để app bị hack ngay tuần đầu lên production.

### 📋 Checklist DevSecOps

#### Container security
- [ ] Không dùng image `:latest` — luôn pin version
- [ ] Quét CVE bằng **Trivy**: `trivy image booking-backend:latest`
- [ ] Chạy container với user non-root
- [ ] Read-only filesystem khi có thể
- [ ] Không build secret vào image — dùng env hoặc secret manager

#### Secrets management
- [ ] Không bao giờ commit `.env` (đã có trong `.gitignore`)
- [ ] Trên cloud dùng **AWS Secrets Manager**, **HashiCorp Vault**, hoặc **K8s Secret**
- [ ] Rotate keys định kỳ

#### CI/CD security
- [ ] Quét code SAST: **SonarQube**, **Snyk**, **CodeQL**
- [ ] Quét dependencies: `npm audit`, **Dependabot**
- [ ] Sign Docker images với **Cosign**

#### Network
- [ ] Bật firewall (UFW trên Ubuntu, Security Group trên AWS)
- [ ] Chỉ mở port cần thiết
- [ ] HTTPS bắt buộc (Let's Encrypt miễn phí)
- [ ] Rate limiting (nginx hoặc express-rate-limit)

#### Backup
- [ ] Backup MongoDB tự động hàng ngày
- [ ] Test restore định kỳ (backup không test = không có backup)

### 🛠️ Bài thực hành

#### Thêm Trivy scan vào CI
```yaml
# Thêm vào docker-publish.yml
- name: Scan image with Trivy
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: ${{ secrets.DOCKERHUB_USERNAME }}/booking-backend:${{ github.sha }}
    format: 'table'
    exit-code: '1'
    severity: 'CRITICAL,HIGH'
```

---

## 🎓 Sau khi hoàn thành

Bạn sẽ có trong CV:
- ✅ Docker + Docker Compose
- ✅ CI/CD với GitHub Actions
- ✅ Cloud (AWS hoặc Azure) — EC2, S3, RDS, IAM, VPC
- ✅ Infrastructure as Code (Terraform)
- ✅ Container Orchestration (Kubernetes + Helm)
- ✅ Monitoring (Prometheus + Grafana)
- ✅ Security best practices

**Project demo:** một MERN app real-time chạy trên cloud, auto-deploy, có monitoring, có HTTPS — đủ tốt để apply Junior DevOps / SRE.

---

## Tài liệu tham khảo

### Sách
- "The Phoenix Project" — tiểu thuyết về DevOps (đọc giải trí)
- "The DevOps Handbook" — Gene Kim
- "Kubernetes in Action" — Marko Lukša

### Video / Khóa học miễn phí
- [TechWorld with Nana](https://www.youtube.com/@TechWorldwithNana) — YouTube DevOps tốt nhất
- [KodeKloud](https://kodekloud.com/) — practice labs
- [DevOps Roadmap](https://roadmap.sh/devops) — visual roadmap

### Communities tiếng Việt
- Group Facebook "Vietnam DevOps Community"
- daynhauhoc.com (channel #devops)

---

## 💡 Lời khuyên cuối

1. **Đừng cố học tất cả cùng lúc.** Mỗi giai đoạn cần chắc rồi mới đi tiếp.
2. **Làm > Đọc.** Một bài lab thực hành có giá trị hơn 10 video lý thuyết.
3. **Ghi chép.** Mỗi lệnh, mỗi lỗi gặp phải — ghi vào file note (Notion, Obsidian).
4. **Build portfolio.** Push code, manifests, terraform lên GitHub — đó là bằng chứng kỹ năng.
5. **Hỏi cộng đồng** khi bí. Stack Overflow, Reddit r/devops, Discord K8s.

> Chúc bạn thành công trên hành trình DevOps! 🚀
