const axios = require('axios');

const endpoints = [
  '/api/customers',
  '/api/members',
  '/api/activities',
  '/api/trainers',
  '/api/events',
  '/api/bookings',
  // '/api/reports/sales?start=2023-01-01&end=2024-01-01',
  '/api/payments',
  '/api/orders',
  '/api/membership-packages',
  '/api/memberships',
  '/api/surveys',
  // '/api/forms', // Not sure if this exists as a direct get
  '/api/contact',
  '/api/settings',
  '/api/trainer-evaluations'
];

async function testAll() {
  console.log('Testing Admin API Endpoints against Supabase Backend...\n');
  let allGood = true;

  for (const ep of endpoints) {
    try {
      const url = `http://localhost:3001${ep}`;
      const res = await axios.get(url);
      console.log(`[OK] GET ${ep} -> Status: ${res.status}, Records: ${Array.isArray(res.data) ? res.data.length : (res.data.data ? res.data.data.length : 'Object')}`);
    } catch (err) {
      allGood = false;
      const status = err.response ? err.response.status : 'Network Error';
      const msg = err.response && err.response.data ? JSON.stringify(err.response.data) : err.message;
      console.error(`[FAIL] GET ${ep} -> Status: ${status}, Error: ${msg}`);
    }
  }

  console.log('\nTest Summary: ' + (allGood ? 'ALL ENDPOINTS OK' : 'SOME ENDPOINTS FAILED'));
}

testAll();
