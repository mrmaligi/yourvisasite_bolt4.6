# VisaBuild Role System & Permissions

## Role Hierarchy

```
Admin (Superuser)
  ├── Full system access
  ├── Can manage all users
  ├── Can manage all content
  └── Can impersonate any role

Lawyer (Verified)
  ├── Own dashboard
  ├── Client management
  ├── Consultation booking
  ├── Document access (client-shared)
  └── Cannot access admin features

User (Applicant)
  ├── Own profile
  ├── Visa applications
  ├── Document upload
  ├── Book consultations
  └── Cannot access lawyer/admin features
```

## Permission Matrix

| Feature | Admin | Lawyer | User | Anonymous |
|---------|-------|--------|------|-----------|
| **Public Pages** |
| View Visas | ✅ | ✅ | ✅ | ✅ |
| View Lawyers | ✅ | ✅ | ✅ | ✅ |
| Read News | ✅ | ✅ | ✅ | ✅ |
| Read Forum | ✅ | ✅ | ✅ | ✅ |
| **Auth** |
| Register/Login | ✅ | ✅ | ✅ | ✅ |
| Password Reset | ✅ | ✅ | ✅ | ✅ |
| **User Dashboard** |
| View Own Profile | ✅ | ✅ | ✅ | ❌ |
| Edit Own Profile | ✅ | ✅ | ✅ | ❌ |
| Saved Visas | ✅ | ✅ | ✅ | ❌ |
| Documents | ✅ | ✅ | ✅ | ❌ |
| Book Consultation | ✅ | ✅ | ✅ | ❌ |
| **Lawyer Dashboard** |
| Lawyer Dashboard | ✅ | ✅ | ❌ | ❌ |
| Client Management | ✅ | ✅ | ❌ | ❌ |
| Availability Settings | ✅ | ✅ | ❌ | ❌ |
| View Other Lawyers | ✅ | ✅ | ✅ | ✅ |
| **Admin Dashboard** |
| Admin Dashboard | ✅ | ❌ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ |
| Lawyer Management | ✅ | ❌ | ❌ | ❌ |
| Content Management | ✅ | ❌ | ❌ | ❌ |
| System Settings | ✅ | ❌ | ❌ | ❌ |
| **Data Access** |
| Read Own Data | ✅ | ✅ | ✅ | ❌ |
| Write Own Data | ✅ | ✅ | ✅ | ❌ |
| Read Other User Data | ✅ | ❌ | ❌ | ❌ |
| Write Other User Data | ✅ | ❌ | ❌ | ❌ |
| Read System Data | ✅ | ❌ | ❌ | ❌ |

## Role Guard Logic

### ProtectedRoute Component
```typescript
// Checks:
1. User authenticated?
2. User role in allowedRoles?
3. User is_active?
4. (Optional) User verified?

// Redirects:
- Not authenticated → /login
- Wrong role → /dashboard (user), /lawyer/dashboard (lawyer), /admin (admin)
- Inactive → Error page
```

### Role-Specific Guards

```typescript
// UserOnly - Allows: user, admin
<ProtectedRoute allowedRoles={['user', 'admin']}>

// LawyerOnly - Allows: lawyer (must be verified)
<ProtectedRoute allowedRoles={['lawyer']} requireVerification={true}>

// AdminOnly - Allows: admin only
<ProtectedRoute allowedRoles={['admin']}>
```

## Backend RLS Policies

### profiles table
- `Users can view own profile` - SELECT (auth.uid() = id)
- `Public can view verified lawyers` - SELECT (role = 'lawyer' AND is_verified = true)
- `Users can update own profile` - UPDATE (auth.uid() = id)
- `Users can insert own profile` - INSERT (auth.uid() = id)
- `Admins have full access` - ALL (is_admin())

### lawyer_profiles table
- `lawyer_read_all` - SELECT (true) - Public can view
- `lawyer_update_self` - ALL (auth.uid() = user_id)

### All Other Tables
- Admin policies use `is_admin()` function
- User policies check `auth.uid()` match
- Public policies allow anonymous read where appropriate

## Frontend Route Protection

```
Public Routes (no auth needed):
  /, /login, /register, /visas, /lawyers, /news, /forum, etc.

Protected Routes (require auth):
  User Routes:
    /dashboard/*
    
  Lawyer Routes (require lawyer role):
    /lawyer/dashboard
    /lawyer/clients
    /lawyer/consultations
    
  Admin Routes (require admin role):
    /admin
    /admin/users
    /admin/lawyers
    /admin/*
```

## Cross-Role Interactions

### User → Lawyer
- User can browse lawyer directory
- User can view lawyer profiles (public info)
- User can book consultation with lawyer
- User can message lawyer (once connected)
- User can review lawyer (after consultation)

### Lawyer → User
- Lawyer can view connected client profiles
- Lawyer can view client documents (shared)
- Lawyer can message clients
- Lawyer can update case status
- Lawyer CANNOT access non-client user data

### Admin → All
- Admin can view/edit all user profiles
- Admin can approve/reject lawyers
- Admin can manage all content
- Admin can view system analytics
- Admin can impersonate users (for support)

## Edge Cases

1. **Unverified Lawyer**: Sees pending page, cannot access dashboard
2. **Inactive User**: Cannot login, sees disabled message
3. **Deleted Account**: Cannot login, data retained for legal
4. **Role Change**: Logout required for changes to take effect
