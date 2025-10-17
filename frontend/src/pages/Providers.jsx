// frontend/src/pages/Providers.jsx
import React, { useState, useEffect } from 'react';
import { Hotel, Car, Users, Search, MapPin, Star } from 'lucide-react';
import { providerAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProviders();
  }, [filter]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await providerAPI.list(params);
      setProviders(response.data.data.providers || []);
    } catch (error) {
      console.error('Failed to load providers:', error);
      setError('Failed to load service providers. Please try again later.');
      setProviders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'hotel':
        return <Hotel className="h-6 w-6" />;
      case 'car_rental':
        return <Car className="h-6 w-6" />;
      case 'guide':
        return <Users className="h-6 w-6" />;
      default:
        return <Hotel className="h-6 w-6" />;
    }
  };

  const getServiceColor = (type) => {
    switch (type) {
      case 'hotel':
        return 'bg-blue-100 text-blue-600';
      case 'car_rental':
        return 'bg-green-100 text-green-600';
      case 'guide':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Local Service Providers
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover trusted hotels, car rentals, and tour guides in Axum
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            filter === 'all'
              ? 'bg-axum-green text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Services
        </button>
        <button
          onClick={() => setFilter('hotel')}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            filter === 'hotel'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Hotels
        </button>
        <button
          onClick={() => setFilter('car_rental')}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            filter === 'car_rental'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Car Rentals
        </button>
        <button
          onClick={() => setFilter('guide')}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            filter === 'guide'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Tour Guides
        </button>
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getServiceColor(provider.type)}`}>
                      {getServiceIcon(provider.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {provider.businessName}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {provider.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  {provider.verificationStatus === 'verified' && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {provider.description}
                </p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.contactInfo?.address || 'Address not available'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>📞</span>
                    <span>{provider.contactInfo?.phone || 'Phone not available'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full bg-axum-green text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium">
                    Contact Provider
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && providers.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No providers found
          </h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'No service providers are currently available.'
              : `No ${filter.replace('_', ' ')} providers found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Providers;