import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gameApi } from '../services/api';
import { MatchResultPayload } from '../types/api';

// Hook para buscar o Ranking Paginado
export function useRanking(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ['ranking', page, pageSize],
    queryFn: () => gameApi.getRanking(page, pageSize),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

// Hook para buscar o Histórico de Partidas Paginado
export function useMatchHistory(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ['matchHistory', page, pageSize],
    queryFn: () => gameApi.getMatchHistory(page, pageSize),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

// Hook para registrar o resultado da partida e invalidar o cache das duas abas
export function useSubmitMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MatchResultPayload) => gameApi.submitMatchResult(payload),
    onSuccess: () => {
      // Atualiza automaticamente o Ranking e o Histórico ao enviar uma nova partida
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      queryClient.invalidateQueries({ queryKey: ['matchHistory'] });
    },
  });
}