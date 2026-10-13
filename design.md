# GleamStrike: Design Document

## 1. Overview

A browser-native, third-person arena survival shooter where light is both the player’s weapon and resource.

## 2. Core Loop

1. Spawn into one arena.
2. Fight escalating enemy waves.
3. Shooting consumes light.
4. Kills and pickups restore light.
5. Manage aggression vs. survival.
6. Die → score screen → restart.

## 3. V1 Scope

### Player

- Third-person character
- WASD movement
- Mouse-look orbit camera
- Aim and shoot
- Dash or slide
- Health
- Light meter

### Camera

- Over-the-shoulder third-person camera
- Camera follows behind and slightly above character
- Mouse controls yaw/pitch
- Camera collision prevents walls blocking view
- Optional scroll-wheel zoom

### Combat

- One weapon
- Bullets consume light
- Kills drop light pickups
- Low light reduces damage or fire rate
- Light meter on HUD

### Enemies

- Chaser
- Ranged shooter
- Elite tank

### Waves

- Escalating enemy count and speed
- Score per kill
- Wave counter
- Game-over screen
- Restart

### Arena

- One map
- Cover objects
- Open central fighting area
- Lighting tied to the light mechanic

### UI

- Main menu
- HUD: health, light, score, wave
- Game-over screen
- Restart

### Polish

- Muzzle flash
- Hit markers
- Screen shake
- Sound
- Clean visual identity

### Full-stack

- Guest session
- High score
- Run history
- Leaderboard
- Optional read-only wallet profile
- No token, gating, or rewards contract

## 4. Architecture

- Frontend: React + React Three Fiber + Three.js
- State: Zustand
- Backend: Node.js + Express
- Database: PostgreSQL or MongoDB
- Game logic: systems
- Rendering: R3F components
- UI: React components

## 5. Data Model

### Player

- id
- sessionId
- walletAddress optional
- highScore
- createdAt

### Run

- id
- playerId
- score
- waveReached
- enemiesKilled
- durationSeconds
- createdAt

### LeaderboardEntry

- id
- playerId
- score
- waveReached
- createdAt

## 6. Game Constants

- maxHealth = 100
- maxLight = 100
- shotLightCost = 5
- passiveLightRegen = 2/sec
- killLightReward = 15
- pickupLightReward = 25
- lowLightThreshold = 20

## 7. Camera Implementation

- Camera pivot attached to player
- Camera offset behind and above player
- Mouse controls yaw/pitch
- Character faces camera yaw while aiming
- Raycast from player to desired camera position
- Pull camera closer if blocked
- Crosshair at screen center

## 8. Build Order

1. Project setup
2. Three.js scene + third-person character
3. Movement + orbit camera
4. Shooting
5. First enemy + damage
6. Health + death/restart
7. Waves + score
8. Light mechanic
9. Enemy variety
10. Arena + visuals
11. UI + game feel
12. Backend + leaderboard
13. Optional wallet profile
14. Bug fixes + performance
15. Deploy

## 9. Cut Order

If scope becomes too large, remove in this order:

1. Wallet connect
2. Leaderboard
3. Third enemy
4. Sound
5. Visual polish
6. Dash

Never remove:

- Third-person camera
- Movement
- Shooting
- Light mechanic
- Death/restart
- Deployment

## 10. Out of Scope for V1

- Multiplayer
- Token launch
- Holder gating
- Rewards contract
- Multiple maps
- Weapon loadouts
- Upgrade trees
- Custom character models
- Complex progression

## 11. Acceptance Criteria

GLEAMSTRIKE V1 is complete when:

- A guest can open the deployed link and play without explanation.
- Player can move, aim, shoot, kill enemies, take damage, die, and restart.
- Light mechanic visibly affects combat decisions.
- Waves escalate correctly.
- Score and high score persist.
- Leaderboard saves valid runs.
- Wallet connection is optional and never blocks gameplay.
- Game runs smoothly on a normal desktop browser.
- Live deployed URL works.
