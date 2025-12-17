import React from 'react'
import { useAuthContext } from '../contexts/AuthContext'

const DashboardHeader = () => {
  const { user } = useAuthContext();
  const displayName = user?.fullName || user?.username || "User";
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome{displayName !== "User" ? `, ${displayName.split(' ')[0]}` : ""}!
        </h1>
        <p className="text-sm text-gray-500">Let's grow something beautiful today 🌱</p>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search plants, tasks..."
          className="hidden md:block px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-green-200"
        />
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={displayName} className="w-full h-full rounded-full object-cover" />
          ) : (
            initials
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
