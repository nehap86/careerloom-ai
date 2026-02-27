# CareerLoom AI - Testing & Security Report

## 1. Features Tested

### Authentication System
| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | Passed | Name (2-100 chars), email validation, password (8+ chars) |
| User Login | Passed | Email/password auth, returns JWT token (24h expiry) |
| Demo Auto-Login | Passed | 3 demo accounts with one-click access |
| Token Verification (/me) | Passed | Returns user profile, rejects expired/invalid tokens |
| Logout | Passed | Clears localStorage, redirects to landing |
| Protected Routes | Passed | Redirects unauthenticated users to /login |

### Skill Assessment (Assess Page)
| Feature | Status | Notes |
|---------|--------|-------|
| Resume Text Input | Passed | Accepts 20-15,000 characters |
| Load Sample Resume | Passed | Pre-fills textarea with sample content |
| AI Skill Extraction | Passed | Returns categorized skills with proficiency scores |
| Skills Display | Passed | Grouped by category with progress bars |
| Rate Limiting | Passed | 20 requests per 15-minute window |

### Career Explorer (Explore Page)
| Feature | Status | Notes |
|---------|--------|-------|
| D3 Force Graph | Passed | Interactive bubble chart with zoom/drag |
| Node Click Detail Panel | Passed | Shows salary, growth, feasibility, skill gaps |
| Tooltip on Hover | Passed | XSS-safe HTML escaping applied |
| Start Path / Generate Roadmap | Passed | Creates learning roadmap, navigates to /roadmap |
| Empty State | Passed | Shows prompt to assess skills first |

### Learning Roadmap (Roadmap Page)
| Feature | Status | Notes |
|---------|--------|-------|
| 12-Week Roadmap Display | Passed | Expandable week sections with resources |
| Week Completion Toggle | Passed | Checkbox updates progress via PATCH API |
| Progress Bar | Passed | Calculates and displays overall % |
| Career Path Info Bar | Passed | Shows source role, target role, salary, growth |
| Back to Explorer Link | Passed | Client-side navigation (React Router) |

### Job Board (Jobs Page)
| Feature | Status | Notes |
|---------|--------|-------|
| AI-Matched Job Listings | Passed | Match scores based on user skills |
| Search by Title/Company | Passed | Client-side filter, case-insensitive |
| Filter by Role | Passed | Server-side filter via query parameter |
| Bookmark/Save Jobs | Passed | POST/DELETE toggle with toast confirmation |
| Expandable Job Details | Passed | Description, type, matching/missing skills |

### Career Resources (Resources Page)
| Feature | Status | Notes |
|---------|--------|-------|
| Pre-Landing Resources Tab | Passed | Resume, Interview, Networking sections |
| Post-Landing Resources Tab | Passed | Onboarding, Growth, Community sections |
| Tab Switching | Passed | Active tab highlighting with teal ring |
| CTA Buttons | Passed | Fixed: Changed from `<a href>` to React Router `<Link>` |

### Dashboard
| Feature | Status | Notes |
|---------|--------|-------|
| Stats Cards (4) | Passed | Skills, Career Paths, Roadmaps, Progress |
| Quick Action Cards (3) | Passed | Assess Skills, Explore Careers, Job Board |
| Career Journey Tracker | Passed | 6-step timeline with auto-detection |
| Recent Activity Feed | Passed | Last 20 actions with formatted labels |
| Skill Profile Summary | Passed | Top skills with proficiency bars |

### Settings Page
| Feature | Status | Notes |
|---------|--------|-------|
| Edit Name | Passed | 2-100 chars, required |
| Edit Current Role | Passed | Max 100 chars, optional |
| Edit Years of Experience | Passed | Validated 0-50 range |
| Save Changes | Passed | PATCH API, reloads page on success |
| Email (Read-only) | Passed | Disabled field, cannot be changed |

### Other Pages
| Feature | Status | Notes |
|---------|--------|-------|
| Landing Page | Passed | Hero, stats, features, how-it-works sections |
| AI Insights Page | Passed | Static content, 6 trending roles, 4 industry shifts |
| 404 Not Found | Passed | Shows on any undefined route |
| Error Boundary | Passed | Catches React crashes, shows refresh button |
| Navbar (Desktop) | Passed | Active link highlighting, user dropdown |
| Navbar (Mobile) | Passed | Hamburger menu, all links accessible |
| Footer | Passed | Navigation links, dynamic copyright year |

