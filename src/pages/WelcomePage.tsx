import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Shield, Heart, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700">
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 mr-2 text-white" />
            <span className="text-2xl font-bold text-white">SexyPraat.nl</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="px-6 py-2 text-white font-medium hover:underline">
              Inloggen
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2 bg-white text-primary-600 rounded-md font-medium shadow-md hover:bg-gray-100"
            >
              Aanmelden
            </Link>
          </div>
        </header>
        
        <main>
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
            <div className="md:w-1/2">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Chat, Flirt & Ontmoet Echte Creators
              </motion.h1>
              <motion.p 
                className="text-xl text-white opacity-90 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Ontdek de spannendste 18+ chat van Nederland. Maak verbinding met echte creators en geniet van privé gesprekken.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link 
                  to="/register" 
                  className="px-8 py-3 bg-white text-primary-600 rounded-md font-medium shadow-lg inline-flex items-center hover:bg-gray-100 transition-all"
                >
                  Nu Starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            </div>
            
            <div className="md:w-1/2">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150" 
                      alt="Jessica" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium mr-2">Jessica</p>
                      <span className="badge badge-creator flex items-center">
                        <Heart size={12} className="mr-0.5" />
                        Creator
                      </span>
                    </div>
                    <div className="chat-bubble chat-bubble-other mt-1">
                      <p>Hoi! Leuk dat je er bent. 💕 Wil je meer weten over mijn exclusieve content?</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 justify-end">
                  <div className="flex-1">
                    <div className="chat-bubble chat-bubble-user">
                      <p>Hoi Jessica! Ja graag, wat heb je allemaal te bieden?</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 mt-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150" 
                      alt="Jessica" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="chat-bubble chat-bubble-other">
                      <p>Ik heb exclusieve fotoseries en live chats. Maak een account aan om meer te ontdekken! 😘</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Waarom kiezen voor SexyPraat?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-medium mb-2">Publieke & Privé Chats</h3>
                <p className="text-gray-600">
                  Chat in publieke kanalen of geniet van exclusieve privégesprekken met creators.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-medium mb-2">Veilig & Vertrouwd</h3>
                <p className="text-gray-600">
                  Alle creators zijn geverifieerd en het platform is beveiligd voor jouw privacy.
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                  <Crown size={24} />
                </div>
                <h3 className="text-xl font-medium mb-2">Premium Voordelen</h3>
                <p className="text-gray-600">
                  Upgrade naar Premium, VIP of Royal voor exclusieve voordelen en functies.
                </p>
              </motion.div>
            </div>
          </section>
          
          <section className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Klaar om te beginnen?</h2>
            <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
              Word nu lid van SexyPraat.nl en ontdek een wereld vol spannende gesprekken en connecties.
            </p>
            <Link 
              to="/register" 
              className="px-8 py-3 bg-white text-primary-600 rounded-md font-medium shadow-lg inline-flex items-center hover:bg-gray-100 transition-all"
            >
              Nu Aanmelden
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </section>
        </main>
        
        <footer className="mt-20 pt-8 border-t border-primary-400 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm opacity-80">© 2025 SexyPraat.nl - Alle rechten voorbehouden</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm opacity-80 hover:opacity-100">Gebruikersvoorwaarden</a>
              <a href="#" className="text-sm opacity-80 hover:opacity-100">Privacybeleid</a>
              <a href="#" className="text-sm opacity-80 hover:opacity-100">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}