import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function TrainerEvaluationsAdminPage(){
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = async ()=>{
    setLoading(true);
    try{
      const res = await api.listTrainerEvaluations({ q, trainer_name: trainerName, page, limit });
      setRows(res.items || []);
      setPage(res.page || 1);
      setLimit(res.limit || 20);
      setTotal(res.total || 0);
    } finally { setLoading(false); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ load(); }, []);

  return (
    <AdminLayout>
      <h2>تقييمات المدربين</h2>
      <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
        <input placeholder="بحث بالاسم/المدرب/العضوية" value={q} onChange={(e)=>setQ(e.target.value)} />
        <input placeholder="اسم المدرب" value={trainerName} onChange={(e)=>setTrainerName(e.target.value)} />
        <button onClick={()=>{ setPage(1); load(); }} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تحديث</button>
        <button onClick={async()=>{ try{ const blob = await api.exportTrainerEvaluationsCsv({ q }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'trainer_evaluations.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }catch (err) { toast.error(err.message || 'تعذر التصدير'); } }} style={{ background:'#10b981', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تصدير CSV</button>
      </div>
      <div style={{ overflowX:'auto', background:'#fff', borderRadius:8 }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f1f5f9' }}>
              <th style={{ padding:8 }}>العضو</th>
              <th style={{ padding:8 }}>رقم العضوية</th>
              <th style={{ padding:8 }}>المدرب</th>
              <th style={{ padding:8 }}>تاريخ الجلسة</th>
              <th style={{ padding:8 }}>التقييم العام</th>
              <th style={{ padding:8 }}>الاحترافية</th>
              <th style={{ padding:8 }}>المعرفة</th>
              <th style={{ padding:8 }}>التواصل</th>
              <th style={{ padding:8 }}>الانضباط</th>
              <th style={{ padding:8 }}>التحفيز</th>
              <th style={{ padding:8 }}>ينصح بالمدرب</th>
              <th style={{ padding:8 }}>التاريخ</th>
              <th style={{ padding:8 }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan="7" style={{ padding:16 }}>جاري التحميل...</td></tr>) : rows.length===0 ? (<tr><td colSpan="7" style={{ padding:16 }}>لا توجد تقييمات</td></tr>) : rows.map(r => (
              <tr key={r.id}>
                <td style={{ padding:8 }}>{r.member_name}</td>
                <td style={{ padding:8 }}>{r.membership_number}</td>
                <td style={{ padding:8 }}>{r.trainer_name}</td>
                <td style={{ padding:8 }}>{r.session_date}</td>
                <td style={{ padding:8 }}>{r.overall_rating}</td>
                <td style={{ padding:8 }}>{r.professionalism_rating ?? '—'}</td>
                <td style={{ padding:8 }}>{r.knowledge_rating ?? '—'}</td>
                <td style={{ padding:8 }}>{r.communication_rating ?? '—'}</td>
                <td style={{ padding:8 }}>{r.punctuality_rating ?? '—'}</td>
                <td style={{ padding:8 }}>{r.motivation_rating ?? '—'}</td>
                <td style={{ padding:8 }}>{r.recommend_trainer}</td>
                <td style={{ padding:8 }}>{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</td>
                <td style={{ padding:8 }}>
                  <button onClick={async()=>{ try{ await api.deleteTrainerEvaluation(r.id); setRows(rows.filter(x=>x.id!==r.id)); }catch (err) { toast.error(err.message || 'تعذر الحذف'); } }} style={{ background:'#ef4444', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>حذف</button>
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
        <select value={limit} onChange={(e)=>{ const v=parseInt(e.target.value)||20; setLimit(v); setPage(1); load(); }}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>إجمالي: {total}</span>
      </div>
    </AdminLayout>
  );
}
