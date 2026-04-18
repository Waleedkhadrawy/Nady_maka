const buckets = new Map();

function rateLimiter({ windowMs = 60000, max = 30 } = {}){
  return (req,res,next)=>{
    const key = req.ip + '|' + (req.baseUrl || '') + (req.path || '');
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || now - b.ts > windowMs){ b = { ts: now, count: 0 }; buckets.set(key, b); }
    b.count++;
    if (b.count > max) return res.status(429).json({ message: 'too_many_requests' });
    next();
  };
}

module.exports = { rateLimiter };

