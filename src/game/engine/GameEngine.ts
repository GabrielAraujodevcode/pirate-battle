import {
 Application,
 Container,
 Sprite,
 TilingSprite,
} from 'pixi.js';
import { GameConfig } from '../../config/gameConfig';
import { AssetManager } from './AssetManager';
import { CollisionManager } from './CollisionManager';
import { Player } from '../entities/Player';
import { Chaser } from '../entities/Chaser';
import { Shooter } from '../entities/Shooter';
import { Bullet } from '../entities/Bullet';
export type GameEndReason =
 | 'time_expired'
 | 'player_destroyed'
 | 'abandoned';
export class GameEngine {
 public app!: Application;
 public player!: Player;
 public score = 0;
 public timeRemaining = 0;
 public isGameOver = false;
 public endReason: GameEndReason | null = null;
 private config!: GameConfig;
 private gameContainer!: Container;
 private entityContainer!: Container;
 private chasers: Chaser[] = [];
 private shooters: Shooter[] = [];
 private bullets: Bullet[] = [];
 private elapsedTime = 0;
 private spawnTimer = 0;
 private lastPlayerFrontShotTime = -Infinity;
 private lastPlayerLateralShotTime = -Infinity;
 private isPaused = false;
 private destroyed = false;
 private keys = new Set<string>();
 private readonly arenaWidth = 1200;
 private readonly arenaHeight = 700;
 private readonly islandBounds = {
  x: 440,
  y: 254,
  width: 320,
  height: 192,
 };
 public async init(
    container: HTMLElement,
    config: GameConfig,
    onLoadingProgress?: (progress: number) => void
  ): Promise<void> {
    this.config = config;

    this.timeRemaining =
      config.sessionDurationSeconds;

    const assets =
      AssetManager.getInstance();

    await assets.loadGameAssets(
      onLoadingProgress
    );

    if (this.destroyed) {
      return;
    }

    assets.playSound(
      'game_start'
    );

    this.app = new Application();

    await this.app.init({
      width: this.arenaWidth,
      height: this.arenaHeight,
      background: '#0f172a',
      antialias: true,
    });

    if (this.destroyed) {
      this.app.destroy(true, { children: true });
      return;
    }

    this.app.canvas.style.display = 'block';
    this.app.canvas.style.width = '100%';
    this.app.canvas.style.height = 'auto';
    this.app.canvas.style.maxWidth = '1200px';
    this.app.canvas.style.maxHeight = '100%';
    this.app.canvas.style.objectFit = 'contain';

    container.appendChild(
      this.app.canvas
    );

    this.gameContainer =
      new Container();

    this.entityContainer =
      new Container();

    this.app.stage.addChild(
      this.gameContainer
    );

    this.createArena();

    this.gameContainer.addChild(
      this.entityContainer
    );

    this.createPlayer();

    this.setupInput();

    this.app.ticker.add(
      this.update
    );
  }

