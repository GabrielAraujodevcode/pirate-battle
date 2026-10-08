import React, { useState } from 'react';
import { useMatchHistory } from '../../hooks/useGameApi';

export const MatchHistoryTable: React.FC = () => {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
  } = useMatchHistory(page, 5);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-slate-400">
        A carregar histórico...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-red-400">
        Erro ao carregar o histórico.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 uppercase text-xs">
              <th className="py-2 px-3">
                Data
              </th>

              <th className="py-2 px-3">
                Jogador
              </th>

              <th className="py-2 px-3">
                Pontos
              </th>

              <th className="py-2 px-3">
                Duração
              </th>

              <th className="py-2 px-3">
                Motivo
              </th>
            </tr>
          </thead>

          <tbody>
            {data?.data.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 px-3 text-center text-slate-500"
                >
                  Nenhuma batalha registrada ainda.
                </td>
              </tr>
            ) : (
              data?.data.map((match) => (
              <tr
                key={match.matchId}
                className="border-b border-slate-800 hover:bg-slate-800/50"
              >
                <td className="py-2 px-3 text-slate-400 text-xs">
                  {new Date(
                    match.playedAt
                  ).toLocaleDateString()}
                </td>

                <td className="py-2 px-3 text-white">
                  {match.playerName}
                </td>

                <td className="py-2 px-3 font-mono text-yellow-400">
                  {match.score}
                </td>

                <td className="py-2 px-3 font-mono text-cyan-300">
                  {Math.floor(
                    match.durationSeconds / 60
                  )
                    .toString()
                    .padStart(2, '0')}
                  :
                  {(match.durationSeconds % 60)
                    .toString()
                    .padStart(2, '0')}
                </td>

                <td className="py-2 px-3 text-xs capitalize text-slate-300">
                  {match.endReason.replace(
                    '_',
                    ' '
                  )}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
        <button
          disabled={page <= 1}
          onClick={() =>
            setPage((p) =>
              Math.max(1, p - 1)
            )
          }
          className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 hover:bg-slate-700"
        >
          Anterior
        </button>

        <span>
          Página {data?.page} de{' '}
          {data?.totalPages}
        </span>

        <button
          disabled={
            page >=
            (data?.totalPages || 1)
          }
          onClick={() =>
            setPage((p) => p + 1)
          }
          className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 hover:bg-slate-700"
        >
          Próxima
        </button>
      </div>
    </div>
  );
};