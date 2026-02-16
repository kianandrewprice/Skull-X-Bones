export interface Team {
  id: string;
  name: string;
  tag: string;
  ownerId: string;
  game: string;
  logo?: string;
  description?: string;
  members: TeamMember[];
  founded: Date;
  disbanded?: Date;
  totalWins: number;
  totalLosses: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  role: 'captain' | 'player' | 'coach' | 'manager';
  joinedAt: Date;
  leftAt?: Date;
  isActive: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  game: string;
  organizerId: string;
  format: 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
  maxTeams: number;
  prizePool?: number;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  status: 'registration' | 'ongoing' | 'completed' | 'cancelled';
  rules?: string;
  participants: string[]; // Team IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  team1Id: string;
  team2Id: string;
  team1Score?: number;
  team2Score?: number;
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  winnerId?: string;
  streamUrl?: string;
}

export interface Leaderboard {
  id: string;
  game: string;
  period: 'daily' | 'weekly' | 'monthly' | 'season' | 'allTime';
  entries: LeaderboardEntry[];
  updatedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  previousRank?: number;
  teamId: string;
  teamName: string;
  points: number;
  wins: number;
  losses: number;
}
