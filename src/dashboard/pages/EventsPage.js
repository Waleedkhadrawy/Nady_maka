import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function EventsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', location: '', category: '', registration_fee: '', currency: 'ريال', max_participants: '', status: 'open' });
  const [editingId, setEditingId] = useState(null);

  const load = async () => { setLoading(true); try { const res = await api.listEvents({ q, status: statusFilter, category: categoryFilter, from, to, page, limit }); setRows(res.items||[]); setPage(res.page||1); setLimit(res.limit||20); setTotal(res.total||0); } finally { setLoading(false); } };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const submit = async (e) => { e.preventDefault(); try { if (editingId) await api.updateEvent(editingId, form); else await api.createEvent(form); setForm({ title: '', description: '', date: '', time: '', location: '', category: '', registration_fee: '', currency: 'ريال', max_participants: '', status: 'open' }); setEditingId(null); load(); } catch (err) { toast.error(err.message || 'خطأ في حفظ الفعالية'); } };
  const startEdit = (r) => { setEditingId(r.id); setForm({ title:r.title||'', description:r.description||'', date:(r.date||'').slice(0,10), time:r.time||'', location:r.location||'', category:r.category||'', registration_fee:r.registration_fee||'', currency:r.currency||'ريال', max_participants:r.max_participants||'', status:r.status||'open' }); };
  const remove = async (id) => { if (!window.confirm('حذف الفعالية؟')) return; await api.deleteEvent(id); load(); };

  return (
    <AdminLayout>
      <h2>إدارة الفعاليات</h2>
      <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
        <input type="text" placeholder="بحث بالعنوان/المكان/الفئة" value={q} onChange={(e)=>setQ(e.target.value)} />
        <input placeholder="الفئة" value={categoryFilter} onChange={(e)=>setCategoryFilter(e.target.value)} />
        <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
          <option value="">كل الحالات</option>
          <option value="open">مفتوح</option>
          <option value="closed">مغلق</option>
        </select>
        <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} />
        <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} />
        <button onClick={()=>{ setPage(1); load(); }} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تحديث</button>
      </div>
      <form onSubmit={submit} style={{ display:'grid', gap:8, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', background:'#fff', padding:16, borderRadius:8, marginBottom:16 }}>
        <input required placeholder="عنوان" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />
        <input placeholder="المكان" value={form.location} onChange={(e)=>setForm({...form, location:e.target.value})} />
        <input placeholder="الفئة" value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} />
        <input type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} />
        <input placeholder="الوقت" value={form.time} onChange={(e)=>setForm({...form, time:e.target.value})} />
        <input placeholder="الرسوم" value={form.registration_fee} onChange={(e)=>setForm({...form, registration_fee:e.target.value})} />
        <input placeholder="العملة" value={form.currency} onChange={(e)=>setForm({...form, currency:e.target.value})} />
        <input placeholder="الحد الأقصى" value={form.max_participants} onChange={(e)=>setForm({...form, max_participants:e.target.value})} />
        <select value={form.status} onChange={(e)=>setForm({...form, status:e.target.value})}>
          <option value="open">مفتوح</option>
          <option value="closed">مغلق</option>
        </select>
        <textarea style={{ gridColumn: '1 / -1' }} placeholder="الوصف" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} />
        <button type="submit" style={{ gridColumn: '1 / -1', background:'#16a34a', color:'#fff', border:0, padding:'10px 16px', borderRadius:6 }}>{editingId ? 'تحديث' : 'إضافة'}</button>
      </form>

      <div style={{ overflowX:'auto', background:'#fff', borderRadius:8 }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f1f5f9' }}>
              <th style={{ padding:8 }}>العنوان</th>
              <th style={{ padding:8 }}>المكان</th>
              <th style={{ padding:8 }}>التاريخ</th>
              <th style={{ padding:8 }}>الوقت</th>
              <th style={{ padding:8 }}>الرسوم</th>
              <th style={{ padding:8 }}>الحالة</th>
              <th style={{ padding:8 }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan="7" style={{ padding:16 }}>جاري التحميل...</td></tr>) : rows.length===0 ? (<tr><td colSpan="7" style={{ padding:16 }}>لا توجد بيانات</td></tr>) : rows.map(r=> (
              <tr key={r.id}>
                <td style={{ padding:8 }}>{r.title}</td>
                <td style={{ padding:8 }}>{r.location}</td>
                <td style={{ padding:8 }}>{r.date ? new Date(r.date).toLocaleDateString() : ''}</td>
                <td style={{ padding:8 }}>{r.time || ''}</td>
                <td style={{ padding:8 }}>{r.registration_fee} {r.currency}</td>
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
