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
      <Container className="checkout-page py-5 app-main">
        <Alert variant="warning" className="shadow border-0 rounded-4 text-center p-5 mt-5">
          <i className="bi bi-exclamation-triangle fs-1 text-warning mb-3 d-block"></i>
          <h4>لا توجد بيانات طلب حالية</h4>
          <p className="text-muted mb-4">يرجى العودة واختيار الباقة وتعبئة بياناتك أولاً.</p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/membership" variant="primary" className="btn-premium">تسجيل عضوية جديدة</Button>
            <Button as={Link} to="/pricing" variant="outline-secondary" className="btn-outline-premium text-muted border-secondary">استعراض الباقات</Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const methodKey = data?.payment?.method || 'cash';

  return (
    <div className="checkout-page app-main pt-4 pt-md-5">
      <Container>
        <div className="checkout-hero reveal-up">
          <div className="section-badge border border-primary text-primary">
            <i className="bi bi-receipt"></i> الخطوة الأخيرة
          </div>
          <h1>مراجعة الطلب والدفع</h1>
          <p>
            راجع تفاصيل باقتك وطريقة الدفع المختارة، يمكنك إضافة أي ملاحظة للإدارة، ثم أرسل الطلب ليكون قيد التنفيذ الفوري.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          <Col lg={6} md={12}>
            <Card className="checkout-card reveal-up" style={{ animationDelay: '0.1s' }}>
              <Card.Body className="p-4">
                <h4 className="mb-4 d-flex align-items-center gap-2 text-primary">
                  <i className="bi bi-file-earmark-text-fill"></i> ملخص الباقة
                </h4>
                
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
                  <span>المستفيد الأول</span>
                  <span>{data.user.firstName} {data.user.lastName}</span>
                </div>
                <div className="summary-row">
                  <span>السعر المعروض</span>
                  <span className="text-primary fs-5">{priceDisplay}</span>
                </div>
                <div className="summary-row">
                  <span>طريقة الدفع</span>
                  <span>
                    <Badge bg="light" text="dark" className="border px-3 py-2 fs-6">
                      {paymentLabel(methodKey)}
                    </Badge>
                  </span>
                </div>
                <div className="summary-row">
                  <span>حالة الطلب بعد الإرسال</span>
                  <span className="text-warning"><i className="bi bi-hourglass-split"></i> قيد المراجعة</span>
                </div>

                {!placed && (
                  <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top">
                    <Button as={Link} to="/membership" variant="outline-secondary" size="sm" className="btn-outline-muted">
                      تعديل البيانات <i className="bi bi-pencil ms-1"></i>
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} md={12}>
            <Card className="checkout-card reveal-up" style={{ animationDelay: '0.2s' }}>
              <Card.Body className="p-4">
                <h4 className="mb-4"><i className="bi bi-info-square-fill text-muted me-2"></i>معلومات إضافية والتأكيد</h4>
                
                {placed ? (
                  <Alert variant={placed.status === 'active' ? 'success' : 'info'} className="mb-0 border-0 rounded-4 shadow-sm p-4 text-center">
                    <i className="bi bi-check-circle-fill fs-1 text-success d-block mb-3"></i>
                    <h5 className="mb-3"><strong>تم استلام طلبك بنجاح!</strong></h5>
                    
                    <ul className="list-unstyled text-end mb-4 bg-white rounded p-3 text-muted">
                      <li className="mb-2"><strong>رقم العضوية (مرجع):</strong> {placed.id}</li>
                      <li className="mb-2"><strong>رقم الطلب:</strong> {placed.orderId || '—'}</li>
                      <li className="mb-2"><strong>الحالة:</strong> {placed.status === 'pending' ? 'قيد المراجعة من الإدارة' : placed.status || '—'}</li>
                      {placed.joinDate && <li className="mb-2"><strong>بداية العضوية المخططة:</strong> {new Date(placed.joinDate).toLocaleDateString('ar-SA')}</li>}
                      {placed.expiryDate && <li><strong>انتهاء العضوية المخطط:</strong> {new Date(placed.expiryDate).toLocaleDateString('ar-SA')}</li>}
                    </ul>
                    <hr className="my-3 mx-auto w-50" />
                    <p className="small text-muted mb-0">
                      سنقوم بمراجعة طلبك وإشعارك قريباً بالموافقة، وسيمكنك متابعة حالة عضويتك من <Link to="/profile">صفحة حسابك الشخصي</Link>.
                    </p>
                  </Alert>
                ) : (
                  <>
                    <Form.Group className="mb-4">
                      <Form.Label className="text-muted mb-2">ملاحظات حول الطلب (اختياري)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="أي تفاصيل ترغب بإيصالها للإدارة..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </Form.Group>
                    
                    <Button variant="success" className="w-100 btn-confirm py-3" onClick={placeOrder} disabled={busy}>
                      {busy ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> جاري الإرسال...</>
                      ) : (
                        <>تأكيد إرسال الطلب <i className="bi bi-send-check ms-1"></i></>
                      )}
                    </Button>
                    <p className="text-center text-muted small mt-3 mb-0">
                      بالنقر على الزر أعلاه، أنت توافق على شروط وأحكام العضوية لنادي مكة يارد
                    </p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
