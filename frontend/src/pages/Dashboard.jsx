// frontend/src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Calendar, Package, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-axum-green rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              {user?.role === 'tourist' 
                ? 'Ready for your next adventure in Axum?'
                : 'Manage your services and connect with travelers'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bookings</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Services</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reviews</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content based on user role */}
      {user?.role === 'tourist' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Travel Plans</h2>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-4">
              Start planning your Axum adventure by exploring our local services.
            </p>
            <a
              href="/providers"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-axum-green hover:bg-green-700"
            >
              Explore Services
            </a>
          </div>
        </div>
      )}

      {user?.role === 'provider' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Provider Dashboard</h2>
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Your Services</h3>
            <p className="text-gray-600 mb-4">
              Set up your service offerings and start connecting with travelers.
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-axum-green hover:bg-green-700">
              Add Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;