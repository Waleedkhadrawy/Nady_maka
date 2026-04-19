import React, { useEffect, useMemo, useState } from 'react';
import { Container, Card, Button, Row, Col, Alert, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import '../styles/pages/CheckoutPage.css';

const PAYMENT_LABELS = {
  cash: 'نقداً في الفرع',
  card: 'بطاقة بنكية',
  bank_transfer: 'تحويل بنكي',
  manual: 'يدوي / مراجعة إدارية',
};

function paymentLabel(method) {
  const key = String(method || 'cash').toLowerCase();
  return PAYMENT_LABELS[key] || key;
}

export default function CheckoutPage() {
  const [data, setData] = useState(null);
  const [placed, setPlaced] = useState(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('pending_membership');
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        setData(null);
      }
    }
  }, []);

  const priceDisplay = useMemo(() => {
    if (!data?.membership) return '—';
    return data.membership.priceLabel || data.membership.price || 'يُحدد بعد المراجعة';
  }, [data]);

  const placeOrder = async () => {
    if (!window.confirm('هل تؤكد إرسال الطلب؟ سيتم مراجعته من الإدارة قبل تفعيل العضوية.')) return;
    if (!data) return;
    setBusy(true);
    try {
      const partner = data.membership.allow_partner
        ? { name: data.partner.name, email: data.partner.email, birthDate: data.partner.birthDate, phone: data.partner.phone }
        : { name: '', email: '', birthDate: '', phone: '' };
      const res = await api.checkoutPayment({
        user: {
          username: data.user.username,
          email: data.user.email,
          phone: data.user.phone,
          gender: data.user.gender,
          dob: data.user.dob,
          nationalId: data.user.nationalId,
          jobTitle: data.user.jobTitle,
          address: data.user.address,
        },
        partner,
        membership: { value: data.membership.value, label: data.membership.label },
        amount: 0,
        currency: 'SAR',
        method: data?.payment?.method || 'cash',
        note,
      });
      setPlaced({
        id: res?.id,
        orderId: res?.orderId,
        status: res?.status,
        joinDate: res?.joinDate,
        expiryDate: res?.expiryDate,
        paymentId: res?.paymentId,
      });
      toast.success('تم إرسال طلبك بنجاح');
      localStorage.removeItem('pending_membership');
    } catch (e) {
      toast.error(e.message || 'تعذر إتمام الطلب');
    } finally {
      setBusy(false);
    }
  };

  if (!data) {
    return (
      <Container className="checkout-page py-5">
        <Alert variant="warning" className="shadow-sm border-0 rounded-3">
          لا توجد بيانات طلب.{' '}
          <Link to="/membership">العودة لصفحة العضوية</Link>
          {' · '}
          <Link to="/pricing">استعراض الباقات</Link>
        </Alert>
      </Container>
    );
  }

  const methodKey = data?.payment?.method || 'cash';

  return (
    <div className="checkout-page">
      <Container className="py-4 py-md-5">
        <div className="checkout-hero">
          <h1>مراجعة الطلب والدفع</h1>
          <p>
            راجع باقتك وطريقة الدفع، أضف أي ملاحظة، ثم أرسل الطلب. بعد الإرسال ستقوم الإدارة بالمراجعة والموافقة أو الرفض من لوحة
            الطلبات.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          <Col lg={7} md={12}>
            <Card className="checkout-card border-0 mb-3 mb-lg-0">
              <Card.Body>
                <h5 className="mb-3 d-flex align-items-center gap-2">
                  <span className="text-success">●</span> ملخص الباقة
                </h5>
                <div className="package-highlight">
                  <div className="pkg-title">{data.membership.label}</div>
                  <div className="pkg-meta">
                    كود الباقة: <strong>{data.membership.value}</strong>
                    {data.membership.period_days ? (
                      <>
                        {' · '}
                        المدة: <strong>{data.membership.period_days}</strong> يوم
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="summary-row">
                  <span>السعر المعروض</span>
                  <span>{priceDisplay}</span>
                </div>
                <div className="summary-row">
                  <span>طريقة الدفع</span>
                  <span>
                    <Badge bg="light" text="dark" className="border">
                      {paymentLabel(methodKey)}
                    </Badge>
                  </span>
                </div>
                <div className="summary-row">
                  <span>حالة الطلب بعد الإرسال</span>
                  <span className="text-warning">قيد المراجعة</span>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <Button as={Link} to="/membership" variant="outline-secondary" size="sm" className="btn-outline-muted">
                    تعديل البيانات
                  </Button>
                  <Button as={Link} to="/pricing" variant="outline-secondary" size="sm" className="btn-outline-muted">
                    تصفح كل الباقات
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5} md={12}>
            <Card className="checkout-card border-0">
              <Card.Body>
                <h5 className="mb-3">معلومات إضافية</h5>
                <Form.Control
                  as="textarea"
                  rows={5}
                  className="mb-3"
                  placeholder="ملاحظات حول الطلب (اختياري)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                {placed ? (
                  <Alert variant={placed.status === 'active' ? 'success' : 'info'} className="mb-0 border-0 rounded-3">
                    <strong>تم استلام طلبك.</strong>
                    <br />
                    رقم العضوية (مرجع): {placed.id}
                    <br />
                    رقم الطلب: {placed.orderId || '—'}
                    <br />
                    الحالة: {placed.status === 'pending' ? 'قيد المراجعة من الإدارة' : placed.status || '—'}
                    <br />
                    {placed.joinDate ? <>بداية العضوية المخططة: {new Date(placed.joinDate).toLocaleDateString('ar-SA')}</> : null}
                    <br />
                    {placed.expiryDate ? <>انتهاء العضوية المخطط: {new Date(placed.expiryDate).toLocaleDateString('ar-SA')}</> : null}
                    <hr className="my-2" />
                    <small className="text-muted">
                      يمكن للإدارة قبول الطلب أو رفضه من: <strong>لوحة التحكم → إدارة الطلبات</strong>.
                    </small>
                  </Alert>
                ) : (
                  <Button variant="success" className="w-100 btn-confirm" onClick={placeOrder} disabled={busy}>
                    {busy ? 'جاري الإرسال...' : 'تأكيد إرسال الطلب'}
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
