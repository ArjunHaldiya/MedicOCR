# SimplyMed API
### AI-Powered Medication Management Platform

REST API that helps non-English speaking patients manage medications through OCR prescription scanning, multilingual translation, and AI-powered simplification of medical terminology.

---

## 🚀 Features

- **Authentication System** - JWT-based auth with role-based access (patient/caregiver)
- **Medication Management** - Full CRUD operations for tracking medications
- **Smart Prescription Scanning** - Upload prescription images for automatic text extraction
- **Multilingual Translation** - Translate prescriptions into 10+ languages
- **AI Text Simplification** - Convert medical jargon into plain language
- **Medication Reminders** - Scheduled notifications with cron jobs
- **Secure File Handling** - Image upload with validation and storage

---

## 🛠️ Tech Stack

**Backend:** Node.js, Express.js  
**Database:** PostgreSQL  
**AI/ML:** Google Cloud Vision (OCR), Google Translate API, Gemini AI  
**Security:** JWT, bcrypt, Helmet, CORS, rate limiting  
**File Upload:** Multer  
**Scheduling:** node-cron  

---

## 📋 API Endpoints

### Authentication
```
POST   /api/v1/auth/register   - Register new user
POST   /api/v1/auth/login      - Login user
GET    /api/v1/auth/me         - Get current user
```

### Medications
```
POST   /api/v1/medications     - Create medication
GET    /api/v1/medications     - Get all medications
GET    /api/v1/medications/:id - Get single medication
PUT    /api/v1/medications/:id - Update medication
DELETE /api/v1/medications/:id - Delete medication
```

### Prescriptions
```
POST   /api/v1/prescriptions     - Upload prescription image
GET    /api/v1/prescriptions     - Get all prescriptions
GET    /api/v1/prescriptions/:id - Get single prescription
DELETE /api/v1/prescriptions/:id - Delete prescription
```

### Reminders
```
POST   /api/v1/reminders     - Create reminder
GET    /api/v1/reminders     - Get all reminders
PUT    /api/v1/reminders/:id - Update reminder
DELETE /api/v1/reminders/:id - Delete reminder
```

---

## 🔧 Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL v15+
- Google Cloud account (for Vision & Translate APIs)
- Gemini API key

### Installation

1. **Clone repository**
```bash
git clone https://github.com/ArjunHaldiya/SimplyMed-Backend.git
cd SimplyMed-Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Setup database**
```bash
createdb simplymed_dev
psql -d simplymed_dev -f migrations/001_create_users_table.sql
psql -d simplymed_dev -f migrations/002_create_medications_table.sql
psql -d simplymed_dev -f migrations/003_create_prescriptions_table.sql
psql -d simplymed_dev -f migrations/004_create_reminders_table.sql
```

5. **Start server**
```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## 🔑 Environment Variables

```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=simplymed_dev
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Google Cloud APIs
GOOGLE_CLOUD_API_KEY=your_google_api_key

# Gemini AI
GEMINI_API_KEY=your_gemini_key

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:19000
```

---

## 📊 Database Schema

- **users** - User accounts and authentication
- **medications** - Medication records with dosage info
- **prescriptions** - Uploaded images with OCR results
- **reminders** - Scheduled medication reminders

---

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication (7-day expiry)
- Rate limiting (100 req/15min general, 5 req/15min auth)
- Helmet security headers
- CORS policy enforcement
- Input validation and sanitization

---

## 📝 License

MIT

---

## 👨‍💻 Author

**Arjun Haldiya**  
[GitHub](https://github.com/ArjunHaldiya)