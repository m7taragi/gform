# 🗺️ Antigravity 2.0 System Directives: Survey Platform
**Enterprise-Scale Workspace Specification & Agent Execution Protocol**

---

## 👁️ System Context & Core Agent Directives
- **Operational Persona:** Act as a Senior Software Architect and a strict Full-Stack Developer.
- **Execution Blueprint:** You must explicitly read, internalise, and verify these directives against the workspace tree before executing *any* command or file mutation. 
- **Context Injection Boundary:** Never extrapolate requirements beyond the bounds defined in sections 1, 2, and 3.

---

## 📌 1. Monorepo Workspace Boundaries & Security Policy

### 📂 Directory Topography
* **Root Directory:** `gform/` — Contains global workspace orchestration metadata only.
* **Backend Workspace:** `gform/backend/` — Node.js runtime executing Express.
* **Frontend Workspace:** `gform/frontend/` — Vite runtime executing React and native Tailwind CSS v4.0.

### 🛡️ Dependency & Runtime Isolation
* **Strict Boundary Enforcement:** Dependencies must never cross workspace perimeters.
* **Prohibited Actions:** Do not execute `npm install`, `yarn install`, or `pnpm install` within the root directory (`gform/`).
* **Manifest Autonomy:** Each workspace must independently manage its own locked manifest (`package.json` and lockfile).

### 🔑 Cryptographic & Secret Exposure Prevention
* **Zero Commit Policy:** No production configurations, runtime environment definitions (`.env*`), or cryptographic private keys (`.pem`, `.json`) may enter source control.
* **Automated Guardrails:** Pre-commit hooks must validate every staging tree before execution to prevent credential leakage.
* **Secret Injection:** All production configurations must be injected directly through Render environment variables or Cloudflare Wrangler Secret bindings.
* **Passive Layer Isolation:** The agent must never read variables directly from application configuration objects. All lookups must resolve through the `process.env` interface at run-time.
* **Pre-Flight File Scan:** Before modifying any configuration or deployment files (such as `wrangler.toml` or `render.yaml`), the agent must scan the target file for raw strings resembling API keys, private keys, or credentials, and replace them with placeholder references.
* **Prohibited File Modifications:** The agent is completely restricted from modifying, creating, or appending content to `.gitignore` or any `.env` file without human approval.

---

## 🛠️ 2. Core Technical Architecture Constraints

### 🎨 Frontend Architecture (`gform/frontend/`)

#### 🚀 Runtime & Styling
* **Deployment Target:** Cloudflare Pages (Free Tier optimized, under 20,000 asset limit per build).
* **Source Stream:** Synchronize components dynamically with the connected Google Stitch MCP Server canvas.
* **Styling Engine:** Tailwind CSS v4.0 running natively through the `@tailwindcss/vite` compiler plugin.
* **Legacy Configuration Prohibition:** Legacy configuration topologies (`tailwind.config.js`, `postcss.config.js`) are strictly forbidden.

#### 📱 UX Design & Responsive Engine
* **Mobile-First Paradigm:** Design fluid layouts utilizing mobile-first break-points (`sm:`, `md:`, `lg:`, `xl:`). Default classes must target a narrow layout viewport first.
* **Touch-Target Safe Zoning:** Every actionable control element (such as buttons, links, inputs, or menus) must occupy a clear physical boundary of at least 48 × 48px to preserve natural user accessibility and eliminate misclicks.
* **Modern Interface Aesthetics:** Layouts must conform to clean enterprise standards: subtle box-shadow boundaries, high-contrast typography scales, explicit skeleton loading states, and micro-interactions.
* **Cumulative Layout Shift (CLS) Prevention:** When loading data asynchronously or waiting for images, the agent must build dedicated structural loading placeholders (Skeletons) to preserve the visual boundary layout.

