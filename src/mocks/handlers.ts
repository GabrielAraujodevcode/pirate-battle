import { http, HttpResponse } from 'msw';

import {
  MatchResultPayload,
  PaginatedResponse,
  RankingEntry,
} from '../types/api';

const STORAGE_KEY_MATCHES = 'pirate_battle_matches';

function getStoredMatches(): MatchResultPayload[] {
  const data = localStorage.getItem(STORAGE_KEY_MATCHES);

  if (!data) {
    return [];
  }

  try {
    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? (parsed as MatchResultPayload[]) : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY_MATCHES);
    return [];
  }
}

function saveMatch(
  match: MatchResultPayload
): { match: MatchResultPayload; created: boolean } {
  const matches = getStoredMatches();
  const existing = matches.find((item) => item.matchId === match.matchId);

  if (existing) {
    return { match: existing, created: false };
  }

  matches.push(match);
  localStorage.setItem(STORAGE_KEY_MATCHES, JSON.stringify(matches));

  return { match, created: true };
}

function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
  const startIndex = (safePage - 1) * safePageSize;

  return {
    data: items.slice(startIndex, startIndex + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    totalPages,
    totalItems,
  };
}

export const handlers = [
  http.get('/api/ranking', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10');

    const rankingMap = new Map<string, RankingEntry>();

    for (const match of getStoredMatches()) {
      const current = rankingMap.get(match.playerId);

      if (!current) {
        rankingMap.set(match.playerId, {
          rank: 0,
          playerId: match.playerId,
          playerName: match.playerName,
          highScore: match.score,
          matchesPlayed: 1,
          lastPlayedAt: match.playedAt,
        });
        continue;
      }

      current.matchesPlayed += 1;

      if (match.score > current.highScore) {
        current.highScore = match.score;
      }

      if (
        new Date(match.playedAt).getTime() >
        new Date(current.lastPlayedAt).getTime()
      ) {
        current.lastPlayedAt = match.playedAt;
      }
    }

    const sortedRanking = Array.from(rankingMap.values()).sort(
      (a, b) =>
        b.highScore - a.highScore ||
        a.playerName.localeCompare(b.playerName)
    );

    sortedRanking.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return HttpResponse.json<PaginatedResponse<RankingEntry>>(
      paginate(sortedRanking, page, pageSize)
    );
  }),

  http.post('/api/matches', async ({ request }) => {
    const match = (await request.json()) as MatchResultPayload;
    const saved = saveMatch(match);

    return HttpResponse.json(saved.match, {
      status: saved.created ? 201 : 200,
    });
  }),

  http.get('/api/matches/history', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10');

    const matches = getStoredMatches().sort(
      (a, b) =>
        new Date(b.playedAt).getTime() -
        new Date(a.playedAt).getTime()
    );

    return HttpResponse.json<PaginatedResponse<MatchResultPayload>>(
      paginate(matches, page, pageSize)
    );
  }),
];
