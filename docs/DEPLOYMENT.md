# Skull x Bones - Deployment Guide

## Deployment Options

### 1. Docker Deployment (Recommended)

#### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 2GB+ RAM
- 10GB+ storage

#### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/kianandrewprice/Skull-X-Bones.git
cd Skull-X-Bones
```

2. Create environment file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start services:
```bash
docker-compose up -d
```

4. Check service health:
```bash
docker-compose ps
```

5. View logs:
```bash
docker-compose logs -f api
```

#### Production Deployment

For production with NGINX:
```bash
docker-compose --profile production up -d
```

### 2. AWS Deployment

#### Architecture
- **Compute**: ECS Fargate or EC2 with Auto Scaling
- **Database**: RDS PostgreSQL Multi-AZ
- **Cache**: ElastiCache Redis Cluster
- **Storage**: S3 + CloudFront CDN
- **Load Balancer**: Application Load Balancer
- **Monitoring**: CloudWatch

#### Step-by-Step AWS Deployment

**1. Database Setup**
```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier skullxbones-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 14.7 \
  --master-username admin \
  --master-user-password [SECURE_PASSWORD] \
  --allocated-storage 100 \
  --storage-type gp3 \
  --multi-az \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name skullxbones-subnet-group
```

**2. ElastiCache Setup**
```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id skullxbones-redis \
  --cache-node-type cache.t3.medium \
  --engine redis \
  --num-cache-nodes 1 \
  --security-group-ids sg-xxxxx
```

**3. S3 Bucket Setup**
```bash
# Create S3 bucket for media
aws s3 mb s3://skullxbones-media
aws s3api put-bucket-versioning \
  --bucket skullxbones-media \
  --versioning-configuration Status=Enabled
```

**4. ECR Repository**
```bash
# Create ECR repository
aws ecr create-repository --repository-name skullxbones-api

# Build and push Docker image
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin [ACCOUNT].dkr.ecr.us-east-1.amazonaws.com
docker build -t skullxbones-api .
docker tag skullxbones-api:latest [ACCOUNT].dkr.ecr.us-east-1.amazonaws.com/skullxbones-api:latest
docker push [ACCOUNT].dkr.ecr.us-east-1.amazonaws.com/skullxbones-api:latest
```

**5. ECS Cluster**
```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name skullxbones-cluster

# Create task definition (see infrastructure/ecs-task-definition.json)
aws ecs register-task-definition --cli-input-json file://infrastructure/ecs-task-definition.json

# Create service
aws ecs create-service \
  --cluster skullxbones-cluster \
  --service-name skullxbones-api \
  --task-definition skullxbones-api \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=api,containerPort=3000
```

### 3. Kubernetes Deployment

#### Prerequisites
- Kubernetes 1.24+
- kubectl configured
- Helm 3.0+

#### Deploy to Kubernetes

1. Create namespace:
```bash
kubectl create namespace skullxbones
```

2. Create secrets:
```bash
kubectl create secret generic skullxbones-secrets \
  --from-literal=db-password=[PASSWORD] \
  --from-literal=jwt-secret=[SECRET] \
  --from-literal=refresh-token-secret=[SECRET] \
  -n skullxbones
```

3. Deploy PostgreSQL:
```bash
helm install postgres bitnami/postgresql \
  --namespace skullxbones \
  --set auth.database=skull_x_bones \
  --set auth.username=postgres \
  --set auth.existingSecret=skullxbones-secrets \
  --set auth.secretKeys.adminPasswordKey=db-password
```

4. Deploy Redis:
```bash
helm install redis bitnami/redis \
  --namespace skullxbones \
  --set auth.enabled=false
```

5. Deploy application:
```bash
kubectl apply -f infrastructure/k8s/ -n skullxbones
```

### 4. Traditional VPS Deployment

#### Prerequisites
- Ubuntu 20.04+ or similar
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- NGINX

#### Installation Steps

1. **Install dependencies:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install NGINX
sudo apt install -y nginx
```

2. **Setup PostgreSQL:**
```bash
sudo -u postgres psql
CREATE DATABASE skull_x_bones;
CREATE USER skullxbones WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE skull_x_bones TO skullxbones;
\q
```

3. **Clone and setup application:**
```bash
cd /var/www
git clone https://github.com/kianandrewprice/Skull-X-Bones.git
cd Skull-X-Bones
npm install
npm run build
```

4. **Configure environment:**
```bash
cp .env.example .env
nano .env  # Edit configuration
```

5. **Setup PM2 for process management:**
```bash
sudo npm install -g pm2
pm2 start dist/index.js --name skullxbones-api
pm2 save
pm2 startup
```

6. **Configure NGINX:**
```bash
sudo nano /etc/nginx/sites-available/skullxbones
```

Add configuration:
```nginx
server {
    listen 80;
    server_name api.skullxbones.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/skullxbones /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.skullxbones.com
```

## Environment Variables

### Required Variables
- `NODE_ENV`: production
- `PORT`: 3000
- `DB_HOST`: Database host
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Strong random secret
- `REFRESH_TOKEN_SECRET`: Strong random secret

### Optional Variables
- `STRIPE_SECRET_KEY`: For payment processing
- `AWS_ACCESS_KEY_ID`: For S3 storage
- `TWITCH_CLIENT_ID`: For Twitch integration
- `SMTP_USER`: For email notifications

## Monitoring

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# Logs
pm2 logs skullxbones-api

# Docker logs
docker-compose logs -f api
```

### Database Monitoring
```bash
# PostgreSQL connections
SELECT * FROM pg_stat_activity;

# Query performance
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

### Health Checks
```bash
# API health
curl http://localhost:3000/health

# Database
pg_isready -h localhost -p 5432

# Redis
redis-cli ping
```

## Backup Strategy

### Database Backups
```bash
# Daily backup script
pg_dump -h localhost -U skullxbones skull_x_bones | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore from backup
gunzip < backup_20260216.sql.gz | psql -h localhost -U skullxbones skull_x_bones
```

### S3 Backups
- Enable versioning on S3 buckets
- Configure lifecycle policies
- Cross-region replication

## Scaling

### Horizontal Scaling
- Add more API server instances
- Use load balancer to distribute traffic
- Scale database with read replicas

### Vertical Scaling
- Increase server resources
- Optimize database configuration
- Tune connection pools

### Performance Tuning
- Enable Redis caching
- Optimize database queries
- Use CDN for static assets
- Implement rate limiting

## Security Checklist

- [ ] Use strong passwords for all services
- [ ] Enable SSL/TLS encryption
- [ ] Configure firewall rules
- [ ] Set up fail2ban for SSH
- [ ] Regular security updates
- [ ] Backup encryption
- [ ] Environment variable security
- [ ] API rate limiting
- [ ] Database connection limits
- [ ] Regular security audits

## Troubleshooting

### Common Issues

**API won't start:**
- Check environment variables
- Verify database connectivity
- Check port availability
- Review logs

**Database connection errors:**
- Verify credentials
- Check network connectivity
- Ensure PostgreSQL is running
- Review pg_hba.conf settings

**High memory usage:**
- Check for memory leaks
- Optimize queries
- Increase server resources
- Enable query caching

## Support

For deployment support:
- Documentation: https://docs.skullxbones.com
- Community: Discord server
- Enterprise: enterprise@skullxbones.com

---

Last updated: February 16, 2026
