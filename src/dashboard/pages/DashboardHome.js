import React from 'react';
import AdminLayout from '../components/AdminLayout';

export default function DashboardHome() {
  return (
    <AdminLayout>
      <h2>مرحباً بالإدمن 👋</h2>
      <p>هذه نظرة عامة سريعة على لوحة التحكم.</p>
      <ul>
        <li>إدارة العملاء: إضافة/تعديل/حذف/عرض</li>
        <li>الإعدادات: ضبط خيارات النظام</li>
      </ul>
    </AdminLayout>
  );
}