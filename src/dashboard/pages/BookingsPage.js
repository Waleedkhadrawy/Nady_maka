import React, { useEffect, useState, useCallback } from 'react';
import { Row, Col, Form, Button, Badge, Spinner, Card } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const STATUSES = [
  { value: '', label: 'كل الحالات' },
  { value: 'pending',   label: 'قيد المراجعة' },
  { value: 'confirmed', label: 'مؤكد' },
  { value: 'completed', label: 'مكتمل' },
  { value: 'cancelled', label: 'ملغى' },
  { value: 'rejected',  label: 'مرفوض' },
];

const STATUS_COLOR = { pending:'warning', confirmed:'success', completed:'info', cancelled:'secondary', rejected:'danger' };

// Add updateBooking & deleteBooking to api service inline (since they are new endpoints)
async function updateBookingStatusApi(id, status) {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`/api/bookings/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'error');
  return res.json();
}

async function deleteBookingApi(id) {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`/api/bookings/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).message || 'error');
}

export default function BookingsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [updating, setUpdating] = useState(null); // id being updated

  const load = useCallback(async (pg = page) => {
    setLoading(true);
    try {
      const res = await api.listBookings({ q, status: statusFilter, from, to, page: pg, limit });
      setRows(res.items || []);
      setPage(res.page || pg);
      setTotal(res.total || 0);
    } catch (err) {
      toast.error(err.message || 'تعذر تحميل الحجوزات');
    } finally { setLoading(false); }
  }, [q, statusFilter, from, to, page, limit]);

  useEffect(() => { load(1); }, []); // eslint-disable-line

  const handleStatusChange = async (id, status) => {
    setUpdating(id);
    try {
      await updateBookingStatusApi(id, status);
      toast.success(`تم تحديث الحالة إلى "${STATUSES.find(s=>s.value===status)?.label}"`);
      load(page);
    } catch (err) {
      toast.error(err.message || 'تعذر التحديث');
    } finally { setUpdating(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل تريد حذف هذا الحجز؟')) return;
    try {
      await deleteBookingApi(id);
      toast.success('تم حذف الحجز');
      load(page);
    } catch (err) {
      toast.error(err.message || 'تعذر الحذف');
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">إدارة الحجوزات</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>إجمالي: {total} حجز</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
        <Card.Body className="p-3">
          <Row className="g-2 align-items-end">
            <Col md={4}>
              <Form.Control
                placeholder="🔍 بحث بالاسم أو الخدمة أو البريد..."
                value={q} onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && load(1)}
              />
            </Col>
            <Col md={2}>
              <Form.Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Control type="date" value={from} onChange={e => setFrom(e.target.value)} placeholder="من" />
            </Col>
            <Col md={2}>
              <Form.Control type="date" value={to} onChange={e => setTo(e.target.value)} placeholder="إلى" />
            </Col>
            <Col md={2}>
              <Button variant="primary" className="w-100" onClick={() => load(1)} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <><i className="bi bi-search me-1" />بحث</>}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0" style={{ fontSize: '0.875rem' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
              <tr>
                <th className="px-3 py-3 fw-semibold">#</th>
                <th className="py-3 fw-semibold">الاسم</th>
                <th className="py-3 fw-semibold">الجوال</th>
                <th className="py-3 fw-semibold">الخدمة</th>
                <th className="py-3 fw-semibold">الموعد</th>
                <th className="py-3 fw-semibold">ملاحظات</th>
                <th className="py-3 fw-semibold">الحالة</th>
                <th className="py-3 fw-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-5"><Spinner /><p className="mt-2 text-muted">جاري التحميل...</p></td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-5 text-muted">لا توجد حجوزات تطابق البحث</td></tr>
              ) : rows.map(r => (
                <tr key={r.id}>
                  <td className="px-3">{r.id}</td>
                  <td>
                    <div className="fw-semibold">{r.name || `عضو #${r.member_id}` || '—'}</div>
                    <small className="text-muted">{r.email || ''}</small>
                  </td>
                  <td>{r.phone || '—'}</td>
                  <td>{r.service || '—'}</td>
                  <td>
                    {r.scheduled_at
                      ? new Date(r.scheduled_at).toLocaleString('ar-SA', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })
                      : '—'}
                  </td>
                  <td><span className="text-muted" style={{ fontSize: '0.8rem' }}>{r.notes || '—'}</span></td>
                  <td>
                    <Badge bg={STATUS_COLOR[r.status] || 'secondary'}>
                      {STATUSES.find(s => s.value === r.status)?.label || r.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1 align-items-center">
                      <Form.Select
                        size="sm"
                        value={r.status}
                        onChange={e => handleStatusChange(r.id, e.target.value)}
                        disabled={updating === r.id}
                        style={{ fontSize: '0.75rem', width: 'auto', minWidth: 90 }}
                      >
                        {STATUSES.filter(s => s.value).map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </Form.Select>
                      {updating === r.id && <Spinner size="sm" />}
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(r.id)}
                        title="حذف"
                        style={{ borderRadius: 6 }}
                      >
                        <i className="bi bi-trash" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-top" style={{ background: '#f9fafb', borderRadius: '0 0 12px 12px' }}>
            <Button size="sm" variant="outline-secondary" disabled={page <= 1} onClick={() => { setPage(p => p-1); load(page-1); }}>
              <i className="bi bi-chevron-right" /> السابق
            </Button>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>صفحة {page} من {totalPages}</span>
            <Button size="sm" variant="outline-secondary" disabled={page >= totalPages} onClick={() => { setPage(p => p+1); load(page+1); }}>
              التالي <i className="bi bi-chevron-left" />
            </Button>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