---

## 2. Bugs Found & Fixed

| # | Bug | Location | Fix Applied |
|---|-----|----------|-------------|
| 1 | Resources CTA buttons used `<a href>` causing full page reloads | Resources.jsx | Changed to React Router `<Link to>` for client-side navigation |
| 2 | Demo password "demo123" rejected after min-length increase to 8 | Login.jsx, Register.jsx, seed.js | Updated all demo passwords to "demo1234" |
| 3 | D3 tooltip injected unescaped HTML (XSS vulnerability) | Explore.jsx | Added `esc()` function to escape all interpolated values |
| 4 | DB errors silently swallowed, returning empty results | db.js | Added `console.error()` logging in catch blocks |
| 5 | Career path data accessible by other users (IDOR) | roadmap.js:114 | Added `AND user_id = ?` to SQL query |

---

## 3. Security Measures Implemented

### Critical Fixes
- **Strong JWT Secret**: Replaced weak `careerpivot_dev_secret_key_2024` with 64-character random hex string
- **`.gitignore` Created**: Prevents committing `.env`, `*.db`, `node_modules/`, `dist/`

### Authentication Security
- **Brute Force Protection**: Rate limited login/register to 10 attempts per 15 minutes per IP
- **JWT Expiry Reduced**: From 7 days to 24 hours
- **Password Minimum**: Increased from 6 to 8 characters
- **bcrypt Hashing**: 12 salt rounds for all passwords
- **Generic Error Messages**: "Invalid email or password" prevents email enumeration

### Input Security
- **Parameterized SQL**: All queries use `?` placeholders (no string concatenation)
- **HTML Sanitization**: Server-side `sanitize()` strips HTML tags from all string inputs
- **Input Validation**: Type, length, and pattern checks via `validate()` middleware
- **Job Save Validation**: Type and length checks on job_id (max 100) and job_title (max 200)
- **Settings Field Whitelist**: Only `name`, `current_role`, `years_experience` accepted
- **Years of Experience**: Validated as number, clamped to 0-50 range

### XSS Protection
- **D3 Tooltip Escaping**: All values HTML-escaped before `.html()` injection
- **React JSX**: All dynamic values auto-escaped (no `dangerouslySetInnerHTML` used)
- **Server-side Sanitization**: HTML tags stripped before database storage

### API Security
- **Global Rate Limiter**: 100 requests per minute per IP (DoS protection)
- **AI Rate Limiter**: 20 requests per 15 minutes on assessment/roadmap generation
- **Auth Rate Limiter**: 10 attempts per 15 minutes on login/register
- **CORS Restricted**: Only localhost origins allowed
- **JSON Body Limit**: Capped at 1MB to prevent memory abuse
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy

### Data Protection
- **SELECT Explicit Columns**: Login query no longer uses `SELECT *`, preventing accidental password hash exposure
- **User Scoped Queries**: All database queries filter by `user_id` to prevent unauthorized access
- **IDOR Fixed**: Career path query in roadmap route now includes user ownership check
- **Password Never Returned**: API responses explicitly exclude password field

### Error Handling
- **try-catch on All Routes**: Every route handler wrapped with error propagation to middleware
- **Error Middleware**: Returns generic "Internal server error" for 500s (no stack trace exposure)
- **DB Error Logging**: Database errors now logged to console for debugging
- **Frontend Toast Errors**: All API failures show user-friendly error messages

---

## 4. Test Environment

| Component | Version |
|-----------|---------|
| Node.js | v24.13.0 |
| Express | ^4.21.1 |
| React | ^19.0.0 |
| Vite | ^6.0.3 |
| SQLite (sql.js) | ^1.12.0 |
| bcryptjs | ^2.4.3 |
| jsonwebtoken | ^9.0.2 |

**Build Status**: 0 errors, 0 warnings
**Total Source Files**: 50 files, 10 folders
