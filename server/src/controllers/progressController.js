import Progress from '../models/Progress.js';
import { getTopicMastery, calculateRecommendations } from '../services/progressService.js';

/**
 * @route GET /api/progress
 * @desc Get user progress and mastery
 * @access Private
 */
export const getMyProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      progress = await Progress.create({ userId: req.user.id });
    }
    
    const mastery = getTopicMastery(progress.topicStats);
    
    res.status(200).json({ 
      progress,
      mastery
    });
  } catch (error) {
    console.error('GetMyProgress error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @route GET /api/progress/recommendations
 * @desc Get personalized challenge recommendations
 * @access Private
 */
export const getRecommendations = async (req, res) => {
  try {
    const recs = await calculateRecommendations(req.user.id);
    res.status(200).json({ recommendations: recs });
  } catch (error) {
    console.error('GetRecommendations error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @route GET /api/progress/stats
 * @desc Get user statistics
 * @access Private
 */
export const getStats = async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
        return res.status(200).json({ 
          totalAttempted: 0,
          totalSolved: 0,
          currentStreak: 0,
          longestStreak: 0,
          recentSubmissions: [] 
        });
    }
    
    res.status(200).json({ 
      totalAttempted: progress.totalAttempted,
      totalSolved: progress.totalSolved,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      recentSubmissions: progress.recentSubmissions
    });
  } catch (error) {
    console.error('GetStats error:', error);
    res.status(500).json({ error: error.message });
  }
};
