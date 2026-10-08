import {
  Container,
  Graphics,
  Sprite,
} from 'pixi.js';

import { ChaserConfig } from '../../config/gameConfig';
import { AssetManager } from '../engine/AssetManager';

export class Chaser {
  public container: Container;

  public health: number;
  public speed: number;
  public isDestroyed = false;

  private readonly config: ChaserConfig;
  private readonly sprite: Sprite;

  private readonly healthBarBackground: Graphics;
  private readonly healthBar: Graphics;

  private damageFlashTime = 0;

  public constructor(
    x: number,
    y: number,
    config: ChaserConfig
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
        'ship_chaser'
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

    const angle =
      Math.atan2(
        dy,
        dx
      );

    this.container.rotation =
      angle;

    const movement =
      this.config.speed *
      deltaSeconds;

    this.container.x +=
      (dx / distance) *
      movement;

    this.container.y +=
      (dy / distance) *
      movement;
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

  public explode(): void {
    if (this.isDestroyed) {
      return;
    }

    this.isDestroyed = true;
  }
}