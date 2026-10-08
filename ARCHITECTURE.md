# Architecture — Pirate Battle

## 1. Overview

Pirate Battle is a 2D top-down naval shooter developed with React, TypeScript and PixiJS.

The project separates the React user interface from the real-time game simulation and rendering.

React is mainly responsible for menus, HUD, loading screens, instructions and match result interfaces, while PixiJS and the `GameEngine` are responsible for the real-time gameplay simulation.

The project also uses Axios and TanStack Query for the ranking and match history API layer. MSW provides the local API implementation, while localStorage is used for local persistence.

---

## 2. Main Technologies

- React
- TypeScript
- PixiJS
- Tailwind CSS
- Axios
- TanStack Query
- MSW
- Playwright
- Vite

---

## 3. Project Structure

The main application structure is organized as follows:

```text
src/
├── components/
│   ├── game/
│   │   └── MobileControls.tsx
│   ├── hud/
│   │   ├── GameOverModal.tsx
│   │   └── HUD.tsx
│   ├── loading/
│   │   └── LoadingScreen.tsx
│   └── menus/
│       ├── MainMenu.tsx
│       ├── RankingTable.tsx
│       └── MatchHistoryTable.tsx
│
├── config/
│   └── gameConfig.ts
│
├── game/
│   ├── engine/
│   │   ├── AssetManager.ts
│   │   ├── CollisionManager.ts
│   │   └── GameEngine.ts
│   │
│   └── entities/
│       ├── Player.ts
│       ├── Chaser.ts
│       ├── Shooter.ts
│       └── Bullet.ts
│
├── hooks/
│   └── useGameApi.ts
│
├── mocks/
│   └── handlers.ts
│
├── services/
│   └── api.ts
│
├── types/
│   └── api.ts
│
└── App.tsx