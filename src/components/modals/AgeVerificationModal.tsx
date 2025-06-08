import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AgeVerificationModalProps {
  onVerify: () => void;
}

export default function AgeVerificationModal({ onVerify }: AgeVerificationModalProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="bg-white rounded-lg shadow-lg max-w-md w-full"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">18+ Verificatie</h2>
            </div>
            
            <div className="bg-primary-50 p-4 rounded-md mb-4 border border-primary-200">
              <p className="text-primary-800 font-medium">SexyPraat.nl is een 18+ platform.</p>
            </div>
            
            <p className="mb-4 text-gray-700">
              Door verder te gaan bevestig je dat je ouder bent dan 18 jaar. SexyPraat is niet verantwoordelijk voor aankopen, content of refunds.
            </p>
            
            <div className="mb-6">
              <div className="flex items-start mb-4">
                <div className="flex items-center h-5">
                  <input
                    id="age-verify"
                    type="checkbox"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                  />
                </div>
                <label htmlFor="age-verify" className="ml-2 text-sm font-medium text-gray-700">
                  Ik bevestig dat ik 18 jaar of ouder ben en ik ga akkoord met de gebruikersvoorwaarden.
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={onVerify}
                disabled={!agreed}
                className={`btn ${
                  agreed ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Bevestigen
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}