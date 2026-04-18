import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';

export default function PaymentsPage(){
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({ count: 0, sum: 0 });
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.listPayments({ from, to, q, status, method, page, limit });
      setRows(res.items || []);
      setSummary(res.summary || { count: 0, sum: 0 });
      setPage(res.page || 1);
      setLimit(res.limit || 20);
      // res.total used for pagination UI
    } finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ load(); }, []);

  return (
    <AdminLayout>
      <h2>إدارة المدفوعات</h2>
      <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
        <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} />
        <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} />
        <input type="text" placeholder="بحث بالمرجع/العضوية" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="">كل الحالات</option>
          <option value="paid">مدفوع</option>
          <option value="pending">معلّق</option>
          <option value="failed">فشل</option>
        </select>
        <select value={method} onChange={(e)=>setMethod(e.target.value)}>
          <option value="">كل الطرق</option>
          <option value="manual">يدوي</option>
          <option value="card">بطاقة</option>
          <option value="bank">تحويل بنكي</option>
        </select>
        <button onClick={load} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تحديث</button>
      </div>
      <div style={{ marginBottom:12 }}>عدد العمليات: {summary.count} | مجموع المبالغ: {summary.sum} SAR</div>
      <div style={{ overflowX:'auto', background:'#fff', borderRadius:8 }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f1f5f9' }}>
              <th style={{ padding:8 }}>العضوية</th>
              <th style={{ padding:8 }}>المبلغ</th>
              <th style={{ padding:8 }}>العملة</th>
              <th style={{ padding:8 }}>الطريقة</th>
              <th style={{ padding:8 }}>الحالة</th>
              <th style={{ padding:8 }}>المرجع</th>
              <th style={{ padding:8 }}>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan="7" style={{ padding:16 }}>جاري التحميل...</td></tr>) : rows.length===0 ? (<tr><td colSpan="7" style={{ padding:16 }}>لا توجد مدفوعات</td></tr>) : rows.map(p => (
              <tr key={p.id}>
                <td style={{ padding:8 }}>{p.membership_id}</td>
                <td style={{ padding:8 }}>{p.amount}</td>
                <td style={{ padding:8 }}>{p.currency}</td>
                <td style={{ padding:8 }}>{p.method}</td>
                <td style={{ padding:8 }}>{p.status}</td>
                <td style={{ padding:8 }}>{p.ref || ''}</td>
                <td style={{ padding:8 }}>{p.paid_at ? new Date(p.paid_at).toLocaleString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:12 }}>
        <button disabled={page<=1} onClick={()=>{ setPage(p=>Math.max(1,p-1)); load(); }} style={{ padding:'6px 10px' }}>السابق</button>
        <span>صفحة {page}</span>
        <button onClick={()=>{ setPage(p=>p+1); load(); }} style={{ padding:'6px 10px' }}>التالي</button>
        <select value={limit} onChange={(e)=>{ setLimit(parseInt(e.target.value)||20); }}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </AdminLayout>
  );
}
