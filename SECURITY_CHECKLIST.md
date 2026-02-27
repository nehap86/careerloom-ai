# CareerLoom AI - Security Checklist

## Authentication & Authorization

- [x] Passwords hashed with bcrypt (12 salt rounds)
- [x] JWT tokens with 24-hour expiration
- [x] Strong 64-character random JWT secret in .env
- [x] Auth middleware verifies token on all protected routes
- [x] Generic error message for login failures (prevents email enumeration)
- [x] Minimum password length: 8 characters
- [x] User data scoped by user_id in all database queries
- [x] IDOR vulnerability fixed (career path ownership check)

## Rate Limiting

- [x] Global rate limiter: 100 requests/minute per IP
- [x] Auth endpoints: 10 attempts per 15 minutes per IP
- [x] AI endpoints: 20 requests per 15 minutes per IP
- [x] Rate limit headers included in responses

## Input Validation & Sanitization

- [x] Server-side validation middleware on all POST/PATCH routes
- [x] Type checking (string, number) for all inputs
- [x] Length limits (minLength, maxLength) enforced
- [x] Email format validated via regex pattern
- [x] HTML tags stripped from all string inputs (XSS prevention)
- [x] Password field excluded from sanitization
- [x] Job save inputs validated (type + length)
- [x] Settings fields whitelisted (name, current_role, years_experience)
- [x] Years of experience validated as number, clamped 0-50

## SQL Injection Prevention

- [x] All SQL queries use parameterized placeholders (?)
- [x] No string concatenation in SQL statements
- [x] Dynamic UPDATE uses whitelisted field names only
- [x] Foreign keys enabled (PRAGMA foreign_keys = ON)

## XSS (Cross-Site Scripting) Prevention

- [x] D3 tooltip values HTML-escaped with esc() function
- [x] No dangerouslySetInnerHTML usage in React components
- [x] Server-side HTML sanitization before database storage
- [x] React JSX auto-escapes all dynamic content

## API Security

- [x] CORS restricted to specific localhost origins
- [x] JSON body size limited to 1MB
- [x] Security headers: X-Content-Type-Options: nosniff
- [x] Security headers: X-Frame-Options: DENY
- [x] Security headers: X-XSS-Protection: 1; mode=block
- [x] Security headers: Referrer-Policy: strict-origin-when-cross-origin
- [x] Error responses don't expose stack traces or internal details

## Data Protection

- [x] .gitignore excludes .env, *.db, node_modules/
- [x] SELECT queries use explicit columns (not SELECT *)
- [x] Password hash never included in API responses
- [x] Database errors logged server-side (not exposed to client)
- [x] Cascading deletes via foreign key constraints

## Error Handling

- [x] try-catch blocks on all route handlers
- [x] Centralized error middleware returns generic 500 messages
- [x] Database layer logs errors to console
- [x] Frontend shows user-friendly toast notifications for all failures
- [x] React ErrorBoundary catches unhandled component crashes

## Audit Summary

| Severity | Found | Fixed |
|----------|-------|-------|
| Critical | 2 | 2 |
| High | 2 | 2 |
| Medium | 9 | 9 |
| Low | 6 | 6 |
| **Total** | **19** | **19** |
