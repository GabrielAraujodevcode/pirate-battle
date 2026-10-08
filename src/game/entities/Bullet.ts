import { Container, Sprite } from 'pixi.js';
import { BulletConfig } from '../../config/gameConfig';
import { AssetManager } from '../engine/AssetManager';

export class Bullet extends Container {
  private sprite: Sprite;
  private config: BulletConfig;

  private velocityX = 0;
  private velocityY = 0;

  public isFromPlayer: boolean;
  public lifespan: number;
  public isDestroyed = false;

  constructor(
    x: number,
    y: number,
    angle: number,
    isFromPlayer: boolean,
    config: BulletConfig
  ) {
    super();

    this.x = x;
    this.y = y;

    this.config = config;
    this.isFromPlayer = isFromPlayer;
    this.lifespan = config.lifespanSeconds;

    // Calculate the projectile velocity from its angle and speed.
    this.velocityX = Math.cos(angle) * config.speed;
    this.velocityY = Math.sin(angle) * config.speed;

    const assets = AssetManager.getInstance();

    // Both player and enemy projectiles use the provided cannon ball asset.
    const texture = assets.getTexture('cannon_ball');

    this.sprite = new Sprite(texture);

    this.sprite.anchor.set(0.5);

    this.addChild(this.sprite);
  }

  public update(deltaTime: number): void {
    if (this.isDestroyed) {
      return;
    }

    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;

    this.lifespan -= deltaTime;

    if (this.lifespan <= 0) {
      this.isDestroyed = true;
    }
  }

  public getDamage(): number {
    return this.config.damage;
  }
}