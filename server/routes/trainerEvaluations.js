const express = require('express');
const router = express.Router();
const repo = require('../repositories/trainerEvaluationRepo');
const { rateLimiter } = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/roles');

router.post('/', rateLimiter({ windowMs: 60000, max: 30 }), async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const b = req.body || {};
    const today = new Date().toISOString().slice(0,10);
    const overallRaw = parseInt(b.overallRating, 10);
    const overall = isNaN(overallRaw) ? 3 : Math.max(1, Math.min(5, overallRaw));
    const trainerName = (b.trainerName || '').trim();
    if (!trainerName){
      return res.status(400).json({ message: 'missing_required' });
    }
    const sanitizeRating = (v)=>{
      const n = parseInt(v,10);
      return isNaN(n) ? overall : Math.max(1, Math.min(5, n));
    };
    const rec = (b.recommendTrainer || 'maybe');
    const data = {
      member_name: (b.memberName || 'غير محدد').slice(0,128),
      membership_number: (b.membershipNumber || 'NA').slice(0,64),
      trainer_name: trainerName.slice(0,128),
      session_date: (b.sessionDate || today),
      overall_rating: overall,
      professionalism_rating: sanitizeRating(b.professionalismRating),
      knowledge_rating: sanitizeRating(b.knowledgeRating),
      communication_rating: sanitizeRating(b.communicationRating),
      punctuality_rating: sanitizeRating(b.punctualityRating),
      motivation_rating: sanitizeRating(b.motivationRating),
      positive_aspects: b.positiveAspects || null,
      improvement_areas: b.improvementAreas || null,
      additional_comments: b.additionalComments || null,
      recommend_trainer: ['yes','no','maybe'].includes(rec) ? rec : 'maybe',
    };
    const row = await repo.createTrainerEvaluation(pool, data);
    res.status(201).json(row);
  }catch(e){
    res.status(400).json({ message: e.message || 'invalid_data' });
  }
});

module.exports = router;
router.get('/', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const { q, trainer_name } = req.query;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '20');
    const data = await repo.listTrainerEvaluations(pool, { q, trainer_name, page, limit });
    res.json({ items: data.items, page, limit, total: data.total });
  }catch(e){
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

function esc(v){
  if (v === null || v === undefined) return '';
  const s = String(v).replace(/"/g,'""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

router.get('/export', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const { q, trainer_name } = req.query;
    const data = await repo.listTrainerEvaluations(pool, { q, trainer_name, page:1, limit:100000 });
    const headers = ['id','member_name','membership_number','trainer_name','session_date','overall_rating','professionalism_rating','knowledge_rating','communication_rating','punctuality_rating','motivation_rating','recommend_trainer','created_at'];
    const rows = data.items.map(r => [r.id, r.member_name, r.membership_number, r.trainer_name, r.session_date, r.overall_rating, r.professionalism_rating, r.knowledge_rating, r.communication_rating, r.punctuality_rating, r.motivation_rating, r.recommend_trainer, r.created_at]);
    const csv = [headers.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\n');
    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.set('Content-Disposition', 'attachment; filename="trainer_evaluations.csv"');
    res.send(csv);
  }catch(e){ res.status(500).json({ message: e.message || 'server_error' }); }
});

router.delete('/:id', auth, adminOnly, async (req,res)=>{
  try{
    const pool = req.app.locals.mysql;
    const id = parseInt(req.params.id||'0');
    if (!id) return res.status(400).json({ message: 'invalid_id' });
    const r = await repo.deleteTrainerEvaluation(pool, id);
    res.json(r);
  }catch(e){ res.status(500).json({ message: e.message || 'server_error' }); }
});
