import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Nav, Modal, Form, Alert } from 'react-bootstrap';
import StatCounter from '../components/StatCounter';
import dataService from '../services/dataService';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  
  // البيانات من قاعدة البيانات
  const [activities, setActivities] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [events, setEvents] = useState([]);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setActivities(dataService.getAllActivities());
    setMembers(dataService.getAllMembers());
    setTrainers(dataService.getAllTrainers());
    setEvents(dataService.getAllEvents());
    setStatistics(dataService.getStatistics());
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleAdd = (type) => {
    setModalType(type);
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleEdit = (type, item) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = (type, id) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      showAlert(`تم حذف ${type} بنجاح`);
      loadData();
    }
  };

  return (
    <div className="dashboard-page">
      <Container fluid className="py-4">
        <Row>
          <Col lg={3}>
            <Card className="mb-4">
              <Card.Body>
                <div className="text-center">
                  <div className="avatar mb-3">
                    <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                      <i className="bi bi-person-fill text-white" style={{fontSize: '2rem'}}></i>
                    </div>
                  </div>
                  <h5>أحمد محمد</h5>
                  <p className="text-muted">عضو منذ يناير 2024</p>
                  <Badge bg="success">{membershipData.status}</Badge>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'overview'}
                      onClick={() => setActiveTab('overview')}
                    >
                      نظرة عامة
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'membership'}
                      onClick={() => setActiveTab('membership')}
                    >
                      الأعضاء
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'activities'}
                      onClick={() => setActiveTab('activities')}
                    >
                      المدربين
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link 
                      active={activeTab === 'settings'}
                      onClick={() => setActiveTab('settings')}
                    >
                      الفعاليات
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={9}>
            {activeTab === 'overview' && (
              <>
                {alert.show && (
                  <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: 'success' })}>
                    {alert.message}
                  </Alert>
                )}
                
                <Row className="mb-4">
                  <Col md={3}>
                    <Card className="text-center">
                      <Card.Body>
                        <StatCounter end={statistics.totalActivities || 0} title="إجمالي الأنشطة" />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center">
                      <Card.Body>
                        <StatCounter end={statistics.totalMembers || 0} title="إجمالي الأعضاء" />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center">
                      <Card.Body>
                        <StatCounter end={statistics.totalTrainers || 0} title="إجمالي المدربين" />
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="text-center">
                      <Card.Body>
                        <StatCounter end={statistics.totalEvents || 0} title="إجمالي الفعاليات" />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">الأنشطة المتاحة</h5>
                    <Button variant="primary" size="sm" onClick={() => handleAdd('activity')}>
                      إضافة نشاط جديد
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>الاسم</th>
                          <th>الفئة</th>
                          <th>المدرب</th>
                          <th>السعر</th>
                          <th>الحالة</th>
                          <th>الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activities.map((activity) => (
                          <tr key={activity.id}>
                            <td>{activity.name}</td>
                            <td>{activity.category}</td>
                            <td>{activity.trainer}</td>
                            <td>{activity.price} {activity.currency}</td>
                            <td>
                              <Badge bg={activity.status === 'متاح' ? 'success' : 'warning'}>
                                {activity.status}
                              </Badge>
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit('activity', activity)}>
                                تعديل
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleDelete('النشاط', activity.id)}>
                                حذف
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </>
            )}

            {activeTab === 'membership' && (
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">إدارة الأعضاء</h5>
                  <Button variant="primary" size="sm" onClick={() => handleAdd('member')}>
                    إضافة عضو جديد
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>العمر</th>
                        <th>نوع العضوية</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.id}>
                          <td>{member.name}</td>
                          <td>{member.email}</td>
                          <td>{member.age}</td>
                          <td>{member.membershipType}</td>
                          <td>
                            <Badge bg={member.status === 'نشط' ? 'success' : 'warning'}>
                              {member.status}
                            </Badge>
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit('member', member)}>
                              تعديل
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete('العضو', member.id)}>
                              حذف
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}

            {activeTab === 'activities' && (
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">إدارة المدربين</h5>
                  <Button variant="primary" size="sm" onClick={() => handleAdd('trainer')}>
                    إضافة مدرب جديد
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>الاسم</th>
                        <th>التخصص</th>
                        <th>الخبرة</th>
                        <th>البريد الإلكتروني</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainers.map((trainer) => (
                        <tr key={trainer.id}>
                          <td>{trainer.name}</td>
                          <td>{trainer.specialization}</td>
                          <td>{trainer.experience}</td>
                          <td>{trainer.email}</td>
                          <td>
                            <Badge bg={trainer.status === 'نشط' ? 'success' : 'warning'}>
                              {trainer.status}
                            </Badge>
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit('trainer', trainer)}>
                              تعديل
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete('المدرب', trainer.id)}>
                              حذف
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}

            {activeTab === 'settings' && (
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">إدارة الفعاليات</h5>
                  <Button variant="primary" size="sm" onClick={() => handleAdd('event')}>
                    إضافة فعالية جديدة
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>العنوان</th>
                        <th>التاريخ</th>
                        <th>الوقت</th>
                        <th>المكان</th>
                        <th>الحالة</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id}>
                          <td>{event.title}</td>
                          <td>{event.date}</td>
                          <td>{event.time}</td>
                          <td>{event.location}</td>
                          <td>
                            <Badge bg={event.status === 'مفتوح للتسجيل' ? 'success' : 'warning'}>
                              {event.status}
                            </Badge>
                          </td>
                          <td>
                            <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit('event', event)}>
                              تعديل
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete('الفعالية', event.id)}>
                              حذف
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      {/* Modal للإضافة والتعديل */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedItem ? 'تعديل' : 'إضافة'} {modalType === 'activity' ? 'نشاط' : modalType === 'member' ? 'عضو' : modalType === 'trainer' ? 'مدرب' : 'فعالية'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'activity' && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>اسم النشاط</Form.Label>
                    <Form.Control type="text" defaultValue={selectedItem?.name || ''} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>الاسم بالإنجليزية</Form.Label>
                    <Form.Control type="text" defaultValue={selectedItem?.nameEn || ''} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>الفئة</Form.Label>
                    <Form.Select defaultValue={selectedItem?.category || ''}>
                      <option value="">اختر الفئة</option>
                      <option value="رياضة جماعية">رياضة جماعية</option>
                      <option value="رياضة فردية">رياضة فردية</option>
                      <option value="فنون قتالية">فنون قتالية</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>السعر</Form.Label>
                    <Form.Control type="number" defaultValue={selectedItem?.price || ''} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>الوصف</Form.Label>
                <Form.Control as="textarea" rows={3} defaultValue={selectedItem?.description || ''} />
              </Form.Group>
            </Form>
          )}

          {modalType === 'member' && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>الاسم</Form.Label>
                    <Form.Control type="text" defaultValue={selectedItem?.name || ''} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>البريد الإلكتروني</Form.Label>
                    <Form.Control type="email" defaultValue={selectedItem?.email || ''} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>العمر</Form.Label>
                    <Form.Control type="number" defaultValue={selectedItem?.age || ''} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>الجنس</Form.Label>
                    <Form.Select defaultValue={selectedItem?.gender || ''}>
                      <option value="">اختر الجنس</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>نوع العضوية</Form.Label>
                    <Form.Select defaultValue={selectedItem?.membershipType || ''}>
                      <option value="">اختر نوع العضوية</option>
                      <option value="شهري">شهري</option>
                      <option value="سنوي">سنوي</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}

          {modalType === 'trainer' && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>الاسم</Form.Label>
                    <Form.Control type="text" defaultValue={selectedItem?.name || ''} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>البريد الإلكتروني</Form.Label>
                    <Form.Control type="email" defaultValue={selectedItem?.email || ''} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>التخصص</Form.Label>
                    <Form.Control type="text" defaultValue={selectedItem?.specialization || ''} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>سنوات الخبرة</Form.Label>
                    <Form.Control type="text" defaultValue={selectedItem?.experience || ''} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>الشهادات</Form.Label>
                <Form.Control as="textarea" rows={2} defaultValue={selectedItem?.certification || ''} />
              </Form.Group>
            </Form>
          )}

          {modalType === 'event' && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>عنوان الفعالية</Form.Label>
                    <Form.Control type="text" defaultValue={selectedItem?.title || ''} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>العنوان بالإنجليزية</Form.Label>
                    <Form.Control type="text" defaultValue={selectedItem?.titleEn || ''} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>التاريخ</Form.Label>
                    <Form.Control type="date" defaultValue={selectedItem?.date || ''} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>الوقت</Form.Label>
                    <Form.Control type="time" defaultValue={selectedItem?.time || ''} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>رسوم التسجيل</Form.Label>
                    <Form.Control type="number" defaultValue={selectedItem?.registrationFee || ''} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>المكان</Form.Label>
                <Form.Control type="text" defaultValue={selectedItem?.location || ''} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>الوصف</Form.Label>
                <Form.Control as="textarea" rows={3} defaultValue={selectedItem?.description || ''} />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={() => {
            showAlert(`تم ${selectedItem ? 'تحديث' : 'إضافة'} البيانات بنجاح`);
            setShowModal(false);
            loadData();
          }}>
            {selectedItem ? 'تحديث' : 'إضافة'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;