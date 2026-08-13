# 🗺️ Antigravity 2.0 System Directives: Survey Platform

## 📌 1. Monorepo Workspace Boundaries
* **Root Directory:** `gform/`
* **Backend Workspace:** `gform/backend/` (Node.js/Express)
* **Frontend Workspace:** `gform/frontend/` (Vite/React/Tailwind v4 via Google Stitch)
* **Strict Isolation:** Never mix dependencies between workspaces.
* **Independent Packages:** Do not run `npm install` at the root directory level.
* **Isolated Manifests:** Each folder tracks its own `package.json` independently.
* **Zero Secret Commits:** Strict `.gitignore` configuration enforced in both workspaces. No `.env`, `.pem`, or runtime secrets may ever enter git tracking.

---

## 🛠️ 2. Core Technical Architecture Constraints

### 🎨 Frontend Architecture (`gform/frontend/`)
* **Deployment Target:** Cloudflare Pages (Free Tier asset limits optimized).
* **Source Stream:** Synchronize components directly with the connected Google Stitch MCP Server canvas.
* **Styling Engine:** Tailwind CSS v4.0 running natively through `@tailwindcss/vite`.
* **No Legacy Configs:** No legacy `tailwind.config.js` or `postcss.config.js` files are permitted.
* **Design Philosophy:** Mobile-first responsive web design matching modern high-fidelity UI/UX patterns.
* **Theme Engine:** Native light/dark mode tracking utilizing a `ThemeProvider` context.
* **Theme Persistence:** Persist theme state in `localStorage` to eliminate layout shift on reload.
* **State & Routing:** Use `react-router-dom` for Role-Based Access Control (RBAC) switches.
* **Identity Tracking:** Track active corporate identities securely using `AuthContext.jsx`.
* **Authentication:** Implement a native Google Sign-In button integrated with the official `@react-oauth/google` runtime.

### ⚙️ Backend Architecture (`gform/backend/`)
* **Deployment Target:** Render (Free Instance / Web Service optimized).
* **Free Tier Management:** Account for the spin-up spin-down delay (cold starts) on free instances.
* **Health Checks:** Implement a `/health` endpoint to facilitate uptime pings and status verification.
* **SOLID Design Enforcement:** Mandate strict architectural decoupling across all API domains:
  * `routes/`: Route mappings and HTTP verb specifications only (Single Responsibility).
  * `controllers/`: Process Express request/response cycles and handle HTTP status codes (Interface Segregation).
  * `repositories/`: Abstract Mongoose/MongoDB Atlas queries entirely (Dependency Inversion).
* **Database Management:** Utilize a cached connection pooling mechanism inside `config/db.js`.
* **Network Protocol:** Maintain compatibility with local corporate LAN firewalls.
* **String Pooling:** Utilize standard `mongodb://` string pooling connections instead of `mongodb+srv://` DNS SRV queries.
* **Auth Verification:** Implement a server-side `google-auth-library` verification token routing step.

---

## 🤖 3. Antigravity Agent Execution Protocol
* **Pre-Flight Step:** Present a visual **Implementation Plan** before modifying any workspace file.
* **Human Sign-off:** Await explicit human approval after presenting the implementation plan.
* **Code Quality:** Avoid generating pseudo-code or trailing placeholder comments like `// TODO: implement later`.
* **Production Ready:** All generated code blocks must be fully completed and ready for deployment.
* **Environment Safety:** Never hardcode system credentials, connection strings, or Google Stitch API keys.
* **Token Isolation:** Always read infrastructure tokens exclusively through `process.env`.
