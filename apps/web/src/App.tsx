import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './pages/auth/Signup.tsx'
import Signin from './pages/auth/Signin.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
