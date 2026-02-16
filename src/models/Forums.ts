export interface Forum {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'general' | 'music' | 'esports' | 'support' | 'official';
  ownerId?: string; // For artist/team forums
  icon?: string;
  isOfficial: boolean;
  isLocked: boolean;
  threadCount: number;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Thread {
  id: string;
  forumId: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  views: number;
  replyCount: number;
  lastReplyAt?: Date;
  lastReplyBy?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  content: string;
  parentPostId?: string; // For nested replies
  likes: number;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumModerator {
  forumId: string;
  userId: string;
  permissions: ModeratorPermission[];
  assignedAt: Date;
}

export type ModeratorPermission = 
  | 'pin_threads'
  | 'lock_threads'
  | 'delete_posts'
  | 'ban_users'
  | 'edit_posts'
  | 'manage_tags';

export interface UserReputation {
  userId: string;
  points: number;
  level: number;
  badges: ReputationBadge[];
  postCount: number;
  threadCount: number;
  likesReceived: number;
  updatedAt: Date;
}

export interface ReputationBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}
