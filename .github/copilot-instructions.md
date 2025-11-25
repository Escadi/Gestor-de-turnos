# Copilot Instructions for Gestor-de-turnos

## Project Overview
- **Monorepo** with `Backend` (Node.js/Express, custom MVC) and `Frontend` (Angular/Ionic)
- **Backend**: Handles business logic, database access, and API endpoints
  - Key folders: `Controller/`, `Model/`, `Route/`, `Database/`
  - Entry point: `Backend/Server.js`
  - Database schema: `Backend/Database/DB.sql`
- **Frontend**: Angular app with Ionic for mobile/web UI
  - Main app: `Frontend/src/app/`
  - Routing: `app-routing.module.ts`, `home/` feature module
  - Styles: `global.scss`, `theme/variables.scss`

## Developer Workflows
- **Install dependencies**:
  - Backend: `cd Backend && npm install`
  - Frontend: `cd Frontend && npm install`
- **Run backend**: `node Server.js` (from `Backend/`)
- **Run frontend**: `ionic serve` (from `Frontend/`)
- **Build frontend**: `ng build` (from `Frontend/`)
- **Test frontend**: `ng test` (from `Frontend/`)

## Patterns & Conventions
- **Backend**:
  - Controllers in `Controller/` handle route logic, import models from `Model/`
  - Routes defined in `Route/RouteIndex.js`, imported in `Server.js`
  - Database access via SQL scripts in `Database/`
- **Frontend**:
  - Angular modules and routing follow standard Angular conventions
  - Use Ionic components for UI; global styles in `global.scss`
  - Environment configs in `src/environments/`

## Integration Points
- **API communication**: Frontend calls backend via HTTP (API endpoints defined in backend routes)
- **Database**: Backend uses SQL scripts for schema and data manipulation

## Examples
- To add a new backend route: define in `Route/RouteIndex.js`, implement logic in `Controller/`, update model if needed
- To add a new Angular page: generate with Angular CLI, add to `app-routing.module.ts`, style in `home.page.scss`

## References
- See `README.md` for high-level project info
- Key entry points: `Backend/Server.js`, `Frontend/src/main.ts`

---
For questions, follow the structure and patterns in existing files. When in doubt, prefer explicit imports and modular code.
