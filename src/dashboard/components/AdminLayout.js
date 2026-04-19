import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../styles/components/AdminLayout.css';

const NAV_ITEMS = [
  { to: '/admin',                      label: 'الرئيسية',         icon: 'bi-speedometer2',      end: true },
  { to: '/admin/customers',            label: 'العملاء',          icon: 'bi-person-lines-fill' },
  { to: '/admin/members',              label: 'الأعضاء',          icon: 'bi-people-fill' },
  { to: '/admin/packages',             label: 'الباقات',          icon: 'bi-box-seam-fill' },
  { to: '/admin/activities',           label: 'الأنشطة',          icon: 'bi-lightning-fill' },
  { to: '/admin/trainers',             label: 'المدربون',         icon: 'bi-person-badge-fill' },
  { to: '/admin/events',               label: 'الفعاليات',        icon: 'bi-calendar-event-fill' },
  { to: '/admin/bookings',             label: 'الحجوزات',         icon: 'bi-calendar-check-fill' },
  { to: '/admin/orders',               label: 'الطلبات',          icon: 'bi-bag-check-fill' },
  { to: '/admin/payments',             label: 'المدفوعات',        icon: 'bi-cash-stack' },
  { to: '/admin/reports',              label: 'التقارير',         icon: 'bi-bar-chart-fill' },
  { to: '/admin/contact',              label: 'الاستعلامات',      icon: 'bi-chat-dots-fill' },
  { to: '/admin/trainer-evaluations',  label: 'تقييمات المدربين', icon: 'bi-star-fill' },
  { to: '/admin/forms',                label: 'النماذج',          icon: 'bi-ui-checks' },
  { to: '/admin/settings',             label: 'الإعدادات',        icon: 'bi-gear-fill' },
];

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const username = (() => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) return 'المشرف';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || 'المشرف';
    } catch { return 'المشرف'; }
  })();

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="admin-container">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        {/* Logo / Brand */}
        <div className="sidebar-brand">
          <div className="brand-logo">
            <i className="bi bi-shield-check-fill" />
          </div>
          <div>
            <div className="brand-title">نادي مكة يارد</div>
            <div className="brand-sub">لوحة الإدارة</div>
          </div>
          <button className="close-btn" onClick={() => setSidebarOpen(false)} aria-label="إغلاق">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* User info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="user-name">{username}</div>
            <div className="user-role">مشرف النظام</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="nav-section-label">القائمة الرئيسية</p>
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${icon} sidebar-icon`} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <i className="bi bi-box-arrow-right me-2" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top bar */}
        <div className="admin-topbar">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)} aria-label="القائمة">
            <i className="bi bi-list" />
          </button>
          <span className="topbar-title">لوحة التحكم</span>
          <div className="topbar-actions">
            <span className="topbar-user">
              <i className="bi bi-person-circle me-1" />{username}
            </span>
          </div>
        </div>

        {/* Page content */}
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}
