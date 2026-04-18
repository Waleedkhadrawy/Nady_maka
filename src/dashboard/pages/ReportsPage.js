import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function ReportsPage(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');

  useEffect(()=>{ (async()=>{ setLoading(true); try{ const d = await api.getReports(); setData(d);} finally{ setLoading(false);} })(); },[]);

  const Card = ({ title, children }) => (
    <div style={{ background:'#fff', borderRadius:8, padding:16, boxShadow:'0 2px 8px rgba(0,0,0,.08)' }}>
      <div style={{ fontWeight:'bold', marginBottom:8 }}>{title}</div>
      <div>{children}</div>
    </div>
  );

  return (
    <AdminLayout>
      <h2>ملخص النظام</h2>
      {loading && <div>جاري التحميل...</div>}
      {!loading && data && (
        <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap:12 }}>
          <Card title="الأعضاء">
            الإجمالي: {data.members.total}<br/>
            نشط: {data.members.active} | مجمّد: {data.members.frozen} | منتهي: {data.members.expired}
          </Card>
          <Card title="العضويات">
            الإجمالي: {data.memberships.total}<br/>
            نشط: {data.memberships.active} | مجمّد: {data.memberships.frozen} | منتهي: {data.memberships.expired}
          </Card>
          <Card title="الأنشطة">
            الإجمالي: {data.activities.total}
          </Card>
          <Card title="المدربون">
            الإجمالي: {data.trainers.total}
          </Card>
          <Card title="الفعاليات القادمة">
            العدد: {data.events.upcoming}
          </Card>
          <Card title="الحجوزات">
            الإجمالي: {data.bookings.total}
          </Card>
          <Card title="المدفوعات">
            عدد العمليات: {data.payments.count}<br/>
            مجموع المبالغ: {data.payments.sum} SAR
            <div style={{ display:'grid', gap:8, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginTop:8 }}>
              <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} />
              <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} />
              <input placeholder="بحث بالمرجع/العضوية" value={q} onChange={(e)=>setQ(e.target.value)} />
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
              <button onClick={async()=>{
                try{
                  const blob = await api.exportReportCsv('payments', { from, to, q, status, method });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'payments.csv'; a.click();
                  setTimeout(()=>URL.revokeObjectURL(url), 1000);
                }catch (err) { toast.error(err.message || 'تعذر استخراج CSV'); }
              }} style={{ background:'#16a34a', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تصدير CSV</button>
            </div>
          </Card>
          <Card title="تصدير سريع">
            <div style={{ display:'grid', gap:8 }}>
              <button onClick={async()=>{ const b=await api.exportReportCsv('summary', {}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='summary.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(u),1000); }} style={{ background:'#10b981', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>ملخص CSV</button>
              <button onClick={async()=>{ const b=await api.exportReportCsv('memberships', {}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='memberships.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(u),1000); }} style={{ background:'#10b981', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>عضويات CSV</button>
              <button onClick={async()=>{ const b=await api.exportReportCsv('members', {}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='members.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(u),1000); }} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>أعضاء CSV</button>
              <button onClick={async()=>{ const b=await api.exportReportCsv('activities', {}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='activities.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(u),1000); }} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>أنشطة CSV</button>
              <button onClick={async()=>{ const b=await api.exportReportCsv('trainers', {}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='trainers.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(u),1000); }} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>مدربون CSV</button>
              <button onClick={async()=>{ const b=await api.exportReportCsv('events', {}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='events.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(u),1000); }} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>فعاليات CSV</button>
              <button onClick={async()=>{ const b=await api.exportReportCsv('bookings', {}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='bookings.csv'; a.click(); setTimeout(()=>URL.revokeObjectURL(u),1000); }} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>حجوزات CSV</button>
            </div>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
