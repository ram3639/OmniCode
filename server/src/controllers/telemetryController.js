import mongoose from 'mongoose';
import User from '../models/User.js';
import Challenge from '../models/Challenge.js';
import Submission from '../models/Submission.js';
import axios from 'axios';

/**
 * @route GET /api/telemetry
 * @desc Get system telemetry data (admin only)
 * @access Private/Admin
 */
export const getTelemetry = async (req, res) => {
  try {
    const [totalUsers, totalChallenges, totalSubmissions] = await Promise.all([
      User.countDocuments(),
      Challenge.countDocuments(),
      Submission.countDocuments()
    ]);
    
    res.status(200).json({
      totalUsers,
      totalChallenges,
      totalSubmissions,
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('GetTelemetry error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @route GET /api/telemetry/health
 * @desc Check health of all microservices
 * @access Public
 */
export const getHealth = async (req, res) => {
  try {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'up' : 'down';
    
    let judge0Status = 'down';
    try {
      await axios.get(`${process.env.JUDGE0_API_URL}/about`, { timeout: 3000 });
      judge0Status = 'up';
    } catch (e) { }

    let microserviceStatus = 'down';
    try {
      await axios.get(`${process.env.MICROSERVICE_URL}/health`, { timeout: 3000 });
      microserviceStatus = 'up';
    } catch (e) { }

    res.status(200).json({
      database: mongoStatus,
      judge0: judge0Status,
      microservice: microserviceStatus,
      server: 'up'
    });
  } catch (error) {
    console.error('GetHealth error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @route GET /api/telemetry/users
 * @desc Get all users with submission counts (admin only)
 * @access Private/Admin
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'submissions',
          localField: '_id',
          foreignField: 'userId',
          as: 'submissions'
        }
      },
      {
        $project: {
          username: 1,
          email: 1,
          role: 1,
          provider: 1,
          createdAt: 1,
          submissionCount: { $size: '$submissions' }
        }
      }
    ]);
    res.status(200).json({ users });
  } catch (error) {
    console.error('GetUsers error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @route GET /api/telemetry/stats
 * @desc Get system-wide statistics (admin only)
 * @access Private/Admin
 */
export const getSystemStats = async (req, res) => {
  try {
    const [languages, statuses] = await Promise.all([
      Submission.aggregate([
        { $group: { _id: '$language', count: { $sum: 1 }, avgRuntime: { $avg: '$runtime' } } }
      ]),
      Submission.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    res.status(200).json({ languages, statuses });
  } catch (error) {
    console.error('GetSystemStats error:', error);
    res.status(500).json({ error: error.message });
  }
};
