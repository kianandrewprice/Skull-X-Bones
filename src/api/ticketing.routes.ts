import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { TicketingService } from '../services/ticketing/TicketingService';

const router = Router();
const ticketingService = new TicketingService();

// Public routes
router.get('/events', async (req, res, next) => {
  try {
    const events = await ticketingService.getEvents(req.query);
    res.json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
});

router.get('/events/:id', async (req, res, next) => {
  try {
    const event = await ticketingService.getEventById(req.params.id);
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
});

router.get('/events/:id/ticket-types', async (req, res, next) => {
  try {
    const ticketTypes = await ticketingService.getTicketTypes(req.params.id);
    res.json({ success: true, data: ticketTypes });
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.post('/events', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const event = await ticketingService.createEvent(req.user!.id, req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
});

router.post('/events/:id/ticket-types', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const ticketType = await ticketingService.createTicketType(req.params.id, req.body);
    res.status(201).json({ success: true, data: ticketType });
  } catch (error) {
    next(error);
  }
});

router.post('/orders', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const order = await ticketingService.purchaseTickets(req.user!.id, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

router.get('/my-tickets', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const tickets = await ticketingService.getUserTickets(req.user!.id);
    res.json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
});

router.get('/tickets/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const ticket = await ticketingService.getTicketById(req.params.id);
    res.json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
});

router.post('/tickets/:id/validate', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const result = await ticketingService.validateTicket(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

export { router as ticketingRoutes };
