import Telemetry from '../models/Telemetry.js';

export const telemetryMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on('finish', async () => {
    const latencyMs = Date.now() - start;
    const status = res.statusCode >= 400 ? 'error' : 'success';
    
    // Fire and forget
    try {
      await Telemetry.create({
        event: `${req.method} ${req.originalUrl}`,
        latencyMs,
        status,
        metadata: {
          statusCode: res.statusCode,
          ip: req.ip
        }
      });
    } catch (error) {
      console.error('Error saving telemetry:', error.message);
    }
  });
  next();
};
