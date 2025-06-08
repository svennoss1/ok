import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Vul alle verplichte velden in');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/chat');
      } else {
        setError(result.error || 'Ongeldige email of wachtwoord');
      }
    } catch (err) {
      setError('Er is iets misgegaan. Probeer het later opnieuw.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center text-primary-600">
              <MessageSquare className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold">SexyPraat.nl</span>
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Inloggen
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-error-50 text-error-700 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="jouw@email.nl"
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Wachtwoord
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                  Wachtwoord vergeten?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? 'Inloggen...' : 'Inloggen'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Nog geen account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Aanmelden
              </Link>
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            Door in te loggen ga je akkoord met onze{' '}
            <a href="#" className="text-primary-600 hover:underline">
              Gebruikersvoorwaarden
            </a>{' '}
            en{' '}
            <a href="#" className="text-primary-600 hover:underline">
              Privacybeleid
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}