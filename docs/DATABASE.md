# Skull x Bones - Database Schema

## Overview

The Skull x Bones platform uses PostgreSQL as the primary relational database. This document outlines the complete database schema including tables, relationships, and indexes.

## Entity Relationship Diagram

```
users ──┬──< verification_requests
        ├──< songs
        ├──< teams
        ├──< team_members
        ├──< tournaments
        ├──< products
        ├──< orders
        ├──< events
        ├──< tickets
        ├──< streams
        ├──< vods
        ├──< forums
        ├──< threads
        └──< posts

songs ──┬──< music_rankings
        ├──< radio_rotations
        └──< song_war_participants

tournaments ──< matches
teams ──< matches

events ──┬──< ticket_types
         └──< tickets

streams ──< chat_messages

forums ──< threads
threads ──< posts
```

## Core Tables

### users
Primary user accounts table.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  bio TEXT,
  avatar TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  verification_type VARCHAR(20),
  verification_status VARCHAR(20) NOT NULL DEFAULT 'none',
  reputation INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CHECK (role IN ('user', 'admin', 'moderator')),
  CHECK (verification_type IN ('artist', 'esports_team', 'label', 'collective')),
  CHECK (verification_status IN ('pending', 'verified', 'rejected', 'none'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_verification_type ON users(verification_type);
```

### verification_requests
User verification requests.

```sql
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  verification_type VARCHAR(20) NOT NULL,
  documents JSONB,
  additional_info TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CHECK (verification_type IN ('artist', 'esports_team', 'label', 'collective')),
  CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX idx_verification_user ON verification_requests(user_id);
CREATE INDEX idx_verification_status ON verification_requests(status);
```

## Music Platform Tables

### songs
Music tracks.

```sql
CREATE TABLE songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artist_name VARCHAR(255) NOT NULL,
  duration INTEGER NOT NULL,
  genre TEXT[],
  cover_art TEXT,
  audio_url TEXT NOT NULL,
  release_date TIMESTAMP NOT NULL,
  plays INTEGER NOT NULL DEFAULT 0,
  likes INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  ranking_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_songs_artist ON songs(artist_id);
CREATE INDEX idx_songs_genre ON songs USING GIN(genre);
CREATE INDEX idx_songs_ranking ON songs(ranking_points DESC);
CREATE INDEX idx_songs_plays ON songs(plays DESC);
```

### music_rankings
Billboard-style rankings.

```sql
CREATE TABLE music_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  previous_rank INTEGER,
  category VARCHAR(20) NOT NULL,
  period VARCHAR(20) NOT NULL,
  points INTEGER NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CHECK (category IN ('overall', 'genre', 'new', 'trending')),
  CHECK (period IN ('daily', 'weekly', 'monthly', 'allTime')),
  UNIQUE (song_id, category, period)
);

CREATE INDEX idx_rankings_category_period ON music_rankings(category, period, rank);
```

### radio_rotations
Radio bot song rotations.

```sql
CREATE TABLE radio_rotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  played_at TIMESTAMP,
  scheduled_for TIMESTAMP,
  rotation VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'queued',
  
  CHECK (rotation IN ('heavy', 'medium', 'light')),
  CHECK (status IN ('queued', 'playing', 'completed'))
);

CREATE INDEX idx_radio_status ON radio_rotations(status);
CREATE INDEX idx_radio_scheduled ON radio_rotations(scheduled_for);
```

### song_wars
Song battle voting system.

```sql
CREATE TABLE song_wars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  song1_id UUID NOT NULL REFERENCES songs(id),
  song2_id UUID NOT NULL REFERENCES songs(id),
  song1_votes INTEGER NOT NULL DEFAULT 0,
  song2_votes INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  winner_id UUID REFERENCES songs(id),
  
  CHECK (status IN ('active', 'completed', 'scheduled'))
);

