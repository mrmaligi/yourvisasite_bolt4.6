# VisaBuild - Comprehensive Development Plan
**Version:** 1.0  
**Date:** February 2026  
**Goal:** Build a robust, scalable visa management platform

---

## 1. DATABASE ARCHITECTURE PLAN

### 1.1 Core Principles
- **Single source of truth** for all data
- **RLS (Row Level Security)** enforced on all tables
- **Foreign key constraints** for data integrity
- **Indexes** on frequently queried columns
- **Audit trails** for critical changes

### 1.2 Table Structure (Simplified Core)

```
┌─────────────────────────────────────────────────────────────┐
│                        CORE TABLES                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │  auth.users  │──────│   profiles   │──────│  visas    │ │
│  │  (supabase)  │      │  (extends)   │      │  (master) │ │
│  └──────────────┘      └──────────────┘      └─────┬─────┘ │
│         │                     │                     │       │
│         │              ┌──────┴──────┐             │       │
│         │              │ lawyer_profiles│           │       │
│         │              │  (optional)   │           │       │
│         │              └───────────────┘           │       │
│         │                                          │       │
│  ┌──────┴──────┐      ┌──────────────┐      ┌─────┴─────┐ │
│  │  bookings   │──────│  saved_visas │      │ premium_  │ │
│  │             │      │              │      │  content  │ │
│  └─────────────┘      └──────────────┘      └───────────┘ │
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐ │
│  │   tracker_   │      │   news_      │      │ documents │ │
│  │   entries    │      │   articles   │      │           │ │
│  └──────────────┘      └──────────────┘      └───────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Detailed Schema Design

#### Table: `profiles`
**Purpose:** Extends auth.users with application-specific data
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'user' NOT NULL,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

#### Table: `visas`
**Purpose:** Master visa data
```sql
CREATE TABLE visas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subclass TEXT NOT NULL,
    name TEXT NOT NULL,
    country TEXT DEFAULT 'Australia' NOT NULL,
    category visa_category NOT NULL,
    summary TEXT,
    description TEXT,
    official_link TEXT,
    government_fee_aud INTEGER,
    processing_time_min_days INTEGER,
    processing_time_max_days INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_visas_country ON visas(country);
CREATE INDEX idx_visas_category ON visas(category);
CREATE INDEX idx_visas_active ON visas(is_active);
```

#### Table: `news_articles`
**Purpose:** News and updates
```sql
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    body TEXT NOT NULL,
    image_url TEXT,
    author_id UUID REFERENCES profiles(id),
    category TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    visa_ids UUID[], -- Array of related visa IDs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_news_published ON news_articles(is_published, published_at);
CREATE INDEX idx_news_category ON news_articles(category);
CREATE INDEX idx_news_visa_ids ON news_articles USING GIN (visa_ids);
```

#### Table: `bookings`
**Purpose:** Consultation bookings
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    lawyer_id UUID NOT NULL REFERENCES lawyer_profiles(id),
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status booking_status DEFAULT 'pending',
    amount_cents INTEGER,
    is_paid BOOLEAN DEFAULT false,
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_lawyer ON bookings(lawyer_id);
CREATE INDEX idx_bookings_status ON bookings(status);
```

#### Table: `tracker_entries`
**Purpose:** Processing time tracking
```sql
CREATE TABLE tracker_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visa_id UUID NOT NULL REFERENCES visas(id),
    submitted_by UUID REFERENCES profiles(id),
    is_anonymous BOOLEAN DEFAULT false,
    application_date DATE NOT NULL,
    decision_date DATE,
    processing_days INTEGER,
    outcome tracker_outcome,
    location TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tracker_visa ON tracker_entries(visa_id);
CREATE INDEX idx_tracker_date ON tracker_entries(application_date);
```

---

## 2. NEWS SYSTEM DESIGN

### 2.1 Features
- **Article management:** Create, edit, publish/unpublish
- **Categories:** Organize by topic (policy changes, processing times, etc.)
- **Visa tagging:** Link articles to specific visas
- **Author attribution:** Track who wrote what
- **Publishing workflow:** Draft → Review → Published
- **SEO optimization:** Slugs, meta descriptions

