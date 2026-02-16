import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { StreamingService } from '../services/streaming/StreamingService';
import { writeLimiter } from '../middleware/rateLimiter';

const router = Router();
const streamingService = new StreamingService();

// Public routes
router.get('/live', async (req, res, next) => {
  try {
    const liveStreams = await streamingService.getLiveStreams(req.query);
    res.json({ success: true, data: liveStreams });
  } catch (error) {
    next(error);
  }
});

router.get('/streams/:id', async (req, res, next) => {
  try {
    const stream = await streamingService.getStreamById(req.params.id);
    res.json({ success: true, data: stream });
  } catch (error) {
    next(error);
  }
});

router.get('/vods', async (req, res, next) => {
  try {
    const vods = await streamingService.getVODs(req.query);
    res.json({ success: true, data: vods });
  } catch (error) {
    next(error);
  }
});

router.get('/vods/:id', async (req, res, next) => {
  try {
    const vod = await streamingService.getVODById(req.params.id);
    res.json({ success: true, data: vod });
  } catch (error) {
    next(error);
  }
});

router.get('/schedule', async (req, res, next) => {
  try {
    const schedule = await streamingService.getStreamSchedule(req.query);
    res.json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.post('/streams', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    const stream = await streamingService.createStream(req.user!.id, req.body);
    res.status(201).json({ success: true, data: stream });
  } catch (error) {
    next(error);
  }
});

router.put('/streams/:id/status', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    await streamingService.updateStreamStatus(req.params.id, req.body.status);
    res.json({ success: true, message: 'Stream status updated' });
  } catch (error) {
    next(error);
  }
});

router.post('/streams/:id/chat', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    await streamingService.sendChatMessage(req.params.id, req.user!.id, req.body.message);
    res.json({ success: true, message: 'Message sent' });
  } catch (error) {
    next(error);
  }
});

router.post('/vods', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    const vod = await streamingService.uploadVOD(req.user!.id, req.body);
    res.status(201).json({ success: true, data: vod });
  } catch (error) {
    next(error);
  }
});

export { router as streamingRoutes };
