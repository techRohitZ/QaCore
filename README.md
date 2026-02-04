# ⚡ QaCore: Autonomous AI Test Agent

<div align="center">

![Project Status](https://img.shields.io/badge/Status-Active_Development-emerald)
![License](https://img.shields.io/badge/License-MIT-blue)
![Stack](https://img.shields.io/badge/Stack-MERN-cyan)

**The gap between manual testing and automation is gone.** *QaCore allows developers to generate, execute, and analyze Playwright test suites using natural language and Generative AI.*

[View Demo](#) · [Report Bug](https://github.com/yourusername/qacore/issues) · [Request Feature](https://github.com/yourusername/qacore/issues)

</div>

---

## 🚀 The Problem & The Solution

**The Problem:** Writing End-to-End (E2E) tests is tedious, brittle, and time-consuming. Selectors break, maintenance is a nightmare, and shipping slows down.

**The Solution:** QaCore acts as an autonomous QA Engineer. You provide a URL; our AI analyzes the DOM, writes robust **Playwright** code, executes it in a sandboxed environment, and provides a detailed pass/fail report—all in seconds.

---

## 📸 Interface

| **Command Center** | **Execution Logs** |
|:---:|:---:|
| ![Dashboard Shot](./frontend/public/dashboard-preview.png) | ![Run Shot](./frontend/public/run-preview.png) |
> *Note: Replace these paths with actual screenshots of your dashboard and run details page.*

---

## ✨ Key Features

* **🧠 Generative Test Suites**: Uses **Google Gemini 1.5** to convert raw HTML/DOM into semantic Playwright scripts.
* **⚡ Headless Runner**: Custom Node.js execution engine that runs tests safely in the cloud (or locally).
* **🛡️ Resilient Selectors**: AI generates selectors that prioritize accessibility attributes (`role`, `aria-label`) over brittle CSS classes.
* **📊 Live Execution History**: Track every run, view console logs, and debug failures with a detailed timeline.
* **🔐 Enterprise-Grade Auth**: Secure access via JWT (JSON Web Tokens) and Bcrypt hashing.
* **🎨 Modern DX**: Built with **React 18**, **Tailwind CSS**, and **Framer Motion** for a fluid, application-like feel.

---

## 🛠️ Tech Stack

### **Frontend (Client)**
* **Framework**: React (Vite)
* **Styling**: Tailwind CSS + Lucide React (Icons)
* **Animations**: Framer Motion
* **State**: React Hooks & Context API
* **HTTP**: Axios with Interceptors

### **Backend (Server)**
* **Runtime**: Node.js & Express
* **Database**: MongoDB Atlas (Cloud)
* **Automation**: Playwright Core
* **AI Model**: Google Generative AI SDK
* **Security**: Helmet, CORS, Dotenv

---

## 📂 Project Structure

```bash
qacore/
├── .github/           # GitHub Actions & Workflow configs
├── backend/           # API, Database, & Test Runner logic
│   ├── controllers/   # Request handlers
│   ├── models/        # Mongoose Schemas (User, Project, Run)
│   ├── services/      # AI Service & Playwright Service
│   └── server.js      # Entry point
├── frontend/          # React Application
│   ├── src/
│   │   ├── pages/     # Dashboard, ProjectDetails, Login
│   │   └── api/       # API integration layers
└── README.md          # Documentation