import {
  Container,
  Graphics,
  Sprite,
} from 'pixi.js';

import { ShooterConfig } from '../../config/gameConfig';
import { AssetManager } from '../engine/AssetManager';

export class Shooter {
  public container: Container;

  public health: number;
  public speed: number;
  public isDestroyed = false;

  private readonly config: ShooterConfig;
  private readonly sprite: Sprite;

  private readonly healthBarBackground: Graphics;
  private readonly healthBar: Graphics;

  private damageFlashTime = 0;

  private lastFiredTime = -Infinity;

  public constructor(
    x: number,
    y: number,
    config: ShooterConfig
  ) {
    const assets = AssetManager.getInstance();

    this.config = config;

    this.health = config.health;
    this.speed = config.speed;

    this.container = new Container();

    this.container.position.set(
      x,
      y
    );

    this.sprite = new Sprite(
      assets.getTexture(
        'ship_shooter'
      )
    );

    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(0.6);

    this.container.addChild(
      this.sprite
    );

    // Fundo da barra de vida
    this.healthBarBackground =
      new Graphics();

    this.healthBarBackground
      .rect(
        -25,
        -45,
        50,
        5
      )
      .fill(0x1e293b);

    this.container.addChild(
      this.healthBarBackground
    );

    // Vida atual
    this.healthBar =
      new Graphics();

    this.container.addChild(
      this.healthBar
    );

    this.updateHealthBar();
  }

  public update(
    deltaSeconds: number,
    targetX: number,
    targetY: number
  ): void {
    if (
      this.isDestroyed
    ) {
      return;
    }

    // Feedback visual de dano
    if (
      this.damageFlashTime > 0
    ) {
      this.damageFlashTime -=
        deltaSeconds;

      this.sprite.tint =
        0xff4444;
    } else {
      this.sprite.tint =
        0xffffff;
    }

    const dx =
      targetX -
      this.container.x;

    const dy =
      targetY -
      this.container.y;

    const distance =
      Math.hypot(
        dx,
        dy
      );

    if (distance <= 0) {
      return;
    }

    this.container.rotation =
      Math.atan2(
        dy,
        dx
      );

    const preferredDistance =
      this.config.attackRange;

    if (
      Math.abs(
        distance -
          preferredDistance
      ) > 20
    ) {
      const direction =
        distance >
        preferredDistance
          ? 1
          : -1;

      const movement =
        this.config.speed *
        direction *
        deltaSeconds;

      this.container.x +=
        (dx / distance) *
        movement;

      this.container.y +=
        (dy / distance) *
        movement;
    }
  }

  public canShoot(
    currentTimeSeconds: number
  ): boolean {
    if (
      this.isDestroyed
    ) {
      return false;
    }

    if (
      currentTimeSeconds -
        this.lastFiredTime >=
      this.config.fireCooldown
    ) {
      this.lastFiredTime =
        currentTimeSeconds;

      return true;
    }

    return false;
  }

  public takeDamage(
    amount: number
  ): void {
    if (
      this.isDestroyed ||
      amount <= 0
    ) {
      return;
    }

    this.health =
      Math.max(
        0,
        this.health - amount
      );

    this.damageFlashTime =
      0.15;

    this.updateHealthBar();

    if (
      this.health === 0
    ) {
      this.isDestroyed =
        true;
    }
  }

  private updateHealthBar(): void {
    const healthPercentage =
      this.health /
      this.config.health;

    this.healthBar.clear();

    this.healthBar
      .rect(
        -25,
        -45,
        50 * healthPercentage,
        5
      )
      .fill(0x22c55e);
  }
}