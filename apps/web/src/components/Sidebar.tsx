import React from 'react'
import { HomeIcon, CalendarIcon, Cog6ToothIcon, QuestionMarkCircleIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import { LeafIcon } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  {label: 'Dashboard', icon: HomeIcon, route:'/dashboard'},
  {label: 'My Plants', icon:LeafIcon, route:'/plants'},
  {label: 'Tasks', icon: CalendarIcon, route:'/tasks'},
  {label: 'Find Plant', icon: IdentificationIcon, route:'/find-plant'}
]

const bottomItems = [
  {label: 'Settings', icon: Cog6ToothIcon, route:'/settings'},
  {label: 'Help', icon: QuestionMarkCircleIcon, route:'/help'}
]

export default function Sidebar() {
  const location = useLocation();

  return (
    <nav className='flex flex-col justify-between w-64 min-h-screen bg-white border-r border-gray-200 px-4 py-6 fixed top-0 left-0 h-screen z-30'>
      <div>
        <div className='flex items-center mb-8'>
          <span className='text-2xl font-bold  text-green-600'>GreenCare</span>
        </div>
      <ul className="space-y-2">
          {navItems.map(({ label, icon: Icon, route }) => (
            <li key={label}>
              <NavLink
                to={route}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Icon className="h-5 w-5 mr-3" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <ul className="space-y-2">
        {bottomItems.map(({ label, icon: Icon, route }) => (
          <li key={label}>
            <NavLink
              to={route}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}


