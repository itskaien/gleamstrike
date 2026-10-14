# GleamStrike: Design Document

## 1. Overview

A browser-native, third-person arena survival shooter in the style of Call of Duty.

## 2. Core Loop

1. Spawn into one arena.
2. Fight escalating enemy waves.
3. Shooting uses ammo from a magazine; reload when empty.
4. Kills drop ammo pickups.
5. Manage ammo, reloads and positioning to survive.
6. Die → score screen → restart.

## 3. V1 Scope

### Player

- Third-person character
- WASD movement
- Mouse-look orbit camera
- Aim and shoot
- Dash or slide
- Health
- Ammo (magazine + reserve) and reload

### Camera

- Over-the-shoulder third-person camera
- Camera follows behind and slightly above character
- Mouse controls yaw/pitch
- Camera collision prevents walls blocking view
- Optional scroll-wheel zoom

### Combat

- One weapon with magazine and reserve ammo, Reload (R) with a reload delay, Kills drop ammo pickups, Low-ammo warning

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

### UI

- Main menu
- HUD: health, ammo, score, wave
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
- magSize = 30
- startReserve = 120
- maxReserve = 240
- reloadTime = 1.8
- killScore = 100
- ammoPickupReward = 30
- lowAmmoThreshold = 20

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
8. Ammo and reload
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
- Ammo and reload visibly affect combat decisions.
- Waves escalate correctly.
- Score and high score persist.
- Leaderboard saves valid runs.
- Wallet connection is optional and never blocks gameplay.
- Game runs smoothly on a normal desktop browser.
- Live deployed URL works.
