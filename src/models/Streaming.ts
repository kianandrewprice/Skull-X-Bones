export interface Stream {
  id: string;
  streamerId: string;
  streamerName: string;
  title: string;
  description?: string;
  category: 'music' | 'gaming' | 'tournament' | 'interview' | 'other';
  thumbnail?: string;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  streamUrl?: string;
  platforms: StreamPlatform[];
  startTime: Date;
  endTime?: Date;
  viewerCount: number;
  peakViewers: number;
  isRecorded: boolean;
  vodUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StreamPlatform {
  platform: 'twitch' | 'youtube' | 'facebook' | 'native';
  platformStreamId?: string;
  platformUrl?: string;
  isActive: boolean;
}

export interface StreamSchedule {
  id: string;
  streamerId: string;
  title: string;
  description?: string;
  scheduledDate: Date;
  duration: number; // in minutes
  category: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
}

export interface VOD {
  id: string;
  streamId?: string;
  title: string;
  description?: string;
  uploaderId: string;
  uploaderName: string;
  duration: number; // in seconds
  thumbnail?: string;
  videoUrl: string;
  views: number;
  likes: number;
  category: string;
  tags: string[];
  isPublic: boolean;
  uploadedAt: Date;
  publishedAt?: Date;
}

export interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  badges?: string[];
  isDeleted: boolean;
}
