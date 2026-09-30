import Progress from '../models/Progress.js';
import Challenge from '../models/Challenge.js';

/**
 * Update user's progress after a submission
 */
export const updateProgress = async (userId, submission, challenge) => {
  try {
    let progress = await Progress.findOne({ userId });
    
    if (!progress) {
      progress = await Progress.create({ userId });
    }

    progress.lastActiveDate = new Date();
    progress.totalAttempted += 1;

    // Update topic stats
    const topic = challenge.category;
    let topicStat = progress.topicStats.find(t => t.topic === topic);
    
    if (!topicStat) {
      topicStat = { topic, attempted: 0, solved: 0, avgRuntime: 0, avgMemory: 0, lastAttempted: new Date() };
      progress.topicStats.push(topicStat);
      // find again by reference
      topicStat = progress.topicStats[progress.topicStats.length - 1];
    }
    
    topicStat.attempted += 1;
    topicStat.lastAttempted = new Date();

    if (submission.status === 'Accepted') {
      progress.totalSolved += 1;
      topicStat.solved += 1;
      
      // Update moving averages
      if (submission.runtime) {
        topicStat.avgRuntime = (topicStat.avgRuntime * (topicStat.solved - 1) + submission.runtime) / topicStat.solved;
      }
      if (submission.memory) {
        topicStat.avgMemory = (topicStat.avgMemory * (topicStat.solved - 1) + submission.memory) / topicStat.solved;
      }
    }

    // Add to recent submissions
    progress.recentSubmissions.unshift({
      challengeId: challenge._id,
      status: submission.status,
      language: submission.language,
      runtime: submission.runtime,
      submittedAt: submission.submittedAt
    });
    
    // Keep only last 20
    if (progress.recentSubmissions.length > 20) {
      progress.recentSubmissions.pop();
    }

    // Basic Streak Logic
    const today = new Date().setHours(0, 0, 0, 0);
    const lastActive = progress.lastActiveDate ? new Date(progress.lastActiveDate).setHours(0, 0, 0, 0) : null;
    
    if (!lastActive || today - lastActive > 86400000) {
      // If last active was > 1 day ago, streak resets
      if (today - lastActive === 86400000) {
          progress.currentStreak += 1;
      } else {
          progress.currentStreak = 1;
      }
    }
    
    if (progress.currentStreak > progress.longestStreak) {
      progress.longestStreak = progress.currentStreak;
    }
    
    // Update Strength / Weak Topics
    progress.strengthTopics = progress.topicStats
      .filter(t => t.attempted > 0 && (t.solved / t.attempted) >= 0.7)
      .map(t => t.topic);
      
    progress.weakTopics = progress.topicStats
      .filter(t => t.attempted > 0 && (t.solved / t.attempted) < 0.4)
      .map(t => t.topic);

    await progress.save();
    return progress;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

/**
 * Calculate Mastery Score per topic
 */
export const getTopicMastery = (topicStats) => {
  return topicStats.map(stat => {
    let score = 0;
    if (stat.attempted > 0) {
      score = (stat.solved / stat.attempted) * 100;
    }
    return {
      topic: stat.topic,
      mastery: Math.min(100, Math.max(0, score))
    };
  });
};

/**
 * Calculate Recommendations based on progress
 */
export const calculateRecommendations = async (userId) => {
  try {
    const progress = await Progress.findOne({ userId });
    if (!progress) return [];

    const weakTopics = progress.weakTopics || [];
    if (weakTopics.length === 0) return [];

    // Find a challenge in weak topics that user hasn't solved yet
    const solvedIds = progress.topicStats.map(t => t.solved > 0 ? t.topic : null); // rudimentary filter
    
    const recommendations = [];
    for (let topic of weakTopics) {
       const challenge = await Challenge.findOne({ category: topic }).sort({ difficulty: 1 });
       if (challenge) {
         recommendations.push({
           challengeId: challenge._id,
           reason: `Suggested to improve your weakness in ${topic}`
         });
       }
    }
    
    progress.recommendations = recommendations;
    await progress.save();
    
    return recommendations;
  } catch (error) {
    console.error('Error calculating recommendations:', error);
    return [];
  }
};
