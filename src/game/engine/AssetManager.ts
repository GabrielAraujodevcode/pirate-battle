import {
  Assets,
  Texture,
} from 'pixi.js';

export class AssetManager {
  private static instance: AssetManager;

  private loaded = false;

  private readonly sounds =
    new Map<string, HTMLAudioElement>();

  private constructor() {}

  public static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance =
        new AssetManager();
    }

    return AssetManager.instance;
  }

  public async loadGameAssets(
    onProgress?: (progress: number) => void
  ): Promise<void> {
    if (this.loaded) {
      onProgress?.(1);
      return;
    }

    const manifest = {
      bundles: [
        {
          name: 'gameplay',
          assets: [
            {
              alias: 'ui_sheet',
              src: new URL(
                '../../assets/spritesheet/ui_sheet.json',
                import.meta.url
              ).href,
            },

            {
              alias: 'ship_player',
              src: new URL(
                '../../assets/png/default/ships/ship_1.png',
                import.meta.url
              ).href,
            },

            {
              alias: 'ship_chaser',
              src: new URL(
                '../../assets/png/default/ships/ship_2.png',
                import.meta.url
              ).href,
            },

            {
              alias: 'ship_shooter',
              src: new URL(
                '../../assets/png/default/ships/ship_3.png',
                import.meta.url
              ).href,
            },

            {
              alias: 'cannon_ball',
              src: new URL(
                '../../assets/png/default/ship_parts/cannon_ball.png',
                import.meta.url
              ).href,
            },

            {
              alias: 'explosion_1',
              src: new URL(
                '../../assets/png/default/effects/explosion_1.png',
                import.meta.url
              ).href,
            },

            {
              alias: 'explosion_2',
              src: new URL(
                '../../assets/png/default/effects/explosion_2.png',
                import.meta.url
              ).href,
            },

            {
              alias: 'explosion_3',
              src: new URL(
                '../../assets/png/default/effects/explosion_3.png',
                import.meta.url
              ).href,
            },

            {
              alias: 'water_tile',
              src: new URL(
                '../../assets/png/default/tiles/tile_73.png',
                import.meta.url
              ).href,
            },

            {
              alias: 'island_tile',
              src: new URL(
                '../../assets/png/default/tiles/tile_68.png',
                import.meta.url
              ).href,
            },

            {
              alias: 'island_grass',
              src: new URL(
                '../../assets/png/default/tiles/tile_39.png',
                import.meta.url
              ).href,
            },
          ],
        },
      ],
    };

    try {
      await Assets.init({
        manifest,
      });

      await Assets.loadBundle(
        'gameplay',
        (progress: number) => {
          onProgress?.(progress);
        }
      );

      this.loadSounds();

      this.loaded = true;
    } catch (error) {
      this.loaded = false;

      console.error(
        'Failed to load game assets:',
        error
      );

      throw new Error(
        'Failed to load game assets.'
      );
    }
  }

  private loadSounds(): void {
    const sounds = {
      cannon_fire:
        new URL(
          '../../assets/sounds/cannon_fire_1.wav',
          import.meta.url
        ).href,

      cannon_broadside:
        new URL(
          '../../assets/sounds/cannon_broadside.wav',
          import.meta.url
        ).href,

      ship_explosion:
        new URL(
          '../../assets/sounds/ship_explosion_1.wav',
          import.meta.url
        ).href,

      ship_collision:
        new URL(
          '../../assets/sounds/ship_collision.wav',
          import.meta.url
        ).href,

      score_point:
        new URL(
          '../../assets/sounds/score_point.wav',
          import.meta.url
        ).href,

      game_start:
        new URL(
          '../../assets/sounds/game_start.wav',
          import.meta.url
        ).href,

      game_over:
        new URL(
          '../../assets/sounds/game_over.wav',
          import.meta.url
        ).href,

      game_complete:
        new URL(
          '../../assets/sounds/game_complete.wav',
          import.meta.url
        ).href,

      game_pause:
        new URL(
          '../../assets/sounds/game_pause.wav',
          import.meta.url
        ).href,

      game_resume:
        new URL(
          '../../assets/sounds/game_resume.wav',
          import.meta.url
        ).href,
    };

    Object.entries(sounds).forEach(
      ([key, source]) => {
        const audio =
          new Audio(source);

        audio.preload = 'auto';

        this.sounds.set(
          key,
          audio
        );
      }
    );
  }

  public getTexture(
    key: string
  ): Texture {
    if (!this.loaded) {
      throw new Error(
        `AssetManager: assets have not been loaded yet. Requested: ${key}`
      );
    }

    const texture = Assets.get(key);

    if (!texture) {
      throw new Error(
        `AssetManager: texture not found: ${key}`
      );
    }

    return texture;
  }

  public playSound(
    key: string
  ): void {
    if (!this.loaded) {
      return;
    }

    const sound =
      this.sounds.get(key);

    if (!sound) {
      console.warn(
        `AssetManager: sound not found: ${key}`
      );

      return;
    }

    sound.currentTime = 0;

    void sound.play().catch(() => {
      // O navegador pode bloquear
      // reprodução automática de áudio.
    });
  }
}