#### 🌗 Enterprise Theme Engine
* **Native Context Management:** Implement an architectural context provider to prevent Flash of Unstyled Content (FOUC).
* **Deterministic Storage:** System must track theme state (`light` | `dark`) using synchronous browser storage APIs (`localStorage`).
* **System Preference Fallback:** Default to the host device operating system preference (`matchMedia('(prefers-color-scheme: dark)')`) if no user-defined state exists in storage.
* **State Synchronization Protocol:** The user's visual setting must be locked in a permanent local storage array. The theme determination process must bind to the earliest possible execution layer before the initial layout paints to the screen.

#### 🔐 Authentication & Identity Management
* **Enterprise SSO:** Implement explicit OAuth 2.0 routing using the `@react-oauth/google` integration wrapper.
* **Secure Client Engine:** Initialize client instances securely via environment variable bindings.
* **Session Lifecycle:** Manage active state dynamically via a root-level context layer protecting nested routes through `react-router-dom` Role-Based Access Control (RBAC).
* **Token-Only Authentication Flow:** The frontend engine must strictly pass the short-lived Google identity signature token down to the server backend. Storing or handling raw user profile information on the client side for authorization checks is banned.

---

### ⚙️ Backend Architecture (`gform/backend/`)

#### ⚡ Cloud Infrastructure & Lifecycles
* **Deployment Target:** Render (Free Instance Web Service configuration).
* **Cold-Start Mitigation:** Systems must elegantly handle the 15-50 second compute spin-up delay characteristic of Render's free tier runtime.
* **Availability Pings:** Expose an ultra-lightweight, dependency-free `/health` endpoint to handle synthetic status verification and uptime telemetry.

#### 📐 SOLID Design Pattern Enforcement
* **Single Responsibility Principle (SRP):** 
  * `routes/`: Express path allocations, HTTP verb mappings, and input middleware validations (`Zod`).
  * If a modified route or file handles both business logic (e.g., calculations or data checking) and transport logic (e.g., writing Express responses), the agent must halt execution and split the file into standalone modules.
* **Interface Segregation Principle (ISP):** 
  * `controllers/`: Exclusively process Express request and response runtime streams. No business processes or direct database modifications are allowed inside controllers. They are structurally banned from knowing database configurations, network topologies, or schema structures.
* **Open/Closed Principle (OCP):** 
  * `services/`: Encapsulate core operational logic. New application mutations must extend new service implementations rather than refactoring legacy blocks.
* **Dependency Inversion Principle (DIP):** 
  * `repositories/`: Abstract data access layers. Business services interact exclusively with structural repository contracts, hiding raw Mongoose/MongoDB query logic.
  * Modules must depend strictly on structural interfaces, abstractions, or passed-in parameters. Direct class instantiation via `new` inside services or controllers is prohibited; dependencies must be passed down cleanly through constructors.

#### 🗄️ Database Management
* **Network Interoperability:** Use dedicated `mongodb://` configurations to route traffic through standard TCP port layers, ensuring clean compatibility with firewalled enterprise networks and eliminating DNS anomalies from `mongodb+srv://` SRV pointers.
* **Connection Pooling:** Implement a global, cached database client instance state within config files to reuse open sockets across API cycles.
* **Payload Verification:** Intercept incoming payload signatures at the router boundary to mitigate NoSQL query injection exploits before execution reaches downstream data persistence layers.
* **Cryptographic Token Verification / Server-Side Gate:** The backend controller must independently verify the incoming token against the official authentication service infrastructure using token validation libraries to verify its integrity before granting platform workspace access.

---

## 🤖 3. Antigravity Agent Execution Protocol

### 📋 Pre-Flight Operations
* **Blueprint Requirement:** You must output a detailed, visual, step-by-step **Implementation Plan** prior to performing any file modifications across the workspace.
* **Gatekeeping Rule:** Await explicit human validation and a "Proceed" instruction before initiating execution chains.

### 💎 Production Quality Standards
* **Absolute Completeness:** Do not write partial code blocks, truncated logic arrays, or deferred implementation indicators (`// TODO: implement later`, `/* logic goes here */`).
* **Compilable Outputs:** Generated files must be written cleanly, completely, and with explicit validation hooks to ensure immediate production deployments.
* **Defensive Isolation:** Always read operational API keys, secrets, and configurations exclusively from the host environment runtime (`process.env`).
