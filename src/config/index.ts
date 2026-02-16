export const config = {
  app: {
    name: 'Skull x Bones Ecosystem',
    version: process.env.API_VERSION || 'v1',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10)
  },
  
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'skull_x_bones',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || ''
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'
  },
  
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackUrl: process.env.GOOGLE_CALLBACK_URL || ''
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
      callbackUrl: process.env.DISCORD_CALLBACK_URL || ''
    }
  },
  
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.S3_BUCKET || 'skull-x-bones-media'
  },
  
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
  },
  
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@skullxbones.com'
  },
  
  streaming: {
    twitch: {
      clientId: process.env.TWITCH_CLIENT_ID || '',
      clientSecret: process.env.TWITCH_CLIENT_SECRET || ''
    },
    youtube: {
      apiKey: process.env.YOUTUBE_API_KEY || ''
    }
  },
  
  radioBot: {
    token: process.env.RADIO_BOT_TOKEN || '',
    rotationInterval: parseInt(process.env.RADIO_ROTATION_INTERVAL || '300000', 10)
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10) * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001'
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log'
  }
};
