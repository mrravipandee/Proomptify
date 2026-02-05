export const config = {
  port: process.env.PORT || 5500,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  
  mail: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || '',
  },
  
  dodopayments: {
    apiKey: process.env.DODOPAYMENTS_API_KEY || '',
    yearlyProductId: process.env.DODOPAYMENTS_YEARLY_PRODUCT_ID || '',
    lifetimeProductId: process.env.DODOPAYMENTS_LIFETIME_PRODUCT_ID || '',
  },
  
  urls: {
    frontend: process.env.FRONTEND_URL || 'http://localhost:3000',
    backend: process.env.BACKEND_URL || 'http://localhost:5500',
  },
  
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate required environment variables
export const validateConfig = () => {
  const required = [
    'MONGO_URI',
    'JWT_SECRET',
    'MAIL_USER',
    'MAIL_PASS',
    'DODOPAYMENTS_API_KEY',
    'DODOPAYMENTS_YEARLY_PRODUCT_ID',
    'DODOPAYMENTS_LIFETIME_PRODUCT_ID',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};
