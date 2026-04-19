import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const METHOD_LABEL = {
  cash: 'نقداً',
  card: 'بطاقة',
  bank_transfer: 'تحويل بنكي',
  manual: 'يدوي',
  online: 'إلكتروني',
};

function methodAr(m) {
  const k = String(m || '').toLowerCase();
  return METHOD_LABEL[k] || m || '—';
}

export default function OrdersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ q: '', status: '', method: '' });

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.listOrders({ ...filters, page: 1, limit: 80 });
      setRows(r.items || []);
    } catch (e) {
      toast.error(e.message || 'تعذر تحميل الطلبات');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    const msg =
      status === 'paid'
        ? 'تأكيد قبول الطلب وتفعيل العضوية؟'
        : 'تأكيد رفض/إلغاء الطلب؟ سيتم إلغاء العضوية المرتبطة.';
    if (!window.confirm(msg)) return;
    try {
      await api.updateOrderStatus(id, status);
      toast.success(status === 'paid' ? 'تم قبول الطلب' : 'تم رفض الطلب');
      load();
    } catch (err) {
      toast.error(err.message || 'تعذر تحديث الحالة — تحقق من صلاحية تسجيل دخول المشرف');
    }
  };

  return (
    <AdminLayout>
      <h2 className="mb-2">إدارة الطلبات</h2>
      <p className="text-muted mb-4" style={{ maxWidth: 640 }}>
        الطلبات الواردة من صفحة الدفع (نقد / تحويل / بطاقة) تظهر هنا بحالة «قيد الانتظار». استخدم{' '}
        <strong>قبول</strong> لتفعيل العضوية وتحديث الدفع، أو <strong>رفض</strong> لإلغاء العضوية.
      </p>

      <div
        className="mb-4 p-3 rounded-3 border bg-white d-flex flex-wrap gap-2 align-items-end"
        style={{ borderColor: '#e2e8f0' }}
      >
        <div>
          <label className="form-label small text-muted mb-1">بحث</label>
          <input
            className="form-control"
            placeholder="رقم الطلب أو المرجع"
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>
        <div>
          <label className="form-label small text-muted mb-1">الحالة</label>
          <select
            className="form-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">الكل</option>
            <option value="pending">قيد الانتظار</option>
            <option value="paid">مقبول / مدفوع</option>
            <option value="failed">فشل</option>
            <option value="cancelled">مرفوض / ملغى</option>
          </select>
        </div>
        <div>
          <label className="form-label small text-muted mb-1">طريقة الدفع</label>
          <select
            className="form-select"
            value={filters.method}
            onChange={(e) => setFilters({ ...filters, method: e.target.value })}
          >
            <option value="">الكل</option>
            <option value="cash">نقداً</option>
            <option value="bank_transfer">تحويل بنكي</option>
            <option value="card">بطاقة</option>
            <option value="manual">يدوي</option>
            <option value="online">إلكتروني</option>
          </select>
        </div>
        <button type="button" className="btn btn-primary" onClick={load}>
          تحديث القائمة
        </button>
        <Link to="/admin/packages" className="btn btn-outline-secondary">
          إدارة الباقات
        </Link>
      </div>

      <div className="table-responsive bg-white rounded-3 border" style={{ borderColor: '#e2e8f0' }}>
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>رقم</th>
              <th>عضو</th>
              <th>النوع</th>
              <th>مرجع</th>
              <th>المبلغ</th>
              <th>الطريقة</th>
              <th>الحالة</th>
              <th style={{ minWidth: 200 }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  جاري التحميل...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  لا توجد طلبات. جرّب تغيير الفلاتر أو انتظر طلبات جديدة من الموقع.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td className="fw-bold">{r.id}</td>
                  <td>{r.member_id ?? '—'}</td>
                  <td>
                    <span className="badge bg-secondary bg-opacity-10 text-dark">{r.subject_type}</span>
                  </td>
                  <td>{r.subject_id}</td>
                  <td>
                    {r.amount} {r.currency}
                  </td>
                  <td>{methodAr(r.payment_method)}</td>
                  <td>
                    <span
                      className={
                        r.status === 'paid'
                          ? 'badge bg-success'
                          : r.status === 'pending'
                            ? 'badge bg-warning text-dark'
                            : 'badge bg-secondary'
                      }
                    >
                      {r.status === 'paid'
                        ? 'مقبول'
                        : r.status === 'pending'
                          ? 'قيد المراجعة'
                          : r.status === 'cancelled'
                            ? 'مرفوض'
                            : r.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        disabled={r.status === 'paid'}
                        onClick={() => updateStatus(r.id, 'paid')}
                      >
                        قبول
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        disabled={r.status === 'cancelled' || r.status === 'failed'}
                        onClick={() => updateStatus(r.id, 'cancelled')}
                      >
                        رفض
                      </button>
                    </div>
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
