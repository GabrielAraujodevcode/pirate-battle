import axios from 'axios';
import { MatchResultPayload, PaginatedResponse, RankingEntry } from '../types/api';

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

export const gameApi = {
  getRanking: async (page = 1, pageSize = 10) => {
    const { data } = await apiClient.get<PaginatedResponse<RankingEntry>>('/ranking', {
      params: { page, pageSize },
    });
    return data;
  },

  getMatchHistory: async (page = 1, pageSize = 10) => {
    const { data } = await apiClient.get<PaginatedResponse<MatchResultPayload>>('/matches/history', {
      params: { page, pageSize },
    });
    return data;
  },

  submitMatchResult: async (payload: MatchResultPayload) => {
    const { data } = await apiClient.post<MatchResultPayload>('/matches', payload);
    return data;
  },
};