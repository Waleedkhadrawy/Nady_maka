import React from 'react';
import { Navigate } from 'react-router-dom';

function isAuthed() {
  return !!localStorage.getItem('admin_token');
}

export default function PrivateRoute({ children }) {
  return isAuthed() ? children : <Navigate to="/admin/login" />;
}