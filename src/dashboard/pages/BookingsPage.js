import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';

export default function BookingsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.listBookings({ q, status: statusFilter, from, to, page, limit });
      setRows(res.items || []);
      setPage(res.page || 1);
      setLimit(res.limit || 20);
      setTotal(res.total || 0);
    } finally { setLoading(false); }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  return (
    <AdminLayout>
      <h2>إدارة الحجوزات</h2>
      <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
        <input type="text" placeholder="بحث بالملاحظات/المعرفات" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
          <option value="">كل الحالات</option>
          <option value="pending">معلّق</option>
          <option value="confirmed">مؤكد</option>
          <option value="cancelled">ملغي</option>
        </select>
        <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} />
        <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} />
        <button onClick={()=>{ setPage(1); load(); }} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تحديث</button>
      </div>
      <div style={{ overflowX:'auto', background:'#fff', borderRadius:8 }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f1f5f9' }}>
              <th style={{ padding:8 }}>الاسم</th>
              <th style={{ padding:8 }}>الجوال</th>
              <th style={{ padding:8 }}>البريد</th>
              <th style={{ padding:8 }}>الخدمة</th>
              <th style={{ padding:8 }}>الوقت</th>
              <th style={{ padding:8 }}>الملاحظات</th>
              <th style={{ padding:8 }}>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan="6" style={{ padding:16 }}>جاري التحميل...</td></tr>) : rows.length===0 ? (<tr><td colSpan="6" style={{ padding:16 }}>لا توجد حجوزات</td></tr>) : rows.map(r=> (
              <tr key={r.id}>
                <td style={{ padding:8 }}>{r.name || '—'}</td>
                <td style={{ padding:8 }}>{r.phone || '—'}</td>
                <td style={{ padding:8 }}>{r.email || '—'}</td>
                <td style={{ padding:8 }}>{r.service || '—'}</td>
                <td style={{ padding:8 }}>{r.scheduled_at ? new Date(r.scheduled_at).toLocaleString() : '—'}</td>
                <td style={{ padding:8 }}>{r.notes || ''}</td>
                <td style={{ padding:8 }}>{r.status}</td>
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
