async function getSummary(pool){
  const [[membersTotal]] = await pool.query('SELECT COUNT(*) AS c FROM members');
  const [[membersActive]] = await pool.query("SELECT COUNT(*) AS c FROM members WHERE status='active'");
  const [[membersFrozen]] = await pool.query("SELECT COUNT(*) AS c FROM members WHERE status='frozen'");
  const [[membersExpired]] = await pool.query("SELECT COUNT(*) AS c FROM members WHERE status='expired'");

  const [[membershipTotal]] = await pool.query('SELECT COUNT(*) AS c FROM memberships');
  const [[membershipActive]] = await pool.query("SELECT COUNT(*) AS c FROM memberships WHERE status='active'");
  const [[membershipFrozen]] = await pool.query("SELECT COUNT(*) AS c FROM memberships WHERE status='frozen'");
  const [[membershipExpired]] = await pool.query("SELECT COUNT(*) AS c FROM memberships WHERE status='expired'");

  const [[activitiesTotal]] = await pool.query('SELECT COUNT(*) AS c FROM activities');
  const [[trainersTotal]] = await pool.query('SELECT COUNT(*) AS c FROM trainers');
  const [[eventsUpcoming]] = await pool.query('SELECT COUNT(*) AS c FROM events WHERE date >= CURDATE()');
  const [[bookingsTotal]] = await pool.query('SELECT COUNT(*) AS c FROM bookings');
  const [[paymentsCount]] = await pool.query('SELECT COUNT(*) AS c FROM payments');
  const [[paymentsSum]] = await pool.query('SELECT COALESCE(SUM(amount),0) AS s FROM payments');

  return {
    members: { total: membersTotal.c, active: membersActive.c, frozen: membersFrozen.c, expired: membersExpired.c },
    memberships: { total: membershipTotal.c, active: membershipActive.c, frozen: membershipFrozen.c, expired: membershipExpired.c },
    activities: { total: activitiesTotal.c },
    trainers: { total: trainersTotal.c },
    events: { upcoming: eventsUpcoming.c },
    bookings: { total: bookingsTotal.c },
    payments: { count: paymentsCount.c, sum: paymentsSum.s },
  };
}

module.exports = { getSummary };

