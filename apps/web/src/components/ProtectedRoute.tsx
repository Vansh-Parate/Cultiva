import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}: {children:React.ReactNode}) => {

  const token = localStorage.getItem('token');

  if(!token){
    return <Navigate to='/auth/signin' replace/>
  }

  return (
    <>{children}</>
  )
}

export default ProtectedRoute
