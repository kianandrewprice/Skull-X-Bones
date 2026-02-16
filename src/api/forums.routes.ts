import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { ForumsService } from '../services/forums/ForumsService';
import { writeLimiter } from '../middleware/rateLimiter';

const router = Router();
const forumsService = new ForumsService();

// Public routes
router.get('/', async (req, res, next) => {
  try {
    const forums = await forumsService.getForums(req.query);
    res.json({ success: true, data: forums });
  } catch (error) {
    next(error);
  }
});

router.get('/:forumId/threads', async (req, res, next) => {
  try {
    const threads = await forumsService.getThreads(req.params.forumId, req.query);
    res.json({ success: true, data: threads });
  } catch (error) {
    next(error);
  }
});

router.get('/threads/:threadId', async (req, res, next) => {
  try {
    const thread = await forumsService.getThreadById(req.params.threadId);
    res.json({ success: true, data: thread });
  } catch (error) {
    next(error);
  }
});

router.get('/threads/:threadId/posts', async (req, res, next) => {
  try {
    const posts = await forumsService.getPosts(req.params.threadId, req.query);
    res.json({ success: true, data: posts });
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.post('/', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    const forum = await forumsService.createForum(req.user!.id, req.body);
    res.status(201).json({ success: true, data: forum });
  } catch (error) {
    next(error);
  }
});

router.post('/:forumId/threads', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    const thread = await forumsService.createThread(req.params.forumId, req.user!.id, req.body);
    res.status(201).json({ success: true, data: thread });
  } catch (error) {
    next(error);
  }
});

router.post('/threads/:threadId/posts', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    const post = await forumsService.createPost(req.params.threadId, req.user!.id, req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
});

router.post('/posts/:postId/like', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    await forumsService.likePost(req.params.postId, req.user!.id);
    res.json({ success: true, message: 'Post liked' });
  } catch (error) {
    next(error);
  }
});

router.get('/users/:userId/reputation', async (req, res, next) => {
  try {
    const reputation = await forumsService.getUserReputation(req.params.userId);
    res.json({ success: true, data: reputation });
  } catch (error) {
    next(error);
  }
});

export { router as forumsRoutes };
