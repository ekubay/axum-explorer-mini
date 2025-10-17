// frontend/src/components/Layout/Footer.jsx
import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-axum-stone text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-6 w-6 text-axum-gold" />
              <span className="text-xl font-bold">Axum Explorer</span>
            </div>
            <p className="text-gray-300 max-w-md">
              Connecting travelers with the best local services in Axum, Ethiopia. 
              Discover authentic experiences with trusted hotels, car rentals, and tour guides.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/providers" className="hover:text-white">Services</a></li>
              <li><a href="/register" className="hover:text-white">Become a Provider</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@axumexplorer.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+251 91 123 4567</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Axum Explorer Mini. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;