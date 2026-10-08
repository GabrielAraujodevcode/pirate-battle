# Pirate Battle

A 2D top-down naval shooter built with React, TypeScript and PixiJS.

The player controls a pirate ship, navigates through an arena with islands, fights enemy ships, earns points and survives until the end of the match.

---

## Overview

Pirate Battle was developed as a technical challenge focused on:

- Real-time gameplay with PixiJS.
- React-based menus and interface.
- TypeScript strict typing.
- Time-based game simulation.
- Enemy AI and combat.
- Collision handling.
- Asset and audio management.
- Responsive desktop and mobile controls.
- Ranking and match history.
- Local API mocking with MSW.
- Server-state management with TanStack Query.
- HTTP communication with Axios.

The game runs entirely in the browser.

---

## Tech Stack

| Area | Technology |
|---|---|
| UI | React |
| Language | TypeScript |
| Game rendering | PixiJS |
| Styling | Tailwind CSS |
| HTTP client | Axios |
| Server state | TanStack Query |
| API mocking | MSW |
| E2E testing | Playwright |
| Build tool | Vite |

---

## Main Features

### Gameplay

- Top-down naval combat.
- Player movement and rotation.
- Front cannon attack.
- Lateral attack.
- Player health system.
- Enemy health system.
- Enemy damage feedback.
- Projectile movement and lifetime.
- Collision detection.
- Island obstacles.
- Enemy spawning.
- Score system.
- Match timer.
- Game Over conditions.
- Pause and resume.
- Explosion effects.
- Sound effects.

### Enemy Types

#### Chaser

The Chaser follows the player and causes damage when colliding with the player's ship.

It also has its own health and can be destroyed by player projectiles.

#### Shooter

The Shooter approaches the player and attacks when the player is within its configured attack range.

It also has health, movement and shooting cooldowns.

---

## Controls

### Keyboard

| Key | Action |
|---|---|
| W | Move forward |
| S | Move backward |
| A | Rotate left |
| D | Rotate right |
| Space | Front shot |
| E | Lateral shot |

The game supports simultaneous movement and shooting.

### Mobile

On mobile devices, virtual controls are displayed during gameplay.

The mobile controls provide:

- Forward movement.
- Backward movement.
- Left rotation.
- Right rotation.
- Front cannon.
- Lateral attack.

Mobile controls reuse the same input system as keyboard controls.

---

## Match Configuration

The Options screen allows the player to configure:

### Session duration

Allowed range:

```text
60 - 180 seconds
## Development Commands

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the TypeScript type check:

```bash
npm run typecheck
```

Preview the production build:

```bash
npm run preview
```

Run the Playwright end-to-end tests:

```bash
npm run test:e2e
```

The application uses MSW for the ranking and match-history API during local development and testing. Match results are persisted in browser `localStorage`.
