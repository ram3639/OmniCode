import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Runtime Error (SIGSEGV)', 'Runtime Error (SIGXFSZ)', 'Runtime Error (SIGFPE)', 'Runtime Error (SIGABRT)', 'Runtime Error (NZEC)', 'Runtime Error (Other)', 'Time Limit Exceeded', 'Compilation Error', 'Internal Error', 'Exec Format Error', 'Pending', 'Unknown', 'Error'],
    default: 'Pending'
  },
  testResults: [{
    passed: Boolean,
    input: String,
    expectedOutput: String,
    actualOutput: String,
    error: String
  }],
  totalTests: { type: Number, default: 0 },
  passedTests: { type: Number, default: 0 },
  runtime: { type: Number }, // ms
  memory: { type: Number }, // KB
  semanticScore: { type: Number },
  aiHints: [String],
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Submission', submissionSchema);