### 2.2 Data Flow
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Admin     │────▶│   Create    │────▶│    Draft    │
│  Dashboard  │     │   Article   │     │   Status    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                       ┌────────────────────────┘
                       ▼
                ┌─────────────┐     ┌─────────────┐
                │  Published  │◀────│   Review    │
                │   Status    │     │   Status    │
                └──────┬──────┘     └─────────────┘
                       │
                       ▼
                ┌─────────────┐
                │   Public    │
                │   News Feed │
                └─────────────┘
```

### 2.3 API Endpoints Needed
```
GET    /api/news              # List published articles
GET    /api/news/:slug        # Get single article
POST   /api/news              # Create article (admin)
PUT    /api/news/:id          # Update article (admin)
DELETE /api/news/:id          # Delete article (admin)
GET    /api/news/by-visa/:id  # Get articles for specific visa
```

---

## 3. APPLICATION ROBUSTNESS STRATEGIES

### 3.1 Error Handling
```typescript
// Layered error handling
┌─────────────────────────────────────────┐
│  UI Layer (Toast notifications)         │
├─────────────────────────────────────────┤
│  Component Layer (Error boundaries)     │
├─────────────────────────────────────────┤
│  Service Layer (API error formatting)   │
├─────────────────────────────────────────┤
│  Repository Layer (Database retries)    │
└─────────────────────────────────────────┘
```

### 3.2 Data Fetching Strategy
```typescript
// React Query pattern
- Stale-while-revalidate caching
- Automatic retries with exponential backoff
- Optimistic updates
- Background refetching
```

### 3.3 State Management
```
┌─────────────────────────────────────────┐
│  Global State (Zustand)                 │
│  - Auth state                           │
│  - Theme                                │
│  - Toast notifications                  │
├─────────────────────────────────────────┤
│  Server State (React Query)             │
│  - API data                             │
│  - Cache management                     │
├─────────────────────────────────────────┤
│  Local State (useState)                 │
│  - Form inputs                          │
│  - UI toggles                           │
└─────────────────────────────────────────┘
```

### 3.4 Security Checklist
- [ ] RLS policies on all tables
- [ ] Input validation on all forms
- [ ] XSS prevention (sanitize HTML)
- [ ] CSRF protection
- [ ] Rate limiting on API
- [ ] Secure session management
- [ ] Audit logging for sensitive actions

### 3.5 Performance Optimizations
- [ ] Lazy loading for routes
- [ ] Image optimization (WebP, lazy loading)
- [ ] Debounced search inputs
- [ ] Pagination for large lists
- [ ] Indexed database queries
- [ ] CDN for static assets

---

## 4. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
- [ ] Finalize database schema
- [ ] Set up Supabase project
- [ ] Create all tables with RLS
- [ ] Set up authentication
- [ ] Basic project structure

### Phase 2: Core Features (Week 3-4)
- [ ] User authentication flow
- [ ] Visa search and detail pages
- [ ] User dashboard
- [ ] Document upload system
- [ ] Basic tracker

### Phase 3: Lawyer Features (Week 5-6)
- [ ] Lawyer registration
- [ ] Lawyer dashboard
- [ ] Availability management
- [ ] Consultation booking

### Phase 4: News & Content (Week 7-8)
- [ ] News system
- [ ] Admin content management
- [ ] Premium content system
- [ ] Email notifications

### Phase 5: Polish & Launch (Week 9-10)
- [ ] Testing (unit, integration, e2e)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] Launch

---

## 5. QUESTIONS FOR DISCUSSION

### Database
1. Should we use a separate `lawyer_profiles` table or extend `profiles`?
2. How should we handle document storage (Supabase Storage vs external)?
3. Do we need soft deletes or hard deletes for data?

### News System
1. Should articles support rich text (Markdown, HTML, or WYSIWYG)?
2. Do we need article scheduling (publish at future date)?
3. Should we track article views/analytics?

### Robustness
1. What's our target uptime SLA?
2. Do we need real-time features (WebSockets) or polling is fine?
3. Should we implement feature flags for gradual rollouts?

### Priorities
1. What's the MVP feature set for initial launch?
2. Which features can be deferred to post-launch?
3. What's the budget/timeline constraints?

---

**Let's discuss and refine this plan!** 🚀
