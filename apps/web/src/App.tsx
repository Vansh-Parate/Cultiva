import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from './pages/auth/Signup'
import Signin from './pages/auth/Signin';
import GoogleSuccess from './pages/auth/GoogleSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/signup" replace />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/google/success" element={<GoogleSuccess />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />   
      </Routes>
    </BrowserRouter>
  )
}
export default App
