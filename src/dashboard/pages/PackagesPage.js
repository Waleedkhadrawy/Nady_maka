import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import '../../styles/pages/AdminPackagesPage.css';

export default function PackagesPage(){
  const [rows,setRows] = useState([]);
  const [loading,setLoading] = useState(false);
  const [form,setForm] = useState({ code:'', label:'', price:'', currency:'SAR', period_days:'', kind:'individual', segment:'adult', active:true, allow_partner:false, min_age:'', max_age:'' });
  const [editingId, setEditingId] = useState(null);
  const priceNum = Number(form.price) || 0;
  const periodNum = Number(form.period_days) || 0;
  const dailyPrice = periodNum > 0 ? (priceNum / periodNum) : 0;
  const monthlyPrice = dailyPrice * 30;

  const load = async () => { setLoading(true); try{ const r=await api.listMembershipPackages(); setRows(r);} finally{ setLoading(false);} };
  useEffect(()=>{ load(); },[]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        period_days: Number(form.period_days),
        allow_partner: !!form.allow_partner,
        min_age: form.min_age !== '' ? Number(form.min_age) : null,
        max_age: form.max_age !== '' ? Number(form.max_age) : null,
      };
      if (editingId) {
        await api.updateMembershipPackage(editingId, payload);
        toast.success('تم تحديث الباقة');
      } else {
        await api.createMembershipPackage(payload);
        toast.success('تمت إضافة الباقة — ستظهر للعملاء بعد التحديث');
      }
      setForm({
        code: '',
        label: '',
        price: '',
        currency: 'SAR',
        period_days: '',
        kind: 'individual',
        segment: 'adult',
        active: true,
        allow_partner: false,
        min_age: '',
        max_age: '',
      });
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.message || 'تعذر الحفظ');
    }
  };
  const startEdit = (r) => { setEditingId(r.id); setForm({ code:r.code, label:r.label, price:r.price||'', currency:r.currency||'SAR', period_days:String(r.period_days), kind:r.kind||'individual', segment:r.segment, active: !!r.active, allow_partner: !!r.allow_partner, min_age: r.min_age ?? '', max_age: r.max_age ?? '' }); };
  const remove = async (id) => { if(!window.confirm('حذف الباقة؟')) return; try{ await api.deleteMembershipPackage(id); load(); }catch (err) { toast.error(err.message || 'تعذر الحذف'); } };

  return (
    <AdminLayout>
      <div className="packages-page">
        <h2 className="packages-title">إدارة باقات العضوية</h2>
      <div className="alert alert-info border-0 rounded-3 mb-3 packages-help" role="status">
        <strong>تدفق الموافقة:</strong> طلبات العملاء من الموقع تذهب إلى{' '}
        <Link to="/admin/orders">إدارة الطلبات</Link> لقبولها أو رفضها. إضافة باقة هنا لا يُنشئ طلبًا تلقائيًا - فقط يعرضها للاختيار في نموذج العضوية.
      </div>
      <form onSubmit={submit} className="packages-form">
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
        <div className="packages-metrics">
          <div className="packages-metric">
            <span>سعر اليوم التقريبي</span>
            <strong>{dailyPrice.toFixed(2)} {form.currency || 'SAR'}</strong>
          </div>
          <div className="packages-metric">
            <span>سعر الشهر التقريبي</span>
            <strong>{monthlyPrice.toFixed(2)} {form.currency || 'SAR'}</strong>
          </div>
        </div>
        <button type="submit" className="packages-submit">{editingId?'تحديث':'إضافة'}</button>
      </form>

      <div className="packages-table-wrap">
        <table className="packages-table">
          <thead>
            <tr>
              <th>الكود</th>
              <th>الاسم</th>
              <th>السعر</th>
              <th>الأيام</th>
              <th>النوع</th>
              <th>الفئة</th>
              <th>نشطة</th>
              <th>شريك</th>
              <th>العمر (من-إلى)</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan="10" className="packages-empty">جاري التحميل...</td></tr>) : rows.length===0 ? (<tr><td colSpan="10" className="packages-empty">لا توجد بيانات</td></tr>) : rows.map(r=> (
              <tr key={r.id}>
                <td>{r.code}</td>
                <td>{r.label}</td>
                <td>{r.price} {r.currency}</td>
                <td>{r.period_days}</td>
                <td>{r.kind}</td>
                <td>{r.segment}</td>
                <td>{String(r.active)}</td>
                <td>{r.allow_partner ? 'يسمح' : 'بدون'}</td>
                <td>{(r.min_age ?? '—') + ' - ' + (r.max_age ?? '—')}</td>
                <td className="packages-actions">
                  <button onClick={()=>startEdit(r)} className="packages-btn packages-btn-edit">تعديل</button>
                  <button onClick={()=>remove(r.id)} className="packages-btn packages-btn-delete">حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </AdminLayout>
  );
}
