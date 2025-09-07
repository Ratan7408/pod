# JWT Token Refresh System - ANIME INDIA

## Overview

This document explains the JWT token refresh system implemented in the ANIME INDIA Print-on-Demand website to handle token expiration gracefully.

## Problem Solved

The original system had JWT tokens expiring after 1 hour, causing users to be logged out unexpectedly. The new system provides:

1. **Automatic token refresh** when tokens expire
2. **Proactive token refresh** before expiration
3. **Silent background refresh** without user interruption
4. **Better error handling** for expired tokens

## How It Works

### 1. Token Structure
- **Access Token**: Short-lived (1 hour by default) for API requests
- **Refresh Token**: Long-lived (7 days by default) for getting new access tokens

### 2. Automatic Refresh Flow
```
User makes API request → Token expired → 
Auto-refresh with refresh token → 
Get new access token → 
Retry original request → 
User gets response (seamless)
```

### 3. Proactive Refresh
- Checks if token expires within 5 minutes
- Refreshes token in background before expiration
- Runs every minute when user is authenticated

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=1h          # Access token expiration
JWT_REFRESH_EXPIRE=7d  # Refresh token expiration
```

### Token Expiration Times

| Token Type | Default | Description |
|------------|---------|-------------|
| Access Token | 1 hour | Used for API requests |
| Refresh Token | 7 days | Used to get new access tokens |
| Email Verification | 1 day | For email verification |
| Password Reset | 1 hour | For password reset |

## Implementation Details

### Frontend (React/TypeScript)

#### 1. API Layer (`client/src/lib/api.ts`)
- Automatic token refresh in `apiRequest` function
- Queue system for multiple concurrent requests during refresh
- Proactive token refresh in `tokenManager`

#### 2. Auth Context (`client/src/contexts/AuthContext.tsx`)
- Periodic token refresh check (every minute)
- Better error handling for expired tokens
- Seamless user experience

### Backend (Node.js/Express)

#### 1. Token Generation (`server/models/user.js`)
- Uses environment variables for expiration times
- Generates both access and refresh tokens
- Stores refresh tokens in user document

#### 2. Refresh Endpoint (`server/routes/auth.js`)
- Validates refresh token
- Generates new access and refresh tokens
- Updates user's refresh token list

## Usage Examples

### Login Response
```json
{
  "success": true,
  "message": "Login successful!",
  "user": { ... },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Refresh Token Response
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## Error Handling

### Token Expired
- Automatically attempts refresh
- If refresh fails, clears tokens and redirects to login
- Shows user-friendly message: "Session expired. Please login again."

### Network Errors
- Retries failed requests after token refresh
- Graceful degradation if refresh fails

## Security Features

1. **Token Rotation**: New refresh token issued with each refresh
2. **Token Storage**: Refresh tokens stored securely in database
3. **Token Cleanup**: Expired refresh tokens automatically removed
4. **Logout**: Clears all refresh tokens for user

## Testing

### Test Token Expiration
1. Set `JWT_EXPIRE=1m` for quick testing
2. Login and wait for token to expire
3. Make API request - should auto-refresh seamlessly

### Test Refresh Token Expiration
1. Set `JWT_REFRESH_EXPIRE=1m` for quick testing
2. Wait for refresh token to expire
3. Next API request should require re-login

## Troubleshooting

### Common Issues

1. **"Session expired" message appears frequently**
   - Check if `JWT_EXPIRE` is set too short
   - Verify refresh token endpoint is working

2. **Users getting logged out unexpectedly**
   - Check if `JWT_REFRESH_EXPIRE` is set too short
   - Verify refresh tokens are being stored correctly

3. **Token refresh not working**
   - Check browser console for errors
   - Verify refresh token is being sent correctly
   - Check server logs for refresh endpoint errors

### Debug Mode

Add this to your frontend for debugging:

```typescript
// In browser console
localStorage.getItem('auth_token') // Check current token
localStorage.getItem('refresh_token') // Check refresh token
```

## Production Considerations

1. **Use strong secrets**: Generate cryptographically secure secrets
2. **HTTPS only**: Ensure all API calls use HTTPS
3. **Token storage**: Consider using httpOnly cookies for better security
4. **Rate limiting**: Implement rate limiting on refresh endpoint
5. **Monitoring**: Log token refresh attempts for security monitoring

## Migration from Old System

The new system is backward compatible. Existing users will:
1. Need to login again (to get refresh tokens)
2. Experience seamless token refresh going forward
3. No data loss or breaking changes

## Support

For issues with the token refresh system:
1. Check server logs for JWT errors
2. Verify environment variables are set correctly
3. Test with shorter expiration times for debugging
4. Check browser network tab for failed refresh requests 