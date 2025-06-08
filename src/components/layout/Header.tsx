import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Heart, User, Settings, CreditCard, Bell, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (!user) return null;
  
  return (
    <header className="bg-primary-600 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            <span className="text-xl font-bold">SexyPraat.nl</span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/chat" className="hover:text-white/80 flex items-center">
            <MessageSquare className="h-5 w-5 mr-1" />
            <span>Chat</span>
          </Link>
          
          {/* Profile dropdown */}
          <div className="relative">
            <button 
              className="flex items-center hover:text-white/80 focus:outline-none"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border-2 border-white">
                <img 
                  src={user.profilePicture || '/assets/default-avatar.png'} 
                  alt={user.username} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span>{user.username}</span>
            </button>
            
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-60 bg-white text-gray-800 rounded-lg shadow-dropdown"
                >
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                        <img 
                          src={user.profilePicture || '/assets/default-avatar.png'} 
                          alt={user.username}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-center bg-gray-50 rounded-md p-2">
                      <p className="text-sm text-gray-600">Saldo</p>
                      <p className="font-bold text-primary-600">€{user.balance.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <Link 
                      to={`/profile/${user.username}`}
                      className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={18} className="mr-3 text-gray-500" />
                      <span>Mijn profiel</span>
                    </Link>
                    <Link 
                      to="/settings"
                      className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={18} className="mr-3 text-gray-500" />
                      <span>Instellingen</span>
                    </Link>
                    <Link 
                      to="/abonnementen"
                      className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Heart size={18} className="mr-3 text-gray-500" />
                      <span>Abonnementen</span>
                    </Link>
                    <Link 
                      to="/balance"
                      className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <CreditCard size={18} className="mr-3 text-gray-500" />
                      <span>Saldo opwaarderen</span>
                    </Link>
                    <Link 
                      to="/notifications"
                      className="flex items-center px-4 py-2 hover:bg-gray-50 text-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Bell size={18} className="mr-3 text-gray-500" />
                      <span>Meldingen</span>
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-100 py-1">
                    <button 
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2 hover:bg-gray-50 text-gray-700"
                    >
                      <LogOut size={18} className="mr-3 text-gray-500" />
                      <span>Uitloggen</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary-700"
          >
            <div className="px-4 py-3 border-t border-primary-500">
              <Link 
                to="/chat" 
                className="block py-2 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-3" />
                  <span>Chat</span>
                </div>
              </Link>
              
              <Link 
                to={`/profile/${user.username}`} 
                className="block py-2 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3" />
                  <span>Mijn profiel</span>
                </div>
              </Link>
              
              <Link 
                to="/settings" 
                className="block py-2 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Settings className="h-5 w-5 mr-3" />
                  <span>Instellingen</span>
                </div>
              </Link>
              
              <Link 
                to="/abonnementen" 
                className="block py-2 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Heart className="h-5 w-5 mr-3" />
                  <span>Abonnementen</span>
                </div>
              </Link>
              
              <Link 
                to="/balance" 
                className="block py-2 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-3" />
                  <span>Saldo opwaarderen</span>
                </div>
              </Link>
              
              <Link 
                to="/notifications" 
                className="block py-2 text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-3" />
                  <span>Meldingen</span>
                </div>
              </Link>
              
              <button 
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-white"
              >
                <div className="flex items-center">
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Uitloggen</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}