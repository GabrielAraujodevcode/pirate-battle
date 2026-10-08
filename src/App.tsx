import React, { useEffect, useRef, useState } from 'react';

import { MainMenu } from './components/menus/MainMenu';
import { MobileControls } from './components/game/MobileControls';
import { HUD } from './components/hud/HUD';
import { GameOverModal } from './components/hud/GameOverModal';
import { LoadingScreen } from './components/loading/LoadingScreen';

import { GameEngine } from './game/engine/GameEngine';
import { DEFAULT_GAME_CONFIG } from './config/gameConfig';
import { useSubmitMatch } from './hooks/useGameApi';

interface MatchConfig {
  sessionDurationSeconds: number;
  enemySpawnIntervalSeconds: number;
}

type AppGameState = 'menu' | 'playing' | 'gameover';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<AppGameState>('menu');
  const [playerName, setPlayerName] = useState('');
  const [matchConfig, setMatchConfig] = useState<MatchConfig>({
    sessionDurationSeconds: DEFAULT_GAME_CONFIG.sessionDurationSeconds,
    enemySpawnIntervalSeconds: DEFAULT_GAME_CONFIG.enemySpawnIntervalSeconds,
  });

  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    DEFAULT_GAME_CONFIG.sessionDurationSeconds
  );
  const [playerHealth, setPlayerHealth] = useState(
    DEFAULT_GAME_CONFIG.player.maxHealth
  );
  const [isPaused, setIsPaused] = useState(false);
  const [endReason, setEndReason] = useState<
    'time_expired' | 'player_destroyed' | 'abandoned'
  >('time_expired');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [loadingAttempt, setLoadingAttempt] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const matchSubmittedRef = useRef(false);

  const { mutateAsync: submitMatch } = useSubmitMatch();

  const handleStartGame = (
    name: string,
    config: MatchConfig = matchConfig
  ): void => {
    setPlayerName(name);
    setMatchConfig(config);
    setScore(0);
    setTimeRemaining(config.sessionDurationSeconds);
    setPlayerHealth(DEFAULT_GAME_CONFIG.player.maxHealth);
    setIsPaused(false);
    setEndReason('time_expired');

    matchSubmittedRef.current = false;
    setLoadingProgress(0);
    setLoadingError(null);
    setIsLoading(true);
    setLoadingAttempt((attempt) => attempt + 1);
    setGameState('playing');
  };

  useEffect(() => {
    if (gameState !== 'playing' || !containerRef.current) {
      return;
    }

    const container = containerRef.current;
    const engine = new GameEngine();
    let interval: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    engineRef.current = engine;

    const gameConfig = {
      ...DEFAULT_GAME_CONFIG,
      sessionDurationSeconds: matchConfig.sessionDurationSeconds,
      enemySpawnIntervalSeconds: matchConfig.enemySpawnIntervalSeconds,
    };

    const startGame = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setLoadingError(null);

        await engine.init(container, gameConfig, (progress) => {
          if (!cancelled) {
            setLoadingProgress(progress);
          }
        });

        if (cancelled || engineRef.current !== engine) {
          engine.destroy();
          return;
        }

        setLoadingProgress(1);
        setIsLoading(false);

        interval = setInterval(() => {
          if (cancelled || engineRef.current !== engine) {
            return;
          }

          setScore(engine.score);
          setTimeRemaining(engine.timeRemaining);
          setPlayerHealth(engine.player.currentHealth);
          setIsPaused(engine.getPausedState());

          if (!engine.isGameOver) {
            return;
          }

          const reason = engine.endReason ?? 'time_expired';

          setScore(engine.score);
          setTimeRemaining(engine.timeRemaining);
          setPlayerHealth(engine.player.currentHealth);
          setEndReason(reason);

          if (interval) {
            clearInterval(interval);
            interval = null;
          }

          // Show the result immediately. Saving the result is a background
          // operation and must never leave the game frozen on the final frame.
          setGameState('gameover');

          if (matchSubmittedRef.current) {
            return;
          }

          matchSubmittedRef.current = true;

          const matchResult = {
            matchId: crypto.randomUUID(),
            playerId: playerName.trim().toLowerCase().replace(/\s+/g, '_'),
            playerName: playerName.trim(),
            score: engine.score,
            durationSeconds: Math.max(
              0,
              gameConfig.sessionDurationSeconds - engine.timeRemaining
            ),
            endReason: reason,
            playedAt: new Date().toISOString(),
            config: {
              sessionDurationSeconds: gameConfig.sessionDurationSeconds,
              enemySpawnIntervalSeconds:
                gameConfig.enemySpawnIntervalSeconds,
            },
          };

          void submitMatch(matchResult).catch((error) => {
            console.error('Failed to submit match result:', error);
          });
        }, 100);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error('Failed to initialize game:', error);
        setIsLoading(false);
        setLoadingError(
          'Não foi possível carregar os recursos do jogo. Tente novamente.'
        );
      }
    };

    void startGame();

    return () => {
      cancelled = true;

      if (interval) {
        clearInterval(interval);
      }

      if (engineRef.current === engine) {
        engine.destroy();
        engineRef.current = null;
      } else {
        engine.destroy();
      }
    };
  }, [
    gameState,
    matchConfig,
    loadingAttempt,
    submitMatch,
    playerName,
  ]);

  const togglePause = (): void => {
    const engine = engineRef.current;

    if (!engine || engine.isGameOver) {
      return;
    }

    if (engine.getPausedState()) {
      engine.resume();
    } else {
      engine.pause();
    }

    setIsPaused(engine.getPausedState());
  };

  const handleRetryLoading = (): void => {
    if (engineRef.current) {
      engineRef.current.destroy();
      engineRef.current = null;
    }

    setLoadingProgress(0);
    setLoadingError(null);
    setIsLoading(true);
    matchSubmittedRef.current = false;
    setLoadingAttempt((attempt) => attempt + 1);
  };

  const handleRestart = (): void => {
    if (engineRef.current) {
      engineRef.current.destroy();
      engineRef.current = null;
    }

    setScore(0);
    setTimeRemaining(matchConfig.sessionDurationSeconds);
    setPlayerHealth(DEFAULT_GAME_CONFIG.player.maxHealth);
    setIsPaused(false);
    setEndReason('time_expired');
    setLoadingProgress(0);
    setLoadingError(null);
    setIsLoading(true);
    matchSubmittedRef.current = false;
    setLoadingAttempt((attempt) => attempt + 1);
    setGameState('playing');
  };

  const handleReturnToMenu = (): void => {
    if (engineRef.current) {
      engineRef.current.destroy();
      engineRef.current = null;
    }

    setIsLoading(false);
    setLoadingError(null);
    setLoadingProgress(0);
    setIsPaused(false);
    setScore(0);
    setPlayerHealth(DEFAULT_GAME_CONFIG.player.maxHealth);
    setTimeRemaining(matchConfig.sessionDurationSeconds);
    matchSubmittedRef.current = false;
    setGameState('menu');
  };

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-slate-950">
      {gameState === 'menu' && (
        <MainMenu onStartGame={handleStartGame} />
      )}

      {(gameState === 'playing' || gameState === 'gameover') && (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-slate-950">
          <div
            ref={containerRef}
            className="flex h-full w-full items-center justify-center overflow-hidden"
          />

          {isLoading && (
            <div className="absolute inset-0 z-50">
              <LoadingScreen
                progress={loadingProgress}
                error={loadingError ?? undefined}
                onRetry={loadingError ? handleRetryLoading : undefined}
              />
            </div>
          )}

          {!isLoading && (
            <HUD
              score={score}
              timeRemaining={timeRemaining}
              playerHealth={playerHealth}
              isPaused={isPaused}
              onPauseToggle={togglePause}
            />
          )}

          {gameState === 'playing' && !isLoading && (
            <MobileControls
              onInputStart={(key) =>
                engineRef.current?.pressVirtualKey(key)
              }
              onInputEnd={(key) =>
                engineRef.current?.releaseVirtualKey(key)
              }
            />
          )}
        </div>
      )}

      {gameState === 'gameover' && !isLoading && (
        <GameOverModal
          score={score}
          reason={endReason}
          onRestart={handleRestart}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
    </div>
  );
};

export default App;
