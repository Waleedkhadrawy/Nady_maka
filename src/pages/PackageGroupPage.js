import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import '../styles/pages/PricingPage.css';

const data = {
  basic: {
    title: 'الباقات الأساسية (عضوية لشخصين)',
    image: `${process.env.PUBLIC_URL}/images/1.PNG`,
    packages: [
      { name: 'الباقة الأساسية', duration: 'سنة', priceText: '4620 SAR / سنة', popular: true, features: [
        'إضافة شخص واحد فقط مجانًا (قرابة من الدرجة الأولى)',
        'استخدام كافة مرافق النادي',
        'دخول مجاني للساحات الخارجية لأفراد العائلة من القرابة الدرجة الأولى',
        'فقط أفراد العائلة من الدرجة الأولى',
        'يمكن التسجيل في الباقات الفرعية سنة، 6 أشهر، و 3 أشهر'
      ]},
      { name: 'الباقة الأساسية', duration: '6 أشهر', priceText: '2730 SAR / 6 شهور', popular: false, features: [
        'إضافة شخص واحد فقط مجانًا (قرابة من الدرجة الأولى)',
        'استخدام كافة مرافق النادي',
        'دخول مجاني للساحات الخارجية لأفراد العائلة من القرابة الدرجة الأولى',
        'فقط أفراد العائلة من الدرجة الأولى',
        'يمكن التسجيل في الباقات الفرعية 6 أشهر، و 3 أشهر'
      ]},
      { name: 'الباقة الأساسية', duration: '3 أشهر', priceText: '1312.5 ريال سعودي / 3 أشهر', popular: false, features: [
        'إضافة شخص واحد فقط مجانًا (قرابة من الدرجة الأولى)',
        'استخدام كافة مرافق النادي',
        'دخول مجاني للساحات الخارجية لأفراد العائلة من القرابة الدرجة الأولى',
        'فقط أفراد العائلة من الدرجة الأولى',
        'يمكن التسجيل في الباقات الفرعية 3 أشهر'
      ]},
    ]
  },
  friends: {
    title: 'باقة الصديقات (عضوية لصديقتين)',
    image: `${process.env.PUBLIC_URL}/images/2.PNG`,
    packages: [
      { name: 'باقة الصديقات', duration: 'سنة', priceText: '4990 SAR / سنة', popular: false, features: [
        'لا يمكن إضافة أكثر من فردين إلى الباقة أو الاستفادة من الباقات الفرعية',
        'إضافة شخص واحد فقط في الباقة مجانا',
        'استخدام كافة مرافق النادي'
      ]},
      { name: 'باقة الصديقات', duration: '6 أشهر', priceText: '3099 SAR / 6 شهور', popular: false, features: [
        'لا يمكن إضافة أكثر من فردين إلى الباقة أو الاستفادة من الباقات الفرعية',
        'إضافة شخص واحد فقط في الباقة مجانا',
        'استخدام كافة مرافق النادي'
      ]},
      { name: 'باقة الصديقات', duration: '3 أشهر', priceText: '1687.5 ريال سعودي / 3 أشهر', popular: false, features: [
        'لا يمكن إضافة أكثر من فردين إلى الباقة أو الاستفادة من الباقات الفرعية',
        'إضافة شخص واحد فقط في الباقة مجانا',
        'استخدام كافة مرافق النادي'
      ]},
    ]
  },
  selected: {
    title: 'باقة الأيام المختارة (عضوية فردية)',
    image: `${process.env.PUBLIC_URL}/images/3.PNG`,
    packages: [
      { name: 'باقة الأيام المختارة', duration: 'سنة', priceText: '2000 ريال سعودي / سنة', popular: false, features: [
        'استخدام الصالات الرياضية فقط، دون الاستشارات أو خدمات التأهيل أو خدمات أخصائي التغذية',
        'مسموح باختيار 120 يومًا خلال السنة',
        'يسمح بالدخول لمدة 10 أيام فقط شهريًا، وأي أيام غير مستخدمة لن يتم ترحيلها إلى الشهر التالي',
        'لا يمكنك الاستفادة من باقة الأكاديميات'
      ]},
      { name: 'باقة الأيام المختارة', duration: '3 أشهر', priceText: '1035 ريال سعودي / 3 أشهر', popular: false, features: [
        'استخدام الصالات الرياضية فقط، دون الاستشارات أو خدمات التأهيل أو خدمات أخصائي التغذية',
        'مسموح باختيار 30 يومًا خلال 3 أشهر',
        'يسمح بالدخول لمدة 10 أيام فقط شهريًا، وأي أيام غير مستخدمة لن يتم ترحيلها إلى الشهر التالي',
        'لا يمكنك الاستفادة من باقة الأكاديميات'
      ]},
      { name: 'باقة الأيام المختارة', duration: 'شهر', priceText: '575 ريال سعودي / شهر', popular: false, features: [
        'استخدام الصالات الرياضية فقط، دون الاستشارات أو خدمات التأهيل أو خدمات أخصائي التغذية',
        'مسموح باختيار 10 أيام خلال الشهر',
        'يسمح بالدخول لمدة 10 أيام فقط شهريًا، وأي أيام غير مستخدمة لن يتم ترحيلها إلى الشهر التالي',
        'لا يمكنك الاستفادة من باقة الأكاديميات'
      ]},
    ]
  },
  individual: {
    title: 'الباقة الفردية (عضوية فردية)',
    image: `${process.env.PUBLIC_URL}/images/fitness.png`,
    packages: [
      { name: 'الباقة الفردية', duration: 'سنة', priceText: '3000 ريال سعودي / سنة', popular: false, features: [
        'استخدام كافة مرافق النادي',
        'لا يمكن الاستفادة من الباقات الفرعية'
      ]},
      { name: 'الباقة الفردية', duration: '6 أشهر', priceText: '1750 ريال سعودي / 6 أشهر', popular: false, features: [
        'استخدام كافة مرافق النادي',
        'لا يمكن الاستفادة من الباقات الفرعية'
      ]},
      { name: 'الباقة الفردية', duration: '3 أشهر', priceText: '1250 ريال سعودي / 3 أشهر', popular: false, features: [
        'استخدام كافة مرافق النادي',
        'لا يمكن الاستفادة من الباقات الفرعية'
      ]},
    ]
  },
  academy: {
    title: 'باقة الأكاديميات (للأفراد تحت سن 15 سنة)',
    image: `${process.env.PUBLIC_URL}/images/acadmy.PNG`,
    packages: [
      { name: 'الفنون القتالية', duration: 'شهر', priceText: '330 ريال سعودي / شهر', popular: false, features: [
        'لفرد واحد فقط أقل من 15 عام',
        'تدريبات تخصصية في الفنون القتالية'
      ]},
      { name: 'السباحة', duration: 'شهر', priceText: '400 ريال سعودي / شهر', popular: false, features: [
        'لفرد واحد فقط أقل من 15 عام',
        'تدريبات تخصصية في السباحة'
      ]},
      { name: 'كرة القدم', duration: 'شهر', priceText: '450 ريال سعودي / شهر', popular: false, features: [
        'لفرد واحد فقط أقل من 15 عام',
        'تدريبات تخصصية في كرة القدم'
      ]},
    ]
  },
};

