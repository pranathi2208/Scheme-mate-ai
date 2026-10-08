# SchemeMate AI

A full-stack MERN GovTech platform helping Indian citizens discover government schemes they're eligible for.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm

### Installation

```bash
# Install all dependencies (root + server + client)
npm run install-all

# OR install individually:
cd server && npm install
cd ../client && npm install
```

### Configuration

1. **Server Setup** - Configure `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/schememate_ai
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
ADMIN_REGISTRATION_KEY=admin_secret_key_2024
```

2. **Seed Database** with 25 government schemes:
```bash
npm run seed
```

3. **Start Development Servers**:
```bash
# Option 1: Run both (from root)
npm run dev

# Option 2: Run separately
npm run server  # Backend on http://localhost:5000
npm run client  # Frontend on http://localhost:5173
```

## 🎯 Features

### User Features
- **Landing Page** - Clear value proposition, how it works, featured schemes
- **Auth System** - Secure JWT-based registration and login
- **Multi-Step Onboarding** - 5-step profile builder (personal, location, occupation, special status, review)
- **Smart Matching** - Rule-based matching engine with transparent scoring (0-100)
- **Scheme Discovery** - Browse, search, filter by category
- **Scheme Details** - Full information, documents, application process
- **Save & Track** - Save schemes and track application status
- **AI Assistant** - Conversational interface (rule-based with fallback)
- **Multilingual** - English, Hindi, Telugu support

### Admin Features
- **Admin Dashboard** - Stats, category breakdown, recent schemes
- **Scheme Management** - CRUD operations for government schemes
- **User Management** - View registered users

## 📁 Project Structure

```
schemate-ai/
├── server/              # Express.js backend
│   ├── src/
│   │   ├── config/      # DB connection
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Auth, validation, error handling
│   │   ├── services/    # Business logic (matching engine, assistant)
│   │   ├── seed/        # Database seed data
│   │   └── utils/       # Helper functions
│   └── .env
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Route pages
│   │   ├── context/     # React Context (Auth, Admin)
│   │   ├── services/    # API calls
│   │   ├── i18n/        # Translations (EN/HI/TE)
│   │   ├── utils/       # Helper functions
│   │   └── index.css    # Global design system
│   └── vite.config.js
└── package.json         # Root scripts
```

## 🔑 Default Credentials

### Admin Panel
- **URL**: http://localhost:5173/admin/login
- **Email**: admin@schememate.ai
- **Password**: Admin@12345

⚠️ **Change in production!**

## 🗄️ Database Models

- **User** - User accounts with authentication
- **Profile** - Detailed user profiles for matching
- **Scheme** - Government scheme information
- **SavedScheme** - User's saved schemes with tracking
- **Admin** - Admin accounts

## 🎨 Design System

Clean, trustworthy GovTech aesthetic:
- **Primary**: Teal-blue (#2563eb)
- **Accent**: Amber (#d97706)
- **Success**: Green (#22c55e)
- No futuristic/neon/cyberpunk elements
- Large readable text, good spacing
- Mobile-first responsive

## 🧪 API Endpoints

### Public
- `GET /api/health` - Health check
- `GET /api/schemes` - List schemes (with filters)
- `GET /api/schemes/:id` - Get scheme details
- `POST /api/match/preview` - Anonymous match preview

### Auth Required
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile
- `GET /api/match` - Get matched schemes
- `GET /api/saved-schemes` - List saved schemes
- `POST /api/saved-schemes/:id` - Save scheme
- `POST /api/assistant/chat` - Chat with assistant

### Admin
- `POST /api/auth/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/schemes` - Manage schemes
- `POST /api/admin/schemes` - Create scheme
- `PUT /api/admin/schemes/:id` - Update scheme
- `DELETE /api/admin/schemes/:id` - Archive scheme

## 🔧 Configuration

### AI Assistant (Optional)
To enable AI-powered responses, add to `server/.env`:
```env
OPENAI_API_KEY=your_openai_key
# OR
GEMINI_API_KEY=your_gemini_key
```

Without API keys, the assistant uses rule-based responses.

## 📊 Matching Engine

Transparent rule-based scoring:
- Age criteria (15 pts)
- Gender match (15 pts)
- State availability (20 pts)
- Income limits (15 pts)
- Occupation match (15 pts)
- Social category (10 pts)
- Special status flags (15 pts each)

**Match Levels**:
- **Highly Relevant**: 75-100 score
- **Relevant**: 50-74 score
- **Possibly Relevant**: 25-49 score

## 🌐 Multilingual

Supported languages:
- 🇬🇧 English (en)
- 🇮🇳 हिंदी (hi)
- 🇮🇳 తెలుగు (te)

Users can switch languages from the navbar.

## ⚠️ Important Disclaimers

1. **Eligibility Verification**: SchemeMate AI provides preliminary recommendations. Official eligibility MUST be confirmed with the relevant government department.

2. **Data Source**: Scheme information is sourced from official government portals for awareness purposes. Always verify on official websites.

3. **Demo Data**: Seed data is marked as `isDemoData: true`. Update with latest official information in production.

## 🚢 Production Deployment

### Environment Variables (Production)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...  # Use MongoDB Atlas
JWT_SECRET=<strong-random-secret>
ADMIN_REGISTRATION_KEY=<strong-secret>
CLIENT_URL=https://yourdomain.com
```

### Security Checklist
- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Set up MongoDB authentication
- [ ] Regular security updates

## 📝 License

Built to serve citizens of India 🇮🇳

## 🤝 Contributing

This is a demo/prototype. For production use:
1. Verify all scheme data with official sources
2. Add proper error tracking (Sentry)
3. Add analytics (if needed)
4. Implement proper logging
5. Add comprehensive tests
6. Set up CI/CD pipeline

## 📞 Support

For issues or questions, check:
- Official government scheme portals
- Local government offices
- Relevant department helplines (listed in scheme details)

---

**Tech Stack**: MongoDB · Express.js · React (Vite) · Node.js · JWT · bcrypt · i18next · Axios · React Router · Lucide Icons
