import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { EsportsService } from '../services/esports/EsportsService';

const router = Router();
const esportsService = new EsportsService();

// Public routes
router.get('/tournaments', async (req, res, next) => {
  try {
    const tournaments = await esportsService.getTournaments(req.query);
    res.json({ success: true, data: tournaments });
  } catch (error) {
    next(error);
  }
});

router.get('/tournaments/:id', async (req, res, next) => {
  try {
    const tournament = await esportsService.getTournamentById(req.params.id);
    res.json({ success: true, data: tournament });
  } catch (error) {
    next(error);
  }
});

router.get('/teams', async (req, res, next) => {
  try {
    const teams = await esportsService.getTeams(req.query);
    res.json({ success: true, data: teams });
  } catch (error) {
    next(error);
  }
});

router.get('/teams/:id', async (req, res, next) => {
  try {
    const team = await esportsService.getTeamById(req.params.id);
    res.json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
});

router.get('/leaderboards/:game', async (req, res, next) => {
  try {
    const leaderboard = await esportsService.getLeaderboard(req.params.game, req.query);
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    next(error);
  }
});

router.get('/matches/:id', async (req, res, next) => {
  try {
    const match = await esportsService.getMatchById(req.params.id);
    res.json({ success: true, data: match });
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.post('/teams', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const team = await esportsService.createTeam(req.user!.id, req.body);
    res.status(201).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
});

router.post('/tournaments', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const tournament = await esportsService.createTournament(req.user!.id, req.body);
    res.status(201).json({ success: true, data: tournament });
  } catch (error) {
    next(error);
  }
});

router.post('/tournaments/:id/register', authenticate, async (req: AuthRequest, res, next) => {
  try {
    await esportsService.registerForTournament(req.params.id, req.body.teamId);
    res.json({ success: true, message: 'Registered successfully' });
  } catch (error) {
    next(error);
  }
});

router.put('/matches/:id/result', authenticate, async (req: AuthRequest, res, next) => {
  try {
    await esportsService.updateMatchResult(req.params.id, req.body);
    res.json({ success: true, message: 'Match result updated' });
  } catch (error) {
    next(error);
  }
});

export { router as esportsRoutes };
