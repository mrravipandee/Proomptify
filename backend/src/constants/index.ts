export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  // Auth errors
  USER_EXISTS: 'User already exists with this email',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_OTP: 'Invalid or expired OTP',
  USER_NOT_FOUND: 'User not found',
  EMAIL_NOT_VERIFIED: 'Please verify your email first',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_REQUIRED: 'No token provided',
  INVALID_TOKEN: 'Invalid or expired token',
  
  // Payment errors
  PAYMENT_SESSION_FAILED: 'Failed to create payment session',
  INVALID_PLAN: 'Invalid plan selected',
  
  // General errors
  SERVER_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error',
} as const;

export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful! Please check your email for verification code',
  LOGIN_SUCCESS: 'Login successful',
  EMAIL_VERIFIED: 'Email verified successfully',
  OTP_SENT: 'OTP sent to your email',
} as const;

export const USER_PLANS = {
  FREE: 'free',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime',
} as const;

export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10,
} as const;

export const JWT_CONFIG = {
  EXPIRY: '7d',
} as const;
