import { Link } from 'react-router-dom';
import { MessageSquare, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <MessageSquare className="h-16 w-16 text-primary-500" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Pagina niet gevonden</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          De pagina die je zoekt bestaat niet of is verplaatst.
          Keer terug naar de homepage of neem contact op met de support.
        </p>
        <Link 
          to="/" 
          className="btn btn-primary inline-flex items-center"
        >
          <Home size={18} className="mr-2" />
          Terug naar Home
        </Link>
      </div>
    </div>
  );
}