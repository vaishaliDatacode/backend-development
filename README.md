# Node.js Authentication System

A complete authentication system built with Node.js, Express, and MongoDB that includes user registration, email verification, login, password reset, and role-based access control.

## Features

- User registration with email verification
- JWT-based authentication
- Password reset functionality
- Role-based access control (Admin and User)
- Secure password storage using bcrypt
- Input validation with express-validator
- Email notifications using Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd auth-project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   # Server
   PORT=5000
   NODE_ENV=development

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/auth-system

   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=90d

   # Email (Development)
   EMAIL_FROM=noreply@yourdomain.com
   CLIENT_URL=http://localhost:3000

   # Email (Production)
   EMAIL_SERVICE=gmail
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-email-password
   ```

## Project Structure

```
.
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   │   └── categoryController.js
│   │   └── courseController.js
│   ├── middleware/
│   │   ├── auth.js
│   ├── models/
│   │   └── User.js
│   │   └── Category.js
│   │   └── Course.js
│   ├── routes/
│   │   └── index.js
│   │   └── authRoutes.js
│   │   └── categoryRoutes.js
│   │   └── courseRoutes.js
│   ├── services/
│   │   └── authService.js
│   │   └── categoryService.js
│   │   └── courseService.js
│   ├── utils/
│   │   ├── emailUtils.js
│   │   └── jwtUtils.js
│   └── validators/
│       └── authValidators.js
│       └── categoryValidators.js
│       └── courseValidators.js
├── app.js
├── server.js
├── package.json
└── .env
```

<!-- ## API Endpoints

### Authentication

- **POST /api/auth/signup** - Register a new user
  - Request body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123", "role": "User" }`

- **POST /api/auth/login** - Login a user
  - Request body: `{ "email": "john@example.com", "password": "password123" }`

- **GET /api/auth/verify-email/:token** - Verify email address

- **POST /api/auth/forgot-password** - Request password reset
  - Request body: `{ "email": "john@example.com" }`

- **POST /api/auth/reset-password/:token** - Reset password
  - Request body: `{ "password": "newpassword123", "passwordConfirm": "newpassword123" }`

- **POST /api/auth/resend-verification** - Resend verification email
  - Request body: `{ "email": "john@example.com" }` -->

## Usage

### Starting the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### Testing the API

You can test the API using tools like Postman or curl.

#### Register a new user:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

#### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### Email Testing in Development

For development environments, the system uses Ethereal Email for testing. When a verification or reset email is sent, the console will display a preview URL where you can view the email that would have been sent.

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Input validation is performed using express-validator
- Email verification prevents fake signups
- Password reset tokens expire after 1 hour

## Troubleshooting

