import mongoose from 'mongoose';

const topicStatSchema = new mongoose.Schema({
  topic: String,
  attempted: { type: Number, default: 0 },
  solved: { type: Number, default: 0 },
  avgRuntime: { type: Number, default: 0 },
  avgMemory: { type: Number, default: 0 },
  lastAttempted: Date
}, { _id: false });

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  topicStats: [topicStatSchema],
  totalAttempted: { type: Number, default: 0 },
  totalSolved: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: Date,
  recentSubmissions: [{
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    status: String,
    language: String,
    runtime: Number,
    submittedAt: Date
  }],
  strengthTopics: [String],
  weakTopics: [String],
  recommendations: [{
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    reason: String
  }]
}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
