import mongoose from 'mongoose';

const telemetrySchema = new mongoose.Schema({
  event: { type: String, required: true },
  latencyMs: Number,
  status: { type: String, enum: ['success', 'error'] },
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});

const Telemetry = mongoose.model('Telemetry', telemetrySchema);
export default Telemetry;
