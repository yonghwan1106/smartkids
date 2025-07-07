# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend
```bash
# Install dependencies
npm install

# Run development server (default port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Run database migrations
npm run migrate

# Start server (development)
node src/index.js
```

## Project Architecture

### Technology Stack
- **Frontend**: React 19 with TypeScript, Vite build tool, Tailwind CSS
- **Backend**: Node.js Express server with PostgreSQL database
- **Authentication**: JWT tokens with bcrypt password hashing
- **AI Integration**: Google Gemini API for intelligent insights
- **Deployment**: Vercel for both frontend and serverless functions

### Application Structure
This is a child management platform with a multi-dashboard architecture:

- **App.tsx**: Main application entry point managing global state (user, children, authentication)
- **AuthPage**: Handles login/registration flow
- **Dashboard Components**: Five main feature areas (Health, Learning, School Life, Meal Planning, Settings)
- **Modal Components**: For data entry and AI analysis
- **UI Components**: Reusable components in `/components/ui/`

### State Management Pattern
- Uses React's built-in state management (useState, useEffect)
- Token-based authentication stored in localStorage
- Demo mode support with sample data fallback
- Child selection drives dashboard content

### API Architecture
- RESTful API with Express.js backend
- Route-based organization in `/server/src/routes/`
- Controller pattern for business logic
- JWT middleware for protected endpoints
- PostgreSQL with migration system using node-pg-migrate

### Database Schema
Key entities: Users, Children, Health Records, Learning Records, School Attendance, Meal Records
- All child-related data references `childId` foreign key
- Time-series data for tracking growth and progress
- Notification settings per user

### Environment Configuration
Frontend requires: `GEMINI_API_KEY`, `VITE_API_BASE_URL`
Backend requires: `DATABASE_URL`, `JWT_SECRET`, `PORT`

## Key Development Patterns

### Component Organization
- Dashboard components follow consistent prop patterns: `child`, `isDemoMode`, `onLoginRequired`
- Modal components handle their own state and call parent callbacks
- UI components are stateless and prop-driven

### Data Flow
1. Authentication state managed in App.tsx
2. Child selection determines active data context
3. Dashboard components fetch data independently
4. Modal components handle CRUD operations

### Demo Mode Behavior
- Provides sample data when not authenticated
- Graceful fallback for API failures
- Prompts for login when advanced features are accessed

### API Integration Pattern
- Fetch with Authorization headers using JWT tokens
- Error handling with fallback to local state
- Optimistic updates for better UX

## Common Development Tasks

### Adding New Dashboard Features
1. Create component in `/components/`
2. Add to App.tsx navigation and routing
3. Implement API endpoints in `/server/src/routes/`
4. Add corresponding controller in `/server/src/controllers/`
5. Create database migration if needed

### Database Changes
1. Create migration file in `/server/migrations/`
2. Update TypeScript interfaces in `types.ts`
3. Modify API controllers to handle new fields
4. Update frontend components as needed

### API Development
- Follow existing route/controller pattern
- Use JWT middleware for protected endpoints
- Return consistent JSON response format
- Handle errors with appropriate HTTP status codes

The application supports both authenticated users with real data and demo mode with sample data, making it suitable for both production use and demonstration purposes.