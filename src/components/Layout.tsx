import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import axios from 'axios';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post('https://projectbackend-14ei.onrender.com/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('userId');
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-purple-100">
      <header className="bg-white bg-opacity-80 backdrop-blur-md shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              Mytalorzone By Sahiba
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="text-gray-700 hover:text-pink-600 transition duration-300">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-pink-600 transition duration-300">Products</Link>
              <Link to="/cart" className="text-gray-700 hover:text-pink-600 transition duration-300">
                <ShoppingBag size={20} />
              </Link>
              <Link to="/complaints" className="text-gray-700 hover:text-pink-600 transition duration-300">Complaints</Link>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="text-gray-700 hover:text-pink-600 transition duration-300">Logout</button>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-pink-600 transition duration-300">Login</Link>
                  <Link to="/signup" className="text-gray-700 hover:text-pink-600 transition duration-300">Signup</Link>
                </>
              )}
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-pink-600 focus:outline-none">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition duration-300">Home</Link>
                <Link to="/products" className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition duration-300">Products</Link>
                <Link to="/cart" className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition duration-300">
                  Cart <ShoppingBag size={16} className="inline ml-2" />
                </Link>
                <Link to="/complaints" className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition duration-300">Complaints</Link>
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-pink-600 transition duration-300">Logout</button>
                ) : (
                  <>
                    <Link to="/login" className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition duration-300">Login</Link>
                    <Link to="/signup" className="block px-3 py-2 text-gray-700 hover:text-pink-600 transition duration-300">Signup</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white bg-opacity-80 backdrop-blur-md shadow-md mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-600">
          © 2023 Mytalorzone By Sahiba. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;

