# Speakwell - AI Testimonial Machine

> Your clients are happy. They just don't know what to write.

Speakwell is a full-stack SaaS application that turns raw client feedback into polished, embeddable testimonials using AI. Share a link, your client answers a few questions, and Speakwell generates a genuine-sounding testimonial  ready to publish on any website with one line of code.

**Live demo:** [speakwell-psi.vercel.app](https://speakwell-psi.vercel.app/)  
**Backend API:** [speakwell-api.onrender.com](https://speakwell-api.onrender.com/)



## Features

### Owner (Authenticated)
- Create testimonial request links with up to 8 custom questions (text, long text, or rating type)
- Configure form theme, anonymous submissions, and link expiry
- Dashboard with overview stats  active requests, total submissions, pending review, published count, average rating
- Review AI-generated drafts, edit inline, approve, reject, or publish to the embed widget
- Draft history showing every AI regeneration with its tone
- Filterable, paginated testimonials list across all requests (status, published state, request, sort)
- Widget customization  color, theme, layout, font, border radius, visible fields, and max testimonials shown  with a live preview
- Copyable one-line embed snippet per request
- Profile management with avatar upload, password change (logs out all devices), and account deletion

### Client (Public, No Signup)
- Open a shareable link and answer a short guided form  no account required
- Star rating, dynamic questions based on the owner's configuration, and a tone selector (casual, professional, emotional)
- Optional email (unless anonymous is disabled) and optional photo upload after submission
- Instant confirmation screen after submitting

### AI Generation
- Two-pass prompt pipeline using Google Gemini: an initial draft, followed by a self-review pass that checks for banned corporate phrases, generic openers, and sentence length
- Tone-aware prompting (casual / professional / emotional) with concrete style guidance per tone
- Up to 3 stored generations per testimonial for draft history

### Security & Infrastructure
- JWT access + refresh token rotation with HTTP-only cookies
- Email OTP verification with bcrypt-hashed OTPs, resend cooldown, and max resend limits
- JWT-based password reset links (no OTP) with 10-minute expiry and email-bound token validation
- Rate limiting on auth, OTP, password reset, testimonial submission, and a global API-wide limiter
- Zod schema validation on every route, mirrored on the frontend with React Hook Form
- Helmet security headers, explicit CORS origin allowlist, and `Cross-Origin-Resource-Policy: cross-origin` on public embed routes
- Cloudinary CDN for avatar and client photo storage with face-aware auto-cropping and compression

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| TypeScript | Type safety across the app |
| React Context | Auth state management |
| SWR + Axios | Data fetching and caching |
| React Router DOM v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | Accessible UI primitives |
| React Hook Form + Zod | Form handling and validation |
| Sonner | Toast notifications |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server and REST API |
| TypeScript | Type safety across the API |
| MongoDB + Mongoose | Database and ODM |
| JWT (jsonwebtoken) | Access, refresh, and reset-password tokens |
| bcryptjs | Password and OTP hashing |
| Google Gemini API | AI testimonial generation |
| Cloudinary + Multer | Image upload pipeline |
| Brevo | Transactional emails |
| Zod | Request validation |
| Helmet + cors | Security headers |
| express-rate-limit | API rate limiting |


## Architecture

```
┌─────────────────────────────────────────────┐
│                 Client (React)               │
│   Public Pages │ Auth Pages │ Dashboard      │
│      SWR + Axios ← HTTP/Cookies → Express    │
└─────────────────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   Express API   │
              │     /api/*      │
              │                 │
              │  protect (JWT)  │
              │  validate (Zod) │
              │  rateLimit      │
              └────────┬────────┘
                       │
     ┌─────────────────┼─────────────────┐
     ▼                 ▼                 ▼
  MongoDB          Cloudinary         Gemini AI
 (Mongoose)     (Image Storage)   (Testimonial Gen)
                       │
                       ▼
                    Brevo
              (Transactional Email)
```


## API Overview

| Module | Endpoints |
|---|---|
| Auth | `POST /api/auth/register` · `login` · `verify-email` · `logout` · `refresh-token` · `forgot-password` · `reset-password` · `resend-otp` |
| User | `GET /api/users/me` · `PATCH /me` · `PATCH /me/avatar` · `PATCH /me/change-password` · `DELETE /me` |
| Requests | `POST /api/requests` · `GET /` · `GET /:id` · `GET /form/:token` · `PATCH /:id` · `PATCH /:id/close` · `DELETE /:id` |
| Responses | `POST /api/responses/submit/:token` · `GET /request/:id` · `GET /:id` · `PATCH /:id/approve` · `PATCH /:id/reject` · `PATCH /:id/publish` · `DELETE /:id` |
| Widget | `GET /api/widget/embed/:token` · `GET /:token` · `GET /settings` · `PATCH /settings` · `GET /snippet/:token` |
| Dashboard | `GET /api/dashboard/stats` · `/testimonials` · `/recent-activity` |


## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Google AI Studio account (free Gemini API key)
- Brevo account (free tier)

### 1. Clone the repository

```bash
git clone https://github.com/deepx-sh/speakwell.git
cd speakwell
```

### 2. Backend setup

```bash
cd server
npm install
```

Fill in your `.env`:

```bash
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://...

JWT_ACCESS_TOKEN_SECRET=your_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_SECRET=your_secret
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
JWT_RESET_PASSWORD_TOKEN_SECRET=your_secret
JWT_RESET_PASSWORD_TOKEN_EXPIRES_IN=10m

CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=

BREVO_FROM_EMAIL=
BREVO_SMTP_PASS=
BREVO_API_KEY=
BREVO_SMTP_PORT=
BREVO_SMTP_HOST=
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd client
npm install
```

Fill in your `.env`:

```bash
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

### 4. Open the app

```
http://localhost:5173
```


## How the AI works

Speakwell uses a **two-pass prompt system** with Google Gemini:

**Pass 1 - Generate**
Raw client answers + tone preference → initial testimonial draft

**Pass 2 - Self-review**
The draft is sent back to the model to check for banned corporate words, generic openers, and sentence count - then rewritten if needed

This ensures output that sounds genuinely human, not like marketing copy.

**Banned words include:** seamless, leverage, cutting-edge, tailored solutions, exceeded expectations, game-changer, transformative, passionate, and 10+ more.


## License

MIT - feel free to use this project as a reference or starting point.