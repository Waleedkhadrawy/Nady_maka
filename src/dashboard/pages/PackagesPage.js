import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function PackagesPage(){
  const [rows,setRows] = useState([]);
  const [loading,setLoading] = useState(false);
  const [form,setForm] = useState({ code:'', label:'', price:'', currency:'SAR', period_days:'', kind:'individual', segment:'adult', active:true, allow_partner:false, min_age:'', max_age:'' });
  const [editingId, setEditingId] = useState(null);

  const load = async () => { setLoading(true); try{ const r=await api.listMembershipPackages(); setRows(r);} finally{ setLoading(false);} };
  useEffect(()=>{ load(); },[]);

  const submit = async (e) => { e.preventDefault(); try{ const payload = { ...form, period_days: Number(form.period_days), allow_partner: !!form.allow_partner, min_age: form.min_age !== '' ? Number(form.min_age) : null, max_age: form.max_age !== '' ? Number(form.max_age) : null }; if(editingId){ await api.updateMembershipPackage(editingId, payload); } else { await api.createMembershipPackage(payload); } setForm({ code:'', label:'', price:'', currency:'SAR', period_days:'', kind:'individual', segment:'adult', active:true, allow_partner:false, min_age:'', max_age:'' }); setEditingId(null); load(); }catch (err) { toast.error(err.message || 'تعذر الحفظ'); } };
  const startEdit = (r) => { setEditingId(r.id); setForm({ code:r.code, label:r.label, price:r.price||'', currency:r.currency||'SAR', period_days:String(r.period_days), kind:r.kind||'individual', segment:r.segment, active: !!r.active, allow_partner: !!r.allow_partner, min_age: r.min_age ?? '', max_age: r.max_age ?? '' }); };
  const remove = async (id) => { if(!window.confirm('حذف الباقة؟')) return; try{ await api.deleteMembershipPackage(id); load(); }catch (err) { toast.error(err.message || 'تعذر الحذف'); } };

  return (
    <AdminLayout>
      <h2>إدارة باقات العضوية</h2>
      <form onSubmit={submit} style={{ display:'grid', gap:8, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', background:'#fff', padding:16, borderRadius:8, marginBottom:16 }}>
        <input required placeholder="الكود" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} />
        <input required placeholder="الاسم" value={form.label} onChange={e=>setForm({...form,label:e.target.value})} />
        <input placeholder="السعر" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} />
        <input placeholder="العملة" value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})} />
        <input required placeholder="الأيام" value={form.period_days} onChange={e=>setForm({...form,period_days:e.target.value})} />
        <select value={form.kind} onChange={e=>setForm({...form,kind:e.target.value})}><option value="individual">فردية</option><option value="family">عائلية</option></select>
        <select value={form.segment} onChange={e=>setForm({...form,segment:e.target.value})}><option value="adult">فوق 15</option><option value="junior">تحت 15</option><option value="sub">فرعية</option></select>
        <select value={form.active? 'true':'false'} onChange={e=>setForm({...form,active:e.target.value==='true'})}><option value="true">نشطة</option><option value="false">غير نشطة</option></select>
        <select value={form.allow_partner? 'true':'false'} onChange={e=>setForm({...form,allow_partner:e.target.value==='true'})}><option value="false">بدون شريك</option><option value="true">يسمح بالشريك</option></select>
        <input placeholder="الحد الأدنى للعمر" value={form.min_age} onChange={e=>setForm({...form,min_age:e.target.value})} />
        <input placeholder="الحد الأقصى للعمر" value={form.max_age} onChange={e=>setForm({...form,max_age:e.target.value})} />
        <button type="submit" style={{ gridColumn: '1 / -1', background:'#16a34a', color:'#fff', border:0, padding:'10px 16px', borderRadius:6 }}>{editingId?'تحديث':'إضافة'}</button>
      </form>

      <div style={{ overflowX:'auto', background:'#fff', borderRadius:8 }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f1f5f9' }}>
              <th style={{ padding:8 }}>الكود</th>
              <th style={{ padding:8 }}>الاسم</th>
              <th style={{ padding:8 }}>السعر</th>
              <th style={{ padding:8 }}>الأيام</th>
              <th style={{ padding:8 }}>النوع</th>
              <th style={{ padding:8 }}>الفئة</th>
              <th style={{ padding:8 }}>نشطة</th>
              <th style={{ padding:8 }}>شريك</th>
              <th style={{ padding:8 }}>العمر (من-إلى)</th>
              <th style={{ padding:8 }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan="8" style={{ padding:16 }}>جاري التحميل...</td></tr>) : rows.length===0 ? (<tr><td colSpan="8" style={{ padding:16 }}>لا توجد بيانات</td></tr>) : rows.map(r=> (
              <tr key={r.id}>
                <td style={{ padding:8 }}>{r.code}</td>
                <td style={{ padding:8 }}>{r.label}</td>
                <td style={{ padding:8 }}>{r.price} {r.currency}</td>
                <td style={{ padding:8 }}>{r.period_days}</td>
                <td style={{ padding:8 }}>{r.kind}</td>
                <td style={{ padding:8 }}>{r.segment}</td>
                <td style={{ padding:8 }}>{String(r.active)}</td>
                <td style={{ padding:8 }}>{r.allow_partner ? 'يسمح' : 'بدون'}</td>
                <td style={{ padding:8 }}>{(r.min_age ?? '—') + ' - ' + (r.max_age ?? '—')}</td>
                <td style={{ padding:8, display:'flex', gap:8 }}>
                  <button onClick={()=>startEdit(r)} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تعديل</button>
                  <button onClick={()=>remove(r.id)} style={{ background:'#ef4444', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