export default function PackageGroupPage() {
  const { group } = useParams();
  const info = data[group] || data.basic;
  return (
    <div className="pricing-page">
      <div className="group-hero" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/4.PNG)` }}>
        <Container>
          <h1 className="group-title">{info.title}</h1>
          <p className="group-subtitle">اختَر الباقة المناسبة ضمن هذه الفئة، واستكشف المزايا والخدمات المتاحة لكل خيار.</p>
          <div className="group-actions">
            <Link to="/pricing" className="chip">الرجوع إلى الأنواع</Link>
          </div>
        </Container>
      </div>
      <Container>
        <Row className="g-4">
          {info.packages.map((plan, index) => (
            <Col lg={4} md={6} key={index}>
              <Card className={`h-100 pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && (
                  <Badge bg="success" className="popular-badge">الأكثر شعبية</Badge>
                )}
                <Card.Header className="bg-light text-center">
                  <h4 className="plan-name">{plan.name}</h4>
                  <p className="text-muted mb-2">{plan.duration}</p>
                  <div className="price-text">{plan.priceText}</div>
                </Card.Header>
                <Card.Body>
                  <ul className="features-list">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <i className="fas fa-check text-success me-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card.Body>
                <Card.Footer className="text-center">
                  <Button
                    as={Link}
                    to="/membership"
                    variant={plan.popular ? 'success' : 'primary'}
                    className="w-100"
                  >
                    اختيار الباقة
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
