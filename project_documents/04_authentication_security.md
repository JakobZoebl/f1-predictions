# F1 PREDICTIONS - SECTION 4: AUTHENTICATION & SECURITY

## Copy-paste this when setting up Supabase Auth and security

---

## AUTHENTICATION SYSTEM

### Provider: Supabase Auth

**Primary Method:** Email + Password
**Optional:** Google OAuth (for easier signup)

---

## PASSWORD REQUIREMENTS

**IMPORTANT:** Keep password requirements minimal for friend group
- **Minimum length:** 8 characters
- **No special requirements** (allow all characters)
- **Reasoning:** This is for friends, not a banking app. User convenience > strict security

**Implementation:**
```typescript
// Zod validation schema
const signupSchema = z.object({
  email: z.string().email("Valid email required"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, _ and -"),
  display_name: z.string()
    .min(1, "Display name required")
    .max(50),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"]
})
```

---

## AUTHENTICATION FLOW

### Sign Up Flow

1. **User fills form:**
   - Email
   - Username
   - Display name
   - Password
   - Confirm password

2. **Frontend validation:**
   - Check all fields filled
   - Validate email format
   - Check password length (8+ chars)
   - Confirm passwords match
   - Check username format (alphanumeric + _ -)

3. **Supabase signup:**
```typescript
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    data: {
      username: username,
      display_name: display_name
    }
  }
})
```

4. **Create user profile:**
```typescript
// After signup, insert into users table
const { error: profileError } = await supabase
  .from('users')
  .insert({
    id: data.user.id,
    username: username,
    display_name: display_name
  })
```

5. **Email verification:**
   - **Optional for friend group**
   - Enable if you want extra security
   - Configure in Supabase dashboard → Authentication → Email Templates

6. **Redirect to dashboard**

---

### Login Flow

1. **User enters:**
   - Email
   - Password

2. **Optional:** "Remember me" checkbox
   - If checked: session persists for 30 days
   - If unchecked: session expires when browser closes

3. **Supabase login:**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password
})
```

4. **Handle errors:**
   - Invalid credentials: "Email or password incorrect"
   - Too many attempts: "Too many login attempts. Please try again later."
   - Network error: "Connection error. Please check your internet."

5. **Redirect to dashboard**

---

### Password Reset Flow

1. **User clicks "Forgot password"**
2. **Enter email address**
3. **Supabase sends reset email:**
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/reset-password`
})
```

4. **User clicks link in email**
5. **Redirected to reset password page**
6. **Enter new password**
7. **Update password:**
```typescript
const { error } = await supabase.auth.updateUser({
  password: newPassword
})
```

---

### Google OAuth (Optional)

1. **Enable in Supabase:**
   - Dashboard → Authentication → Providers → Google
   - Add Client ID and Secret from Google Cloud Console

2. **Add button to login/signup:**
```typescript
const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
}
```

3. **Create user profile on first OAuth login:**
   - Check if profile exists
   - If not, create with Google display name as username

---

## SESSION MANAGEMENT

### JWT Tokens
- **Handled by Supabase automatically**
- Access token stored in localStorage
- Refresh token for extending sessions

### Session Duration
- **Default:** 1 hour (access token)
- **With refresh:** Up to 30 days
- **Remember me:** Persist refresh token for 30 days

### Session Check
```typescript
// Check if user is authenticated
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  // Redirect to login
}
```

### Auto-refresh
- Supabase automatically refreshes tokens
- No manual intervention needed

---

## ROUTE PROTECTION

### Middleware (middleware.ts)

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Protected routes
  const protectedPaths = [
    '/dashboard',
    '/predictions',
    '/leaderboard',
    '/profile',
    '/admin'
  ]
  
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )
  
  if (isProtectedPath && !session) {
    // Redirect to login
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }
  
  // Admin-only routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()
    
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
  
  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/predictions/:path*',
    '/leaderboard/:path*',
    '/profile/:path*',
    '/admin/:path*'
  ]
}
```

---

## SECURITY MEASURES

### Rate Limiting

**Login Attempts:**
- Use Vercel Edge Config or Upstash Redis
- Limit: 5 failed attempts per email per hour
- After limit: Block for 1 hour

