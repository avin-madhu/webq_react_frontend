import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ListChecks, BookOpen } from 'lucide-react';

const Navigation = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
    ${isActive
      ? 'bg-blue-100 text-blue-700'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-6 py-2">
          <NavLink to="/" className={linkClass} end>
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/recommendations" className={linkClass}>
            <ListChecks className="h-4 w-4" />
            <span>Recommendations</span>
          </NavLink>

          {/* Optional: link only shown when a resource is selected */}
          <NavLink to="/resources" className={linkClass}>
            <BookOpen className="h-4 w-4" />
            <span>Resources</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;