import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react';
import { providerAPI } from '../services/api';

const ProviderRegister = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    type: 'hotel',
    contactInfo: {
      phone: '',
      email: '',
      address: ''
    },
    location: {
      latitude: 14.1214, // Default Axum coordinates
      longitude: 38.7233
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await providerAPI.register(formData);
      alert('Service registered successfully!');
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-axum-green mb-6"
            >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
        </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Building className="h-8 w-8 text-axum-green" />
          <h1 className="text-2xl font-bold text-gray-900">Register Your Service</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-axum-green focus:border-axum-green"
              placeholder="Enter your business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-axum-green focus:border-axum-green"
            >
              <option value="hotel">Hotel</option>
              <option value="car_rental">Car Rental</option>
              <option value="guide">Tour Guide</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-axum-green focus:border-axum-green"
              placeholder="Describe your services..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone
              </label>
              <input
                type="tel"
                name="contactInfo.phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-axum-green focus:border-axum-green"
                placeholder="+251 ..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                name="contactInfo.email"
                value={formData.contactInfo.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-axum-green focus:border-axum-green"
                placeholder="contact@yourbusiness.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-1" />
              Address
            </label>
            <input
              type="text"
              name="contactInfo.address"
              value={formData.contactInfo.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-axum-green focus:border-axum-green"
              placeholder="Your business address in Axum"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-axum-green text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Service'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProviderRegister;