import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './config/db.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport.js';
import { generalLimiter, authLimiter, submissionLimiter } from './middleware/rateLimiter.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import challengeRoutes from './routes/challenge.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import progressRoutes from './routes/progress.routes.js';
import astRoutes from './routes/ast.routes.js';
import translationRoutes from './routes/translation.routes.js';
import complexityRoutes from './routes/complexity.routes.js';
import telemetryRoutes from './routes/telemetry.routes.js';
import adminRoutes from './routes/admin.routes.js';
import playgroundRoutes from './routes/playground.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Disable for dev; enable in production
}));
app.use(mongoSanitize());
app.use(generalLimiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body Parsing with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'omnicode_session_secret_2024',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Mount Routes with rate limiters
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/submit', submissionLimiter, submissionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ast', astRoutes);
app.use('/api/translate', translationRoutes);
app.use('/api/complexity', complexityRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/playground', playgroundRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: Date.now() }));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

const server = app.listen(PORT, () => {
  console.log(`OmniCode Server running on port ${PORT}`);
});

// Fix for Node.js >= 18 HTTP Keep-Alive proxy ECONNRESET race condition
// Express default is 5 seconds, which causes Vite proxy to fail if user idles on login page
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