**Implementation:**
```typescript
// Simple in-memory rate limiting (for development)
const loginAttempts = new Map<string, { count: number, resetTime: number }>()

function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const attempt = loginAttempts.get(email)
  
  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(email, { count: 1, resetTime: now + 3600000 }) // 1 hour
    return true
  }
  
  if (attempt.count >= 5) {
    return false // Rate limited
  }
  
  attempt.count++
  return true
}
```

---

### Input Validation

**Always validate on both client and server:**

1. **Frontend (React Hook Form + Zod):**
   - Immediate feedback to user
   - Prevents unnecessary API calls

2. **Backend (API routes):**
   - Security measure (can't trust client)
   - Validate again before database operations

**Validation Points:**
- Email format
- Username format (alphanumeric + _ -)
- Password length
- No SQL injection (use parameterized queries)
- No XSS (sanitize inputs)

---

### Row Level Security (RLS)

**Enable on all user tables:**

```sql
-- See Section 2 for complete RLS policies

-- Key principle: Users can only modify their own data
-- Users can view others' predictions (for leaderboard)
-- Results and races are public (read-only)
```

---

### Environment Variables

**Never commit these to git:**

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...  # Safe for client
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...      # SERVER ONLY - dangerous if exposed
CRON_SECRET=random_string_here_xyz123
```

**Vercel deployment:**
- Add all env vars in Vercel dashboard
- Never log sensitive values
- Use different Supabase projects for dev/prod

---

### CSRF Protection

**Handled by Supabase:**
- Tokens included in requests automatically
- No manual CSRF setup needed

**Additional measures:**
- SameSite cookie attribute
- Origin header checks

---

### SQL Injection Prevention

**Supabase uses parameterized queries:**
```typescript
// ✅ Safe - parameterized
await supabase
  .from('predictions')
  .select('*')
  .eq('user_id', userId)

// ❌ Never do this
await supabase.rpc('unsafe_query', { 
  query: `SELECT * FROM predictions WHERE user_id = '${userId}'` 
})
```

**In custom SQL:**
```sql
-- ✅ Use $1, $2 for parameters
SELECT * FROM predictions WHERE user_id = $1 AND race_id = $2;

-- ❌ Never concatenate strings
SELECT * FROM predictions WHERE user_id = '" + userId + "';
```

---

### XSS Prevention

**React handles most XSS automatically:**
- Escapes strings in JSX
- Sanitizes user input

**Be careful with:**
```typescript
// ❌ Dangerous
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Safe
<div>{userInput}</div>
```

**For rich text (if needed):**
- Use DOMPurify library
- Sanitize before rendering

---

## LOGOUT

```typescript
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut()
  if (!error) {
    router.push('/login')
  }
}
```

---

## SESSION TIMEOUT

**Automatic:**
- Access token expires after 1 hour
- Refresh token extends for 30 days (if remember me)
- Supabase handles refresh automatically

**Manual timeout:**
```typescript
// Force logout after 30 days of inactivity
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

function checkSessionAge() {
  const lastActivity = localStorage.getItem('lastActivity')
  const now = Date.now()
  
  if (lastActivity && (now - parseInt(lastActivity)) > THIRTY_DAYS) {
    supabase.auth.signOut()
  }
  
  localStorage.setItem('lastActivity', now.toString())
}
```

---

## ADMIN ROLE

**Add role column to users table:**
```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';

-- Set yourself as admin
UPDATE users SET role = 'admin' WHERE username = 'your_username';
```

**Check admin status:**
```typescript
async function isAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()
  
  return data?.role === 'admin'
}
```

---

## SECURITY CHECKLIST

- [ ] Supabase RLS enabled on all tables
- [ ] Environment variables not committed to git
- [ ] Different Supabase projects for dev/prod
- [ ] Service role key only used server-side
- [ ] Input validation on client and server
- [ ] Rate limiting on login endpoint
- [ ] HTTPS only (Vercel provides automatically)
- [ ] Session timeout configured
- [ ] Password reset flow tested
- [ ] Admin routes protected
- [ ] No sensitive data in client console.log
- [ ] SQL queries parameterized
- [ ] User input sanitized
- [ ] Email verification (optional but recommended)

---

## Use this for:
1. Setting up Supabase Auth
2. Implementing login/signup forms
3. Protecting routes with middleware
4. Configuring RLS policies
5. Handling sessions and tokens
6. Adding admin functionality
7. Securing API endpoints
