const { Client } = require('pg');

async function checkBookings() {
  const client = new Client({
    connectionString: 'postgresql://postgres.ufbhziylkofuihkkkzwa:Waleed%402026%40@aws-1-eu-central-1.pooler.supabase.com:5432/postgres'
  });

  try {
    await client.connect();
    
    // Check bookings
    const bookingsRes = await client.query('SELECT * FROM bookings ORDER BY scheduled_at DESC LIMIT 5');
    console.log('--- Bookings ---');
    console.log('Total bookings found:', bookingsRes.rowCount);
    console.log(bookingsRes.rows);

    // Also check events in case they meant event_registrations
    const eventsRes = await client.query('SELECT * FROM event_registrations ORDER BY registered_at DESC LIMIT 5');
    console.log('\n--- Event Registrations ---');
    console.log('Total event registrations found:', eventsRes.rowCount);
    console.log(eventsRes.rows);

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

checkBookings();
