import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function OrdersPage(){
  const [rows,setRows] = useState([]);
  const [loading,setLoading] = useState(false);
  const [filters,setFilters] = useState({ q:'', status:'', method:'' });

  const load = async ()=>{ setLoading(true); try{ const r = await api.listOrders({ ...filters, page:1, limit:50 }); setRows(r.items||[]); } finally{ setLoading(false); } };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ load(); },[]);

  const updateStatus = async (id, status)=>{ try{ await api.updateOrderStatus(id, status); load(); }catch (err) { toast.error(err.message || 'تعذر تحديث الحالة'); } };

  return (
    <AdminLayout>
      <h2>إدارة الطلبات</h2>
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <input placeholder="بحث" value={filters.q} onChange={e=>setFilters({ ...filters, q:e.target.value })} />
        <select value={filters.status} onChange={e=>setFilters({ ...filters, status:e.target.value })}><option value="">الحالة</option><option value="pending">قيد الانتظار</option><option value="paid">مدفوع</option><option value="failed">فشل</option><option value="cancelled">ملغى</option></select>
        <select value={filters.method} onChange={e=>setFilters({ ...filters, method:e.target.value })}><option value="">طريقة الدفع</option><option value="manual">يدوي</option><option value="online">إلكتروني</option></select>
        <button onClick={load} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تحديث</button>
      </div>
      <div style={{ overflowX:'auto', background:'#fff', borderRadius:8 }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f1f5f9' }}>
              <th style={{ padding:8 }}>رقم</th>
              <th style={{ padding:8 }}>عضو</th>
              <th style={{ padding:8 }}>نوع</th>
              <th style={{ padding:8 }}>موضوع</th>
              <th style={{ padding:8 }}>المبلغ</th>
              <th style={{ padding:8 }}>العملة</th>
              <th style={{ padding:8 }}>الطريقة</th>
              <th style={{ padding:8 }}>الحالة</th>
              <th style={{ padding:8 }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan="9" style={{ padding:16 }}>جاري التحميل...</td></tr>) : rows.length===0 ? (<tr><td colSpan="9" style={{ padding:16 }}>لا توجد طلبات</td></tr>) : rows.map(r=> (
              <tr key={r.id}>
                <td style={{ padding:8 }}>{r.id}</td>
                <td style={{ padding:8 }}>{r.member_id ?? '—'}</td>
                <td style={{ padding:8 }}>{r.subject_type}</td>
                <td style={{ padding:8 }}>{r.subject_id}</td>
                <td style={{ padding:8 }}>{r.amount}</td>
                <td style={{ padding:8 }}>{r.currency}</td>
                <td style={{ padding:8 }}>{r.payment_method}</td>
                <td style={{ padding:8 }}>{r.status}</td>
                <td style={{ padding:8, display:'flex', gap:8 }}>
                  <button onClick={()=>updateStatus(r.id, 'paid')} style={{ background:'#16a34a', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تعيين مدفوع</button>
                  <button onClick={()=>updateStatus(r.id, 'cancelled')} style={{ background:'#ef4444', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>إلغاء</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
