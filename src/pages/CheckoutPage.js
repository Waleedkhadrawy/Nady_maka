import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Alert, Form } from 'react-bootstrap';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const [data, setData] = useState(null);
  const [placed, setPlaced] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('pending_membership');
    if (raw) setData(JSON.parse(raw));
  }, []);

  const placeOrder = async () => {
    if (!window.confirm("هل أنت متأكد من إتمام الحجز والتسجيل؟\n- اضغط (موافق/OK) للبدء.\n- اضغط (إلغاء/Cancel) للعودة والتعديل.")) return;
    if (!data) return;
    try {
      const partner = data.membership.allow_partner ? { name: data.partner.name, email: data.partner.email, birthDate: data.partner.birthDate, phone: data.partner.phone } : { name: '', email: '', birthDate: '', phone: '' };
      const res = await api.checkoutPayment({
        user: { username: data.user.username, email: data.user.email, phone: data.user.phone, gender: data.user.gender, dob: data.user.dob },
        partner,
        membership: { value: data.membership.value, label: data.membership.label },
        amount: 0,
        currency: 'SAR',
        method: 'manual',
        note,
      });
      setPlaced({ id: res?.id, orderId: res?.orderId, status: res?.status, joinDate: res?.joinDate, expiryDate: res?.expiryDate, paymentId: res?.paymentId });
      toast.success('تم إرسال الطلب بنجاح!');
      localStorage.removeItem('pending_membership');
    } catch (e) {
      toast.error(e.message || 'تعذر إتمام الطلب');
    }
  };

  if (!data) return (
    <Container className="py-5"><Alert variant="warning">لا توجد بيانات طلب. الرجاء العودة إلى صفحة العضوية.</Alert></Container>
  );

  return (
    <Container className="py-5">
      <h1 className="mb-4">Checkout</h1>
      <Row className="g-4">
        <Col md={7}>
          <Card className="shadow border-0">
            <Card.Body>
              <h5 className="mb-3">Additional information</h5>
              <Form.Control as="textarea" rows={4} placeholder="ملاحظات حول الطلب" value={note} onChange={(e)=>setNote(e.target.value)} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card className="shadow border-0">
            <Card.Body>
              <h5 className="mb-3">Your order</h5>
              <div className="d-flex justify-content-between mb-2"><span>Product</span><span>Subtotal</span></div>
              <div className="d-flex justify-content-between mb-2"><span>{data.membership.label}</span><span>—</span></div>
              <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>—</span></div>
              <div className="d-flex justify-content-between mb-3"><span>Total</span><span>—</span></div>
              {placed ? (
                <Alert variant="success" className="mt-2">
                  تم إنشاء الطلب بنجاح<br/>
                  رقم العضوية: {placed.id}<br/>
                  رقم الطلب: {placed.orderId || '—'}<br/>
                  الحالة: {placed.status || '—'}<br/>
                  بداية العضوية: {placed.joinDate ? new Date(placed.joinDate).toLocaleDateString() : '—'}<br/>
                  انتهاء العضوية: {placed.expiryDate ? new Date(placed.expiryDate).toLocaleDateString() : '—'}
                </Alert>
              ) : (
                <Button variant="success" className="w-100" onClick={placeOrder}>Place order</Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
