import React from 'react';

interface LoadingScreenProps {
  progress: number;
  error?: string;
  onRetry?: () => void;
}

export const LoadingScreen: React.FC<
  LoadingScreenProps
> = ({
  progress,
  error,
  onRetry,
}) => {
  const percentage = Math.round(
    Math.max(0, Math.min(1, progress)) * 100
  );

  return (
    <div className="w-screen h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-amber-400 tracking-wider">
            PIRATE BATTLE
          </h1>

          <p className="text-sm text-slate-400 mt-2">
            Carregando recursos da batalha...
          </p>
        </div>

        {!error ? (
          <>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-200"
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            <p className="text-center text-sm text-slate-400 mt-3">
              {percentage}%
            </p>
          </>
        ) : (
          <div className="space-y-4">
            <div
              role="alert"
              className="bg-red-950/50 border border-red-800 text-red-300 rounded-lg p-4 text-sm"
            >
              {error}
            </div>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-3 rounded-lg transition"
              >
                Tentar novamente
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};