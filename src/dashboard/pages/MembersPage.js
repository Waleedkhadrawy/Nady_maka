import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function MembersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', phone: '', gender: '', dob: '', type: 'primary', relation: '', parent_member_id: '' });
  const [editingId, setEditingId] = useState(null);
  const [packages, setPackages] = useState([]);
  const [memberMemberships, setMemberMemberships] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [eligiblePackages, setEligiblePackages] = useState([]);
  const [primaryOptions, setPrimaryOptions] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.listMembers({ q, type: typeFilter, status: statusFilter, page, limit });
      setRows(res.items || []);
      setPage(res.page || 1);
      setLimit(res.limit || 20);
      setTotal(res.total || 0);
    } catch (e) {
      toast.error(e.message || 'فشل في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  useEffect(() => {
    (async () => {
      try {
        const rows = await api.listMembershipPackages();
        setPackages(rows);
      } catch (e) {
        setPackages([]);
      }
    })();
  }, []);

  useEffect(()=>{
    if (form.type === 'sub'){
      (async ()=>{
        try {
          const res = await api.listMembers({ type: 'primary', page: 1, limit: 1000 });
          setPrimaryOptions(res.items || []);
        } catch {
          setPrimaryOptions([]);
        }
      })();
    } else {
      setPrimaryOptions([]);
    }
  }, [form.type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateMember(editingId, form);
      } else {
        await api.createMember(form);
      }
      setForm({ name: '', email: '', phone: '', gender: '', dob: '', type: 'primary', relation: '', parent_member_id: '' });
      setEditingId(null);
      load();
    } catch (e) {
      toast.error(e.message || 'حدث خطأ أثناء الحفظ');
    }
  };

  const startEdit = (row) => {
    setEditingId(row._id);
    setForm({ name: row.name || '', email: row.email || '', phone: row.phone || '', gender: row.gender || '', dob: row.dob ? String(row.dob).slice(0,10) : '', type: row.type || 'primary', relation: row.relation || '', parent_member_id: row.parent_member_id || '' });
    setSelectedPackage('');
    (async () => {
      try {
        const mems = await api.listMemberMemberships(row._id);
        setMemberMemberships(mems);
      } catch (e) {
        setMemberMemberships([]);
      }
    })();
    (async () => {
      try {
        const seg = row.type === 'sub' ? 'sub' : (() => {
          if (row.dob) {
            const d = new Date(row.dob);
            const now = new Date();
            let age = now.getFullYear() - d.getFullYear();
            const m = now.getMonth() - d.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
            return age >= 15 ? 'adult' : 'junior';
          }
          return 'adult';
        })();
        const rows = await api.listMembershipPackages(seg);
        setEligiblePackages(rows);
      } catch (e) {
        setEligiblePackages([]);
      }
    })();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذا العضو؟')) return;
    try {
      await api.deleteMember(id);
      load();
    } catch (e) {
      toast.error(e.message || 'حدث خطأ أثناء الحذف');
    }
  };

  return (
    <AdminLayout>
      <h2>إدارة الأعضاء</h2>
      <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
        <input type="text" placeholder="بحث بالاسم/البريد/الجوال" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select value={typeFilter} onChange={(e)=>setTypeFilter(e.target.value)}>
          <option value="">كل الأنواع</option>
          <option value="primary">أساسي</option>
          <option value="sub">فرعي</option>
        </select>
        <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
          <option value="">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="frozen">مجمّد</option>
          <option value="expired">منتهي</option>
        </select>
        <button onClick={()=>{ setPage(1); load(); }} style={{ background:'#3b82f6', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تحديث</button>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,.08)', marginBottom: 16 }}>
        <input required placeholder="الاسم" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
        <input placeholder="البريد" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
        <input placeholder="الجوال" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
        <select value={form.gender} onChange={(e)=>setForm({...form, gender:e.target.value})}>
          <option value="">اختر الجنس</option>
          <option value="male">ذكر</option>
          <option value="female">أنثى</option>
        </select>
        <input type="date" placeholder="تاريخ الميلاد" value={form.dob} onChange={(e)=>setForm({...form, dob:e.target.value})} />
        <select value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})}>
          <option value="primary">أساسي</option>
          <option value="sub">فرعي</option>
        </select>
        {form.type === 'sub' ? (
          <select value={form.parent_member_id} onChange={(e)=>setForm({...form, parent_member_id:e.target.value})}>
            <option value="">اختر العضو الأساسي</option>
            {(primaryOptions || []).map(r=> (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
        ) : (
          <input placeholder="العلاقة" value={form.relation} onChange={(e)=>setForm({...form, relation:e.target.value})} />
        )}
        <button type="submit" style={{ gridColumn: '1 / -1', background: '#16a34a', color: '#fff', border: 0, padding: '10px 16px', borderRadius: 6 }}>
          {editingId ? 'تحديث العضو' : 'إضافة عضو'}
        </button>
      </form>

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ padding: 8 }}>الاسم</th>
              <th style={{ padding: 8 }}>البريد</th>
              <th style={{ padding: 8 }}>الجوال</th>
              <th style={{ padding: 8 }}>النوع</th>
              <th style={{ padding: 8 }}>العلاقة</th>
              <th style={{ padding: 8 }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: 16 }}>جاري التحميل...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: 16 }}>لا توجد بيانات</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r._id}>
                  <td style={{ padding: 8 }}>{r.name}</td>
                  <td style={{ padding: 8 }}>{r.email}</td>
                  <td style={{ padding: 8 }}>{r.phone}</td>
                  <td style={{ padding: 8 }}>{r.type === 'primary' ? 'أساسي' : 'فرعي'}</td>
                  <td style={{ padding: 8 }}>{r.relation || ''}</td>
                  <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                    <button onClick={() => startEdit(r)} style={{ background: '#3b82f6', color: '#fff', border: 0, padding: '6px 10px', borderRadius: 6 }}>تعديل</button>
                    <button onClick={() => handleDelete(r._id)} style={{ background: '#ef4444', color: '#fff', border: 0, padding: '6px 10px', borderRadius: 6 }}>حذف</button>
                  </td>
                </tr>
              ))
            )}
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

      {editingId && (
        <div style={{ marginTop: 16, background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
          <h3 style={{ marginTop: 0 }}>عضويات العضو</h3>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr auto' }}>
            <select value={selectedPackage} onChange={(e)=>setSelectedPackage(e.target.value)}>
              <option value="">اختر باقة</option>
              {(eligiblePackages.length ? eligiblePackages : packages).map(p => (
                <option key={p.code} value={p.code}>{p.label}</option>
              ))}
            </select>
            <input type="date" defaultValue={new Date().toISOString().slice(0,10)} id="joinDateInput" />
            <button onClick={async ()=>{
              if(!selectedPackage) { toast.error('يرجى اختيار باقة'); return; }
              try {
                const payload = { package_code: selectedPackage, amount: 0, currency: 'SAR', method: 'manual' };
                await api.addMembershipCheckoutForMember(editingId, payload);
                const mems = await api.listMemberMemberships(editingId);
                setMemberMemberships(mems);
                setSelectedPackage('');
              } catch (e) { toast.error(e.message || 'تعذر إضافة العضوية'); }
            }} style={{ background: '#16a34a', color: '#fff', border: 0, padding: '10px 16px', borderRadius: 6 }}>إضافة عضوية</button>
          </div>
          <div style={{ marginTop: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: 8 }}>الباقة</th>
                  <th style={{ padding: 8 }}>البداية</th>
                  <th style={{ padding: 8 }}>الانتهاء</th>
                  <th style={{ padding: 8 }}>الحالة</th>
                  <th style={{ padding: 8 }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {memberMemberships.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: 16 }}>لا توجد عضويات</td></tr>
                ) : (
                  memberMemberships.map(m => (
                    <tr key={m.id}>
                      <td style={{ padding: 8 }}>{m.label}</td>
                      <td style={{ padding: 8 }}>{m.join_date ? new Date(m.join_date).toLocaleDateString() : ''}</td>
                      <td style={{ padding: 8 }}>{m.expiry_date ? new Date(m.expiry_date).toLocaleDateString() : ''}</td>
                      <td style={{ padding: 8 }}>{m.status}</td>
                      <td style={{ padding: 8, display:'flex', gap:8 }}>
                        <button onClick={async()=>{ await api.updateMembershipStatus(m.id,'active'); const mems=await api.listMemberMemberships(editingId); setMemberMemberships(mems); }} style={{ background:'#16a34a', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تفعيل</button>
                        <button onClick={async()=>{ await api.updateMembershipStatus(m.id,'frozen'); const mems=await api.listMemberMemberships(editingId); setMemberMemberships(mems); }} style={{ background:'#f59e0b', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>تجميد</button>
                        <button onClick={async()=>{ await api.updateMembershipStatus(m.id,'expired'); const mems=await api.listMemberMemberships(editingId); setMemberMemberships(mems); }} style={{ background:'#ef4444', color:'#fff', border:0, borderRadius:6, padding:'6px 10px' }}>إنهاء</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <h3 style={{ marginTop: 16 }}>مدفوعات العضويات</h3>
          <div>
            {memberMemberships.length === 0 ? null : memberMemberships.map(m => (
              <div key={`pay-${m.id}`} style={{ marginTop: 12 }}>
                <div style={{ fontWeight:'bold' }}>{m.label}</div>
                <Payments membershipId={m.id} />
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function Payments({ membershipId }){
  const [rows, setRows] = React.useState([]);
  React.useEffect(()=>{ (async()=>{ try{ const list=await api.listMembershipPayments(membershipId); setRows(list);}catch{ setRows([]);} })(); },[membershipId]);
  return (
    <table style={{ width:'100%', borderCollapse:'collapse' }}>
      <thead>
        <tr style={{ background:'#f1f5f9' }}>
          <th style={{ padding:8 }}>المبلغ</th>
          <th style={{ padding:8 }}>العملة</th>
          <th style={{ padding:8 }}>الطريقة</th>
          <th style={{ padding:8 }}>الحالة</th>
          <th style={{ padding:8 }}>المرجع</th>
          <th style={{ padding:8 }}>التاريخ</th>
        </tr>
      </thead>
      <tbody>
        {rows.length===0 ? (<tr><td colSpan="6" style={{ padding:16 }}>لا توجد مدفوعات</td></tr>) : rows.map(p => (
          <tr key={p.id}>
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
  );
}
