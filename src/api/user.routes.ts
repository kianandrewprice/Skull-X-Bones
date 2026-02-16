import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { UserService } from '../services/user/UserService';

const router = Router();
const userService = new UserService();

router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await userService.getUserById(req.user!.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.put('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await userService.updateUser(req.user!.id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.post('/verification/request', authenticate, async (req: AuthRequest, res, next) => {
  try {
    await userService.requestVerification(req.user!.id, req.body);
    res.json({ success: true, message: 'Verification request submitted' });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await userService.getPublicProfile(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

export { router as userRoutes };
