// frontend/src/pages/CreateBooking.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Plus, Trash2, Package } from 'lucide-react';
import { providerAPI, bookingAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// Define TypeScript interfaces
interface ServiceProvider {
  id: string;
  businessName: string;
  description: string;
  type: 'hotel' | 'car_rental' | 'guide';
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  verificationStatus: string;
}

interface ServiceDetails {
  rooms?: number;
  roomRate?: number;
  vehicleType?: string;
  dailyRate?: number;
  language?: string;
}

interface Service {
  serviceType: 'hotel' | 'car_rental' | 'guide';
  serviceProviderId: string;
  details: ServiceDetails;
  startDate: string | Date;
  endDate: string | Date;
}

interface FormData {
  packageName: string;
  travelerCount: number;
  specialRequests: string;
  services: Service[];
}

const CreateBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    packageName: '',
    travelerCount: 1,
    specialRequests: '',
    services: []
  });

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const response = await providerAPI.list();
      setProviders(response.data.data.providers || []);
    } catch (error) {
      console.error('Failed to load providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addService = (provider: ServiceProvider) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const newService: Service = {
      serviceType: provider.type,
      serviceProviderId: provider.id,
      details: {},
      startDate: today.toISOString().split('T')[0],
      endDate: tomorrow.toISOString().split('T')[0]
    };

    // Set default details based on service type
    switch (provider.type) {
      case 'hotel':
        newService.details = { rooms: 1, roomRate: 5000 };
        break;
      case 'car_rental':
        newService.details = { vehicleType: 'Sedan', dailyRate: 2000 };
        break;
      case 'guide':
        newService.details = { language: 'English', dailyRate: 1500 };
        break;
    }

    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const updateService = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => {
        if (i === index) {
          if (field.includes('.')) {
            const [parent, child] = field.split('.');
            if (parent === 'details') {
              return {
                ...service,
                details: {
                  ...service.details,
                  [child]: value
                }
              };
            }
          } else if (field === 'startDate' || field === 'endDate') {
            return {
              ...service,
              [field]: value
            };
          }
          return {
            ...service,
            [field]: value
          };
        }
        return service;
      })
    }));
  };

  const calculateTotal = () => {
    return formData.services.reduce((total, service) => {
      const start = new Date(service.startDate);
      const end = new Date(service.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (service.serviceType) {
        case 'hotel':
          return total + (days * (service.details.roomRate || 0) * (service.details.rooms || 1));
        case 'car_rental':
        case 'guide':
          return total + (days * (service.details.dailyRate || 0));
        default:
          return total;
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🎯 Starting booking creation...');
    
    if (formData.services.length === 0) {
      alert('Please add at least one service to your package');
      return;
    }

    setSubmitting(true);
    try {
      console.log('📦 Form data being sent:', formData);

      // Prepare data for API
      const bookingData = {
        packageName: formData.packageName,
        services: formData.services.map(service => ({
          serviceType: service.serviceType,
          serviceProviderId: service.serviceProviderId,
          details: service.details,
          startDate: service.startDate,
          endDate: service.endDate
        })),
        travelerCount: formData.travelerCount,
        specialRequests: formData.specialRequests
      };

      console.log('📤 Sending booking data:', bookingData);

      const response = await bookingAPI.create(bookingData);
      
      console.log('✅ Booking creation response:', response);
      alert('Booking created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ Booking creation error:', error);
      console.error('❌ Error response:', error.response);
      alert('Failed to create booking: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Package className="h-8 w-8 text-axum-green" />
          <h1 className="text-2xl font-bold text-gray-900">Create Travel Package</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Package Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Name
              </label>
              <input
                type="text"
                value={formData.packageName}
                onChange={(e) => setFormData(prev => ({ ...prev, packageName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-axum-green focus:border-axum-green"
                placeholder="e.g., Axum Cultural Tour"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4 inline mr-1" />
                Travelers
              </label>
              <input
                type="number"
                min="1"
                value={formData.travelerCount}
                onChange={(e) => setFormData(prev => ({ ...prev, travelerCount: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-axum-green focus:border-axum-green"
                required
              />
            </div>
          </div>

          {/* Available Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {providers.map(provider => (
                <div key={provider.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">{provider.businessName}</h4>
                  <p className="text-sm text-gray-600 capitalize mb-2">{provider.type.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{provider.description}</p>
                  <button
                    type="button"
                    onClick={() => addService(provider)}
                    className="w-full bg-axum-green text-white py-2 px-3 rounded-md hover:bg-green-700 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    Add to Package
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Services */}
          {formData.services.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Services</h3>
              <div className="space-y-4">
                {formData.services.map((service, index) => {
                  const provider = providers.find(p => p.id === service.serviceProviderId);
                  const startDateStr = typeof service.startDate === 'string' 
                    ? service.startDate 
                    : service.startDate.toISOString().split('T')[0];
                  const endDateStr = typeof service.endDate === 'string'
                    ? service.endDate
                    : service.endDate.toISOString().split('T')[0];

                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{provider?.businessName}</h4>
                          <p className="text-sm text-gray-600 capitalize">{service.serviceType.replace('_', ' ')}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={startDateStr}
                            onChange={(e) => updateService(index, 'startDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="date"
                            value={endDateStr}
                            onChange={(e) => updateService(index, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* Service-specific fields */}
                      {service.serviceType === 'hotel' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                            <input
                              type="number"
                              min="1"
                              value={service.details.rooms || 1}
                              onChange={(e) => updateService(index, 'details.rooms', parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rate per Night (ETB)</label>
                            <input
                              type="number"
                              min="0"
                              value={service.details.roomRate || 0}
                              onChange={(e) => updateService(index, 'details.roomRate', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                          </div>
                        </div>
                      )}

                      {(service.serviceType === 'car_rental' || service.serviceType === 'guide') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Daily Rate (ETB)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={service.details.dailyRate || 0}
                            onChange={(e) => updateService(index, 'details.dailyRate', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Total Calculation */}
              <div className="mt-6 p-4 bg-axum-green text-white rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Estimated Cost:</span>
                  <span className="text-2xl font-bold">{calculateTotal().toLocaleString()} ETB</span>
                </div>
              </div>
            </div>
          )}

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-axum-green focus:border-axum-green"
              placeholder="Any special requirements or requests..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || formData.services.length === 0}
            className="w-full bg-axum-green text-white py-3 px-4 rounded-md hover:bg-green-700 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating Booking...' : 'Create Travel Package'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBooking;