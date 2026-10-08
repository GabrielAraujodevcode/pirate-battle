import React from 'react';

interface HUDProps {
  score: number;
  timeRemaining: number;
  playerHealth: number;
  onPauseToggle: () => void;
  isPaused: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  timeRemaining,
  playerHealth,
  onPauseToggle,
  isPaused,
}) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = Math.floor(timeRemaining % 60);
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <>
      <div className="absolute inset-x-0 top-0 z-50 p-2 sm:p-3 md:p-4 pointer-events-none select-none">
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-between sm:items-center sm:gap-2 md:gap-3">
          <div className="min-w-0 bg-slate-900/90 text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-slate-700 shadow-md">
            <span className="text-[10px] sm:text-xs text-slate-400 block uppercase">
              Vida
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-20 sm:w-32 h-2.5 sm:h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{
                    width: `${Math.max(0, Math.min(100, playerHealth))}%`,
                  }}
                />
              </div>
              <span className="text-xs sm:text-sm font-bold">
                {Math.max(0, Math.ceil(playerHealth))}
              </span>
            </div>
          </div>

          <div className="min-w-0 bg-slate-900/90 text-white px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-slate-700 shadow-md">
            <span className="text-[10px] sm:text-xs text-slate-400 block uppercase">
              Pontuação
            </span>
            <span className="text-lg sm:text-2xl font-bold text-yellow-400">
              {score}
            </span>
          </div>

          <div className="min-w-0 bg-slate-900/90 text-white px-2.5 py-1.5 sm:px-6 sm:py-2 rounded-lg border border-slate-700 shadow-md text-center">
            <span className="text-[10px] sm:text-xs text-slate-400 block uppercase">
              Tempo
            </span>
            <span className="text-lg sm:text-2xl font-mono font-bold text-cyan-400">
              {formattedTime}
            </span>
          </div>

          <button
            type="button"
            onClick={onPauseToggle}
            className="pointer-events-auto min-w-0 bg-slate-800/95 hover:bg-slate-700 text-white font-bold px-3 py-2 sm:px-4 rounded-lg border border-slate-600 transition text-sm sm:text-base"
          >
            {isPaused ? 'Continuar' : 'Pausa'}
          </button>
        </div>
      </div>

      {isPaused && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm pointer-events-auto p-4">
          <div className="w-full max-w-sm text-center bg-slate-900/95 border border-slate-700 rounded-2xl px-6 sm:px-10 py-6 sm:py-8 shadow-2xl">
            <div className="text-4xl sm:text-5xl mb-4">⏸</div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Jogo Pausado
            </h2>

            <p className="text-sm sm:text-base text-slate-400 mb-6">
              A partida está pausada.
            </p>

            <button
              type="button"
              onClick={onPauseToggle}
              className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-6 py-3 rounded-lg transition"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
