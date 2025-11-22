# Copilot Instructions for Gestor-de-turnos

## Project Overview
- **Gestor-de-turnos** is structured as a classic backend/frontend monorepo.
- The backend is in `Backend/`, with a placeholder for a Node.js/Express server (`Server.js`) and a database schema (`Database/DB.sql`).
- The frontend is in `Frontend/` (currently empty).

## Architecture & Data Flow
- **Backend**: Intended for Node.js/Express. The main entry is `Backend/Server.js` (currently empty).
- **Database**: SQL schema is in `Backend/Database/DB.sql`.
- **MVC Pattern**: The backend is organized for Model-View-Controller, with deep nesting: `Backend/Database/Controller/Model/Route/` (currently empty, but suggests future separation of concerns).
- **Frontend**: No files yet, but expected to be a separate app in `Frontend/`.

## Conventions & Patterns
- **File/Folder Naming**: Folders use PascalCase (e.g., `Server.js`, `Database/`).
- **Backend Structure**: Follows a deep MVC pattern, even if not yet implemented.
- **No code or schema is present yet**: All files are placeholders.

## Developer Workflows
- **No build/test scripts or package managers detected yet.**
- **To start backend development**: Initialize Node.js in `Backend/`, add Express, and implement `Server.js`.
- **To start frontend development**: Choose a framework (e.g., React, Angular) and initialize in `Frontend/`.

## Integration Points
- **Backend/Frontend communication**: Not implemented, but will likely use REST APIs.
- **Database**: SQL schema to be defined in `DB.sql`.

## Examples
- To add a new API route: Implement in `Backend/Server.js` or under `Backend/Database/Controller/Model/Route/` as the project grows.
- To update the database: Edit `Backend/Database/DB.sql`.

## Recommendations for AI Agents
- Scaffold missing files/folders as needed, following the existing deep MVC pattern.
- When adding backend logic, prefer Express.js and keep code modular.
- When adding frontend logic, keep all code in `Frontend/`.
- Update this file as the project evolves.