CREATE INDEX idx_song_wars_status ON song_wars(status);
```

## Esports Platform Tables

### teams
Esports teams.

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  tag VARCHAR(10) NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id),
  game VARCHAR(100) NOT NULL,
  logo TEXT,
  description TEXT,
  founded TIMESTAMP NOT NULL,
  disbanded TIMESTAMP,
  total_wins INTEGER NOT NULL DEFAULT 0,
  total_losses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_teams_game ON teams(game);
CREATE INDEX idx_teams_owner ON teams(owner_id);
```

### team_members
Team rosters.

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  left_at TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  CHECK (role IN ('captain', 'player', 'coach', 'manager')),
  UNIQUE (team_id, user_id, is_active)
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
```

### tournaments
Esports tournaments.

```sql
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  game VARCHAR(100) NOT NULL,
  organizer_id UUID NOT NULL REFERENCES users(id),
  format VARCHAR(30) NOT NULL,
  max_teams INTEGER NOT NULL,
  prize_pool DECIMAL(10, 2),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  registration_deadline TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'registration',
  rules TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CHECK (format IN ('single_elimination', 'double_elimination', 'round_robin', 'swiss')),
  CHECK (status IN ('registration', 'ongoing', 'completed', 'cancelled'))
);

CREATE INDEX idx_tournaments_game ON tournaments(game);
CREATE INDEX idx_tournaments_status ON tournaments(status);
```

### tournament_participants
Teams registered for tournaments.

```sql
CREATE TABLE tournament_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  registered_at TIMESTAMP NOT NULL DEFAULT NOW(),
  seed INTEGER,
  
  UNIQUE (tournament_id, team_id)
);
```

### matches
Tournament matches.

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  team1_id UUID NOT NULL REFERENCES teams(id),
  team2_id UUID NOT NULL REFERENCES teams(id),
  team1_score INTEGER,
  team2_score INTEGER,
  scheduled_at TIMESTAMP NOT NULL,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  winner_id UUID REFERENCES teams(id),
  stream_url TEXT,
  
  CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled'))
);

CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_status ON matches(status);
```

### leaderboards
Game leaderboards.

```sql
CREATE TABLE leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game VARCHAR(100) NOT NULL,
  period VARCHAR(20) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CHECK (period IN ('daily', 'weekly', 'monthly', 'season', 'allTime')),
  UNIQUE (game, period)
);

CREATE TABLE leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leaderboard_id UUID NOT NULL REFERENCES leaderboards(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  previous_rank INTEGER,
  team_id UUID NOT NULL REFERENCES teams(id),
  points INTEGER NOT NULL,
  wins INTEGER NOT NULL,
  losses INTEGER NOT NULL,
  
  UNIQUE (leaderboard_id, team_id)
);

CREATE INDEX idx_leaderboard_entries_rank ON leaderboard_entries(leaderboard_id, rank);
```

## Marketplace Tables

### products
Marketplace products.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES users(id),
  vendor_type VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(30) NOT NULL,
  images TEXT[],
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  stock INTEGER NOT NULL DEFAULT 0,
  sku VARCHAR(50) UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CHECK (vendor_type IN ('artist', 'team', 'label', 'collective')),
  CHECK (category IN ('merchandise', 'digital', 'music', 'tickets', 'other'))
);

CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
```

### product_variants
Product variations (size, color, etc.).

```sql
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  options JSONB NOT NULL,
  price DECIMAL(10, 2),
  stock INTEGER NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
```

## Additional tables for Ticketing, Streaming, and Forums are structured similarly...

## Indexes Strategy

### Primary Indexes
- All tables have UUID primary keys with indexes
- Foreign key columns are indexed

### Performance Indexes
- Frequently queried fields (status, dates, categories)
- Full-text search on text fields
- GIN indexes for array and JSONB fields

### Composite Indexes
- Multi-column queries (e.g., category + period)
- Unique constraints on logical combinations

## Maintenance

### Regular Tasks
- VACUUM ANALYZE weekly
- Reindex monthly
- Partition large tables by date
- Archive old data quarterly

---

This schema is designed for scalability, performance, and data integrity while supporting all features of the Skull x Bones ecosystem.
