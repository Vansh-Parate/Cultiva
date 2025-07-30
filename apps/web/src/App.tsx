import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from './components/Layout';
import Signup from './pages/auth/Signup'
import Signin from './pages/auth/Signin';
import GoogleSuccess from './pages/auth/GoogleSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import MyPlants from './pages/MyPlants';
import FindPlant from './pages/FindPlant';
import Care from './pages/Care';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
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
          <Route
            path="/plants"
            element={
              <ProtectedRoute>
                <MyPlants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/care"
            element={
              <ProtectedRoute>
                <Care />
              </ProtectedRoute>
            }
          />
          <Route
            path="/find-plant"
            element={
              <ProtectedRoute>
                <FindPlant />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
