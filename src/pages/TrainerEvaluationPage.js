import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import SectionTitle from '../components/SectionTitle';
import { api } from '../services/api';
import '../styles/pages/TrainerEvaluationPage.css';
import toast from 'react-hot-toast';

const TrainerEvaluationPage = () => {
  const [formData, setFormData] = useState({
    memberName: '',
    membershipNumber: '',
    trainerName: '',
    sessionDate: '',
    overallRating: '',
    professionalismRating: '',
    knowledgeRating: '',
    communicationRating: '',
    punctualityRating: '',
    motivationRating: '',
    positiveAspects: '',
    improvementAreas: '',
    additionalComments: '',
    recommendTrainer: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const trainers = [
    'أحمد محمد - مدرب كمال أجسام',
    'سارة أحمد - مدربة لياقة بدنية',
    'محمد علي - مدرب كارديو',
    'فاطمة حسن - مدربة يوجا',
    'عبدالله سالم - مدرب تدريب وظيفي',
    'نورا خالد - مدربة بيلاتس'
  ];

  const ratingOptions = [
    { value: '5', label: 'ممتاز (5)' },
    { value: '4', label: 'جيد جداً (4)' },
    { value: '3', label: 'جيد (3)' },
    { value: '2', label: 'مقبول (2)' },
    { value: '1', label: 'ضعيف (1)' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        memberName: formData.memberName,
        membershipNumber: formData.membershipNumber,
        trainerName: formData.trainerName,
        sessionDate: formData.sessionDate,
        overallRating: formData.overallRating,
        professionalismRating: formData.professionalismRating || undefined,
        knowledgeRating: formData.knowledgeRating || undefined,
        communicationRating: formData.communicationRating || undefined,
        punctualityRating: formData.punctualityRating || undefined,
        motivationRating: formData.motivationRating || undefined,
        positiveAspects: formData.positiveAspects || undefined,
        improvementAreas: formData.improvementAreas || undefined,
        additionalComments: formData.additionalComments || undefined,
        recommendTrainer: formData.recommendTrainer || undefined,
      };
      await api.submitTrainerEvaluation(payload);
      setShowAlert(true);
      setFormData({
        memberName: '',
        membershipNumber: '',
        trainerName: '',
        sessionDate: '',
        overallRating: '',
        professionalismRating: '',
        knowledgeRating: '',
        communicationRating: '',
        punctualityRating: '',
        motivationRating: '',
        positiveAspects: '',
        improvementAreas: '',
        additionalComments: '',
        recommendTrainer: ''
      });
    } catch (err) {
      const msg = (err && err.message) ? err.message : 'تعذر إرسال تقييم المدرب';
      toast.error(msg);
    }
    setSubmitting(false);
  };

  return (
    <div className="trainer-evaluation-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="text-center">
            <Col>
              <h1 className="display-4 fw-bold mb-4">تقييم المدرب</h1>
              <p className="lead">
                ساعدنا في تحسين خدماتنا من خلال تقييم أداء مدربينا
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Evaluation Form */}
      <section className="evaluation-form py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              {showAlert && (
                <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                  شكراً لك! تم إرسال تقييمك بنجاح. رأيك مهم جداً لنا لتحسين خدماتنا.
                </Alert>
              )}
              
              <Card className="shadow">
                <Card.Header className="bg-primary text-white">
                  <h4 className="mb-0">نموذج تقييم المدرب</h4>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    {/* Member Information */}
                    <div className="section-divider mb-4">
                      <h5 className="text-primary">معلومات العضو</h5>
                      <hr />
                    </div>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>اسم العضو *</Form.Label>
                          <Form.Control
                            type="text"
                            name="memberName"
                            value={formData.memberName}
                            onChange={handleInputChange}
                            required
                            placeholder="أدخل اسمك الكامل"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>رقم العضوية</Form.Label>
                          <Form.Control
                            type="text"
                            name="membershipNumber"
                            value={formData.membershipNumber}
                            onChange={handleInputChange}
                            placeholder="رقم العضوية (اختياري)"
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Session Information */}
                    <div className="section-divider mb-4">
                      <h5 className="text-primary">معلومات الجلسة</h5>
                      <hr />
                    </div>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>اسم المدرب *</Form.Label>
                          <Form.Select
                            name="trainerName"
                            value={formData.trainerName}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">اختر المدرب</option>
                            {trainers.map((trainer, index) => (
                              <option key={index} value={trainer}>{trainer}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>تاريخ الجلسة *</Form.Label>
                          <Form.Control
                            type="date"
                            name="sessionDate"
                            value={formData.sessionDate}
                            onChange={handleInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Ratings */}
                    <div className="section-divider mb-4">
                      <h5 className="text-primary">التقييمات</h5>
                      <hr />
                    </div>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>التقييم العام *</Form.Label>
                          <Form.Select
                            name="overallRating"
                            value={formData.overallRating}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">اختر التقييم</option>
                            {ratingOptions.map((option, index) => (
                              <option key={index} value={option.value}>{option.label}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>الاحترافية *</Form.Label>
                          <Form.Select
                            name="professionalismRating"
                            value={formData.professionalismRating}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">اختر التقييم</option>
                            {ratingOptions.map((option, index) => (
                              <option key={index} value={option.value}>{option.label}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>المعرفة والخبرة *</Form.Label>
                          <Form.Select
                            name="knowledgeRating"
                            value={formData.knowledgeRating}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">اختر التقييم</option>
                            {ratingOptions.map((option, index) => (
                              <option key={index} value={option.value}>{option.label}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>التواصل والشرح *</Form.Label>
                          <Form.Select
                            name="communicationRating"
                            value={formData.communicationRating}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">اختر التقييم</option>
                            {ratingOptions.map((option, index) => (
                              <option key={index} value={option.value}>{option.label}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>الالتزام بالمواعيد *</Form.Label>
                          <Form.Select
                            name="punctualityRating"
                            value={formData.punctualityRating}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">اختر التقييم</option>
                            {ratingOptions.map((option, index) => (
                              <option key={index} value={option.value}>{option.label}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>التحفيز والدعم *</Form.Label>
                          <Form.Select
                            name="motivationRating"
                            value={formData.motivationRating}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">اختر التقييم</option>
                            {ratingOptions.map((option, index) => (
                              <option key={index} value={option.value}>{option.label}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Comments */}
                    <div className="section-divider mb-4">
                      <h5 className="text-primary">التعليقات والملاحظات</h5>
                      <hr />
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>الجوانب الإيجابية</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="positiveAspects"
                        value={formData.positiveAspects}
                        onChange={handleInputChange}
                        placeholder="ما الذي أعجبك في أداء المدرب؟"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>مجالات التحسين</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="improvementAreas"
                        value={formData.improvementAreas}
                        onChange={handleInputChange}
                        placeholder="ما الذي يمكن للمدرب تحسينه؟"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>تعليقات إضافية</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="additionalComments"
                        value={formData.additionalComments}
                        onChange={handleInputChange}
                        placeholder="أي تعليقات أو اقتراحات أخرى"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>هل تنصح بهذا المدرب؟ *</Form.Label>
                      <div>
                        <Form.Check
                          type="radio"
                          name="recommendTrainer"
                          value="yes"
                          label="نعم، أنصح به"
                          checked={formData.recommendTrainer === 'yes'}
                          onChange={handleInputChange}
                          required
                        />
                        <Form.Check
                          type="radio"
                          name="recommendTrainer"
                          value="no"
                          label="لا، لا أنصح به"
                          checked={formData.recommendTrainer === 'no'}
                          onChange={handleInputChange}
                          required
                        />
                        <Form.Check
                          type="radio"
                          name="recommendTrainer"
                          value="maybe"
                          label="ربما، مع بعض التحسينات"
                          checked={formData.recommendTrainer === 'maybe'}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </Form.Group>

                    <div className="text-center">
                      <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                        إرسال التقييم
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why Evaluate Section */}
      <section className="why-evaluate bg-light py-5">
        <Container>
          <SectionTitle 
            title="لماذا تقييمك مهم؟" 
            subtitle="رأيك يساعدنا في تقديم أفضل الخدمات"
          />
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <div className="benefit-item text-center">
                <div className="benefit-icon mb-3">
                  <i className="fas fa-chart-line fa-3x text-primary"></i>
                </div>
                <h5>تحسين الخدمات</h5>
                <p>تقييمك يساعدنا في تطوير وتحسين خدماتنا باستمرار</p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="benefit-item text-center">
                <div className="benefit-icon mb-3">
                  <i className="fas fa-users fa-3x text-primary"></i>
                </div>
                <h5>تطوير المدربين</h5>
                <p>ملاحظاتك تساعد مدربينا في تطوير مهاراتهم</p>
              </div>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <div className="benefit-item text-center">
                <div className="benefit-icon mb-3">
                  <i className="fas fa-star fa-3x text-primary"></i>
                </div>
                <h5>ضمان الجودة</h5>
                <p>نحرص على تقديم أعلى مستويات الجودة في التدريب</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default TrainerEvaluationPage;
