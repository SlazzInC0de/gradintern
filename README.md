# 🎓 GradIntern — Full-Stack RBAC Job Marketplace

> A production-grade RESTful career marketplace engineered specifically for verified alumni and enterprise recruiters, featuring strict cryptographic Role-Based Access Control (RBAC).

![Tech Stack](https://img.shields.io/badge/Stack-React_19_|_Node_|_Express_|_MongoDB-indigo?style=for-the-badge)
![Security](https://img.shields.io/badge/Auth-Stateless_JWT_|_Bcrypt-emerald?style=for-the-badge)
![Styling](https://img.shields.io/badge/CSS-Tailwind_v4_|_PostCSS-sky?style=for-the-badge)

---

## 🏛️ System Architecture & RBAC Matrix

The platform enforces a strict separation of concerns between client UI state machines and backend validation layers. Access authorization is determined via stateless JSON Web Tokens evaluated at the Express routing middleware layer.

| User Persona | Endpoint Access | Cryptographic Permission | UI Experience |
| :--- | :--- | :--- | :--- |
| **👨‍🎓 Graduate** | `GET /api/listings` | `role: 'grad'` | Browse feed, view salary specs, apply |
| **👔 Recruiter** | `POST /api/listings` | `role: 'recruiter'` | Full broadcasting rights, form rendering |
| **🤖 Unauthenticated**| None | `401 / 403 Forbidden` | Redirected to `/login` gate |

---

## ⚡ Core Engineering Highlights

* **Stateless RBAC Gatekeeper:** Custom Express middleware decodes Bearer tokens in real-time, rejecting unauthorized payload modifications at the network port before Mongoose schema evaluation.
* **Zero-Dependency Sanitization:** Implemented a strict request-body validation layer protecting NoSQL document stores against malformed string injection and buffer bloating.
* **Persistent Session Hydration:** Built a custom React `AuthContext` utilizing synchronous `useEffect` mounting sweeps to catch and re-hydrate `localStorage` session tokens instantly across browser reloads.
* **Dynamic Cloud Bridging:** Frontend fetch pipelines utilize dynamic environment switching (`import.meta.env`) to seamlessly route requests between local Node ports and serverless production URLs.

---

## 🚀 Local Deployment Guide

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **MongoDB Atlas** Cluster URI

### 1. Clone the Safe
```bash
git clone [https://github.com/SlazzInC0de/gradintern.git](https://github.com/SlazzInC0de/gradintern.git)
cd gradintern