import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', membershipType: '', notes: '' });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listCustomers();
      setRows(data);
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'فشل في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateCustomer(editingId, form);
      } else {
        await api.createCustomer(form);
      }
      setForm({ name: '', email: '', phone: '', membershipType: '', notes: '' });
      setEditingId(null);
      load();
    } catch (e) {
      toast.error(e.message || 'حدث خطأ أثناء الحفظ');
    }
  };

  const startEdit = (row) => {
    setEditingId(row._id);
    setForm({ name: row.name || '', email: row.email || '', phone: row.phone || '', membershipType: row.membershipType || '', notes: row.notes || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذا العميل؟')) return;
    try {
      await api.deleteCustomer(id);
      load();
    } catch (e) {
      toast.error(e.message || 'حدث خطأ أثناء الحذف');
    }
  };

  return (
    <AdminLayout>
      <h2>إدارة العملاء</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', background: '#fff', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,.08)', marginBottom: 16 }}>
        <input required placeholder="الاسم" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
        <input placeholder="البريد" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
        <input placeholder="الجوال" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
        <input placeholder="نوع العضوية" value={form.membershipType} onChange={(e)=>setForm({...form, membershipType:e.target.value})} />
        <input placeholder="ملاحظات" value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} />
        <button type="submit" style={{ gridColumn: '1 / -1', background: '#16a34a', color: '#fff', border: 0, padding: '10px 16px', borderRadius: 6 }}>
          {editingId ? 'تحديث العميل' : 'إضافة عميل'}
        </button>
      </form>

      <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ padding: 8 }}>الاسم</th>
              <th style={{ padding: 8 }}>البريد</th>
              <th style={{ padding: 8 }}>الجوال</th>
              <th style={{ padding: 8 }}>العضوية</th>
              <th style={{ padding: 8 }}>بداية العضوية</th>
              <th style={{ padding: 8 }}>انتهاء العضوية</th>
              <th style={{ padding: 8 }}>ملاحظات</th>
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
                  <td style={{ padding: 8 }}>{r.membershipType}</td>
                  <td style={{ padding: 8 }}>{r.joinDate ? new Date(r.joinDate).toLocaleDateString() : ''}</td>
                  <td style={{ padding: 8 }}>{r.expiryDate ? new Date(r.expiryDate).toLocaleDateString() : ''}</td>
                  <td style={{ padding: 8 }}>{r.notes}</td>
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
    </AdminLayout>
  );
}
