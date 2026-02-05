# Proomptify Backend

Production-ready Node.js + Express + MongoDB + TypeScript backend for Proomptify.

## 🚀 Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with required variables (see Environment Variables section)

3. Run in development mode:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Start production server:
```bash
npm start
```

## 📦 Scripts

- `npm run dev` - Start development server with hot-reload (nodemon)
- `npm run build` - Build TypeScript to JavaScript (outputs to `dist/`)
- `npm start` - Start production server from `dist/server.js`
- `npm run clean` - Remove `dist/` folder

## 🌐 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server
PORT=5500
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Email (Nodemailer)
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-specific-password

# Dodopayments
DODOPAYMENTS_API_KEY=your-dodopayments-api-key
DODOPAYMENTS_YEARLY_PRODUCT_ID=pdt_yearly_product_id
DODOPAYMENTS_LIFETIME_PRODUCT_ID=pdt_lifetime_product_id

# URLs
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-backend-domain.com
```

### Required Variables (MUST be set):
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (min 32 characters)
- `MAIL_USER` - Email account for sending OTPs
- `MAIL_PASS` - Email password/app-specific password
- `DODOPAYMENTS_API_KEY` - Dodopayments API key
- `DODOPAYMENTS_YEARLY_PRODUCT_ID` - Yearly subscription product ID
- `DODOPAYMENTS_LIFETIME_PRODUCT_ID` - Lifetime subscription product ID

### Optional Variables (have defaults):
- `PORT` - Server port (default: 5500)
- `NODE_ENV` - Environment (default: development)
- `FRONTEND_URL` - Frontend URL (default: http://localhost:3000)
- `BACKEND_URL` - Backend URL (default: http://localhost:5500)

## 🔧 Technology Stack

- **Runtime**: Node.js 20+
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Authentication**: JWT + bcrypt
- **Email**: Nodemailer
- **Payment**: Dodopayments integration

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── config/             # Configuration files
│   │   ├── db.ts           # MongoDB connection
│   │   └── env.ts          # Environment config
│   ├── constants/          # Constants and enums
│   ├── controllers/        # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── payment.controller.ts
│   │   └── usage.controller.ts
│   ├── middlewares/        # Express middlewares
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/             # Mongoose models
│   │   ├── User.ts
│   │   └── Usage.ts
│   ├── routes/             # API routes
│   │   ├── auth.routes.ts
│   │   ├── payment.routes.ts
│   │   └── usage.routes.ts
│   ├── services/           # Business logic services
│   │   └── mail.service.ts
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── dist/                   # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── nodemon.json

```

## 🚢 Deployment to Render

### Step 1: Connect Repository
1. Sign in to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository containing this backend

### Step 2: Configure Service
Fill in the following settings:

**Basic Settings:**
- **Name**: `proomptify-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your production branch)
- **Root Directory**: `backend` (if backend is in a subdirectory)
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

**Instance Type:**
- Free tier or Starter (based on your needs)

### Step 3: Environment Variables
Add ALL required environment variables in Render dashboard:
- Go to "Environment" tab
- Add each variable from the Environment Variables section above
- ⚠️ Make sure to set `NODE_ENV=production`

### Step 4: Deploy
1. Click "Create Web Service"
2. Render will automatically deploy your app
3. Monitor logs for any errors
4. Once deployed, you'll get a URL like: `https://proomptify-backend.onrender.com`

### Common Render Issues & Solutions

❌ **Build fails**: 
- Ensure Node version is 20+ in package.json engines
- Check that all TypeScript code compiles locally first

❌ **Port binding error**:
- ✅ Fixed - Server now correctly uses `process.env.PORT`

❌ **MongoDB connection timeout**:
- Whitelist Render's IP `0.0.0.0/0` in MongoDB Atlas Network Access
- Ensure MONGO_URI is correct and includes credentials

❌ **Missing environment variables**:
- Double-check all required env vars are set in Render dashboard
- Variables are case-sensitive

❌ **404 on all routes**:
- Check Start Command is exactly: `npm start`
- Verify dist/ folder is being created during build

## 🔍 Health Check

The API includes a health endpoint:
```
GET /health
```

Response:
```json
{
  "status": "OK"
}
```

## 🛡️ Security Features

- JWT authentication
- bcrypt password hashing
- CORS protection with whitelist
- MongoDB injection prevention via Mongoose
- Error handling middleware
- Request validation

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify` - Verify OTP
- `POST /api/auth/login` - Login user
- `POST /api/auth/request-otp` - Request OTP for login

### Usage
- `GET /api/usage/:userId` - Get user's prompt usage

### Payment
- `POST /api/payment/create-session` - Create payment session
- `POST /api/payment/webhook` - Handle payment webhooks

## 🐛 Troubleshooting

### Local Development Issues

**Port already in use:**
```bash
# Kill process on port 5500
lsof -ti:5500 | xargs kill -9
```

**TypeScript compilation errors:**
```bash
# Clean and rebuild
npm run clean
npm run build
```

**MongoDB connection failed:**
- Check MongoDB Atlas is running
- Verify MONGO_URI in .env
- Whitelist your IP in MongoDB Network Access

## 📄 License

ISC
