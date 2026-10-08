import React from 'react';

interface MobileControlsProps {
  onInputStart: (key: string) => void;
  onInputEnd: (key: string) => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onInputStart,
  onInputEnd,
}) => {
  const buttonProps = (key: string) => ({
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      onInputStart(key);
    },
    onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      onInputEnd(key);
    },
    onPointerCancel: (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      onInputEnd(key);
    },
    onLostPointerCapture: () => onInputEnd(key),
    onContextMenu: (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
  });

  return (
    <div className="fixed inset-0 z-40 pointer-events-none select-none md:hidden touch-none">
      <div
        className="absolute left-3 sm:left-6 pointer-events-auto"
        style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-32 sm:w-36">
          <div />
          <button
            type="button"
            {...buttonProps('w')}
            className="h-11 sm:h-12 rounded-xl bg-slate-900/85 border border-slate-600 text-white text-lg sm:text-xl font-bold active:bg-amber-500 active:text-slate-950 touch-none"
            aria-label="Avançar"
          >
            ▲
          </button>
          <div />

          <button
            type="button"
            {...buttonProps('a')}
            className="h-11 sm:h-12 rounded-xl bg-slate-900/85 border border-slate-600 text-white text-lg sm:text-xl font-bold active:bg-amber-500 active:text-slate-950 touch-none"
            aria-label="Virar para esquerda"
          >
            ◀
          </button>

          <button
            type="button"
            {...buttonProps('s')}
            className="h-11 sm:h-12 rounded-xl bg-slate-900/85 border border-slate-600 text-white text-lg sm:text-xl font-bold active:bg-amber-500 active:text-slate-950 touch-none"
            aria-label="Ré"
          >
            ▼
          </button>

          <button
            type="button"
            {...buttonProps('d')}
            className="h-11 sm:h-12 rounded-xl bg-slate-900/85 border border-slate-600 text-white text-lg sm:text-xl font-bold active:bg-amber-500 active:text-slate-950 touch-none"
            aria-label="Virar para direita"
          >
            ▶
          </button>
        </div>
      </div>

      <div
        className="absolute right-3 sm:right-6 flex flex-col gap-2 sm:gap-3 pointer-events-auto"
        style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          {...buttonProps(' ')}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/90 border-2 border-amber-300 text-slate-950 font-extrabold text-[10px] sm:text-sm shadow-lg active:bg-amber-300 touch-none"
          aria-label="Disparo frontal"
        >
          CANHÃO
        </button>

        <button
          type="button"
          {...buttonProps('e')}
          className="w-16 h-12 sm:w-20 sm:h-16 rounded-xl bg-slate-900/90 border border-slate-500 text-white font-extrabold text-[10px] sm:text-xs shadow-lg active:bg-slate-700 touch-none"
          aria-label="Disparo lateral"
        >
          LATERAL
        </button>
      </div>
    </div>
  );
};
