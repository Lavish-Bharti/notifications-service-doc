import express, { Request, Response } from 'express';
import cors from 'cors';
import { notificationsDb, Notification } from './data';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*', // Allow all origins for the playground
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Version']
}));

app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Authentication middleware check (for playground demonstration)
const checkAuth = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  const apiKeyHeader = req.headers['x-api-key'];

  if (!authHeader && !apiKeyHeader) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication credentials missing. Provide a Bearer Token or X-API-Key header."
    });
  }

  // Acceptance of any mock key for playground ease
  next();
};

// GET /evaluation-service/notifications
app.get('/evaluation-service/notifications', checkAuth, (req: Request, res: Response) => {
  const { type, recipient, limit } = req.query;
  let results = [...notificationsDb];

  if (type) {
    results = results.filter(n => n.Type.toLowerCase() === (type as string).toLowerCase());
  }

  if (recipient) {
    results = results.filter(n => n.Recipient?.toLowerCase() === (recipient as string).toLowerCase());
  }

  if (limit) {
    const parsedLimit = parseInt(limit as string, 10);
    if (!isNaN(parsedLimit)) {
      results = results.slice(0, parsedLimit);
    }
  }

  // Introduce brief mock latency to simulate real network responses in playground
  setTimeout(() => {
    res.status(200).json({ notifications: results });
  }, 80);
});

// POST /evaluation-service/notifications
app.post('/evaluation-service/notifications', checkAuth, (req: Request, res: Response) => {
  const { Type, Message, Recipient } = req.body;

  if (!Type || !Message || !Recipient) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Missing required fields: Type, Message, and Recipient are mandatory."
    });
  }

  const validTypes = ['Result', 'System', 'Alert', 'Maintenance'];
  if (!validTypes.includes(Type)) {
    return res.status(400).json({
      error: "Bad Request",
      message: `Invalid notification Type. Must be one of: ${validTypes.join(', ')}`
    });
  }

  const newNotification: Notification = {
    ID: crypto.randomUUID(),
    Type: Type as any,
    Message,
    Timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    Recipient,
    Status: 'sent'
  };

  notificationsDb.unshift(newNotification);

  setTimeout(() => {
    res.status(201).json(newNotification);
  }, 100);
});

// GET /evaluation-service/health
app.get('/evaluation-service/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: "operational",
      emailGateway: "operational",
      smsGateway: "operational",
      pushGateway: "operational"
    },
    latency: {
      dbResponseMs: 12,
      averageReqLatencyMs: 78
    }
  });
});

// GET /evaluation-service/stats (Usage statistics for dashboard)
app.get('/evaluation-service/stats', (req: Request, res: Response) => {
  res.status(200).json({
    totalRequests24h: 18402,
    successRate: 99.82,
    averageLatencyMs: 78,
    errorRate: 0.18,
    trafficDistribution: [
      { name: '00:00', requests: 450, latency: 72 },
      { name: '04:00', requests: 210, latency: 68 },
      { name: '08:00', requests: 890, latency: 85 },
      { name: '12:00', requests: 1540, latency: 95 },
      { name: '16:00', requests: 1210, latency: 80 },
      { name: '20:00', requests: 980, latency: 74 }
    ],
    endpointUsage: [
      { path: 'GET /notifications', count: 12450, percentage: 67.6 },
      { path: 'POST /notifications', count: 5210, percentage: 28.3 },
      { path: 'GET /health', count: 742, percentage: 4.1 }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`[Notification Service] Backend is running at http://localhost:${PORT}`);
});
