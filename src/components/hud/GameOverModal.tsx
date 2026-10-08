import React from 'react';

interface GameOverModalProps {
  score: number;
  reason: 'time_expired' | 'player_destroyed' | 'abandoned';
  onRestart: () => void;
  onReturnToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  reason,
  onRestart,
  onReturnToMenu,
}) => {
  const reasonText = {
    time_expired: 'O Tempo Esgotou-se!',
    player_destroyed: 'O Teu Navio Foi Afundado!',
    abandoned: 'Batalha Abandonada',
  }[reason];

  return (
    <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl max-w-sm w-full text-center space-y-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-red-500">{reasonText}</h2>

        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
          <span className="text-xs text-slate-400 block uppercase">Pontuação Final</span>
          <span className="text-4xl font-bold text-yellow-400">{score}</span>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onRestart}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition"
          >
            Jogar Novamente
          </button>
          <button
            onClick={onReturnToMenu}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
          >
            Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
};