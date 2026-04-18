function adminOnly(req, res, next){
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super')) return next();
  return res.status(403).json({ message: 'forbidden' });
}

function memberOnly(req, res, next){
  if (req.user && req.user.role === 'member') return next();
  return res.status(403).json({ message: 'forbidden' });
}

module.exports = { adminOnly, memberOnly };

