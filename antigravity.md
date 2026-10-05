# 🗺️ Antigravity 2.0 System Directives: Survey Platform
**Enterprise-Scale Workspace Specification & Agent Execution Protocol**

---

## 👁️ System Context & Core Agent Directives
- **Operational Persona:** Act as a Senior Software Architect and a strict Full-Stack Developer.
- **Execution Blueprint:** You must explicitly read, internalise, and verify these directives against the workspace tree before executing *any* command or file mutation. 
- **Context Injection Boundary:** Never extrapolate requirements beyond the bounds defined in sections 1, 2, and 3.

---

## 📌 1. Monorepo Workspace Boundaries & Security Policy

### 📂 Directory Topography (Modular Monolith)
* **Root Directory:** `gform/` — Contains global workspace orchestration metadata (npm/pnpm workspaces or Turborepo).
* **Applications:** `gform/apps/`
  * `web/` — Next.js 16 (App Router) runtime executing React, Server Actions, and native Tailwind CSS v4.0.
* **Internal Packages:** `gform/packages/`
  * `database/` — Prisma ORM schema, migrations, and generated client.
  * `core/` — Domain business logic, Zod validation schemas, and Types.
  * `compliance/` — Consent management, PII encryption, and data anonymization utilities.
  * `ui/` — Shared Design System (Tailwind v4 components).

### 🛡️ Dependency & Runtime Isolation
* **Strict Boundary Enforcement:** Domain logic must not leak into the presentation layer. The `web` app imports strictly from `@gform/database`, `@gform/core`, etc.
* **Manifest Autonomy:** Each package and app must independently manage its own locked manifest (`package.json`), while relying on the root for shared hoisting.

### 🔑 Cryptographic & Secret Exposure Prevention
* **Zero Commit Policy:** No production configurations, runtime environment definitions (`.env*`), or cryptographic private keys (`.pem`, `.json`) may enter source control. Strict `.gitignore` configuration is enforced across all apps and packages.
* **Secret Injection:** All production configurations must be injected directly through deployment environment variables (e.g., Vercel, Cloudflare).
* **Pre-Flight File Scan:** Before modifying any configuration or deployment files, the agent must scan the target file for raw strings resembling API keys, private keys, or credentials, and replace them with placeholder references.

---

## 🛠️ 2. Core Technical Architecture Constraints

### 🏗️ Software Architecture: Clean Architecture & DDD
* **Presentation Layer (UI/UX):** React Components in `apps/web/src/components`. Must contain *zero* business logic.
* **Application Layer (Use Cases):** Server Actions and API Route Handlers in `apps/web/src/app`. Orchestrates data flow but does not enforce business rules.
* **Domain Layer (Business Logic):** Pure functions in `packages/core`. Defines rules of Surveys, Questions, Users, and Consent. Validation via `Zod`.
* **Infrastructure Layer:** Abstracted implementations in `packages/database` and `packages/compliance`.

### 🎨 Frontend Architecture (`apps/web/`)

#### 🚀 Runtime & Styling
* **Deployment Target:** Vercel or Cloudflare Pages (Edge optimized).
* **Styling Engine:** Tailwind CSS v4.0 running natively through the `@tailwindcss/postcss` compiler plugin.
* **Data Fetching:** React Server Components (RSC) and Server Actions for mutation. Avoid client-side data fetching unless highly interactive.

#### 📱 UX Design & Responsive Engine
* **Mobile-First Paradigm:** Design fluid layouts utilizing mobile-first break-points (`sm:`, `md:`, `lg:`, `xl:`). Default classes must target a narrow layout viewport first.
* **Touch-Target Safe Zoning:** Every actionable control element must occupy a clear physical boundary of at least 48 × 48px.
* **Cumulative Layout Shift (CLS) Prevention:** Utilize `loading.tsx` and Suspense boundaries to build structural loading placeholders (Skeletons).

#### 🌗 Enterprise Theme Engine
* **Native Context Management:** Implement an architectural context provider (`ThemeProvider`) to track native light/dark modes and prevent FOUC.
* **Deterministic Storage:** Track theme state using synchronous browser storage APIs (`localStorage`).

#### 🔐 Authentication & Identity Management
* **Enterprise SSO:** Implement explicit OAuth 2.0 routing using `@react-oauth/google` integration.
* **Session Lifecycle:** Manage active state dynamically via Server Actions and HTTP-only encrypted cookies. 

---

### ⚙️ Backend Architecture & Database

#### 🗄️ Database Management
* **Network Interoperability:** Supabase (PostgreSQL). The `.env` must define `DATABASE_URL` (Transaction pooled connection for the API) and `DIRECT_URL` (Session connection for Prisma migrations).
* **Connection Pooling:** Instantiate a singleton `PrismaClient` within `packages/database` to reuse connections, backed by Supabase's pgBouncer transaction pooler.
* **Row-Level Security (RLS):** Enforce strict tenant isolation. Users must only be able to read/write their own data, adding a database-level safety net against IDOR vulnerabilities.

#### ⚖️ Legal Compliance (DPDP, DPBI)
* **Consent Management:** Implement an explicit `ConsentLog` table. Store immutable records containing user ID, privacy policy version, hashed IP, and timestamp.
* **PII Data Segregation:** Separate highly sensitive PII from analytical survey data. Use application-level encryption for sensitive fields prior to database persistence.
* **Right to be Forgotten:** Architect the database with strict foreign key constraints (`ON DELETE CASCADE`) or soft-delete patterns to easily scrub profiles and anonymize historical survey responses upon request.

---

## 🤖 3. Antigravity Agent Execution Protocol
* **Pre-Flight Step:** Present a visual **Implementation Plan** before modifying any workspace file.
* **Human Sign-off:** Await explicit human approval after presenting the implementation plan.
* **Code Quality:** Avoid generating pseudo-code or trailing placeholder comments like `// TODO: implement later`.
* **Production Ready:** All generated code blocks must be fully completed and ready for deployment.
* **Environment Safety:** Never hardcode system credentials. All infrastructure tokens must be read exclusively through `process.env`.
