export interface PlayerConfig {
  moveSpeed: number;
  rotationSpeed: number;
  maxHealth: number;
  fireCooldownFrontal: number;
  fireCooldownLateral: number;
}

export interface ChaserConfig {
  speed: number;
  rotationSpeed: number;
  health: number;
  collisionDamage: number;
}

export interface ShooterConfig {
  speed: number;
  rotationSpeed: number;
  health: number;
  attackRange: number;
  fireCooldown: number;
}

export interface BulletConfig {
  speed: number;
  damage: number;
  lifespanSeconds: number;
}

export interface GameConfig {
  sessionDurationSeconds: number;
  enemySpawnIntervalSeconds: number;
  player: PlayerConfig;
  chaser: ChaserConfig;
  shooter: ShooterConfig;
  projectiles: BulletConfig;
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  sessionDurationSeconds: 120,
  enemySpawnIntervalSeconds: 3,
  player: {
    moveSpeed: 180,
    rotationSpeed: 2.5,
    maxHealth: 100,
    fireCooldownFrontal: 0.4,
    fireCooldownLateral: 1.2,
  },
  chaser: {
    speed: 120,
    rotationSpeed: 2.0,
    health: 30,
    collisionDamage: 15,
  },
  shooter: {
    speed: 80,
    rotationSpeed: 1.5,
    health: 40,
    attackRange: 280,
    fireCooldown: 1.8,
  },
  projectiles: {
    speed: 400,
    damage: 15,
    lifespanSeconds: 2.5,
  },
};