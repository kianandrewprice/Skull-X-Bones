import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { MusicService } from '../services/music/MusicService';
import { writeLimiter, readLimiter } from '../middleware/rateLimiter';

const router = Router();
const musicService = new MusicService();

// Public routes
router.get('/songs', async (req, res, next) => {
  try {
    const songs = await musicService.getSongs(req.query);
    res.json({ success: true, data: songs });
  } catch (error) {
    next(error);
  }
});

router.get('/songs/:id', async (req, res, next) => {
  try {
    const song = await musicService.getSongById(req.params.id);
    res.json({ success: true, data: song });
  } catch (error) {
    next(error);
  }
});

router.get('/rankings', async (req, res, next) => {
  try {
    const rankings = await musicService.getRankings(req.query);
    res.json({ success: true, data: rankings });
  } catch (error) {
    next(error);
  }
});

router.get('/radio/current', async (req, res, next) => {
  try {
    const current = await musicService.getCurrentRadioSong();
    res.json({ success: true, data: current });
  } catch (error) {
    next(error);
  }
});

router.get('/song-wars', async (req, res, next) => {
  try {
    const wars = await musicService.getActiveSongWars();
    res.json({ success: true, data: wars });
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.post('/songs', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    const song = await musicService.createSong(req.user!.id, req.body);
    res.status(201).json({ success: true, data: song });
  } catch (error) {
    next(error);
  }
});

router.post('/songs/:id/play', readLimiter, async (req, res, next) => {
  try {
    await musicService.recordPlay(req.params.id);
    res.json({ success: true, message: 'Play recorded' });
  } catch (error) {
    next(error);
  }
});

router.post('/song-wars/:id/vote', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    await musicService.voteInSongWar(req.params.id, req.user!.id, req.body.songId);
    res.json({ success: true, message: 'Vote recorded' });
  } catch (error) {
    next(error);
  }
});

export { router as musicRoutes };
