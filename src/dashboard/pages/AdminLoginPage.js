import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) { toast.error('يرجى إدخال اسم المستخدم وكلمة المرور'); return; }
    setLoading(true);
    try {
      const { token } = await api.login(username.trim(), password);
      setToken(token);
      toast.success('مرحباً بك في لوحة التحكم 👋');
      navigate('/admin');
    } catch (e) {
      toast.error(e.message || 'بيانات الدخول غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      direction: 'rtl',
      padding: '1rem',
    }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(139,195,74,0.07)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(99,102,241,0.07)', filter: 'blur(50px)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 25px 60px rgba(0,0,0,0.35)', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #1a2e1a, #2d5016, #8BC34A)', padding: '2rem', textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.15)',
              margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.3)',
            }}>
              <i className="bi bi-shield-lock-fill" style={{ fontSize: 28, color: '#fff' }} />
            </div>
            <h3 style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '1.25rem' }}>لوحة تحكم الإدارة</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>نادي مكة يارد — دخول المشرف</p>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem', color: '#374151' }}>
                اسم المستخدم أو البريد
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                  <i className="bi bi-person" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                  style={{
                    width: '100%', paddingRight: 36, paddingLeft: 12, height: 44,
                    border: '2px solid #e5e7eb', borderRadius: 10, fontSize: '0.95rem',
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#8BC34A'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem', color: '#374151' }}>
                كلمة المرور
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                  <i className="bi bi-lock" />
                </span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%', paddingRight: 36, paddingLeft: 44, height: 44,
                    border: '2px solid #e5e7eb', borderRadius: 10, fontSize: '0.95rem',
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#8BC34A'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}
                >
                  <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 46, borderRadius: 12, border: 'none',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #8BC34A, #558B2F)',
                color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading ? (
                <><span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> جارٍ الدخول...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right" /> تسجيل الدخول</>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginTop: '1rem' }}>
          © {new Date().getFullYear()} نادي مكة يارد — جميع الحقوق محفوظة
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}