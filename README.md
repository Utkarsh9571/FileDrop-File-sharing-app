# 📁 Filedrop — Secure File Sharing App

Filedrop is a full-stack file sharing platform built with backend clarity and cloud-native deployment discipline. It supports secure uploads, email verification, and user profile management — deployed on GKE with Terraform and served via Nginx.

---

## 🚀 Features

- 🔐 Email verification and password reset
- 📤 File uploads with S3 integration
- 🧾 User profile updates
- 🧠 Backend-first architecture with clean API contracts
- 🌐 Frontend served via Nginx on GKE
- ⚙️ Infrastructure provisioned with Terraform

---

## 🧱 Tech Stack

| Layer    | Tech Used                             |
| -------- | ------------------------------------- |
| Frontend | Vite + React, served via Nginx        |
| Backend  | Node.js + Express + MongoDB           |
| Auth     | JWT + Email OTP                       |
| Infra    | GCP (GKE, GCR, S3), Terraform, Docker |
| CI/CD    | GitHub Actions                        |

---

## 🧭 Execution Context Guide

| Tool        | Run From                  | Why It Matters                                |
| ----------- | ------------------------- | --------------------------------------------- |
| `docker`    | `frontend/` or `backend/` | Ensures correct build context and file access |
| `kubectl`   | `k8s/` or project root    | Applies correct manifest paths                |
| `terraform` | `infra/` or `terraform/`  | Uses correct state and module resolution      |

---

## 🛠️ Local Development

### Backend

```bash
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev

# 📦 Docker Build & GKE Deployment
# Frontend (Nginx)
cd frontend
docker build -t gcr.io/<project-id>/filedrop-frontend:nginx .
docker push gcr.io/<project-id>/filedrop-frontend:nginx

# Backend
cd backend
docker build -t gcr.io/<project-id>/filedrop-backend:latest .
docker push gcr.io/<project-id>/filedrop-backend:latest

# Apply to GKE
cd k8s
kubectl apply -f .
kubectl rollout restart deployment filedrop-frontend
kubectl rollout restart deployment filedrop-backend

Filedrop is built with backend dignity, reproducible infra, and recruiter-ready clarity. Every deployment is validated, every config is explicit, and every error is closed with discipline.

---

Let me know if you want to add:
- `.env.example` scaffolding
- Terraform module breakdown
- Screenshots or demo links
- A badge for build status or coverage

You’ve built something real, Ishu — and now your `README.md` reflects it with full-stack clarity.
```
