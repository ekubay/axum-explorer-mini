// frontend/src/components/Layout/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MapPin, User, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <MapPin className="h-8 w-8 text-axum-green" />
              <span className="text-xl font-bold text-gray-900">
                Axum Explorer
              </span>
              <span className="text-sm text-axum-gold font-semibold">Mini</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/'
                  ? 'text-axum-green border-b-2 border-axum-green'
                  : 'text-gray-700 hover:text-axum-green'
              }`}
            >
              Home
            </Link>

            <Link
              to="/providers"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/providers'
                  ? 'text-axum-green border-b-2 border-axum-green'
                  : 'text-gray-700 hover:text-axum-green'
              }`}
            >
              Services
            </Link>

            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/admin'
                    ? 'text-axum-green border-b-2 border-axum-green'
                    : 'text-gray-700 hover:text-axum-green'
                }`}
              >
                Admin
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-axum-green"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-axum-green font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-axum-green text-white px-4 py-2 rounded-md hover:bg-green-700 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;