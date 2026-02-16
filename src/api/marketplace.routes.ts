import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth';
import { MarketplaceService } from '../services/marketplace/MarketplaceService';
import { writeLimiter } from '../middleware/rateLimiter';

const router = Router();
const marketplaceService = new MarketplaceService();

// Public routes
router.get('/products', async (req, res, next) => {
  try {
    const products = await marketplaceService.getProducts(req.query);
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

router.get('/products/:id', async (req, res, next) => {
  try {
    const product = await marketplaceService.getProductById(req.params.id);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// Protected routes
router.post('/products', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    const product = await marketplaceService.createProduct(req.user!.id, req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

router.get('/cart', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const cart = await marketplaceService.getCart(req.user!.id);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

router.post('/cart/items', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    await marketplaceService.addToCart(req.user!.id, req.body);
    res.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    next(error);
  }
});

router.delete('/cart/items/:itemId', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    await marketplaceService.removeFromCart(req.user!.id, req.params.itemId);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
});

router.post('/orders', authenticate, writeLimiter, async (req: AuthRequest, res, next) => {
  try {
    const order = await marketplaceService.createOrder(req.user!.id, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

router.get('/orders', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const orders = await marketplaceService.getUserOrders(req.user!.id);
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

router.get('/orders/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const order = await marketplaceService.getOrderById(req.params.id);
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

export { router as marketplaceRoutes };
