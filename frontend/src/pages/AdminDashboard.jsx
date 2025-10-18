import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Check, X, Users, Hotel, Car, MapPin } from 'lucide-react';
import { providerAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadPendingProviders();
    }
  }, [user]);

  const loadPendingProviders = async () => {
    try {
      setLoading(true);
      // We'll need to add this endpoint to our API
      const response = await providerAPI.getPending();
      setPendingProviders(response.data.data.providers || []);
    } catch (error) {
      setError('Failed to load pending providers');
      console.error('Error loading pending providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyProvider = async (providerId) => {
    try {
      await providerAPI.verify(providerId);
      // Remove from pending list
      setPendingProviders(prev => prev.filter(p => p.id !== providerId));
      alert('Provider verified successfully!');
    } catch (error) {
      alert('Failed to verify provider');
      console.error('Error verifying provider:', error);
    }
  };

  const rejectProvider = async (providerId) => {
    if (window.confirm('Are you sure you want to reject this provider?')) {
      try {
        await providerAPI.reject(providerId);
        // Remove from pending list
        setPendingProviders(prev => prev.filter(p => p.id !== providerId));
        alert('Provider rejected successfully!');
      } catch (error) {
        alert('Failed to reject provider');
        console.error('Error rejecting provider:', error);
      }
    }
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'hotel': return <Hotel className="h-5 w-5" />;
      case 'car_rental': return <Car className="h-5 w-5" />;
      case 'guide': return <Users className="h-5 w-5" />;
      default: return <Hotel className="h-5 w-5" />;
    }
  };

  const getServiceColor = (type) => {
    switch (type) {
      case 'hotel': return 'bg-blue-100 text-blue-600';
      case 'car_rental': return 'bg-green-100 text-green-600';
      case 'guide': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="h-8 w-8 text-axum-green" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <p className="text-gray-600">Manage service provider verifications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
              <p className="text-2xl font-bold text-gray-900">{pendingProviders.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Shield className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Providers */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pending Service Providers</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            {error}
          </div>
        ) : pendingProviders.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending verifications</h3>
            <p className="text-gray-600">All service providers are verified.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {pendingProviders.map((provider) => (
              <div key={provider.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${getServiceColor(provider.type)}`}>
                      {getServiceIcon(provider.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {provider.businessName}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize mb-2">
                        {provider.type.replace('_', ' ')}
                      </p>
                      <p className="text-gray-600 mb-2">{provider.description}</p>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{provider.contactInfo.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>📞</span>
                          <span>{provider.contactInfo.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>✉️</span>
                          <span>{provider.contactInfo.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => verifyProvider(provider.id)}
                      className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      <span>Verify</span>
                    </button>
                    <button
                      onClick={() => rejectProvider(provider.id)}
                      className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;