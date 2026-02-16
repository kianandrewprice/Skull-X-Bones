export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  duration: number; // in seconds
  genre: string[];
  coverArt?: string;
  audioUrl: string;
  releaseDate: Date;
  plays: number;
  likes: number;
  shares: number;
  rankingPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicRanking {
  id: string;
  songId: string;
  rank: number;
  previousRank?: number;
  category: 'overall' | 'genre' | 'new' | 'trending';
  period: 'daily' | 'weekly' | 'monthly' | 'allTime';
  points: number;
  updatedAt: Date;
}

export interface RadioRotation {
  id: string;
  songId: string;
  position: number;
  playedAt?: Date;
  scheduledFor?: Date;
  rotation: 'heavy' | 'medium' | 'light';
  status: 'queued' | 'playing' | 'completed';
}

export interface SongWar {
  id: string;
  title: string;
  song1Id: string;
  song2Id: string;
  song1Votes: number;
  song2Votes: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'scheduled';
  winnerId?: string;
}
