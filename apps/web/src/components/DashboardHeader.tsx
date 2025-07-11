import React from 'react'

const user = {
  name: "Vansh",
  avatarUrl:""
}

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome{user.name ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-sm text-gray-500">Let’s grow something beautiful today 🌱</p>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search plants, tasks..."
          className="hidden md:block px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            user.name.charAt(0)
          )}
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
