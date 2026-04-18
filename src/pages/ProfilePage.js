import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { api, setMemberToken } from '../services/api';

export default function ProfilePage(){
  const [me, setMe] = useState(null);
  const [subs, setSubs] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ name:'', email:'', phone:'', gender:'', dob:'' });
  const [subForm, setSubForm] = useState({ name:'', email:'', phone:'', gender:'', dob:'', relation:'' });
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedSubPackage, setSelectedSubPackage] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [loginForm, setLoginForm] = useState({ email:'', password:'' });

  const load = async () => {
    try{
      const prof = await api.getMemberProfile();
      setMe(prof.me); setSubs(prof.subs||[]); setMemberships(prof.memberships||[]);
      setForm({ name: prof.me?.name||'', email: prof.me?.email||'', phone: prof.me?.phone||'', gender: prof.me?.gender||'', dob: prof.me?.dob ? String(prof.me.dob).slice(0,10) : '' });
      const pkgs = await api.listMembershipPackages();
      setPackages(pkgs);
    }catch(e){ setMsg('تعذر تحميل البروفايل'); }
  };
  useEffect(()=>{ load(); },[]);

  const doLogin = async (e) => { e.preventDefault(); try{ const res = await api.memberLogin(loginForm); if (res?.token) { setMemberToken(res.token); setLoginForm({ email:'', password:'' }); await load(); } }catch{ setMsg('تعذر تسجيل الدخول'); } };
  const doRegister = async (e) => { e.preventDefault(); try{ const res = await api.memberRegister({ email: loginForm.email, password: loginForm.password }); if (res?.token) { setMemberToken(res.token); setLoginForm({ email:'', password:'' }); await load(); } }catch{ setMsg('تعذر التسجيل'); } };

  const save = async (e) => { e.preventDefault(); try{ await api.updateMemberProfile(form); setMsg('تم حفظ البيانات'); }catch{ setMsg('تعذر الحفظ'); } };
  const addSub = async (e) => { e.preventDefault(); try{ await api.createSubMember(subForm); setSubForm({ name:'', email:'', phone:'', gender:'', dob:'', relation:'' }); load(); }catch{ setMsg('تعذر إضافة الفرعي'); } };
  const checkoutPrimary = async () => {
    if(!selectedPackage) return;
    try{
      const pkg = packages.find(p=>p.code===selectedPackage);
      const calcAge = (dob)=>{ if(!dob) return null; const d=new Date(dob); const now=new Date(); let age=now.getFullYear()-d.getFullYear(); const m=now.getMonth()-d.getMonth(); if(m<0||(m===0&&now.getDate()<d.getDate())) age--; return age; };
      const age = calcAge(me?.dob);
      if (age !== null){
        if (pkg?.min_age != null && age < pkg.min_age){ setMsg('العمر غير مؤهل لهذه الباقة'); return; }
        if (pkg?.max_age != null && age > pkg.max_age){ setMsg('العمر غير مؤهل لهذه الباقة'); return; }
      }
      await api.checkoutMemberMembership({ package_code: selectedPackage, amount:0, currency:'SAR', method:'manual' }); setSelectedPackage(''); load();
    }catch{ setMsg('تعذر شراء العضوية'); }
  };
  const checkoutSub = async () => {
    if(!selectedSubId || !selectedSubPackage) return;
    try{
      const pkg = packages.find(p=>p.code===selectedSubPackage);
      const sub = subs.find(s=>String(s.id)===String(selectedSubId));
      const calcAge = (dob)=>{ if(!dob) return null; const d=new Date(dob); const now=new Date(); let age=now.getFullYear()-d.getFullYear(); const m=now.getMonth()-d.getMonth(); if(m<0||(m===0&&now.getDate()<d.getDate())) age--; return age; };
      const age = calcAge(sub?.dob);
      if (age !== null){
        if (pkg?.min_age != null && age < pkg.min_age){ setMsg('العمر غير مؤهل لهذه الباقة الفرعية'); return; }
        if (pkg?.max_age != null && age > pkg.max_age){ setMsg('العمر غير مؤهل لهذه الباقة الفرعية'); return; }
      }
      await api.checkoutSubMemberMembership(selectedSubId, { package_code: selectedSubPackage, amount:0, currency:'SAR', method:'manual' }); setSelectedSubPackage(''); setSelectedSubId(''); load();
    }catch{ setMsg('تعذر شراء عضوية الفرعي'); }
  };

  const ageSegment = (()=>{
    if (!me?.dob) return null; const d=new Date(me.dob); const now=new Date(); let age=now.getFullYear()-d.getFullYear(); const m=now.getMonth()-d.getMonth(); if(m<0||(m===0&&now.getDate()<d.getDate())) age--; return age>=15 ? 'adult' : 'junior';
  })();
  const primaryPackages = ageSegment ? packages.filter(p=>p.segment===ageSegment && p.segment!=='sub') : packages.filter(p=>p.segment!=='sub');
  const subPackages = packages.filter(p=>p.segment==='sub');

  return (
    <Container className="py-4">
      {!me && (
        <Card className="mb-3">
          <Card.Body>
            <Form className="d-flex gap-2" onSubmit={doLogin}>
              <Form.Control placeholder="البريد" value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})} />
              <Form.Control type="password" placeholder="كلمة المرور" value={loginForm.password} onChange={e=>setLoginForm({...loginForm,password:e.target.value})} />
              <Button type="submit" variant="primary">دخول</Button>
              <Button variant="secondary" onClick={doRegister}>تسجيل</Button>
            </Form>
          </Card.Body>
        </Card>
      )}
      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow">
            <Card.Header><strong>بياناتي</strong></Card.Header>
            <Card.Body>
              {msg && <Alert variant="info" onClose={()=>setMsg('')} dismissible>{msg}</Alert>}
              <Form onSubmit={save}>
                <Form.Group className="mb-2"><Form.Label>الاسم</Form.Label><Form.Control value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></Form.Group>
                <Form.Group className="mb-2"><Form.Label>البريد</Form.Label><Form.Control value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></Form.Group>
                <Form.Group className="mb-2"><Form.Label>الجوال</Form.Label><Form.Control value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></Form.Group>
                <Form.Group className="mb-2"><Form.Label>الجنس</Form.Label><Form.Select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option value="">اختر</option><option value="male">ذكر</option><option value="female">أنثى</option></Form.Select></Form.Group>
                <Form.Group className="mb-2"><Form.Label>تاريخ الميلاد</Form.Label><Form.Control type="date" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})} /></Form.Group>
                <Button type="submit" variant="success">حفظ</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow">
            <Card.Header><strong>عضويتي</strong></Card.Header>
            <Card.Body>
              <Form.Group className="mb-2"><Form.Label>شراء عضوية</Form.Label><Form.Select value={selectedPackage} onChange={e=>setSelectedPackage(e.target.value)}><option value="">اختر باقة</option>{primaryPackages.map(p=> (<option key={p.code} value={p.code}>{p.label}</option>))}</Form.Select></Form.Group>
              <Button onClick={checkoutPrimary} variant="primary">شراء</Button>
              <hr/>
              <div>
                {memberships.length===0 ? 'لا توجد عضويات' : memberships.map(m=> (<div key={m.id}>{m.label} | {m.status} | {m.join_date} → {m.expiry_date}</div>))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow">
            <Card.Header><strong>الأعضاء الفرعيون</strong></Card.Header>
            <Card.Body>
              <Form onSubmit={addSub} className="mb-3">
                <Row>
                  <Col md={6}><Form.Control placeholder="الاسم" value={subForm.name} onChange={e=>setSubForm({...subForm,name:e.target.value})} /></Col>
                  <Col md={6}><Form.Control placeholder="البريد" value={subForm.email} onChange={e=>setSubForm({...subForm,email:e.target.value})} /></Col>
                </Row>
                <Row className="mt-2">
                  <Col md={4}><Form.Control placeholder="الجوال" value={subForm.phone} onChange={e=>setSubForm({...subForm,phone:e.target.value})} /></Col>
                  <Col md={4}><Form.Select value={subForm.gender} onChange={e=>setSubForm({...subForm,gender:e.target.value})}><option value="">الجنس</option><option value="male">ذكر</option><option value="female">أنثى</option></Form.Select></Col>
                  <Col md={4}><Form.Control type="date" value={subForm.dob} onChange={e=>setSubForm({...subForm,dob:e.target.value})} /></Col>
                </Row>
                <Row className="mt-2">
                  <Col md={6}><Form.Control placeholder="العلاقة" value={subForm.relation} onChange={e=>setSubForm({...subForm,relation:e.target.value})} /></Col>
                  <Col md={6}><Button type="submit" variant="success">إضافة فرعي</Button></Col>
                </Row>
              </Form>
              <div>
                {subs.length===0 ? 'لا يوجد فرعيون' : subs.map(s=> (<div key={s.id}>{s.name} | {s.relation} <Form.Select value={selectedSubId===String(s.id)?selectedSubPackage:''} onChange={e=>{setSelectedSubId(String(s.id));setSelectedSubPackage(e.target.value);}}><option value="">اختر باقة فرعية</option>{subPackages.map(p=> (<option key={p.code} value={p.code}>{p.label}</option>))}</Form.Select> <Button onClick={checkoutSub} variant="primary">شراء فرعي</Button></div>))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow">
            <Card.Header><strong>أنشطتي</strong></Card.Header>
            <Card.Body>
              <div className="mb-2">التسجيلات:</div>
              <MemberEnrollments />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow">
            <Card.Header><strong>فعالياتي</strong></Card.Header>
            <Card.Body>
              <div className="mb-2">التسجيلات:</div>
              <MemberEventRegistrations />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow">
            <Card.Header><strong>حجوزاتي</strong></Card.Header>
            <Card.Body>
              <MemberBookings />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow">
            <Card.Header><strong>مدفوعاتي</strong></Card.Header>
            <Card.Body>
              <MemberPayments />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

function MemberEnrollments(){
  const [rows,setRows] = React.useState([]);
  React.useEffect(()=>{ (async()=>{ try{ const r=await api.getMemberEnrollments(); setRows(r);}catch{ setRows([]);} })(); },[]);
  return (<div>{rows.length===0?'لا توجد تسجيلات': rows.map(e=> (<div key={e.id}>{e.name} | {e.enrolled_at}</div>))}</div>);
}

function MemberEventRegistrations(){
  const [rows,setRows] = React.useState([]);
  React.useEffect(()=>{ (async()=>{ try{ const r=await api.getMemberEventRegistrations(); setRows(r);}catch{ setRows([]);} })(); },[]);
  return (<div>{rows.length===0?'لا توجد تسجيلات': rows.map(e=> (<div key={e.id}>{e.title} | {e.registered_at}</div>))}</div>);
}

function MemberBookings(){
  const [rows,setRows] = React.useState([]);
  const [form,setForm] = React.useState({ date:'', time:'', notes:'' });
  React.useEffect(()=>{ (async()=>{ try{ const r=await api.getMemberBookings(); setRows(r);}catch{ setRows([]);} })(); },[]);
  const submit = async (e)=>{ e.preventDefault(); try{ await api.createMemberBooking(form); setForm({ date:'', time:'', notes:'' }); const r=await api.getMemberBookings(); setRows(r);}catch{} };
  return (
    <div>
      <Form onSubmit={submit} className="d-flex gap-2 mb-2">
        <Form.Control type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
        <Form.Control value={form.time} onChange={e=>setForm({...form,time:e.target.value})} placeholder="HH:MM:SS" />
        <Form.Control value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="ملاحظات" />
        <Button type="submit" variant="primary">حجز</Button>
      </Form>
      <div>{rows.length===0?'لا توجد حجوزات': rows.map(b=> (<div key={b.id}>{b.scheduled_at} | {b.status}</div>))}</div>
    </div>
  );
}

function MemberPayments(){
  const [rows,setRows] = React.useState([]);
  React.useEffect(()=>{ (async()=>{ try{ const r=await api.getMemberPayments(); setRows(r);}catch{ setRows([]);} })(); },[]);
  return (<div>{rows.length===0?'لا توجد مدفوعات': rows.map(p=> (<div key={p.id}>{p.membership_id} | {p.amount} {p.currency} | {p.method} | {p.paid_at}</div>))}</div>);
}
