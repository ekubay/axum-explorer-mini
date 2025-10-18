# 🏔️ Axum Explorer Mini

A modern travel platform connecting tourists with local service providers in Axum, Ethiopia. Experience authentic Ethiopian hospitality while exploring ancient historical sites.

![Axum Explorer](https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=600&fit=crop)

## 🌟 Features

### 👥 User Management
- **Role-based authentication** (Tourist, Service Provider, Admin)
- Secure JWT-based authentication
- User registration and profile management
- Email verification system

### 🏨 Service Provider Features
- Provider registration and verification
- Multiple service types per provider
- Service management dashboard
- Earnings tracking and commission reports

### 📅 Booking System
- Custom package creation (hotel + car + guide combinations)
- Real-time price calculation with commission
- Date-based availability
- Booking status tracking

### 👑 Admin Features
- Provider verification management
- Platform analytics and revenue tracking
- User management
- Commission payout management

### 💰 Revenue Model
- **Commission-based**: 10-15% hotels, 8-12% car rentals, 10% guides
- Real-time commission tracking
- Automated payout calculations

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **Architecture**: Clean Architecture Pattern

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB 4.4+
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/ekubay/axum-explorer-mini.git
cd axum-explorer-mini

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Environment configuration
cp .env.example .env
# Edit .env with your configuration

# Build the project
npm run build

# Seed the database
npm run seed

# Start development server
npm run dev