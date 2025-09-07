// Test script for JWT Token Refresh System
// Run with: node test-jwt-refresh.js

import jwt from 'jsonwebtoken';

// Test configuration
const JWT_SECRET = 'your-secret-key';
const JWT_REFRESH_SECRET = 'your-refresh-secret';
const JWT_EXPIRE = '1m'; // 1 minute for testing
const JWT_REFRESH_EXPIRE = '5m'; // 5 minutes for testing

console.log('🧪 Testing JWT Token Refresh System');
console.log('=====================================\n');

// Test 1: Generate tokens
console.log('1. Generating test tokens...');
const payload = {
  id: 'test-user-id',
  email: 'test@example.com',
  role: 'user'
};

const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRE });

console.log('✅ Access Token:', accessToken.substring(0, 50) + '...');
console.log('✅ Refresh Token:', refreshToken.substring(0, 50) + '...');

// Test 2: Verify tokens are valid
console.log('\n2. Verifying tokens are valid...');
try {
  const decodedAccess = jwt.verify(accessToken, JWT_SECRET);
  const decodedRefresh = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  console.log('✅ Access token is valid, expires:', new Date(decodedAccess.exp * 1000));
  console.log('✅ Refresh token is valid, expires:', new Date(decodedRefresh.exp * 1000));
} catch (error) {
  console.error('❌ Token verification failed:', error.message);
}

// Test 3: Check token expiration logic
console.log('\n3. Testing token expiration logic...');
const isTokenExpiringSoon = (token, secret, thresholdMinutes = 5) => {
  try {
    const decoded = jwt.verify(token, secret);
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const threshold = thresholdMinutes * 60 * 1000; // Convert to milliseconds
    
    return (expirationTime - currentTime) < threshold;
  } catch (error) {
    return false;
  }
};

const accessExpiringSoon = isTokenExpiringSoon(accessToken, JWT_SECRET, 2);
const refreshExpiringSoon = isTokenExpiringSoon(refreshToken, JWT_REFRESH_SECRET, 2);

console.log('Access token expiring soon (within 2 min):', accessExpiringSoon);
console.log('Refresh token expiring soon (within 2 min):', refreshExpiringSoon);

// Test 4: Simulate token refresh
console.log('\n4. Simulating token refresh...');
try {
  // Verify refresh token
  const decodedRefresh = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  
  // Generate new tokens (remove exp from payload to avoid conflict)
  const { exp, iat, ...payloadWithoutExp } = decodedRefresh;
  const newAccessToken = jwt.sign(payloadWithoutExp, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  const newRefreshToken = jwt.sign(payloadWithoutExp, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRE });
  
  console.log('✅ New access token generated:', newAccessToken.substring(0, 50) + '...');
  console.log('✅ New refresh token generated:', newRefreshToken.substring(0, 50) + '...');
  
  // Verify new tokens
  const newDecodedAccess = jwt.verify(newAccessToken, JWT_SECRET);
  const newDecodedRefresh = jwt.verify(newRefreshToken, JWT_REFRESH_SECRET);
  
  console.log('✅ New access token verified, expires:', new Date(newDecodedAccess.exp * 1000));
  console.log('✅ New refresh token verified, expires:', new Date(newDecodedRefresh.exp * 1000));
  
} catch (error) {
  console.error('❌ Token refresh simulation failed:', error.message);
}

// Test 5: Test expired token handling
console.log('\n5. Testing expired token handling...');
const expiredToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1s' });

// Wait for token to expire
setTimeout(() => {
  try {
    jwt.verify(expiredToken, JWT_SECRET);
    console.log('❌ Expired token should not be valid');
  } catch (error) {
    console.log('✅ Expired token correctly rejected:', error.message);
  }
}, 2000);

console.log('\n🎉 JWT Token Refresh System Test Complete!');
console.log('\nNext steps:');
console.log('1. Start the server: npm run dev:server');
console.log('2. Start the client: npm run dev');
console.log('3. Login and test the automatic token refresh');
console.log('4. Check browser console for refresh logs'); 