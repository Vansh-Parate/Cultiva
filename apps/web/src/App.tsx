import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Signup from './pages/auth/Signup'
import Signin from './pages/auth/Signin';
import GoogleSuccess from './pages/auth/GoogleSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import MyPlants from './pages/MyPlants';
import FindPlant from './pages/FindPlant';
import Care from './pages/Care';
import Community from './pages/Community';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
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
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
