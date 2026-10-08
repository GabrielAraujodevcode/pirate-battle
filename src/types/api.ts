export type MatchEndReason = 'time_expired' | 'player_destroyed' | 'abandoned';

export interface GameSnapshotConfig {
  sessionDurationSeconds: number;
  enemySpawnIntervalSeconds: number;
}

export interface MatchResultPayload {
  matchId: string;
  playerId: string;
  playerName: string;
  score: number;
  durationSeconds: number;
  endReason: MatchEndReason;
  playedAt: string;
  config: GameSnapshotConfig;
}

export interface RankingEntry {
  rank: number;
  playerId: string;
  playerName: string;
  highScore: number;
  matchesPlayed: number;
  lastPlayedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}