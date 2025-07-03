import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './pages/auth/Signup.tsx'
import Signin from './pages/auth/Signin.tsx';
import GoogleSuccess from './pages/auth/GoogleSuccess.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Dashboard from './pages/Dashboard.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
