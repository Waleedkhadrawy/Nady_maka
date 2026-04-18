import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import SectionTitle from '../components/SectionTitle';
import '../styles/pages/PricingPage.css';

const PricingPage = () => {
  const categories = [
    { key: 'basic', title: 'الباقات الأساسية (عضوية لشخصين)' },
    { key: 'friends', title: 'باقة الصديقات (عضوية لصديقتين)' },
    { key: 'selected', title: 'باقة الأيام المختارة (عضوية فردية)' },
    { key: 'individual', title: 'الباقة الفردية (عضوية فردية)' },
    { key: 'academy', title: 'باقة الأكاديميات (للأفراد تحت سن 15 سنة)' },
  ];

  return (
    <div className="pricing-page pricing-cover" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/4.PNG)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Container>
        <SectionTitle title="اكتشف باقاتنا" subtitle="اختر نوع الباقة لعرض تفاصيلها" />
        <div className="pricing-intro">
          <p>
            طريقك لصحة أفضل يبدأ من هنا. اختر الفئة التي تناسب أسلوب حياتك وأهدافك،
            واستمتع بمرافق راقية وخدمات مصممة بعناية لتمنحك تجربة رياضية ممتعة ومثرية.
          </p>
        </div>
        <div className="category-nav">
          {categories.map(c => (
            <Link key={c.key} to={`/pricing/${c.key}`} className="chip">
              {c.title}
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default PricingPage;
