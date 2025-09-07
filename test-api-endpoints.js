import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

async function testEndpoints() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test cart endpoint
    console.log('1. Testing cart endpoint...');
    try {
      const cartResponse = await axios.get(`${API_BASE}/cart`, {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      console.log('✅ Cart endpoint responded:', cartResponse.status);
    } catch (error) {
      console.log('❌ Cart endpoint error:', error.response?.status, error.response?.data?.message);
    }

    // Test wishlist endpoint
    console.log('\n2. Testing wishlist endpoint...');
    try {
      const wishlistResponse = await axios.get(`${API_BASE}/wishlist`, {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      console.log('✅ Wishlist endpoint responded:', wishlistResponse.status);
    } catch (error) {
      console.log('❌ Wishlist endpoint error:', error.response?.status, error.response?.data?.message);
    }

    // Test server health
    console.log('\n3. Testing server health...');
    try {
      const healthResponse = await axios.get('http://localhost:5000/');
      console.log('✅ Server is running:', healthResponse.status);
    } catch (error) {
      console.log('❌ Server not responding:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEndpoints(); 