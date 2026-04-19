import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Tab, Nav, Spinner } from 'react-bootstrap';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

/* ─── Helper ──────────────────────────────────────────────────────────────── */
const statusBadge = (s) => {
  const map = { active: ['success','نشطة'], pending: ['warning','قيد المراجعة'], expired: ['secondary','منتهية'], cancelled: ['danger','ملغاة'], suspended: ['info','موقوفة'] };
  const [v, l] = map[s] || ['secondary', s];
  return <Badge bg={v}>{l}</Badge>;
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function MemberEnrollments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.getMemberEnrollments().then(setRows).catch(() => setRows([])).finally(()=>setLoading(false));
  }, []);
  if (loading) return <div className="text-center py-3"><Spinner size="sm" /></div>;
  if (!rows.length) return <p className="text-muted mb-0">لا توجد تسجيلات في أنشطة.</p>;
  return (
    <div className="list-group list-group-flush">
      {rows.map(e => (
        <div key={e.id} className="list-group-item px-0">
          <strong>{e.name}</strong>
          <small className="text-muted d-block">{e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString('ar-SA') : ''}</small>
        </div>
      ))}
    </div>
  );
}

function MemberEventRegistrations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.getMemberEventRegistrations().then(setRows).catch(() => setRows([])).finally(()=>setLoading(false));
  }, []);
  if (loading) return <div className="text-center py-3"><Spinner size="sm" /></div>;
  if (!rows.length) return <p className="text-muted mb-0">لا توجد تسجيلات في فعاليات.</p>;
  return (
    <div className="list-group list-group-flush">
      {rows.map(e => (
        <div key={e.id} className="list-group-item px-0">
          <strong>{e.title}</strong>
          <small className="text-muted d-block">{e.registered_at ? new Date(e.registered_at).toLocaleDateString('ar-SA') : ''}</small>
        </div>
      ))}
    </div>
  );
}

