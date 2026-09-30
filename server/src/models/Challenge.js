import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true }
}, { _id: false });

const challengeSchema = new mongoose.Schema({
  problemNumber: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: { type: String, enum: ['Array', 'String', 'Stack', 'Queue', 'Mixed'], required: true },
  description: { type: String, required: true },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  publicTestCases: [testCaseSchema],
  hiddenTestCases: [testCaseSchema],
  starterCode: {
    python: String,
    cpp: String,
    c: String,
    java: String
  },
  optimalSolutions: {
    python: String,
    cpp: String,
    c: String,
    java: String
  },
  tags: [String],
  hints: [String],
  timeLimit: { type: Number, default: 2000 }, // ms
  memoryLimit: { type: Number, default: 256000 }, // KB
  totalSubmissions: { type: Number, default: 0 },
  acceptedSubmissions: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Challenge', challengeSchema);
