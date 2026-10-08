import {
  Container,
  Graphics,
  Sprite,
} from 'pixi.js';

import { PlayerConfig } from '../../config/gameConfig';
import { AssetManager } from '../engine/AssetManager';

export class Player {
  public readonly container: Container;

  public currentHealth: number;
  public readonly maxHealth: number;

  private readonly config: PlayerConfig;
  private readonly sprite: Sprite;

  private readonly healthBarBackground: Graphics;
  private readonly healthBar: Graphics;

  private damageFlashTime = 0;

  public constructor(
    x: number,
    y: number,
    config: PlayerConfig
  ) {
    const assets =
      AssetManager.getInstance();

    this.config = config;

    this.currentHealth =
      config.maxHealth;

    this.maxHealth =
      config.maxHealth;

    this.container =
      new Container();

    this.sprite =
      new Sprite(
        assets.getTexture(
          'ship_player'
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

    this.container.position.set(
      x,
      y
    );
  }

  public getHealth(): number {
    return this.currentHealth;
  }

  public getMaxHealth(): number {
    return this.maxHealth;
  }

  public takeDamage(
    amount: number
  ): void {
    if (
      amount <= 0 ||
      this.currentHealth <= 0
    ) {
      return;
    }

    this.currentHealth =
      Math.max(
        0,
        this.currentHealth - amount
      );

    this.damageFlashTime = 0.15;

    this.updateHealthBar();
  }

  public update(
    deltaSeconds: number
  ): void {
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
  }

  private updateHealthBar(): void {
    const healthPercentage =
      this.currentHealth /
      this.maxHealth;

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

  public isAlive(): boolean {
    return this.currentHealth > 0;
  }

  public setRotation(
    rotation: number
  ): void {
    this.container.rotation =
      rotation;
  }

  public destroy(): void {
    this.container.destroy({
      children: true,
    });
  }
}