function MemberBookings() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ date:'', time:'', notes:'' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try { const r = await api.getMemberBookings(); setRows(r); } catch { setRows([]); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.time) { toast.error('يرجى اختيار التاريخ والوقت'); return; }
    setSubmitting(true);
    try {
      await api.createMemberBooking(form);
      toast.success('تم إرسال طلب الحجز');
      setForm({ date:'', time:'', notes:'' });
      load();
    } catch (err) {
      toast.error(err.message || 'تعذر الحجز');
    } finally { setSubmitting(false); }
  };

  const statusColors = { pending:'warning', confirmed:'success', cancelled:'secondary', completed:'info', rejected:'danger' };
  const statusAr = { pending:'قيد المراجعة', confirmed:'مؤكد', cancelled:'ملغى', completed:'مكتمل', rejected:'مرفوض' };

  return (
    <div>
      <h6 className="mb-3">حجز موعد جديد</h6>
      <Form onSubmit={submit} className="mb-4">
        <Row className="g-2">
          <Col md={4}>
            <Form.Control type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} min={new Date().toISOString().split('T')[0]} />
          </Col>
          <Col md={3}>
            <Form.Control type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} />
          </Col>
          <Col md={3}>
            <Form.Control placeholder="ملاحظات" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
          </Col>
          <Col md={2}>
            <Button type="submit" variant="primary" className="w-100" disabled={submitting}>
              {submitting ? <Spinner size="sm"/> : 'حجز'}
            </Button>
          </Col>
        </Row>
      </Form>

      {loading ? <div className="text-center"><Spinner size="sm"/></div> :
        rows.length === 0 ? <p className="text-muted">لا توجد حجوزات.</p> :
        <div className="table-responsive">
          <table className="table table-sm">
            <thead><tr><th>التاريخ</th><th>الحالة</th><th>ملاحظات</th></tr></thead>
            <tbody>
              {rows.map(b => (
                <tr key={b.id}>
                  <td>{b.scheduled_at ? new Date(b.scheduled_at).toLocaleString('ar-SA') : '—'}</td>
                  <td><Badge bg={statusColors[b.status]||'secondary'}>{statusAr[b.status]||b.status}</Badge></td>
                  <td>{b.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}

function MemberPayments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.getMemberPayments().then(setRows).catch(() => setRows([])).finally(()=>setLoading(false));
  }, []);
  if (loading) return <div className="text-center py-3"><Spinner size="sm" /></div>;
  if (!rows.length) return <p className="text-muted mb-0">لا توجد مدفوعات.</p>;
  return (
    <div className="table-responsive">
      <table className="table table-sm">
        <thead><tr><th>#</th><th>المبلغ</th><th>الطريقة</th><th>الحالة</th><th>التاريخ</th></tr></thead>
        <tbody>
          {rows.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><strong>{p.amount} {p.currency}</strong></td>
              <td>{p.method}</td>
              <td>{statusBadge(p.status)}</td>
              <td>{p.paid_at ? new Date(p.paid_at).toLocaleDateString('ar-SA') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Main ProfilePage ────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [subs, setSubs] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [packages, setPackages] = useState([]);
  const [msg, setMsg] = useState({ text:'', variant:'info' });
  const [form, setForm] = useState({ name:'', email:'', phone:'', gender:'', dob:'' });
  const [subForm, setSubForm] = useState({ name:'', email:'', phone:'', gender:'', dob:'', relation:'' });
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedSubPackage, setSelectedSubPackage] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // eslint-disable-next-line no-unused-vars
  const showMsg = (text, variant='info') => setMsg({ text, variant });


  const load = async () => {
    setLoading(true);
    try {
      const prof = await api.getMemberProfile();
      setMe(prof.me);
      setSubs(prof.subs || []);
      setMemberships(prof.memberships || []);
      setForm({
        name: prof.me?.name || '',
        email: prof.me?.email || '',
        phone: prof.me?.phone || '',
        gender: prof.me?.gender || '',
        dob: prof.me?.dob ? String(prof.me.dob).slice(0,10) : '',
      });
      const pkgs = await api.listMembershipPackages();
      setPackages(pkgs);
    } catch {
      // Not logged in - redirect to login
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('الاسم مطلوب'); return; }
    setSaving(true);
    try {
      await api.updateMemberProfile(form);
      toast.success('تم حفظ بياناتك بنجاح ✓');
    } catch {
      toast.error('تعذر حفظ البيانات');
    } finally { setSaving(false); }
  };

  const addSub = async (e) => {
    e.preventDefault();
    if (!subForm.name.trim()) { toast.error('اسم العضو الفرعي مطلوب'); return; }
    try {
      await api.createSubMember(subForm);
      setSubForm({ name:'', email:'', phone:'', gender:'', dob:'', relation:'' });
      toast.success('تمت إضافة العضو الفرعي');
      load();
    } catch (err) { toast.error(err.message || 'تعذر الإضافة'); }
  };

  const calcAge = (dob) => {
    if (!dob) return null;
    const d = new Date(dob); const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
    return age;
  };

  const checkoutPrimary = async () => {
    if (!selectedPackage) { toast.error('يرجى اختيار باقة'); return; }
    const pkg = packages.find(p => p.code === selectedPackage);
    const age = calcAge(me?.dob);
    if (age !== null) {
      if (pkg?.min_age != null && age < pkg.min_age) { toast.error('العمر غير مؤهل لهذه الباقة'); return; }
      if (pkg?.max_age != null && age > pkg.max_age) { toast.error('العمر غير مؤهل لهذه الباقة'); return; }
    }
    try {
      await api.checkoutMemberMembership({ package_code: selectedPackage, amount: 0, currency: 'SAR', method: 'manual' });
      setSelectedPackage('');
      toast.success('تم تفعيل العضوية بنجاح 🎉');
      load();
    } catch (err) { toast.error(err.message || 'تعذر شراء العضوية'); }
  };

  const checkoutSub = async () => {
    if (!selectedSubId || !selectedSubPackage) { toast.error('يرجى اختيار العضو والباقة'); return; }
    try {
      await api.checkoutSubMemberMembership(selectedSubId, { package_code: selectedSubPackage, amount: 0, currency: 'SAR', method: 'manual' });
      setSelectedSubPackage(''); setSelectedSubId('');
      toast.success('تم تفعيل عضوية العضو الفرعي');
      load();
    } catch (err) { toast.error(err.message || 'تعذر شراء عضوية الفرعي'); }
  };

  const ageSegment = (() => {
    if (!me?.dob) return null;
    const age = calcAge(me.dob);
    return age >= 15 ? 'adult' : 'junior';
  })();
  const primaryPackages = ageSegment ? packages.filter(p => p.segment === ageSegment && p.segment !== 'sub') : packages.filter(p => p.segment !== 'sub');
  const subPackages = packages.filter(p => p.segment === 'sub');

  const logout = () => {
    localStorage.removeItem('member_token');
    toast.success('تم تسجيل الخروج');
    navigate('/login');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3 text-muted">جاري التحميل...</p>
      </Container>
    );
  }

  if (!me) return null;

  return (
    <div style={{ background: '#f8fafb', minHeight: '100vh' }}>
      {/* Profile Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #2e7d32, #8BC34A)', padding: '2.5rem 0', marginBottom: '0' }}>
        <Container>
          <Row className="align-items-center">
            <Col xs="auto">
              <div style={{
                width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, color: '#fff', fontWeight: 700, border: '3px solid rgba(255,255,255,0.5)'
              }}>
                {me.name ? me.name.charAt(0) : '؟'}
              </div>
            </Col>
            <Col>
              <h4 style={{ color: '#fff', margin: 0 }}>{me.name || me.email}</h4>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.9rem' }}>{me.email}</p>
            </Col>
            <Col xs="auto">
              <Button variant="outline-light" size="sm" onClick={logout}>
                <i className="bi bi-box-arrow-right me-1" />
                خروج
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Tabs */}
      <Container className="py-4">
        {msg.text && (
          <Alert variant={msg.variant} dismissible onClose={() => setMsg({ text:'', variant:'info' })} className="mb-4">
            {msg.text}
          </Alert>
        )}

        <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
          <Nav variant="pills" className="mb-4 gap-2 flex-wrap">
            {[
              { key: 'profile',    label: 'بياناتي',   icon: 'bi-person-fill' },
              { key: 'membership', label: 'عضويتي',     icon: 'bi-award-fill' },
              { key: 'subs',       label: 'أعضاء فرعيون', icon: 'bi-people-fill' },
              { key: 'activities', label: 'أنشطتي',    icon: 'bi-lightning-fill' },
              { key: 'bookings',   label: 'حجوزاتي',   icon: 'bi-calendar-check-fill' },
              { key: 'payments',   label: 'مدفوعاتي',  icon: 'bi-credit-card-fill' },
            ].map(({ key, label, icon }) => (
              <Nav.Item key={key}>
                <Nav.Link eventKey={key} style={{
                  borderRadius: 10, fontWeight: 600, padding: '0.5rem 1rem',
                  background: activeTab === key ? 'linear-gradient(135deg,#8BC34A,#558B2F)' : '#fff',
                  color: activeTab === key ? '#fff' : '#555',
                  border: '1px solid #dee2e6',
                }}>
                  <i className={`bi ${icon} me-1`} />{label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <Tab.Content>
            {/* ─── Profile Tab ─── */}
            <Tab.Pane eventKey="profile">
              <Card className="shadow-sm border-0" style={{ borderRadius: 16 }}>
                <Card.Header style={{ background: 'transparent', borderBottom: '1px solid #f0f0f0', padding: '1.25rem 1.5rem' }}>
                  <h5 className="mb-0"><i className="bi bi-person-fill me-2 text-success" />البيانات الشخصية</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <Form onSubmit={save}>
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>الاسم الكامل</Form.Label>
                          <Form.Control value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>البريد الإلكتروني</Form.Label>
                          <Form.Control type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>رقم الجوال</Form.Label>
                          <Form.Control value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="05XXXXXXXX" />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>الجنس</Form.Label>
                          <Form.Select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}>
                            <option value="">اختر</option>
                            <option value="male">ذكر</option>
                            <option value="female">أنثى</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>تاريخ الميلاد</Form.Label>
                          <Form.Control type="date" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})} />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Button type="submit" variant="success" disabled={saving} style={{ minWidth: 140, borderRadius: 10 }}>
                          {saving ? <Spinner size="sm" /> : 'حفظ التغييرات'}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* ─── Membership Tab ─── */}
            <Tab.Pane eventKey="membership">
              <Card className="shadow-sm border-0" style={{ borderRadius: 16 }}>
                <Card.Header style={{ background: 'transparent', borderBottom: '1px solid #f0f0f0', padding: '1.25rem 1.5rem' }}>
                  <h5 className="mb-0"><i className="bi bi-award-fill me-2 text-success" />عضوياتي</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  {/* Active memberships */}
                  {memberships.length === 0 ? (
                    <Alert variant="light" className="text-center">لا توجد عضويات مسجلة بعد.</Alert>
                  ) : (
                    <Row className="g-3 mb-4">
                      {memberships.map(m => (
                        <Col md={6} key={m.id}>
                          <Card className="border-0 bg-light" style={{ borderRadius: 12 }}>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <strong>{m.label || m.code}</strong>
                                {statusBadge(m.status)}
                              </div>
                              <small className="text-muted d-block">
                                <i className="bi bi-calendar-range me-1" />
                                {m.join_date ? m.join_date.slice(0,10) : '—'} ← {m.expiry_date ? m.expiry_date.slice(0,10) : '—'}
                              </small>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}

                  {/* Buy new membership */}
                  <hr />
                  <h6 className="mb-3">شراء عضوية جديدة</h6>
                  <Row className="g-2 align-items-end">
                    <Col md={8}>
                      <Form.Select value={selectedPackage} onChange={e=>setSelectedPackage(e.target.value)}>
                        <option value="">اختر باقة</option>
                        {primaryPackages.map(p => (
                          <option key={p.code} value={p.code}>{p.label} — {p.price} {p.currency}</option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={4}>
                      <Button onClick={checkoutPrimary} variant="primary" className="w-100" style={{ borderRadius: 10 }}>
                        <i className="bi bi-cart-plus me-1" />شراء
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* ─── Sub Members Tab ─── */}
            <Tab.Pane eventKey="subs">
              <Card className="shadow-sm border-0" style={{ borderRadius: 16 }}>
                <Card.Header style={{ background: 'transparent', borderBottom: '1px solid #f0f0f0', padding: '1.25rem 1.5rem' }}>
                  <h5 className="mb-0"><i className="bi bi-people-fill me-2 text-success" />أعضاء الأسرة</h5>
                </Card.Header>
                <Card.Body className="p-4">
                  {/* Add sub member form */}
                  <h6 className="mb-3">إضافة عضو جديد</h6>
                  <Form onSubmit={addSub}>
                    <Row className="g-2 mb-4">
                      <Col md={4}><Form.Control placeholder="الاسم *" value={subForm.name} onChange={e=>setSubForm({...subForm,name:e.target.value})} /></Col>
                      <Col md={4}><Form.Control placeholder="البريد" value={subForm.email} onChange={e=>setSubForm({...subForm,email:e.target.value})} /></Col>
                      <Col md={4}><Form.Control placeholder="الجوال (05...)" value={subForm.phone} onChange={e=>setSubForm({...subForm,phone:e.target.value})} /></Col>
                      <Col md={3}>
                        <Form.Select value={subForm.gender} onChange={e=>setSubForm({...subForm,gender:e.target.value})}>
                          <option value="">الجنس</option>
                          <option value="male">ذكر</option>
                          <option value="female">أنثى</option>
                        </Form.Select>
                      </Col>
                      <Col md={3}><Form.Control type="date" value={subForm.dob} onChange={e=>setSubForm({...subForm,dob:e.target.value})} /></Col>
                      <Col md={3}><Form.Control placeholder="العلاقة (زوجة/ابن...)" value={subForm.relation} onChange={e=>setSubForm({...subForm,relation:e.target.value})} /></Col>
                      <Col md={3}><Button type="submit" variant="success" className="w-100">إضافة</Button></Col>
                    </Row>
                  </Form>

                  {/* List of sub members */}
                  {subs.length === 0 ? (
                    <p className="text-muted text-center">لا يوجد أعضاء مضافون بعد.</p>
                  ) : (
                    <div className="vstack gap-3">
                      {subs.map(s => (
                        <Card key={s.id} className="border-0 bg-light" style={{ borderRadius: 12 }}>
                          <Card.Body>
                            <Row className="align-items-center g-2">
                              <Col>
                                <strong>{s.name}</strong>
                                {s.relation && <Badge bg="secondary" className="ms-2">{s.relation}</Badge>}
                                <small className="text-muted d-block">{s.phone || s.email || ''}</small>
                              </Col>
                              <Col md={4}>
                                <Form.Select size="sm" value={selectedSubId===String(s.id) ? selectedSubPackage : ''} onChange={e=>{setSelectedSubId(String(s.id));setSelectedSubPackage(e.target.value);}}>
                                  <option value="">اختر باقة فرعية</option>
                                  {subPackages.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
                                </Form.Select>
                              </Col>
                              <Col md="auto">
                                <Button size="sm" onClick={() => { setSelectedSubId(String(s.id)); checkoutSub(); }} variant="primary">شراء</Button>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* ─── Activities Tab ─── */}
            <Tab.Pane eventKey="activities">
              <Row className="g-4">
                <Col md={6}>
                  <Card className="shadow-sm border-0 h-100" style={{ borderRadius: 16 }}>
                    <Card.Header style={{ background: 'transparent', borderBottom: '1px solid #f0f0f0', padding: '1.25rem 1.5rem' }}>
                      <h5 className="mb-0"><i className="bi bi-lightning-fill me-2 text-success" />الأنشطة</h5>
                    </Card.Header>
                    <Card.Body className="p-4"><MemberEnrollments /></Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="shadow-sm border-0 h-100" style={{ borderRadius: 16 }}>
                    <Card.Header style={{ background: 'transparent', borderBottom: '1px solid #f0f0f0', padding: '1.25rem 1.5rem' }}>
                      <h5 className="mb-0"><i className="bi bi-calendar-event-fill me-2 text-success" />الفعاليات</h5>
                    </Card.Header>
                    <Card.Body className="p-4"><MemberEventRegistrations /></Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* ─── Bookings Tab ─── */}
            <Tab.Pane eventKey="bookings">
              <Card className="shadow-sm border-0" style={{ borderRadius: 16 }}>
                <Card.Header style={{ background: 'transparent', borderBottom: '1px solid #f0f0f0', padding: '1.25rem 1.5rem' }}>
                  <h5 className="mb-0"><i className="bi bi-calendar-check-fill me-2 text-success" />حجوزاتي</h5>
                </Card.Header>
                <Card.Body className="p-4"><MemberBookings /></Card.Body>
              </Card>
            </Tab.Pane>

            {/* ─── Payments Tab ─── */}
            <Tab.Pane eventKey="payments">
              <Card className="shadow-sm border-0" style={{ borderRadius: 16 }}>
                <Card.Header style={{ background: 'transparent', borderBottom: '1px solid #f0f0f0', padding: '1.25rem 1.5rem' }}>
                  <h5 className="mb-0"><i className="bi bi-credit-card-fill me-2 text-success" />سجل المدفوعات</h5>
                </Card.Header>
                <Card.Body className="p-4"><MemberPayments /></Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
}
