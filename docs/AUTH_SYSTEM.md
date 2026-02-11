# Authentication & Encryption System

This document explains the authentication and encryption system implemented in this application.

## Overview

The system implements:
- **Email + Password Authentication** with bcrypt hashing
- **Client-side Encryption** using Web Crypto API
- **Data Encryption Key (DEK)** encrypted with password-derived key
- **Multi-device Support** via encrypted DEK storage on server

## Architecture

### Password Flow

1. **Registration**:
   - User enters email, username, and password
   - Password is hashed server-side with bcrypt (12 rounds)
   - Client generates a random DEK (Data Encryption Key)
   - DEK is encrypted with a password-derived key (PBKDF2)
   - Encrypted DEK + salt are stored on server
   - Password hash is stored on server

2. **Login**:
   - User enters email and password
   - Server verifies password hash with bcrypt
   - Server returns encrypted DEK
   - Client decrypts DEK using password-derived key
   - DEK is stored in sessionStorage for the session

### Encryption Flow

- **DEK (Data Encryption Key)**: Random 256-bit AES-GCM key generated per user
- **Password-derived Key**: Derived from password using PBKDF2 (100,000 iterations)
- **Data Encryption**: All sensitive data encrypted with DEK client-side
- **Server Storage**: Only encrypted blobs are stored on server

## File Structure

```
lib/
  crypto.ts          # Client-side encryption utilities
  session.ts         # JWT session management
  useAuth.ts         # React hook for auth state

actions/auth/
  register.ts        # Registration server action
  login.ts           # Login server action
  logout.ts          # Logout server action
  getCurrentUser.ts  # Get current user server action

app/
  login/page.tsx     # Login page
  register/page.tsx  # Registration page

proxy.ts             # Route protection proxy
```

## Database Schema

### Users Table
- `id`: UUID (primary key)
- `email`: Unique email address
- `userName`: Unique username
- `passwordHash`: bcrypt hash of password
- `encryptedDEK`: JSON string containing encrypted DEK and salt
- `createdAt`, `updatedAt`: Timestamps

## Security Features

### Password Security
- ✅ Passwords never stored in plaintext
- ✅ bcrypt hashing with 12 rounds
- ✅ Minimum 8 character requirement

### Encryption Security
- ✅ AES-GCM 256-bit encryption
- ✅ PBKDF2 key derivation (100,000 iterations)
- ✅ Random salt per user
- ✅ Random IV for each encryption operation
- ✅ All encryption/decryption happens client-side

### Session Security
- ✅ JWT tokens in HTTP-only cookies
- ✅ 7-day expiration
- ✅ Secure flag in production
- ✅ SameSite protection

## Usage Examples

### Register a New User

```typescript
import { register, completeRegistration } from "@/actions/auth/register";
import { generateDEK, encryptDEK, exportKey } from "@/lib/crypto";

// 1. Generate DEK client-side
const dek = await generateDEK();

// 2. Encrypt DEK with password
const { encryptedDEK, salt } = await encryptDEK(dek, password);

// 3. Register user
const result = await register(email, userName, password);

// 4. Complete registration with encrypted DEK
await completeRegistration(result.userId, JSON.stringify({ encryptedDEK, salt }));

// 5. Store DEK for session
const dekString = await exportKey(dek);
sessionStorage.setItem("dek", dekString);
```

### Login

```typescript
import { login } from "@/actions/auth/login";
import { decryptDEK, exportKey } from "@/lib/crypto";

// 1. Login
const result = await login(email, password);

// 2. Decrypt DEK
const dekData = JSON.parse(result.encryptedDEK);
const dek = await decryptDEK(dekData.encryptedDEK, dekData.salt, password);

// 3. Store DEK for session
const dekString = await exportKey(dek);
sessionStorage.setItem("dek", dekString);
```

### Encrypt/Decrypt Data

```typescript
import { getDEK } from "@/lib/useAuth";
import { encryptData, decryptData } from "@/lib/crypto";

// Get DEK from session
const dek = await getDEK();

// Encrypt sensitive data
const encrypted = await encryptData(dek, "sensitive data");

// Decrypt data
const decrypted = await decryptData(dek, encrypted);
```

### Use Auth Hook

```typescript
import { useAuth } from "@/lib/useAuth";

function MyComponent() {
  const { user, dek, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>Welcome, {user.userName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Environment Variables

Add to `.env.local`:

```env
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your-secret-key-change-in-production
```

## Dependencies

Required packages:
- `bcrypt` - Password hashing
- `jose` - JWT token creation/verification
- `cookies-next` - Cookie management (optional, using Next.js built-in)

Install with:
```bash
npm install bcrypt jose cookies-next
npm install --save-dev @types/bcrypt
```

## Migration

After updating the schema, generate and run migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Security Considerations

1. **DEK Storage**: Currently stored in sessionStorage. For production, consider:
   - IndexedDB with additional encryption
   - Memory-only storage (cleared on page close)
   - Hardware security modules for sensitive applications

2. **Password Requirements**: Consider adding:
   - Password strength validation
   - Rate limiting on login attempts
   - Two-factor authentication

3. **Session Management**: Consider:
   - Refresh tokens for longer sessions
   - Session invalidation on password change
   - Device tracking and management

4. **Encryption**: Consider:
   - Key rotation mechanisms
   - Backup key escrow (encrypted)
   - Audit logging of encryption operations

## Multi-Device Support

The system supports multi-device access:

1. User logs in on Device A → DEK decrypted and used
2. User logs in on Device B → Same encrypted DEK fetched from server
3. Password unlocks DEK on both devices
4. Each device has independent session but uses same DEK

The encrypted DEK is stored on the server, so it can be accessed from any device with the correct password.
