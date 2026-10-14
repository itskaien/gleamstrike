START GleamStrike

1. SETUP PROJECT
   - Create repo
   - Initialize React + Three.js / React Three Fiber + Vite
   - Add basic folder structure
   - Set up Git
   - Verify dev server runs

2. BUILD CORE SCENE
   - Create canvas
   - Add scene
   - Add camera
   - Add lights
   - Add ground plane
   - Verify scene renders

3. BUILD PLAYER
   - Add capsule as placeholder character
   - Add player state:
     position
     rotation
     health
     light
     score
   - Add keyboard input listener
   - Add mouse input listener

4. BUILD THIRD-PERSON CAMERA
   - Create camera pivot at player position
   - Offset camera behind and above player
   - Mouse X controls yaw
   - Mouse Y controls pitch
   - Clamp pitch so camera doesn’t flip
   - Make camera follow player smoothly
   - Add camera collision:
     raycast from player to camera
     if wall blocks view, pull camera closer

5. BUILD MOVEMENT
   - Read WASD input
   - Convert input to camera-relative direction
   - Move player
   - Rotate character toward movement direction
   - Add simple ground collision
   - Add basic wall collision
   - Add dash:
     IF dash pressed AND cooldown ready:
     boost movement briefly
     start cooldown

6. TEST CHECKPOINT 1
   IF player can move, look, and camera follows correctly:
   continue
   ELSE:
   fix movement/camera before proceeding

7. BUILD SHOOTING
   - Add crosshair
   - Add shoot input
   - On shoot:
     spawn bullet or raycast from camera/player
     consume light
     add muzzle flash
   - Add bullet movement
   - Add bullet lifespan
   - Add fire-rate cooldown

8. BUILD FIRST ENEMY
   - Add enemy capsule
   - Add enemy state:
     position
     health
     speed
   - Enemy moves toward player
   - Enemy damages player when close
   - Enemy dies when health <= 0

9. BUILD DAMAGE SYSTEM
   - Bullet hits enemy:
     reduce enemy health
     remove bullet
     show hit effect
   - Enemy reaches player:
     reduce player health
     apply hit feedback

10. BUILD DEATH + RESTART
    - IF player health <= 0:
      show game-over screen
      save score locally
      show restart button
    - Restart resets:
      player health
      light
      score
      wave
      enemies
      bullets
      pickups

11. TEST CHECKPOINT 2
    IF player can shoot, kill enemy, die, and restart:
    continue
    ELSE:
    fix combat loop before adding more systems

12. BUILD LIGHT MECHANIC
    - Set max light = 100
    - Shooting consumes light
    - Passive light regen over time
    - Enemy kill restores light
    - Light pickup restores more light
    - IF light < threshold:
      reduce weapon effectiveness
      show low-light warning
    - IF light <= 0:
      block shooting until enough light regenerates

13. BUILD PICKUPS
    - Spawn light pickup when enemy dies
    - Pickup floats/rotates
    - Player collision restores light
    - Remove pickup after collection

14. BUILD WAVES
    - wave = 1
    - Spawn enemies based on wave number
    - Enemy count and speed increase each wave
    - WHEN all enemies dead:
      wave += 1
      spawn next wave
    - Add wave announcement UI

15. BUILD ENEMY VARIETY
    - Chaser:
      moves directly toward player
    - Shooter:
      keeps distance
      fires projectiles at intervals
    - Elite:
      higher health
      slower but dangerous
      appears in later waves

16. BUILD ENEMY PROJECTILES
    - Shooter fires projectile
    - Projectile moves toward player
    - Projectile damages player on hit
    - Projectile expires after range/time

17. BUILD ARENA
    - Replace ground plane with real arena layout
    - Add walls
    - Add cover objects
    - Add ramps or elevation if simple
    - Add spawn points away from player
    - Add boundary collision

18. BUILD VISUAL IDENTITY
    - Choose color palette
    - Add materials
    - Add lighting
    - Add fog if useful
    - Add simple particle effects
    - Add muzzle flash
    - Add hit effects

    - Add death effects

19. BUILD UI
    - Main menu
    - HUD:
      health bar
      light meter
      score
      wave
    - Game-over screen
    - Restart button
    - Pause menu optional

20. BUILD GAME FEEL
    - Add sound effects:
      shoot
      hit
      enemy death
      player damage
      pickup
      game over
    - Add screen shake
    - Add damage flash
    - Add low-light warning
    - Tune movement speed
    - Tune enemy speed
    - Tune weapon damage
    - Tune light costs and regen

21. TEST CHECKPOINT 3
    IF full loop is fun:
    continue
    ELSE:
    simplify:
    reduce enemy types
    reduce wave complexity
    improve movement/shooting feel
    Do not add new systems until core loop feels good

22. BUILD BACKEND
    - Express + Prisma + PostgreSQL
    - Set up database
    - Create tables:
      players
      runs
      scores
    - Create API endpoints:
      submit run
      get leaderboard
      get player runs
    - Add guest session
    - Validate score submission
    - Prevent obvious duplicate submissions

23. BUILD LEADERBOARD
    - Show top scores
    - Show player rank
    - Show run history
    - Handle network failure gracefully

24. BUILD OPTIONAL WALLET PROFILE
    - Add “Connect Wallet” button
    - Connect wallet read-only
    - Save wallet address to profile
    - Show wallet identity on leaderboard
    - No token balance requirement
    - No transactions
    - No approvals
    - No rewards contract

25. TEST CHECKPOINT 4
    IF guest can play without wallet:
    continue
    ELSE:
    make wallet fully optional or remove it

26. OPTIMIZE
    - Reduce draw calls
    - Reuse geometries/materials
    - Limit particle count
    - Remove unused objects
    - Check FPS on normal laptop
    - Fix memory leaks
    - Test browser resize
    - Test pause/resume

27. FIX BUGS
    - Test full run
    - Test death/restart
    - Test wave progression
    - Test light depletion
    - Test leaderboard
    - Test wallet connect
    - Test on different screen sizes

28. DEPLOY
    - Build production version
    - Deploy frontend
    - Deploy backend/database
    - Add environment variables
    - Verify live link
    - Test game on deployed URL

29. RECORD DEMO
    - Record 30–60 second gameplay clip
    - Show movement, shooting, light mechanic, waves, game over
    - Save for portfolio/Upwork

30. SHIP V1
    - Publish link
    - Share with test players
    - Collect feedback
    - Fix top issues
    - Plan V1.1

END V1

AFTER V1 IS LIVE:

    IF players enjoy core loop:
        ADD:
            - upgrades
            - more weapons
            - more enemy types
            - second arena
            - replay system
            - better progression

    IF players want social competition:
        ADD:
            - weekly leaderboard
            - challenges
            - achievements

    IF crypto audience exists:
        ADD:
            - testnet badge
            - optional on-chain achievement
            - later: evaluate token utility

    IF multiplayer is requested repeatedly:
        CONSIDER:
            - separate multiplayer milestone
            - never bolt it onto V1 casually