  private createArena(): void {
  const assets =
   AssetManager.getInstance();
  const waterTexture =
   assets.getTexture(
    'water_tile'
   );
  const water =
   new TilingSprite({
    texture: waterTexture,
    width: this.arenaWidth,
    height: this.arenaHeight,
   });
  water.position.set(0, 0);
  this.gameContainer.addChild(
   water
  );
  const islandContainer =
   new Container();
  const sandTexture =
   assets.getTexture(
    'island_tile'
   );
  const grassTexture =
   assets.getTexture(
    'island_grass'
   );
  const tileSize = 64;
  const islandColumns = 5;
  const islandRows = 3;
  for (
   let row = 0;
   row < islandRows;
   row++
  ) {
   for (
    let column = 0;
    column < islandColumns;
    column++
   ) {
    const sand =
     new Sprite(
      sandTexture
     );
    sand.width =
     tileSize;
    sand.height =
     tileSize;
    sand.position.set(
     column * tileSize,
     row * tileSize
    );
    islandContainer.addChild(
     sand
    );
   }
  }
  for (
   let row = 1;
   row < islandRows - 1;
   row++
  ) {
   for (
    let column = 1;
    column < islandColumns - 1;
    column++
   ) {
    const grass =
     new Sprite(
      grassTexture
     );
    grass.width =
     tileSize;
    grass.height =
     tileSize;
    grass.position.set(
     column * tileSize,
     row * tileSize
    );
    islandContainer.addChild(
     grass
    );
   }
  }
  islandContainer.position.set(
   this.islandBounds.x,
   this.islandBounds.y
  );
  this.gameContainer.addChild(
   islandContainer
  );
 }
 private createPlayer(): void {
  this.player =
   new Player(
    180,
    this.arenaHeight / 2,
    this.config.player
   );
  this.entityContainer.addChild(
   this.player.container
  );
 }
 private update = (): void => {
  if (
   this.destroyed ||
   this.isPaused ||
   this.isGameOver
  ) {
   return;
  }
  const deltaSeconds =
   this.app.ticker.deltaMS / 1000;
  this.elapsedTime +=
   deltaSeconds;
  this.timeRemaining =
   Math.max(
    0,
    this.config.sessionDurationSeconds -
     this.elapsedTime
   );
if (this.timeRemaining <= 0) {
 this.endGame('time_expired');
 return;
}
  this.spawnTimer +=
   deltaSeconds;
  this.updatePlayer(
   deltaSeconds
  );
  this.updatePlayerShooting();
  this.updateEnemies(
   deltaSeconds
  );
  this.updateBullets(
   deltaSeconds
  );
  this.handleCollisions();
  if (
   this.spawnTimer >=
   this.config.enemySpawnIntervalSeconds
  ) {
   this.spawnTimer = 0;
   this.spawnEnemy();
  }
if (!this.player.isAlive()) {
 this.endGame('player_destroyed');
}
 };
 private updatePlayer(
  deltaSeconds: number
 ): void {
  this.player.update(
   deltaSeconds
  );
  if (
   !this.player.isAlive()
  ) {
   return;
  }
  const isMovingForward =
   this.keys.has('w');
  const isMovingBackward =
   this.keys.has('s');
  const isRotatingLeft =
   this.keys.has('a');
  const isRotatingRight =
   this.keys.has('d');
  if (isRotatingLeft) {
   this.player.container.rotation -=
    this.config.player.rotationSpeed *
    deltaSeconds;
  }
  if (isRotatingRight) {
   this.player.container.rotation +=
    this.config.player.rotationSpeed *
    deltaSeconds;
  }
  let movementDirection = 0;
  if (isMovingForward) {
   movementDirection = 1;
  }
  if (isMovingBackward) {
   movementDirection = -1;
  }
  if (
   movementDirection !== 0
  ) {
   const speed =
    this.config.player.moveSpeed *
    deltaSeconds *
    movementDirection;
   const nextX =
    this.player.container.x +
    Math.cos(
     this.player.container.rotation
    ) *
    speed;
   const nextY =
    this.player.container.y +
    Math.sin(
     this.player.container.rotation
    ) *
    speed;
   const collidesWithIsland =
    CollisionManager.checkCircleRectCollision(
     {
      x: nextX,
      y: nextY,
      radius: 25,
     },
     this.islandBounds
    );
   if (
    !collidesWithIsland
   ) {
    this.player.container.x =
     nextX;
    this.player.container.y =
     nextY;
   }
  }
  const playerPosition = {
   x: this.player.container.x,
   y: this.player.container.y,
   radius: 25,
  };
  CollisionManager.clampToBounds(
   playerPosition,
   {
    width: this.arenaWidth,
    height: this.arenaHeight,
   }
  );
  this.player.container.x =
   playerPosition.x;
  this.player.container.y =
   playerPosition.y;
 }
 private updatePlayerShooting(): void {
  if (
   !this.player.isAlive()
  ) {
   return;
  }
  this.updateFrontShooting();
  this.updateLateralShooting();
 }
 private updateFrontShooting(): void {
  if (
   !this.keys.has(' ')
  ) {
   return;
  }
  const cooldown =
   this.config.player.fireCooldownFrontal;
  if (
   this.elapsedTime -
    this.lastPlayerFrontShotTime <
   cooldown
  ) {
   return;
  }
  this.lastPlayerFrontShotTime =
   this.elapsedTime;
  const angle =
   this.player.container.rotation;
  const spawnDistance = 35;
  const spawnX =
   this.player.container.x +
   Math.cos(angle) *
    spawnDistance;
  const spawnY =
   this.player.container.y +
   Math.sin(angle) *
    spawnDistance;
  const assets =
 AssetManager.getInstance();
assets.playSound(
 'cannon_fire'
);
  this.createBullet(
   spawnX,
   spawnY,
   angle,
   true
  );
 }
 private updateLateralShooting(): void {
  if (
   !this.keys.has('e')
  ) {
   return;
  }
  const cooldown =
   this.config.player.fireCooldownLateral;
  if (
   this.elapsedTime -
    this.lastPlayerLateralShotTime <
   cooldown
  ) {
   return;
  }
  this.lastPlayerLateralShotTime =
   this.elapsedTime;
  const playerAngle =
   this.player.container.rotation;
  const leftAngle =
   playerAngle -
   Math.PI / 2;
  const rightAngle =
   playerAngle +
   Math.PI / 2;
  const spawnDistance = 35;
  const leftX =
   this.player.container.x +
   Math.cos(leftAngle) *
    spawnDistance;
  const leftY =
   this.player.container.y +
   Math.sin(leftAngle) *
    spawnDistance;
  const rightX =
   this.player.container.x +
   Math.cos(rightAngle) *
    spawnDistance;
  const rightY =
   this.player.container.y +
   Math.sin(rightAngle) *
    spawnDistance;
  const assets =
 AssetManager.getInstance();
assets.playSound(
 'cannon_broadside'
);
  this.createLateralBulletPattern(
   leftX,
   leftY,
   leftAngle
  );
  this.createLateralBulletPattern(
   rightX,
   rightY,
   rightAngle
  );
 }
 private createLateralBulletPattern(
  x: number,
  y: number,
  angle: number
 ): void {
  // Three parallel projectiles with a small perpendicular offset.
  const offset = 8;
  const perpendicularX = -Math.sin(angle);
  const perpendicularY = Math.cos(angle);

  this.createBullet(
   x + perpendicularX * offset,
   y + perpendicularY * offset,
   angle,
   true
  );
  this.createBullet(
   x,
   y,
   angle,
   true
  );
  this.createBullet(
   x - perpendicularX * offset,
   y - perpendicularY * offset,
   angle,
   true
  );
 }
 private updateEnemies(
  deltaSeconds: number
 ): void {
  for (
   const chaser of this.chasers
  ) {
   this.updateEnemyMovement(
    chaser,
    deltaSeconds
   );
  }
  for (
   const shooter of this.shooters
  ) {
   this.updateEnemyMovement(
    shooter,
    deltaSeconds
   );
   const dx =
    this.player.container.x -
    shooter.container.x;
   const dy =
    this.player.container.y -
    shooter.container.y;
   const distance =
    Math.hypot(
     dx,
     dy
    );
   if (
    distance <=
     this.config.shooter.attackRange &&
    shooter.canShoot(
     this.elapsedTime
    )
   ) {
    this.createBullet(
     shooter.container.x,
     shooter.container.y,
     shooter.container.rotation,
     false
    );
   }
  }
 }
 private updateEnemyMovement(
  enemy: Chaser | Shooter,
  deltaSeconds: number
 ): void {
  const currentX =
   enemy.container.x;
  const currentY =
   enemy.container.y;
  enemy.update(
   deltaSeconds,
   this.player.container.x,
   this.player.container.y
  );
  const nextX =
   enemy.container.x;
  const nextY =
   enemy.container.y;
  const collidesWithIsland =
   CollisionManager.checkCircleRectCollision(
    {
     x: nextX,
     y: nextY,
     radius: 25,
    },
    this.islandBounds
   );
  if (
   collidesWithIsland
  ) {
   enemy.container.x =
    currentX;
   enemy.container.y =
    currentY;
  }
  const enemyPosition = {
   x: enemy.container.x,
   y: enemy.container.y,
   radius: 25,
  };
  CollisionManager.clampToBounds(
   enemyPosition,
   {
    width: this.arenaWidth,
    height: this.arenaHeight,
   }
  );
  enemy.container.x =
   enemyPosition.x;
  enemy.container.y =
   enemyPosition.y;
 }
 private updateBullets(
  deltaSeconds: number
 ): void {
  for (
   const bullet of this.bullets
  ) {
   bullet.update(
    deltaSeconds
   );
   if (
    !bullet.isDestroyed &&
    CollisionManager.checkCircleRectCollision(
     {
      x: bullet.x,
      y: bullet.y,
      radius: 8,
     },
     this.islandBounds
    )
   ) {
    bullet.isDestroyed = true;
   }
   if (
    !bullet.isDestroyed &&
    (
     bullet.x < 0 ||
     bullet.x > this.arenaWidth ||
     bullet.y < 0 ||
     bullet.y > this.arenaHeight
    )
   ) {
    bullet.isDestroyed = true;
   }
   if (
    bullet.isDestroyed
   ) {
    this.removeBullet(
     bullet
    );
   }
  }
 }
 private handleCollisions(): void {
  for (
   const bullet of this.bullets
  ) {
   if (
    bullet.isDestroyed
   ) {
    continue;
   }
   if (
    bullet.isFromPlayer
   ) {
    for (
     const chaser of this.chasers
    ) {
     if (
      chaser.isDestroyed
     ) {
      continue;
     }
     if (
      this.isEntityHit(
       bullet,
       chaser.container.x,
       chaser.container.y,
       25
      )
     ) {
      chaser.takeDamage(
       bullet.getDamage()
      );
      bullet.isDestroyed =
       true;
      if (
       chaser.isDestroyed
      ) {
       this.score += 1;
       AssetManager.getInstance().playSound('score_point');
       this.createExplosion(
        chaser.container.x,
        chaser.container.y
       );
       this.removeEnemy(
        chaser
       );
      }
      break;
     }
    }
    if (
     bullet.isDestroyed
    ) {
     continue;
    }
    for (
     const shooter of this.shooters
    ) {
     if (
      shooter.isDestroyed
     ) {
      continue;
     }
     if (
      this.isEntityHit(
       bullet,
       shooter.container.x,
       shooter.container.y,
       25
      )
     ) {
      shooter.takeDamage(
       bullet.getDamage()
      );
      bullet.isDestroyed =
       true;
      if (
       shooter.isDestroyed
      ) {
       this.score += 1;
       AssetManager.getInstance().playSound('score_point');
       this.createExplosion(
        shooter.container.x,
        shooter.container.y
       );
       this.removeEnemy(
        shooter
       );
      }
      break;
     }
    }
   } else {
    if (
     this.isEntityHit(
      bullet,
      this.player.container.x,
      this.player.container.y,
      25
     )
    ) {
     this.player.takeDamage(
      bullet.getDamage()
     );
     bullet.isDestroyed =
      true;
    }
   }
  }
  this.handleChaserCollisions();
 }
 private handleChaserCollisions(): void {
  for (
   const chaser of this.chasers
  ) {
   if (
    chaser.isDestroyed
   ) {
    continue;
   }
   const collision =
    CollisionManager.checkCircleCollision(
     {
      x: chaser.container.x,
      y: chaser.container.y,
      radius: 25,
     },
     {
      x: this.player.container.x,
      y: this.player.container.y,
      radius: 25,
     }
    );
   if (
    collision
   ) {
    const assets =
 AssetManager.getInstance();
assets.playSound(
 'ship_collision'
);
    this.player.takeDamage(
     this.config.chaser.collisionDamage
    );
    this.createExplosion(
     chaser.container.x,
     chaser.container.y
    );
    chaser.explode();
    this.removeEnemy(
     chaser
    );
   }
  }
 }
 private isEntityHit(
  bullet: Bullet,
  x: number,
  y: number,
  radius: number
 ): boolean {
  return CollisionManager.checkCircleCollision(
   {
    x: bullet.x,
    y: bullet.y,
    radius: 8,
   },
   {
    x,
    y,
    radius,
   }
  );
 }
 private spawnEnemy(): void {
  const spawnPosition =
   this.getSpawnPosition();
  const shouldSpawnChaser =
   Math.random() < 0.5;
  if (
   shouldSpawnChaser
  ) {
   const chaser =
    new Chaser(
     spawnPosition.x,
     spawnPosition.y,
     this.config.chaser
    );
   this.chasers.push(
    chaser
   );
   this.entityContainer.addChild(
    chaser.container
   );
  } else {
   const shooter =
    new Shooter(
     spawnPosition.x,
     spawnPosition.y,
     this.config.shooter
    );
   this.shooters.push(
    shooter
   );
   this.entityContainer.addChild(
    shooter.container
   );
  }
 }
 private getSpawnPosition(): {
  x: number;
  y: number;
 } {
  const padding = 80;
  let x = padding;
  let y = padding;
  let attempts = 0;
  do {
   x =
    padding +
    Math.random() *
     (
      this.arenaWidth -
      padding * 2
     );
   y =
    padding +
    Math.random() *
     (
      this.arenaHeight -
      padding * 2
     );
   attempts += 1;
   const tooCloseToPlayer =
    Math.hypot(
     x -
      this.player.container.x,
     y -
      this.player.container.y
    ) < 200;
   const insideIsland =
    CollisionManager.checkCircleRectCollision(
     {
      x,
      y,
      radius: 25,
     },
     this.islandBounds
    );
   if (
    !tooCloseToPlayer &&
    !insideIsland
   ) {
    break;
   }
  } while (
   attempts < 100
  );
  return {
   x,
   y,
  };
 }
 private createBullet(
 x: number,
 y: number,
 angle: number,
 isFromPlayer: boolean
): void {
 const bullet =
  new Bullet(
   x,
   y,
   angle,
   isFromPlayer,
   this.config.projectiles
  );
 this.bullets.push(
  bullet
 );
 this.entityContainer.addChild(
  bullet
 );
 // Pequeno flash visual no momento do disparo
 const muzzleFlash =
  new Sprite(
   AssetManager
    .getInstance()
    .getTexture('cannon_ball')
  );
 muzzleFlash.anchor.set(0.5);
 muzzleFlash.scale.set(
  0.35
 );
 muzzleFlash.alpha = 0.8;
 muzzleFlash.position.set(
  x,
  y
 );
 this.entityContainer.addChild(
  muzzleFlash
 );
 setTimeout(() => {
  if (
   !muzzleFlash.destroyed
  ) {
   muzzleFlash.destroy();
  }
 }, 80);
}
 private createExplosion(
 x: number,
 y: number
): void {
 const assets =
  AssetManager.getInstance();
 assets.playSound(
 'ship_explosion'
);
 const explosion =
  new Sprite(
   assets.getTexture(
    'explosion_1'
   )
  );
 explosion.anchor.set(0.5);
 explosion.scale.set(0.8);
 explosion.position.set(
  x,
  y
 );
 this.gameContainer.addChild(
  explosion
 );
 // Primeiro frame
 setTimeout(() => {
  if (explosion.destroyed) {
   return;
  }
  explosion.texture =
   assets.getTexture(
    'explosion_2'
   );
 }, 70);
 // Segundo frame
 setTimeout(() => {
  if (explosion.destroyed) {
   return;
  }
  explosion.texture =
   assets.getTexture(
    'explosion_3'
   );
 }, 140);
 // Remove a explosão
 setTimeout(() => {
  if (!explosion.destroyed) {
   explosion.destroy();
  }
 }, 210);
}
 private removeBullet(
  bullet: Bullet
 ): void {
  const index =
   this.bullets.indexOf(
    bullet
   );
  if (
   index !== -1
  ) {
   this.bullets.splice(
    index,
    1
   );
  }
  bullet.destroy({
   children: true,
  });
 }
 private removeEnemy(
  enemy: Chaser | Shooter
 ): void {
  enemy.container.destroy({
   children: true,
  });
  if (
   enemy instanceof Chaser
  ) {
   const index =
    this.chasers.indexOf(
     enemy
    );
   if (
    index !== -1
   ) {
    this.chasers.splice(
     index,
     1
    );
   }
  } else {
   const index =
    this.shooters.indexOf(
     enemy
    );
   if (
    index !== -1
   ) {
    this.shooters.splice(
     index,
     1
    );
   }
  }
 }
 private setupInput(): void {
  window.addEventListener(
   'keydown',
   this.handleKeyDown
  );
  window.addEventListener(
   'keyup',
   this.handleKeyUp
  );
  window.addEventListener(
   'blur',
   this.handleWindowBlur
  );
  document.addEventListener(
   'visibilitychange',
   this.handleVisibilityChange
  );
 }
 private handleKeyDown = (
  event: KeyboardEvent
 ): void => {
  const key = event.key.toLowerCase();

  if (
   key === ' ' ||
   key === 'arrowup' ||
   key === 'arrowdown' ||
   key === 'arrowleft' ||
   key === 'arrowright'
  ) {
   event.preventDefault();
  }

  this.keys.add(key);
 };
 private handleKeyUp = (
  event: KeyboardEvent
 ): void => {
  this.keys.delete(
   event.key.toLowerCase()
  );
 };
 public pressVirtualKey(
  key: string
): void {
  this.keys.add(
    key.toLowerCase()
  );
}

public releaseVirtualKey(
  key: string
): void {
  this.keys.delete(
    key.toLowerCase()
  );
}
 private handleWindowBlur = (): void => {
  this.pause();
 };
 private handleVisibilityChange = (): void => {
  if (
   document.hidden
  ) {
   this.pause();
  }
 };
 private cleanupInput(): void {
  window.removeEventListener(
   'keydown',
   this.handleKeyDown
  );
  window.removeEventListener(
   'keyup',
   this.handleKeyUp
  );
  window.removeEventListener(
   'blur',
   this.handleWindowBlur
  );
  document.removeEventListener(
   'visibilitychange',
   this.handleVisibilityChange
  );
  this.keys.clear();
 }
public pause(): void {
 if (
  this.isGameOver ||
  this.isPaused
 ) {
  return;
 }
 this.isPaused = true;
 const assets =
  AssetManager.getInstance();
 assets.playSound(
  'game_pause'
 );
}
public resume(): void {
 if (
  this.isGameOver ||
  !this.isPaused
 ) {
  return;
 }
 this.isPaused = false;
 const assets =
  AssetManager.getInstance();
 assets.playSound(
  'game_resume'
 );
}
 public getPausedState(): boolean {
  return this.isPaused;
 }
private endGame(
 reason: GameEndReason
): void {
 if (this.isGameOver) {
  return;
 }
 this.isGameOver = true;
 this.endReason = reason;
 const assets =
  AssetManager.getInstance();
 if (reason === 'player_destroyed') {
  assets.playSound(
   'game_over'
  );
 } else if (reason === 'time_expired') {
  assets.playSound(
   'game_complete'
  );
 }
}
 public destroy(): void {
  if (
   this.destroyed
  ) {
   return;
  }
  this.destroyed = true;
  this.cleanupInput();
  this.app?.ticker.remove(
   this.update
  );
  const canvas = this.app?.canvas;

  this.app?.destroy(
   true,
   {
    children: true,
   }
  );

  canvas?.remove();

  this.chasers = [];
  this.shooters = [];
  this.bullets = [];
 }
}
