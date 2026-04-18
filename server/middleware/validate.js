function requireFields(fields){
  return (req,res,next)=>{
    const body = req.body || {};
    for(const f of fields){
      if (body[f] === undefined || body[f] === null || (typeof body[f] === 'string' && body[f].trim()==='')){
        return res.status(400).json({ message: `missing_${f}` });
      }
    }
    next();
  };
}

module.exports = { requireFields };

