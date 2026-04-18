





BEGIN;

DROP TABLE IF EXISTS admins, customers, users, password_reset_tokens, members, partners, membership_packages, memberships, payments, activities, activity_schedules, trainers, activity_trainers, enrollments, events, event_registrations, media_images, media_videos, bookings, trainer_evaluations, surveys, contact_messages, settings CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';


CREATE TABLE admins (
  id BIGSERIAL NOT NULL,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(64) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE customers (
  id BIGSERIAL NOT NULL,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(32),
  membership_type VARCHAR(64),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (email)
);

CREATE TABLE users (
  id BIGSERIAL NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(32),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE password_reset_tokens (
  id BIGSERIAL NOT NULL,
  user_id BIGINT,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE members (
  id BIGSERIAL NOT NULL,
  customer_id BIGINT,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(32),
  gender VARCHAR(16),
  dob DATE,
  type VARCHAR(64) DEFAULT 'primary',
  parent_member_id BIGINT,
  relation VARCHAR(64),
  status VARCHAR(32) DEFAULT 'active',
  join_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (email),
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE partners (
  id BIGSERIAL NOT NULL,
  member_id BIGINT,
  name VARCHAR(160),
  email VARCHAR(255),
  birth_date DATE,
  phone VARCHAR(32),
  relation VARCHAR(64),
  PRIMARY KEY (id),
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE membership_packages (
  id BIGSERIAL NOT NULL,
  code VARCHAR(64) NOT NULL UNIQUE,
  label VARCHAR(160) NOT NULL,
  price DECIMAL(10,2),
  currency VARCHAR(8) DEFAULT 'SAR',
  period_days INT NOT NULL,
  kind VARCHAR(32) DEFAULT 'individual',
  segment VARCHAR(64) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id)
);

CREATE TABLE memberships (
  id BIGSERIAL NOT NULL,
  member_id BIGINT,
  package_id BIGINT,
  join_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status VARCHAR(32) DEFAULT 'active',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES membership_packages(id) ON DELETE SET NULL
);

CREATE TABLE payments (
  id BIGSERIAL NOT NULL,
  membership_id BIGINT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(8) DEFAULT 'SAR',
  method VARCHAR(32) DEFAULT 'manual',
  status VARCHAR(32) DEFAULT 'paid',
  ref VARCHAR(64),
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (membership_id) REFERENCES memberships(id) ON DELETE CASCADE
);

CREATE TABLE activities (
  id BIGSERIAL NOT NULL,
  name VARCHAR(160) NOT NULL,
  description TEXT,
  category VARCHAR(64),
  age_group VARCHAR(32),
  duration_minutes INT,
  price DECIMAL(10,2),
  currency VARCHAR(8) DEFAULT 'SAR',
  capacity INT,
  image VARCHAR(255),
  status VARCHAR(32) DEFAULT 'available',
  PRIMARY KEY (id)
);

CREATE TABLE activity_schedules (
  id BIGSERIAL NOT NULL,
  activity_id BIGINT,
  day_of_week SMALLINT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

CREATE TABLE trainers (
  id BIGSERIAL NOT NULL,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(32),
  specialization VARCHAR(64),
  experience_years INT,
  certification VARCHAR(160),
  status VARCHAR(32) DEFAULT 'active',
  PRIMARY KEY (id),
  UNIQUE (email)
);

CREATE TABLE activity_trainers (
  activity_id BIGINT,
  trainer_id BIGINT,
  PRIMARY KEY (activity_id, trainer_id),
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE
);

CREATE TABLE enrollments (
  id BIGSERIAL NOT NULL,
  member_id BIGINT,
  activity_id BIGINT,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (member_id, activity_id),
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

CREATE TABLE events (
  id BIGSERIAL NOT NULL,
  title VARCHAR(160) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location VARCHAR(160),
  category VARCHAR(64),
  registration_fee DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(8) DEFAULT 'SAR',
  max_participants INT,
  status VARCHAR(32) DEFAULT 'open',
  PRIMARY KEY (id)
);

CREATE TABLE event_registrations (
  id BIGSERIAL NOT NULL,
  event_id BIGINT,
  member_id BIGINT,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (event_id, member_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE media_images (
  id BIGSERIAL NOT NULL,
  url VARCHAR(255) NOT NULL,
  title VARCHAR(160),
  alt VARCHAR(160),
  PRIMARY KEY (id)
);

CREATE TABLE media_videos (
  id BIGSERIAL NOT NULL,
  url VARCHAR(255) NOT NULL,
  title VARCHAR(160),
  thumb_url VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE bookings (
  id BIGSERIAL NOT NULL,
  member_id BIGINT,
  activity_id BIGINT,
  event_id BIGINT,
  scheduled_at TIMESTAMP,
  notes TEXT,
  status VARCHAR(32) DEFAULT 'pending',
  PRIMARY KEY (id),
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

CREATE TABLE trainer_evaluations (
  id BIGSERIAL NOT NULL,
  trainer_id BIGINT,
  member_id BIGINT,
  rating SMALLINT NOT NULL,
  feedback TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CHECK (rating BETWEEN 1 AND 5),
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
);

CREATE TABLE surveys (
  id BIGSERIAL NOT NULL,
  member_id BIGINT,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
);

CREATE TABLE contact_messages (
  id BIGSERIAL NOT NULL,
  name VARCHAR(160),
  email VARCHAR(255),
  phone VARCHAR(32),
  subject VARCHAR(160),
  message TEXT,
  status VARCHAR(32) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE settings (
  id BIGSERIAL NOT NULL,
  site_name VARCHAR(160),
  site_name_en VARCHAR(160),
  description TEXT,
  description_en TEXT,
  contact_phone VARCHAR(32),
  contact_email VARCHAR(255),
  address VARCHAR(255),
  address_en VARCHAR(255),
  social_media JSON,
  working_hours JSON,
  PRIMARY KEY (id)
);

INSERT INTO admins (username, password_hash, email, role) VALUES
('admin', '$2b$10$Zl9qkM4o4xwzqvQHk3dVqu3e7Jv6p1Hc3hZr0iD1bJk5uUu3kEwzS', 'admin@example.com', 'admin');

INSERT INTO membership_packages (code, label, price, currency, period_days, kind, segment, active) VALUES
('basic_year', 'الباقة الأساسية - سنة', 4620.00, 'SAR', 365, 'family', 'adult', TRUE),
('basic_6m', 'الباقة الأساسية - 6 أشهر', 2730.00, 'SAR', 182, 'family', 'adult', TRUE),
('basic_3m', 'الباقة الأساسية - 3 أشهر', 1312.50, 'SAR', 91, 'family', 'adult', TRUE),
('individual_year', 'الباقة الفردية - سنة', 3000.00, 'SAR', 365, 'individual', 'adult', TRUE),
('individual_6m', 'الباقة الفردية - 6 أشهر', 1750.00, 'SAR', 182, 'individual', 'adult', TRUE),
('individual_3m', 'الباقة الفردية - 3 أشهر', 1250.00, 'SAR', 91, 'individual', 'adult', TRUE),
('junior_year', 'باقة الأحداث - سنة', 2500.00, 'SAR', 365, 'individual', 'junior', TRUE),
('junior_6m', 'باقة الأحداث - 6 أشهر', 1500.00, 'SAR', 182, 'individual', 'junior', TRUE),
('junior_3m', 'باقة الأحداث - 3 أشهر', 900.00, 'SAR', 91, 'individual', 'junior', TRUE),
('sub_year', 'الباقة الفرعية - سنة', 1200.00, 'SAR', 365, 'family', 'sub', TRUE),
('sub_6m', 'الباقة الفرعية - 6 أشهر', 700.00, 'SAR', 182, 'family', 'sub', TRUE),
('sub_3m', 'الباقة الفرعية - 3 أشهر', 400.00, 'SAR', 91, 'family', 'sub', TRUE);

INSERT INTO customers (name, email, phone) VALUES
('عبدالله أحمد', 'abdullah@example.com', '+966501234567'),
('فاطمة سالم', 'fatima@example.com', '+966501234569');

INSERT INTO members (customer_id, name, email, phone, gender, status, join_date, type) VALUES
(1, 'عبدالله أحمد', 'abdullah@example.com', '+966501234567', 'male', 'active', '2024-01-15', 'primary'),
(2, 'فاطمة سالم', 'fatima@example.com', '+966501234569', 'female', 'active', '2023-12-01', 'primary');

INSERT INTO partners (member_id, name, email, birth_date, phone, relation) VALUES
(1, 'أحمد محمد', 'ahmed.father@example.com', NULL, '+966501234568', 'father');

INSERT INTO activities (name, description, category, age_group, duration_minutes, price, currency, capacity, image, status) VALUES
('كرة القدم', 'تدريب كرة القدم للجميع الأعمار مع مدربين محترفين', 'رياضة جماعية', '6-18', 90, 150, 'ريال', 20, '/images/fitness.svg', 'available'),
('الجمباز', 'تدريب الجمباز لتطوير المرونة والقوة', 'رياضة فردية', '4-16', 60, 200, 'ريال', 12, '/images/gymnastics.svg', 'available'),
('الكاراتيه', 'تعلم فنون الدفاع عن النفس والانضباط', 'فنون قتالية', '5-18', 75, 180, 'ريال', 15, '/images/karate.svg', 'available');

INSERT INTO activity_schedules (activity_id, day_of_week, start_time, end_time) VALUES
(1, 0, '16:00:00', '17:30:00'),
(1, 2, '16:00:00', '17:30:00'),
(1, 4, '16:00:00', '17:30:00'),
(2, 6, '10:00:00', '11:00:00'),
(2, 1, '16:00:00', '17:00:00'),
(2, 3, '16:00:00', '17:00:00'),
(3, 0, '18:00:00', '19:15:00'),
(3, 2, '18:00:00', '19:15:00'),
(3, 4, '18:00:00', '19:15:00');

INSERT INTO trainers (name, email, phone, specialization, experience_years, certification, status) VALUES
('أحمد محمد', 'ahmed.trainer@makkahyard.com', '+966501234571', 'كرة القدم', 5, 'مدرب معتمد من الاتحاد السعودي', 'active'),
('سارة أحمد', 'sara.trainer@makkahyard.com', '+966501234572', 'الجمباز', 7, 'مدربة معتمدة دولياً', 'active'),
('محمد علي', 'mohammed.trainer@makkahyard.com', '+966501234573', 'الكاراتيه', 10, 'حزام أسود درجة ثالثة', 'active');

INSERT INTO activity_trainers (activity_id, trainer_id) VALUES
(1,1),(2,2),(3,3);

INSERT INTO enrollments (member_id, activity_id) VALUES
(1,1),(1,3),(2,2);

INSERT INTO events (title, description, date, time, location, category, registration_fee, currency, max_participants, status) VALUES
('بطولة كرة القدم الصيفية', 'بطولة كرة قدم للأطفال والناشئين', '2024-07-15', '16:00:00', 'ملعب مكة يارد الرئيسي', 'بطولة', 50, 'ريال', 32, 'open'),
('عرض الجمباز السنوي', 'عرض مهارات الجمباز للطلاب', '2024-06-20', '19:00:00', 'صالة الجمباز', 'عرض', 0, 'ريال', 100, 'open');

INSERT INTO media_images (url, title, alt) VALUES
('/images/karate.svg', 'تدريب الكاراتيه', 'Karate'),
('/images/fitness.svg', 'صالة اللياقة', 'Fitness'),
('/images/gymnastics.svg', 'عرض الجمباز', 'Gymnastics');

INSERT INTO memberships (member_id, package_id, join_date, expiry_date, status) VALUES
(1, (SELECT id FROM membership_packages WHERE code='individual_year'), '2024-01-15', '2025-01-14', 'active'),
(2, (SELECT id FROM membership_packages WHERE code='basic_6m'), '2023-12-01', '2024-05-31', 'active');

INSERT INTO bookings (member_id, activity_id, scheduled_at, notes, status) VALUES
(1, 1, '2024-07-20 10:00:00', 'جلسة تعريفية', 'pending');

INSERT INTO trainer_evaluations (trainer_id, member_id, rating, feedback) VALUES
(1, 1, 5, 'مدرب ممتاز');

INSERT INTO surveys (member_id, data) VALUES
(1, '{"name":"عبدالله","rating":5,"preferredContact":"phone"}');

INSERT INTO contact_messages (name, email, phone, subject, message, status) VALUES
('عميل تجريبي', 'client@example.com', '+966550185959', 'استفسار عام', 'أرغب في معرفة مواعيد الكاراتيه', 'new');

INSERT INTO settings (site_name, site_name_en, description, description_en, contact_phone, contact_email, address, address_en, social_media, working_hours) VALUES
('مكة يارد', 'Makkah Yard', 'مركز رياضي متكامل للأطفال والناشئين', 'Complete sports center for children and youth', '+966 55 018 5599', 'info@makkahyard.com', 'مكة المكرمة، المملكة العربية السعودية', 'Makkah, Saudi Arabia', '{"facebook":"https://facebook.com/makkahyard","instagram":"https://instagram.com/makkahyard","twitter":"https://twitter.com/makkahyard"}', '{"weekdays":"15:00 - 22:00","weekends":"09:00 - 22:00"}');

CREATE TRIGGER update_admins_modtime BEFORE UPDATE ON admins FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_customers_modtime BEFORE UPDATE ON customers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


INSERT INTO users (first_name, last_name, email, phone, password_hash) 
VALUES ('تجربة', 'مستخدم', 'test@example.com', '+966500000000', '$2b$10$Zl9qkM4o4xwzqvQHk3dVqu3e7Jv6p1Hc3hZr0iD1bJk5uUu3kEwzS');

INSERT INTO members (customer_id, name, email, phone, gender, status, join_date, type) 
VALUES (NULL, 'مستخدم تجربة', 'test@example.com', '+966500000000', 'male', 'active', CURRENT_DATE, 'primary');

COMMIT;

