import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function TrainersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', specialization: '', experience_years: '', certification: '', status: 'active' });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.listTrainers({ q, status: statusFilter, page, limit });
      setRows(res.items || []);
      setPage(res.page || 1);
      setLimit(res.limit || 20);
      setTotal(res.total || 0);
    } finally { setLoading(false); }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.updateTrainer(editingId, form); else await api.createTrainer(form);
      setForm({ name: '', email: '', phone: '', specialization: '', experience_years: '', certification: '', status: 'active' });
      setEditingId(null);
      load();
    } catch (err) { toast.error(err.message || 'خطأ في حفظ المدرب'); }
  };

  const startEdit = (r) => { setEditingId(r.id); setForm({ name:r.name||'', email:r.email||'', phone:r.phone||'', specialization:r.specialization||'', experience_years:r.experience_years||'', certification:r.certification||'', status:r.status||'active' }); };
  const remove = async (id) => { if (!window.confirm('حذف المدرب؟')) return; await api.deleteTrainer(id); load(); };

  return (
    <AdminLayout>
      <h2>إدارة المدربين</h2>
      <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
        <input type="text" placeholder="بحث بالاسم/البريد/الجوال/التخصص" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
          <option value="">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>
        <button onClick={()=>{ setPage(1); load(); }} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تحديث</button>
      </div>
      <form onSubmit={submit} style={{ display:'grid', gap:8, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', background:'#fff', padding:16, borderRadius:8, marginBottom:16 }}>
        <input required placeholder="الاسم" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
        <input placeholder="البريد" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
        <input placeholder="الجوال" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
        <input placeholder="التخصص" value={form.specialization} onChange={(e)=>setForm({...form, specialization:e.target.value})} />
        <input placeholder="الخبرة بالسنوات" value={form.experience_years} onChange={(e)=>setForm({...form, experience_years:e.target.value})} />
        <input placeholder="الشهادة" value={form.certification} onChange={(e)=>setForm({...form, certification:e.target.value})} />
        <select value={form.status} onChange={(e)=>setForm({...form, status:e.target.value})}>
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>
        <button type="submit" style={{ gridColumn: '1 / -1', background:'#16a34a', color:'#fff', border:0, padding:'10px 16px', borderRadius:6 }}>{editingId ? 'تحديث' : 'إضافة'}</button>
      </form>

      <div style={{ overflowX:'auto', background:'#fff', borderRadius:8 }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f1f5f9' }}>
              <th style={{ padding:8 }}>الاسم</th>
              <th style={{ padding:8 }}>البريد</th>
              <th style={{ padding:8 }}>الجوال</th>
              <th style={{ padding:8 }}>التخصص</th>
              <th style={{ padding:8 }}>الخبرة</th>
              <th style={{ padding:8 }}>الحالة</th>
              <th style={{ padding:8 }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan="7" style={{ padding:16 }}>جاري التحميل...</td></tr>) : rows.length===0 ? (<tr><td colSpan="7" style={{ padding:16 }}>لا توجد بيانات</td></tr>) : rows.map(r=> (
              <tr key={r.id}>
                <td style={{ padding:8 }}>{r.name}</td>
                <td style={{ padding:8 }}>{r.email}</td>
                <td style={{ padding:8 }}>{r.phone}</td>
                <td style={{ padding:8 }}>{r.specialization}</td>
                <td style={{ padding:8 }}>{r.experience_years}</td>
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
