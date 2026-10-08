import React, { useState } from 'react';
import { RankingTable } from './RankingTable';
import { MatchHistoryTable } from './MatchHistoryTable';

interface MainMenuProps {
  onStartGame: (
    playerName: string,
    gameConfig?: {
      sessionDurationSeconds: number;
      enemySpawnIntervalSeconds: number;
    }
  ) => void;
}

const DEFAULT_SESSION_TIME = 120;
const DEFAULT_SPAWN_INTERVAL = 3;

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
}) => {
  const [activeTab, setActiveTab] =
    useState<'ranking' | 'history'>('ranking');

  const [playerName, setPlayerName] =
    useState('');

  const [showOptions, setShowOptions] =
    useState(false);

  const [showInstructions, setShowInstructions] =
    useState(false);

  const [sessionTime, setSessionTime] =
    useState(() =>
      Number(
        localStorage.getItem(
          'pirate_battle_session_time'
        ) ?? DEFAULT_SESSION_TIME
      )
    );

  const [spawnInterval, setSpawnInterval] =
    useState(() =>
      Number(
        localStorage.getItem(
          'pirate_battle_spawn_interval'
        ) ?? DEFAULT_SPAWN_INTERVAL
      )
    );

  const [error, setError] =
    useState('');

  const validateOptions = (): boolean => {
    if (
      sessionTime < 60 ||
      sessionTime > 180
    ) {
      setError(
        'A duração da partida deve estar entre 60 e 180 segundos.'
      );

      return false;
    }

    if (
      spawnInterval < 0.1 ||
      spawnInterval > 30
    ) {
      setError(
        'O intervalo de spawn deve estar entre 0.1 e 30 segundos.'
      );

      return false;
    }

    setError('');

    return true;
  };

  const saveOptions = () => {
    if (!validateOptions()) {
      return;
    }

    localStorage.setItem(
      'pirate_battle_session_time',
      String(sessionTime)
    );

    localStorage.setItem(
      'pirate_battle_spawn_interval',
      String(spawnInterval)
    );

    setShowOptions(false);
  };

  const handleStart = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!playerName.trim()) {
      return;
    }

    if (!validateOptions()) {
      return;
    }

    onStartGame(
      playerName.trim(),
      {
        sessionDurationSeconds:
          sessionTime,
        enemySpawnIntervalSeconds:
          spawnInterval,
      }
    );
  };

  if (showOptions) {
    return (
      <div className="fixed inset-0 z-10 w-full bg-slate-950 text-white overflow-y-auto overscroll-y-contain touch-pan-y">
        <div className="min-h-full w-full flex items-start justify-center p-3 sm:p-4 pb-8">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-2xl space-y-5 sm:space-y-6 my-2 sm:my-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-amber-400">
                Options
              </h1>

              <p className="text-sm text-slate-400 mt-1">
                Configure a partida antes de jogar.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Game session time
                </label>

                <input
                  type="number"
                  min={60}
                  max={180}
                  value={sessionTime}
                  onChange={(e) =>
                    setSessionTime(
                      Number(e.target.value)
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />

                <p className="text-xs text-slate-500 mt-1">
                  Entre 60 e 180 segundos.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Enemy spawn time
                </label>

                <input
                  type="number"
                  min={0.1}
                  max={30}
                  step={0.1}
                  value={spawnInterval}
                  onChange={(e) =>
                    setSpawnInterval(
                      Number(e.target.value)
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-400"
                />

                <p className="text-xs text-slate-500 mt-1">
                  Entre 0.1 e 30 segundos.
                </p>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="bg-red-950/50 border border-red-800 text-red-300 rounded-lg p-3 text-sm"
              >
                {error}
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setShowOptions(false);
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-lg transition"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={saveOptions}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg transition"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="fixed inset-0 z-10 w-full bg-slate-950 text-white overflow-y-auto overscroll-y-contain touch-pan-y">
        <div className="w-full min-h-full flex justify-center px-3 py-4 sm:px-4 sm:py-6 pb-8">
          <div className="w-full max-w-2xl self-start bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-2xl">
            <div className="text-center mb-5 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                Como Jogar
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
                Controle seu navio, destrua os inimigos e faça a maior pontuação possível.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-3.5 sm:p-4">
                <h2 className="font-bold text-amber-400 mb-2.5 sm:mb-3">
                  🎮 Controles
                </h2>

                <div className="space-y-1.5 sm:space-y-2 text-sm text-slate-300">
                  <p>
                    <span className="font-bold text-white">W</span> — Avançar
                  </p>

                  <p>
                    <span className="font-bold text-white">S</span> — Ré
                  </p>

                  <p>
                    <span className="font-bold text-white">A / D</span> — Girar o navio
                  </p>

                  <p>
                    <span className="font-bold text-white">Espaço</span> — Disparo frontal
                  </p>

                  <p>
                    <span className="font-bold text-white">E</span> — Disparo lateral
                  </p>

                  <p>
                    <span className="font-bold text-white">Pausa</span> — Pausar ou continuar
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-3.5 sm:p-4">
                <h2 className="font-bold text-amber-400 mb-2.5 sm:mb-3">
                  ⚔️ Objetivo
                </h2>

                <div className="space-y-1.5 sm:space-y-2 text-sm text-slate-300 leading-relaxed">
                  <p>
                    Destrua os navios inimigos para ganhar pontos.
                  </p>

                  <p>
                    Cada inimigo destruído vale{' '}
                    <span className="font-bold text-white">
                      1 ponto
                    </span>.
                  </p>

                  <p>
                    Evite colisões e os disparos dos inimigos.
                  </p>

                  <p>
                    A partida termina quando o tempo acaba ou quando sua vida chega a zero.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-3.5 sm:p-4">
                <h2 className="font-bold text-amber-400 mb-2.5 sm:mb-3">
                  🏝️ Arena
                </h2>

                <div className="space-y-1.5 sm:space-y-2 text-sm text-slate-300 leading-relaxed">
                  <p>
                    As ilhas bloqueiam o movimento dos navios.
                  </p>

                  <p>
                    Os projéteis também não atravessam as áreas bloqueadas.
                  </p>

                  <p>
                    Use o espaço da arena para se posicionar e atacar.
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-3.5 sm:p-4">
                <h2 className="font-bold text-amber-400 mb-2.5 sm:mb-3">
                  📱 Celular
                </h2>

                <div className="space-y-1.5 sm:space-y-2 text-sm text-slate-300 leading-relaxed">
                  <p>
                    No celular, controles virtuais aparecem automaticamente durante a partida.
                  </p>

                  <p>
                    Use as setas para movimentar o navio.
                  </p>

                  <p>
                    Use os botões de canhão para atacar.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="w-full mt-4 sm:mt-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-3 rounded-lg transition"
            >
              Voltar ao Menu
            </button>

            <div className="h-2 sm:h-0" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-10 w-full bg-slate-950 text-white overflow-y-auto overscroll-y-contain touch-pan-y">
      <div className="min-h-full w-full flex items-start justify-center p-3 sm:p-4 pb-8">
        <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-2xl space-y-5 sm:space-y-6 my-2 sm:my-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-wider">
              PIRATE BATTLE
            </h1>

            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest">
              Teste Técnico Naval Shooter
            </p>
          </div>

          <form
            onSubmit={handleStart}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              placeholder="Nome do Capitão"
              value={playerName}
              onChange={(e) =>
                setPlayerName(e.target.value)
              }
              className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              required
            />

            <button
              type="submit"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition"
            >
              Navegar
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setShowOptions(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3 rounded-lg border border-slate-700 transition"
            >
              Options
            </button>

            <button
              type="button"
              onClick={() => setShowInstructions(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3 rounded-lg border border-slate-700 transition"
            >
              Como Jogar
            </button>
          </div>

          <div className="border-b border-slate-800 flex gap-4 overflow-x-auto">
            <button
              type="button"
              onClick={() =>
                setActiveTab('ranking')
              }
              className={`pb-2 text-sm font-semibold transition border-b-2 whitespace-nowrap ${
                activeTab === 'ranking'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Classificação
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveTab('history')
              }
              className={`pb-2 text-sm font-semibold transition border-b-2 whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Histórico de Batalhas
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            {activeTab === 'ranking' && (
              <RankingTable />
            )}

            {activeTab === 'history' && (
              <MatchHistoryTable />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};