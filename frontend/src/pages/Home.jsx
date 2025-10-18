// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Hotel, Car, Users, Star, Shield, Calendar, Award, Crown, Landmark, Globe, Trophy } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Hotel className="h-8 w-8" />,
      title: 'Hotels & Lodging',
      description: 'Stay in comfortable accommodations with authentic Ethiopian hospitality',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: 'Car Rentals',
      description: 'Reliable transportation with experienced local drivers',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Tour Guides',
      description: 'Knowledgeable guides for historical and cultural experiences',
      image: 'https://images.unsplash.com/photo-1586495770824-996c5e72e324?w=400&h=300&fit=crop'
    }
  ];

  const historicalFacts = [
    {
      icon: <Crown className="h-8 w-8" />,
      title: 'Ancient Kingdom',
      description: 'Founded in the 1st century AD, Axum was one of the four great powers of its time'
    },
    {
      icon: <Landmark className="h-8 w-8" />,
      title: 'Architectural Marvels',
      description: 'Home to the tallest ancient obelisk still standing, reaching over 24 meters'
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: 'UNESCO Heritage',
      description: 'Designated as a UNESCO World Heritage Site for its outstanding cultural significance'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Trade Empire',
      description: 'Connected Africa, Arabia, and the Mediterranean through extensive trade networks'
    }
  ];

  const attractions = [
    {
      name: 'Obelisk of Axum',
      description: 'Ancient towering obelisks that symbolize the Aksumite Kingdom',
      image: 'https://images.unsplash.com/photo-1589556183059-2ce31bd75bd9?w=300&h=200&fit=crop'
    },
    {
      name: "St. Mary of Zion",
      description: 'Home to the legendary Ark of the Covenant',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=300&h=200&fit=crop'
    },
    {
      name: "King Ezana's Palace",
      description: 'Ruins of ancient royal palace with rich history',
      image: 'https://images.unsplash.com/photo-1483721310020-03392a8b4902?w=300&h=200&fit=crop'
    },
    {
      name: 'Queen of Sheba Bath',
      description: 'Historic reservoir with legendary origins',
      image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop'
    }
  ];

  const stats = [
    { number: '50+', label: 'Local Providers' },
    { number: '1,000+', label: 'Happy Travelers' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&h=800&fit=crop)'
        }}
      >
        <div className="text-center text-white px-4 max-w-4xl">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <MapPin className="h-12 w-12 text-axum-gold" />
            <h1 className="text-5xl md:text-7xl font-bold">
              Discover <span className="text-axum-gold">Axum</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Experience the ancient wonders of Ethiopia's historical capital
          </p>
          <p className="text-lg mb-12 max-w-2xl mx-auto text-gray-300">
            Walk in the footsteps of kings and queens. Explore towering obelisks, 
            sacred churches, and legendary palaces that tell the story of one of Africa's greatest civilizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/providers"
              className="bg-axum-gold text-axum-stone px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-all transform hover:scale-105"
            >
              Explore Services
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-axum-stone transition-all"
            >
              Become a Provider
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Historical Context Section */}
      <section className="py-20 bg-axum-stone text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">
              The Kingdom of Axum
            </h2>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto">
              Axum was the center of a powerful ancient civilization that flourished from approximately 100 AD to 940 AD 
              in what is now northern Ethiopia and Eritrea. As one of Africa's greatest ancient kingdoms, Axum was 
              renowned for its monumental architecture, including the famous obelisks (stelae), its advanced civilization, 
              and its role as one of the first nations to adopt Christianity as the state religion.
            </p>
          </div>

          {/* Historical Facts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {historicalFacts.map((fact, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 border border-white/20"
              >
                <div className="text-axum-gold mb-4 flex justify-center">
                  {fact.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{fact.title}</h3>
                <p className="text-gray-200 text-sm">{fact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Axum Adventure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We connect you with verified local service providers for an authentic and memorable experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className="h-48 bg-gray-200">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="text-axum-green mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historical Attractions Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Ancient Wonders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the legendary sites that make Axum one of Africa's most important historical destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {attractions.map((attraction, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className="h-40 bg-gray-200">
                  <img 
                    src={attraction.image} 
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{attraction.name}</h3>
                  <p className="text-sm text-gray-600">{attraction.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-axum-green to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl font-bold text-axum-gold mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-200 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Axum Explorer?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Providers</h3>
              <p className="text-gray-600">All our service providers are thoroughly vetted and verified for your safety</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Expertise</h3>
              <p className="text-gray-600">Connect with locals who know Axum's history and culture intimately</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple and secure booking process with instant confirmation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-axum-stone text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Explore Ancient Axum?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey through history today. Book your perfect Axum experience with trusted local providers.
          </p>
          <Link
            to="/register"
            className="bg-axum-gold text-axum-stone px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-500 transition-all transform hover:scale-105 inline-block"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;