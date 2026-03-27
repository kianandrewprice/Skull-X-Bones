import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { musicRoutes } from './api/music.routes';
import { esportsRoutes } from './api/esports.routes';
import { marketplaceRoutes } from './api/marketplace.routes';
import { ticketingRoutes } from './api/ticketing.routes';
import { streamingRoutes } from './api/streaming.routes';
import { forumsRoutes } from './api/forums.routes';
import { authRoutes } from './api/auth.routes';
import { userRoutes } from './api/user.routes';

dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Skull x Bones Ecosystem',
    version: config.app.version,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/music', musicRoutes);
app.use('/api/v1/esports', esportsRoutes);
app.use('/api/v1/marketplace', marketplaceRoutes);
app.use('/api/v1/ticketing', ticketingRoutes);
app.use('/api/v1/streaming', streamingRoutes);
app.use('/api/v1/forums', forumsRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.app.port;
app.listen(PORT, () => {
  logger.info(`🚀 Skull x Bones Ecosystem running on port ${PORT}`);
  logger.info(`📍 Environment: ${config.app.env}`);
  logger.info(`🔗 API Version: ${config.app.version}`);
});

export default app;
