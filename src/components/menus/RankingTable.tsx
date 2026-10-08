import React, { useState } from 'react';
import { useRanking } from '../../hooks/useGameApi';

export const RankingTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useRanking(page, 5);

  if (isLoading) return <div className="text-center py-8 text-slate-400">A carregar classificação...</div>;
  if (isError) return <div className="text-center py-8 text-red-400">Erro ao carregar o ranking.</div>;

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400 uppercase text-xs">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Jogador</th>
              <th className="py-2 px-3 text-right">Recorde</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-8 px-3 text-center text-slate-500"
                >
                  Nenhum resultado registrado ainda.
                </td>
              </tr>
            ) : (
              data?.data.map((entry) => (
              <tr key={entry.playerId} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="py-2 px-3 font-bold text-yellow-400">{entry.rank}</td>
                <td className="py-2 px-3 text-white">{entry.playerName}</td>
                <td className="py-2 px-3 text-right font-mono text-cyan-300">{entry.highScore}</td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-xs text-slate-400 pt-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 hover:bg-slate-700"
        >
          Anterior
        </button>
        <span>Página {data?.page} de {data?.totalPages}</span>
        <button
          disabled={page >= (data?.totalPages || 1)}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-slate-800 rounded disabled:opacity-50 hover:bg-slate-700"
        >
          Próxima
        </button>
      </div>
    </div>
  );
};