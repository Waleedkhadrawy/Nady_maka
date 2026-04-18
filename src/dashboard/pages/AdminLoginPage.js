import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await api.login(username, password);
      setToken(token);
      navigate('/admin');
    } catch (e) {
      toast.error(e.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f8fafc', direction: 'rtl' }}>
      <form onSubmit={submit} style={{ width: 360, background: '#fff', padding: 20, borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,.1)' }}>
        <h3 style={{ marginTop: 0, textAlign: 'center' }}>تسجيل دخول الإدمن</h3>
        <label>اسم المستخدم</label>
        <input value={username} onChange={(e)=>setUsername(e.target.value)} required style={{ width: '100%', marginBottom: 10 }} />
        <label>كلمة المرور</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required style={{ width: '100%', marginBottom: 16 }} />
        <button type="submit" disabled={loading} style={{ width: '100%', background: '#16a34a', color: '#fff', border: 0, padding: '10px 16px', borderRadius: 6 }}>
          {loading ? 'جارٍ الدخول...' : 'دخول'}
        </button>
      </form>
    </div>
  );
}