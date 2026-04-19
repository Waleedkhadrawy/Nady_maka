import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';

const StatCard = ({ title, value, icon, color, to, sub }) => (
  <Col md={6} xl={3} className="mb-4">
    <Link to={to || '#'} style={{ textDecoration: 'none' }}>
      <Card className="border-0 h-100" style={{
        borderRadius: 16,
        background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.18)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
      >
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{title}</p>
              <h2 style={{ color: '#fff', margin: '0.25rem 0', fontSize: '2rem', fontWeight: 800 }}>
                {value !== null && value !== undefined ? Number(value).toLocaleString('ar-SA') : <Spinner size="sm" style={{ borderColor: 'rgba(255,255,255,0.5)', borderTopColor: '#fff' }} />}
              </h2>
              {sub && <small style={{ color: 'rgba(255,255,255,0.7)' }}>{sub}</small>}
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>
              <i className={`bi ${icon}`} style={{ color: '#fff' }} />
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  </Col>
);

const QuickLink = ({ to, label, icon, color }) => (
  <Col xs={6} md={4} lg={3} className="mb-3">
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Card className="border-0 text-center h-100" style={{ borderRadius: 12, transition: 'all 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
      >
        <Card.Body className="py-3">
          <div style={{
            width: 44, height: 44, borderRadius: 12, margin: '0 auto 0.5rem',
            background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className={`bi ${icon}`} style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>{label}</p>
        </Card.Body>
      </Card>
    </Link>
  </Col>
);

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    Promise.all([
      api.getReports().catch(() => null),
      api.listBookings({ limit: 5, sort: 'id', order: 'DESC' }).catch(() => ({ items: [] })),
    ]).then(([s, b]) => {
      setStats(s);
      setRecentBookings(b?.items || []);
    }).finally(() => setLoading(false));
  }, []);

  const s = stats || {};

  const statusAr = { pending:'قيد المراجعة', confirmed:'مؤكد', cancelled:'ملغى', completed:'مكتمل', rejected:'مرفوض' };
  const statusColor = { pending:'warning', confirmed:'success', cancelled:'secondary', completed:'info', rejected:'danger' };

  return (
    <AdminLayout>
      {/* Welcome */}
      <div className="mb-4">
        <h4 style={{ fontWeight: 800, color: '#1a1a2e', margin: 0 }}>مرحباً بك في لوحة التحكم 👋</h4>
        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
          {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Row */}
      <Row>
        <StatCard title="إجمالي الأعضاء"   value={s?.members?.total}       icon="bi-people-fill"         color={['#6366f1','#4f46e5']}  to="/admin/members" />
        <StatCard title="الأعضاء النشطون"  value={s?.members?.active}       icon="bi-person-check-fill"   color={['#10b981','#059669']}  to="/admin/members" sub={`منتهية: ${s?.members?.expired ?? '—'}`} />
        <StatCard title="الحجوزات الكلية"  value={s?.bookings?.total}       icon="bi-calendar-check-fill" color={['#f59e0b','#d97706']}  to="/admin/bookings" />
        <StatCard title="إجمالي الإيرادات" value={s?.payments?.sum != null ? `${Number(s.payments.sum).toFixed(0)} ر.س` : null} icon="bi-cash-stack" color={['#ec4899','#db2777']} to="/admin/payments" sub={`من ${s?.payments?.count ?? '—'} عملية`} />
      </Row>
      <Row>
        <StatCard title="العضويات النشطة"  value={s?.memberships?.active}   icon="bi-award-fill"          color={['#3b82f6','#2563eb']}  to="/admin/members" />
        <StatCard title="الأنشطة"          value={s?.activities?.total}     icon="bi-lightning-fill"      color={['#14b8a6','#0d9488']}  to="/admin/activities" />
        <StatCard title="المدربون"         value={s?.trainers?.total}       icon="bi-person-badge-fill"   color={['#8b5cf6','#7c3aed']}  to="/admin/trainers" />
        <StatCard title="الفعاليات القادمة" value={s?.events?.upcoming}     icon="bi-calendar-event-fill" color={['#f97316','#ea580c']}  to="/admin/events" />
      </Row>

      {/* Quick Access */}
      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
        <Card.Header style={{ background: 'transparent', borderBottom: '1px solid #f5f5f5', padding: '1rem 1.25rem' }}>
          <h6 className="mb-0 fw-bold"><i className="bi bi-grid-fill me-2 text-success" />وصول سريع</h6>
        </Card.Header>
        <Card.Body className="p-3">
          <Row>
            <QuickLink to="/admin/customers"           label="العملاء"         icon="bi-person-lines-fill"   color="#6366f1" />
            <QuickLink to="/admin/members"             label="الأعضاء"         icon="bi-people-fill"         color="#10b981" />
            <QuickLink to="/admin/packages"            label="الباقات"         icon="bi-box-seam-fill"       color="#3b82f6" />
            <QuickLink to="/admin/bookings"            label="الحجوزات"        icon="bi-calendar-check-fill" color="#f59e0b" />
            <QuickLink to="/admin/payments"            label="المدفوعات"       icon="bi-cash-stack"          color="#ec4899" />
            <QuickLink to="/admin/orders"              label="الطلبات"         icon="bi-bag-check-fill"      color="#8b5cf6" />
            <QuickLink to="/admin/activities"          label="الأنشطة"         icon="bi-lightning-fill"      color="#14b8a6" />
            <QuickLink to="/admin/trainers"            label="المدربون"        icon="bi-person-badge-fill"   color="#f97316" />
            <QuickLink to="/admin/events"              label="الفعاليات"       icon="bi-calendar-event-fill" color="#06b6d4" />
            <QuickLink to="/admin/reports"             label="التقارير"        icon="bi-bar-chart-fill"      color="#84cc16" />
            <QuickLink to="/admin/contact"             label="الاستعلامات"     icon="bi-chat-dots-fill"      color="#ef4444" />
            <QuickLink to="/admin/settings"            label="الإعدادات"       icon="bi-gear-fill"           color="#6b7280" />
          </Row>
        </Card.Body>
      </Card>

      {/* Recent Bookings */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: 16 }}>
        <Card.Header style={{ background: 'transparent', borderBottom: '1px solid #f5f5f5', padding: '1rem 1.25rem' }} className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0 fw-bold"><i className="bi bi-clock-history me-2 text-warning" />آخر الحجوزات</h6>
          <Link to="/admin/bookings" style={{ fontSize: '0.85rem', color: '#8BC34A', textDecoration: 'none' }}>عرض الكل →</Link>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-4"><Spinner size="sm" /></div>
          ) : recentBookings.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">لا توجد حجوزات حديثة.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0" style={{ fontSize: '0.88rem' }}>
                <thead style={{ background: '#f9fafb' }}>
                  <tr>
                    <th className="px-3 py-2 fw-semibold">#</th>
                    <th className="py-2 fw-semibold">الاسم</th>
                    <th className="py-2 fw-semibold">الخدمة</th>
                    <th className="py-2 fw-semibold">الموعد</th>
                    <th className="py-2 fw-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(b => (
                    <tr key={b.id}>
                      <td className="px-3">{b.id}</td>
                      <td>{b.name || `عضو #${b.member_id}` || '—'}</td>
                      <td>{b.service || '—'}</td>
                      <td>{b.scheduled_at ? new Date(b.scheduled_at).toLocaleDateString('ar-SA') : '—'}</td>
                      <td><Badge bg={statusColor[b.status] || 'secondary'}>{statusAr[b.status] || b.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
}