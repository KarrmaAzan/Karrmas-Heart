import helmet from 'helmet';
import rateLimiter from './rateLimit.js';

const applySecurityMiddleware = (app) => {
  app.use(helmet());
  app.use(rateLimiter);
};

export default applySecurityMiddleware;
