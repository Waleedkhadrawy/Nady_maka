import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function ActivitiesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ name: '', category: '', age_group: '', duration_minutes: '', price: '', currency: 'ريال', capacity: '', image: '', status: 'available' });
  const [editingId, setEditingId] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [assignTrainerId, setAssignTrainerId] = useState('');
  const [schedule, setSchedule] = useState([{ day_of_week: 0, start_time: '10:00:00', end_time: '11:00:00' }]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.listActivities({ q, category: categoryFilter, age_group: ageFilter, status: statusFilter, page, limit });
      setRows(res.items || []);
      setPage(res.page || 1);
      setLimit(res.limit || 20);
      setTotal(res.total || 0);
      const ts = await api.listTrainers();
      setTrainers(ts);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.updateActivity(editingId, form); else await api.createActivity(form);
      setForm({ name: '', category: '', age_group: '', duration_minutes: '', price: '', currency: 'ريال', capacity: '', image: '', status: 'available' });
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.message || 'خطأ في حفظ النشاط');
    }
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setForm({ name: row.name||'', category: row.category||'', age_group: row.age_group||'', duration_minutes: row.duration_minutes||'', price: row.price||'', currency: row.currency||'ريال', capacity: row.capacity||'', image: row.image||'', status: row.status||'available' });
  };

  const remove = async (id) => { if (!window.confirm('حذف النشاط؟')) return; await api.deleteActivity(id); load(); };

  const saveSchedule = async () => { if (!editingId) return; try { await api.setActivitySchedules(editingId, schedule); toast.success('تم حفظ الجدول'); } catch (err) { toast.error(err.message || 'تعذر حفظ الجدول'); } };
  const assignTrainer = async () => { if (!editingId || !assignTrainerId) return; try { await api.assignTrainerToActivity(editingId, assignTrainerId); toast.success('تم ربط المدرب'); } catch (err) { toast.error(err.message || 'تعذر ربط المدرب'); } };

  return (
    <AdminLayout>
      <h2>إدارة الأنشطة</h2>
      <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
        <input type="text" placeholder="بحث بالاسم/الفئة" value={q} onChange={(e)=>setQ(e.target.value)} />
        <input placeholder="الفئة" value={categoryFilter} onChange={(e)=>setCategoryFilter(e.target.value)} />
        <input placeholder="العمر" value={ageFilter} onChange={(e)=>setAgeFilter(e.target.value)} />
        <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
          <option value="">كل الحالات</option>
          <option value="available">متاح</option>
          <option value="closed">مغلق</option>
        </select>
        <button onClick={()=>{ setPage(1); load(); }} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تحديث</button>
      </div>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
        <input required placeholder="اسم النشاط" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
        <input placeholder="الفئة" value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} />
        <input placeholder="الفئة العمرية" value={form.age_group} onChange={(e)=>setForm({...form, age_group:e.target.value})} />
        <input placeholder="المدة بالدقائق" value={form.duration_minutes} onChange={(e)=>setForm({...form, duration_minutes:e.target.value})} />
        <input placeholder="السعر" value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} />
        <input placeholder="العملة" value={form.currency} onChange={(e)=>setForm({...form, currency:e.target.value})} />
        <input placeholder="السعة" value={form.capacity} onChange={(e)=>setForm({...form, capacity:e.target.value})} />
        <input placeholder="الصورة" value={form.image} onChange={(e)=>setForm({...form, image:e.target.value})} />
        <select value={form.status} onChange={(e)=>setForm({...form, status:e.target.value})}>
          <option value="available">متاح</option>
          <option value="closed">مغلق</option>
        </select>
        <button type="submit" style={{ gridColumn: '1 / -1', background: '#16a34a', color: '#fff', border: 0, padding: '10px 16px', borderRadius: 6 }}>{editingId ? 'تحديث' : 'إضافة'}</button>
      </form>

      {editingId && (
        <div style={{ background: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <h3>جدول النشاط</h3>
          {schedule.map((s, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8 }}>
              <input type="number" min="0" max="6" value={s.day_of_week} onChange={(e)=>{ const v=[...schedule]; v[idx].day_of_week=Number(e.target.value); setSchedule(v); }} />
              <input value={s.start_time} onChange={(e)=>{ const v=[...schedule]; v[idx].start_time=e.target.value; setSchedule(v); }} />
              <input value={s.end_time} onChange={(e)=>{ const v=[...schedule]; v[idx].end_time=e.target.value; setSchedule(v); }} />
              <button onClick={()=>{ const v=[...schedule]; v.splice(idx,1); setSchedule(v); }} style={{ background:'#ef4444', color:'#fff', border:0, borderRadius:6 }}>حذف</button>
            </div>
          ))}
          <div style={{ display:'flex', gap:8, marginTop:8 }}>
            <button onClick={()=>setSchedule([...schedule,{ day_of_week:0, start_time:'10:00:00', end_time:'11:00:00' }])} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>إضافة سطر</button>
            <button onClick={saveSchedule} style={{ background:'#16a34a', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>حفظ الجدول</button>
          </div>

          <h3 style={{ marginTop:16 }}>ربط مدرب</h3>
          <div style={{ display:'flex', gap:8 }}>
            <select value={assignTrainerId} onChange={(e)=>setAssignTrainerId(e.target.value)}>
              <option value="">اختر المدرب</option>
              {trainers.map(t=> (<option key={t.id} value={t.id}>{t.name}</option>))}
            </select>
            <button onClick={assignTrainer} style={{ background:'#16a34a', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>ربط</button>
          </div>
        </div>
      )}

      <div style={{ overflowX:'auto', background:'#fff', borderRadius:8 }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f1f5f9' }}>
              <th style={{ padding:8 }}>الاسم</th>
              <th style={{ padding:8 }}>الفئة</th>
              <th style={{ padding:8 }}>العمر</th>
              <th style={{ padding:8 }}>السعر</th>
              <th style={{ padding:8 }}>السعة</th>
              <th style={{ padding:8 }}>الحالة</th>
              <th style={{ padding:8 }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan="7" style={{ padding:16 }}>جاري التحميل...</td></tr>) : rows.length===0 ? (<tr><td colSpan="7" style={{ padding:16 }}>لا توجد بيانات</td></tr>) : rows.map(r=> (
              <tr key={r.id}>
                <td style={{ padding:8 }}>{r.name}</td>
                <td style={{ padding:8 }}>{r.category}</td>
                <td style={{ padding:8 }}>{r.age_group}</td>
                <td style={{ padding:8 }}>{r.price} {r.currency}</td>
                <td style={{ padding:8 }}>{r.capacity}</td>
                <td style={{ padding:8 }}>{r.status}</td>
                <td style={{ padding:8, display:'flex', gap:8 }}>
                  <button onClick={()=>startEdit(r)} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تعديل</button>
                  <button onClick={()=>remove(r.id)} style={{ background:'#ef4444', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:12 }}>
        <button disabled={page<=1} onClick={()=>{ setPage(p=>Math.max(1,p-1)); load(); }} style={{ padding:'6px 10px' }}>السابق</button>
        <span>صفحة {page} من {Math.max(1, Math.ceil(total/limit))}</span>
        <button disabled={page >= Math.ceil(total/limit)} onClick={()=>{ setPage(p=>p+1); load(); }} style={{ padding:'6px 10px' }}>التالي</button>
        <select value={limit} onChange={(e)=>{ const v = parseInt(e.target.value)||20; setLimit(v); setPage(1); load(); }}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>إجمالي: {total}</span>
      </div>
    </AdminLayout>
  );
}
