import User from '../models/User.js';
import Challenge from '../models/Challenge.js';
import Submission from '../models/Submission.js';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * @route GET /api/admin/stats
 * @desc Get real-time admin dashboard statistics
 * @access Admin only
 */
export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalChallenges, totalSubmissions, recentSubmissions, acceptedSubmissions] = await Promise.all([
      User.countDocuments(),
      Challenge.countDocuments(),
      Submission.countDocuments(),
      Submission.countDocuments({ submittedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      Submission.countDocuments({ status: 'Accepted' })
    ]);

    const activeUsers = await User.countDocuments({ 
      updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.status(200).json({
      totalUsers,
      activeUsersThisWeek: activeUsers,
      totalChallenges,
      totalSubmissions,
      submissionsToday: recentSubmissions,
      acceptedSubmissions,
      acceptanceRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
};

/**
 * @route GET /api/admin/health
 * @desc Check health of all services (backend, Judge0, microservice, Ollama)
 * @access Admin only
 */
export const getSystemHealth = async (req, res) => {
  const health = {
    backend: { status: 'healthy', latency: 0 },
    database: { status: 'unknown', latency: 0 },
    judge0: { status: 'unknown', latency: 0 },
    microservice: { status: 'unknown', latency: 0 },
    ollama: { status: 'unknown', latency: 0 }
  };

  // Check Database
  try {
    const dbStart = Date.now();
    await User.findOne().lean();
    health.database = { status: 'healthy', latency: Date.now() - dbStart };
  } catch (e) {
    health.database = { status: 'unhealthy', latency: 0, error: e.message };
  }

  // Check Judge0
  try {
    const j0Start = Date.now();
    await axios.get(`${process.env.JUDGE0_API_URL || 'http://localhost:2358'}/about`, { timeout: 5000 });
    health.judge0 = { status: 'healthy', latency: Date.now() - j0Start };
  } catch (e) {
    health.judge0 = { status: 'unhealthy', latency: 0, error: 'Judge0 not reachable. Start Docker.' };
  }

  // Check Microservice
  try {
    const msStart = Date.now();
    await axios.get(`${process.env.MICROSERVICE_URL || 'http://localhost:8000'}/health`, { timeout: 5000 });
    health.microservice = { status: 'healthy', latency: Date.now() - msStart };
  } catch (e) {
    health.microservice = { status: 'unhealthy', latency: 0, error: 'Microservice not running' };
  }

  // Check Ollama
  try {
    const olStart = Date.now();
    const olRes = await axios.get('http://localhost:11434/api/tags', { timeout: 3000 });
    const models = olRes.data?.models?.map(m => m.name) || [];
    health.ollama = { status: 'healthy', latency: Date.now() - olStart, models };
  } catch (e) {
    health.ollama = { status: 'unhealthy', latency: 0, error: 'Ollama not running' };
  }

  res.status(200).json(health);
};

/**
 * @route POST /api/admin/reseed
 * @desc Re-seed the challenges database
 * @access Admin only
 */
export const reseedDatabase = async (req, res) => {
  try {
    const { stdout, stderr } = await execAsync('node seed/seed.js', {
      cwd: process.cwd(),
      timeout: 30000
    });
    res.status(200).json({ message: 'Database re-seeded successfully', output: stdout });
  } catch (error) {
    console.error('Reseed error:', error);
    res.status(500).json({ error: 'Failed to reseed database', details: error.message });
  }
};

/**
 * @route DELETE /api/admin/submissions
 * @desc Clear all submissions
 * @access Admin only
 */
export const clearSubmissions = async (req, res) => {
  try {
    const result = await Submission.deleteMany({});
    // Reset challenge submission counters
    await Challenge.updateMany({}, { $set: { totalSubmissions: 0, acceptedSubmissions: 0 } });
    res.status(200).json({ message: `Cleared ${result.deletedCount} submissions` });
  } catch (error) {
    console.error('Clear submissions error:', error);
    res.status(500).json({ error: 'Failed to clear submissions' });
  }
};

/**
 * @route GET /api/admin/users
 * @desc List all users
 * @access Admin only
 */
export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt').lean();
    res.status(200).json({ users });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
};

/**
 * @route PUT /api/admin/users/:userId/role
 * @desc Toggle user role between 'user' and 'admin'
 * @access Admin only
 */
export const toggleUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    
    res.status(200).json({ message: `User role changed to ${user.role}`, user: { _id: user._id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Toggle role error:', error);
    res.status(500).json({ error: 'Failed to toggle user role' });
  }
};
