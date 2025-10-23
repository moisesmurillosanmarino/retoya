import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomeSimple from '../pages/HomeSimple.jsx';
import LoginPage from '../pages/Auth/LoginPage.jsx';
import Dashboard from '../pages/Dashboard/DashboardAdaptativo.jsx';
import TestDashboard from '../pages/TestDashboard.jsx';
import TestLogin from '../pages/TestLogin.jsx';
import Test from '../pages/Test.jsx';
import TestLayout from '../pages/TestLayout.jsx';
import CourtsList from '../pages/Courts/CourtsList.jsx';
import CourtsView from '../pages/Courts/CourtsView.jsx';
import CourtDetail from '../pages/Courts/CourtDetail.jsx';
import BookingNew from '../pages/Bookings/BookingNew.jsx';
import BookingsList from '../pages/Bookings/BookingsList.jsx';
import Teams from '../pages/Teams/index.jsx';
import Matches from '../pages/Matches/index.jsx';
import Bets from '../pages/Bets/index.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeSimple />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/test-dashboard" element={<TestDashboard />} />
      <Route path="/test-login" element={<TestLogin />} />
      <Route path="/test" element={<Test />} />
      <Route path="/test-layout" element={<TestLayout />} />
      <Route path="/courts" element={<CourtsList />} />
      <Route path="/courts/view" element={<CourtsView />} />
      <Route path="/courts/:id" element={<CourtDetail />} />
      <Route path="/bookings" element={<BookingsList />} />
      <Route path="/bookings/new" element={<BookingNew />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/matches" element={<Matches />} />
      <Route path="/bets" element={<Bets />} />
    </Routes>
  );
}

