import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { UserService } from '../services/user/UserService';
import { writeLimiter, readLimiter } from '../middleware/rateLimiter';

const router = Router();
const userService = new UserService();

router.get('/me', authenticate, readLimiter, async (req: AuthRequest, res, next) => {
  try {
    const user = await userService.getUserById(req.user!.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.put('/me', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    const user = await userService.updateUser(req.user!.id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.post('/verification/request', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    await userService.requestVerification(req.user!.id, req.body);
    res.json({ success: true, message: 'Verification request submitted' });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', readLimiter, async (req, res, next) => {
  try {
    const user = await userService.getPublicProfile(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

export { router as userRoutes };
