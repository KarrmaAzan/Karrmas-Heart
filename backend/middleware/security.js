// middleware/security.js
const helmet = require('helmet');
const rateLimiter = require('./rateLimit');

module.exports = (app) => {
  app.use(helmet());
  app.use(rateLimiter);
};
