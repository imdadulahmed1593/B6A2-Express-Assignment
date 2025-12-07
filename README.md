# Vehicle Rental System API

A robust RESTful API for a vehicle rental management system built with Node.js, Express, TypeScript, and PostgreSQL.

## 🔗 Live URL

https://vehicle-rental-system-tau-lemon.vercel.app/

## ✨ Features

- **User Management**

  - User registration and authentication
  - Role-based access control (Admin & Customer)
  - JWT-based authentication
  - Secure password hashing with bcrypt

- **Vehicle Management**

  - CRUD operations for vehicles
  - Vehicle type categorization (Car, Bike, Van, SUV)
  - Real-time availability tracking
  - Registration number validation

- **Booking System**

  - Create and manage vehicle bookings
  - Booking status tracking
  - Date-based availability checking
  - Rental cost calculation

- **Security**
  - JWT token authentication
  - Protected routes with authorization middleware
  - Password encryption
  - Input validation

## 🛠️ Technology Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs

### Development Tools

- **TypeScript Compiler:** tsc
- **Dev Server:** tsx (TypeScript execution)
- **Environment Variables:** dotenv

### Deployment

- **Platform:** Vercel

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo_url>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
CONNECTION_STR=your_postgre_db_connection_string
JWT_SECRET=your_jwt_secret_key_here
```

**Note:** Replace the placeholders with your actual configuration values.

### 4. Database Setup

The application will automatically create the required tables on the first run. The database schema includes:

- **users** - User account information
- **vehicles** - Vehicle inventory
- **bookings** - Rental bookings

### 5. Build the Project

```bash
npm run build
```

This will compile TypeScript files to JavaScript in the `dist` folder.

## 💻 Usage Instructions

### Development Mode

Run the application in development mode with hot-reload:

```bash
npm run dev
```

The server will start at `http://localhost:5000` (or your configured PORT).

### Production Mode

1. Build the project:

```bash
npm run build
```

2. Start the server:

```bash
node dist/server.js
```

## 📡 API Endpoints

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Users

- `GET /users` - Get all users (Admin only)
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Vehicles

- `GET /vehicles` - Get all vehicles
- `GET /vehicles/:id` - Get vehicle by ID
- `POST /vehicles` - Add new vehicle (Admin only)
- `PUT /vehicles/:id` - Update vehicle (Admin only)
- `DELETE /vehicles/:id` - Delete vehicle (Admin only)

### Bookings

- `GET /bookings` - Get all bookings
- `POST /bookings` - Create new booking
- `PUT /bookings/:id` - Update booking

## 🔐 Authentication

Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📁 Project Structure

```
assignment_02/
├── src/
│   ├── config/           # Configuration files
│   │   ├── db.ts        # Database setup
│   │   └── index.ts     # Environment config
│   ├── middleware/       # Custom middleware
│   │   ├── auth.ts      # Authentication middleware
│   │   └── logger.ts    # Request logger
│   ├── modules/          # Feature modules
│   │   ├── auth/        # Authentication module
│   │   ├── booking/     # Booking module
│   │   ├── user/        # User module
│   │   └── vehicle/     # Vehicle module
│   ├── types/           # TypeScript type definitions
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript files
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── vercel.json          # Vercel deployment config
└── README.md            # Project documentation
```

## 🚢 Deployment

This project is configured for deployment on Vercel. To deploy:

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

Make sure to configure your environment variables in the Vercel dashboard.

**Note:** This is a learning project developed as part of Next Level Web Development coursework.
