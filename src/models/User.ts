export interface User {
  id: string;
  email: string;
  password?: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  verificationType?: 'artist' | 'esports_team' | 'label' | 'collective';
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'none';
  reputation: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Artist extends User {
  verificationType: 'artist';
  genre?: string[];
  streamingLinks?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
    soundcloud?: string;
  };
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export interface EsportsTeam extends User {
  verificationType: 'esports_team';
  games?: string[];
  teamSize?: number;
  founded?: Date;
  achievements?: string[];
}

export interface Label extends User {
  verificationType: 'label';
  roster?: string[]; // Array of artist IDs
  established?: Date;
  website?: string;
}

export interface Collective extends User {
  verificationType: 'collective';
  members?: string[]; // Array of user IDs
  description?: string;
  website?: string;
}
