import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [form, setForm] = useState({ site_name: '', site_name_en: '', description: '', description_en: '', contact_phone: '', contact_email: '', address: '', address_en: '', social_media: {}, working_hours: {} });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getSettings();
      setForm({
        site_name: data?.site_name || '',
        site_name_en: data?.site_name_en || '',
        description: data?.description || '',
        description_en: data?.description_en || '',
        contact_phone: data?.contact_phone || '',
        contact_email: data?.contact_email || '',
        address: data?.address || '',
        address_en: data?.address_en || '',
        social_media: data?.social_media || {},
        working_hours: data?.working_hours || {},
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaved(false);
    try {
      await api.updateSettings(form);
      setSaved(true);
    } catch (err) {
      toast.error(err.message || 'تعذر حفظ الإعدادات');
    }
  };

  return (
    <AdminLayout>
      <h2>الإعدادات</h2>
      <form onSubmit={save} style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', background: '#fff', padding: 16, borderRadius: 8 }}>
        <input placeholder="اسم الموقع" value={form.site_name} onChange={(e)=>setForm({...form, site_name:e.target.value})} />
        <input placeholder="اسم الموقع (EN)" value={form.site_name_en} onChange={(e)=>setForm({...form, site_name_en:e.target.value})} />
        <input placeholder="الهاتف" value={form.contact_phone} onChange={(e)=>setForm({...form, contact_phone:e.target.value})} />
        <input placeholder="البريد" value={form.contact_email} onChange={(e)=>setForm({...form, contact_email:e.target.value})} />
        <input placeholder="العنوان" value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} />
        <input placeholder="العنوان (EN)" value={form.address_en} onChange={(e)=>setForm({...form, address_en:e.target.value})} />
        <textarea placeholder="وصف" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} style={{ gridColumn: '1 / -1' }} />
        <textarea placeholder="وصف (EN)" value={form.description_en} onChange={(e)=>setForm({...form, description_en:e.target.value})} style={{ gridColumn: '1 / -1' }} />
        <button type="submit" style={{ gridColumn: '1 / -1', background: '#16a34a', color: '#fff', border: 0, padding: '10px 16px', borderRadius: 6 }}>حفظ</button>
      </form>
      {saved && <div style={{ marginTop: 8, color: '#16a34a' }}>تم حفظ الإعدادات</div>}
      {loading && <div style={{ marginTop: 8 }}>جاري التحميل...</div>}
    </AdminLayout>
  );
}
