import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function FormsPage(){
  const [rows,setRows] = useState([]);
  const [loading,setLoading] = useState(false);
  const [form,setForm] = useState({ code:'', title:'', schema_json:'{}', is_active:true });
  const [editingId, setEditingId] = useState(null);
  const [subs,setSubs] = useState({ items:[], page:1, limit:20, total:0 });

  const load = async ()=>{ setLoading(true); try{ const r = await api.listForms(); setRows(r); } finally{ setLoading(false); } };
  useEffect(()=>{ load(); },[]);

  const submit = async (e)=>{
    e.preventDefault();
    try{
      const payload = { code: form.code, title: form.title, schema_json: JSON.parse(form.schema_json||'{}'), is_active: !!form.is_active };
      if (editingId){ await api.updateForm(editingId, payload); } else { await api.createForm(payload); }
      setForm({ code:'', title:'', schema_json:'{}', is_active:true }); setEditingId(null); load();
    }catch (err) { toast.error(err.message || 'تعذر الحفظ'); }
  };
  const startEdit = (r)=>{ setEditingId(r.id); setForm({ code:r.code, title:r.title, schema_json: JSON.stringify(r.schema_json||{}), is_active: !!r.is_active }); };
  const remove = async (id)=>{ if(!window.confirm('حذف النموذج؟')) return; try{ await api.deleteForm(id); load(); }catch (err) { toast.error(err.message || 'تعذر الحذف'); } };
  const loadSubs = async (id)=>{ try{ const res = await api.listFormSubmissions(id, { page:1, limit:20 }); setSubs(res); }catch{ setSubs({ items:[], page:1, limit:20, total:0 }); } };

  return (
    <AdminLayout>
      <h2>إدارة النماذج الديناميكية</h2>
      <form onSubmit={submit} style={{ display:'grid', gap:8, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', background:'#fff', padding:16, borderRadius:8, marginBottom:16 }}>
        <input required placeholder="الكود" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} />
        <input required placeholder="العنوان" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <select value={form.is_active? 'true':'false'} onChange={e=>setForm({...form,is_active:e.target.value==='true'})}><option value="true">نشط</option><option value="false">معطّل</option></select>
        <button type="submit" style={{ background:'#16a34a', color:'#fff', border:0, padding:'10px 16px', borderRadius:6 }}>{editingId?'تحديث':'إضافة'}</button>
        <textarea placeholder="مخطط JSON" value={form.schema_json} onChange={e=>setForm({...form, schema_json:e.target.value})} style={{ gridColumn: '1 / -1', minHeight:200 }} />
      </form>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>
        <div style={{ overflowX:'auto', background:'#fff', borderRadius:8 }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead><tr style={{ background:'#f1f5f9' }}><th style={{ padding:8 }}>الكود</th><th style={{ padding:8 }}>العنوان</th><th style={{ padding:8 }}>نشط</th><th style={{ padding:8 }}>إجراءات</th></tr></thead>
            <tbody>
              {loading ? (<tr><td colSpan="4" style={{ padding:16 }}>جاري التحميل...</td></tr>) : rows.length===0 ? (<tr><td colSpan="4" style={{ padding:16 }}>لا توجد نماذج</td></tr>) : rows.map(r=> (
                <tr key={r.id}>
                  <td style={{ padding:8 }}>{r.code}</td>
                  <td style={{ padding:8 }}>{r.title}</td>
                  <td style={{ padding:8 }}>{String(r.is_active)}</td>
                  <td style={{ padding:8, display:'flex', gap:8 }}>
                    <button onClick={()=>startEdit(r)} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تعديل</button>
                    <button onClick={()=>remove(r.id)} style={{ background:'#ef4444', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>حذف</button>
                    <button onClick={()=>loadSubs(r.id)} style={{ background:'#22c55e', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>ردود</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ background:'#fff', borderRadius:8, padding:12 }}>
          <h4>الردود</h4>
          <div style={{ maxHeight:400, overflow:'auto' }}>
            {subs.items.length===0 ? 'لا توجد ردود' : subs.items.map(s=> (
              <pre key={s.id} style={{ background:'#f8fafc', padding:8, borderRadius:6 }}>{JSON.stringify(s, null, 2)}</pre>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
