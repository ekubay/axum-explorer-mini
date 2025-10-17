// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Hotel, Car, Users, Star, Shield } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Hotel className="h-8 w-8" />,
      title: 'Hotels & Lodging',
      description: 'Comfortable accommodations with authentic Ethiopian hospitality'
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: 'Car Rentals',
      description: 'Reliable transportation with experienced local drivers'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Tour Guides',
      description: 'Knowledgeable guides for historical and cultural experiences'
    }
  ];

  const stats = [
    { number: '50+', label: 'Local Providers' },
    { number: '1,000+', label: 'Happy Travelers' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-pattern text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover the Ancient Wonders of
              <span className="block text-axum-gold">Axum, Ethiopia</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Experience authentic travel with trusted local services. Book hotels, 
              transportation, and guides in one seamless platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/providers"
                className="bg-white text-axum-green px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Services
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-axum-green transition-colors"
              >
                Become a Provider
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Axum Adventure
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We connect you with verified local service providers for an authentic and memorable experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center card-hover"
              >
                <div className="text-axum-green mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-axum-green mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-axum-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Explore Axum?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered the magic of ancient Ethiopia
          </p>
          <Link
            to="/register"
            className="bg-axum-gold text-axum-green px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;