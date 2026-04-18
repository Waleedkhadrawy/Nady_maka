import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/AdminLayout.css';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-container">
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h3>
          لوحة التحكم
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        </h3>
        <nav>
          <Link to="/admin" onClick={() => setSidebarOpen(false)}>الرئيسية</Link>
          <Link to="/admin/customers" onClick={() => setSidebarOpen(false)}>إدارة العملاء</Link>
          <Link to="/admin/members" onClick={() => setSidebarOpen(false)}>إدارة الأعضاء</Link>
          <Link to="/admin/activities" onClick={() => setSidebarOpen(false)}>إدارة الأنشطة</Link>
          <Link to="/admin/trainers" onClick={() => setSidebarOpen(false)}>إدارة المدربين</Link>
          <Link to="/admin/events" onClick={() => setSidebarOpen(false)}>إدارة الفعاليات</Link>
          <Link to="/admin/packages" onClick={() => setSidebarOpen(false)}>إدارة الباقات</Link>
          <Link to="/admin/bookings" onClick={() => setSidebarOpen(false)}>إدارة الحجوزات</Link>
          <Link to="/admin/reports" onClick={() => setSidebarOpen(false)}>التقارير</Link>
          <Link to="/admin/payments" onClick={() => setSidebarOpen(false)}>إدارة المدفوعات</Link>
          <Link to="/admin/contact" onClick={() => setSidebarOpen(false)}>إدارة الاستعلامات</Link>
          <Link to="/admin/trainer-evaluations" onClick={() => setSidebarOpen(false)}>تقييمات المدربين</Link>
          <Link to="/admin/settings" onClick={() => setSidebarOpen(false)}>الإعدادات</Link>
        </nav>
      </aside>
      <main className="admin-main">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>☰</button>
        {children}
      </main>
    </div>
  );
}
