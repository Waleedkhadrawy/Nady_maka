import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MainLandingPage from './pages/MainLandingPage';
import AboutPage from './pages/AboutPage';
import AcademyPage from './pages/AcademyPage';
import BookingPage from './pages/BookingPage';
import MembershipPage from './pages/MembershipPage';
import PricingPage from './pages/PricingPage';
import PackageGroupPage from './pages/PackageGroupPage';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CheckoutPage from './pages/CheckoutPage';
import TrainerEvaluationPage from './pages/TrainerEvaluationPage';
import CustomerServicePage from './pages/CustomerServicePage';
import SurveyPage from './pages/SurveyPage';
import AdminLoginPage from './dashboard/pages/AdminLoginPage';
import DashboardHome from './dashboard/pages/DashboardHome';
import CustomersPage from './dashboard/pages/CustomersPage';
import MembersPage from './dashboard/pages/MembersPage';
import ActivitiesPage from './dashboard/pages/ActivitiesPage';
import TrainersPage from './dashboard/pages/TrainersPage';
import EventsPage from './dashboard/pages/EventsPage';
import BookingsPage from './dashboard/pages/BookingsPage';
import ReportsPage from './dashboard/pages/ReportsPage';
import PaymentsPage from './dashboard/pages/PaymentsPage';
import OrdersPage from './dashboard/pages/OrdersPage';
import ContactMessagesPage from './dashboard/pages/ContactMessagesPage';
import TrainerEvaluationsAdminPage from './dashboard/pages/TrainerEvaluationsAdminPage';
import ProfilePage from './pages/ProfilePage';
import PackagesPage from './dashboard/pages/PackagesPage';
import SettingsPage from './dashboard/pages/SettingsPage';
import FormsPage from './dashboard/pages/FormsPage';
import PrivateRoute from './dashboard/components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ChatWidget from './components/ChatWidget';
import WhatsAppFloat from './components/WhatsAppFloat';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Toaster
          position="top-center"
          containerStyle={{ top: 88, zIndex: 1040 }}
          gutter={12}
          toastOptions={{
            duration: 4000,
            style: { fontSize: '1rem', fontFamily: 'inherit', maxWidth: 520 },
          }}
        />
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/main" element={<MainLandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/pricing/:group" element={<PackageGroupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/trainer-evaluation" element={<TrainerEvaluationPage />} />
          <Route path="/customer-service" element={<CustomerServicePage />} />
          {/* Admin Dashboard */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <DashboardHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <PrivateRoute>
                <CustomersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/members"
            element={
              <PrivateRoute>
                <MembersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/activities"
            element={
              <PrivateRoute>
                <ActivitiesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/trainers"
            element={
              <PrivateRoute>
                <TrainersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <PrivateRoute>
                <EventsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <PrivateRoute>
                <BookingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <PrivateRoute>
                <ReportsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <PrivateRoute>
                <PaymentsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/packages"
            element={
              <PrivateRoute>
                <PackagesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/forms"
            element={
              <PrivateRoute>
                <FormsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/contact"
            element={
              <PrivateRoute>
                <ContactMessagesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/trainer-evaluations"
            element={
              <PrivateRoute>
                <TrainerEvaluationsAdminPage />
              </PrivateRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
      <WhatsAppFloat />
    </div>
  );
}

export default App;
