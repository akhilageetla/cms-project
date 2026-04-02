import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

import Landing    from './pages/Landing';
import SignUp     from './pages/SignUp';
import OtpVerify  from './pages/OtpVerify';
import SignIn     from './pages/SignIn';
import Dashboard  from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import ComplaintDetail from './pages/ComplaintDetail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<Landing />} />
          <Route path="/signup"    element={<SignUp />} />
          <Route path="/verify"    element={<OtpVerify />} />
          <Route path="/signin"    element={<SignIn />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/new"       element={<PrivateRoute><NewComplaint /></PrivateRoute>} />
          <Route path="/complaint/:id" element={<PrivateRoute><ComplaintDetail /></PrivateRoute>} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
