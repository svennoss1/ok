import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import { CreditCard, Plus, History, Euro, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const topUpAmounts = [5, 10, 25, 50, 100, 250];

const mockTransactions = [
  {
    id: 1,
    type: 'deposit',
    amount: 25.00,
    description: 'Saldo opwaardering',
    status: 'completed',
    date: '2025-01-30T10:30:00Z'
  },
  {
    id: 2,
    type: 'quote_payment',
    amount: -15.00,
    description: 'Betaling aan Jessica',
    status: 'completed',
    date: '2025-01-29T15:45:00Z'
  },
  {
    id: 3,
    type: 'subscription',
    amount: -3.29,
    description: 'VIP abonnement',
    status: 'completed',
    date: '2025-01-28T09:15:00Z'
  }
];

export default function BalancePage() {
  const { user, updateProfile } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'topup' | 'history'>('topup');
  
  if (!user) return null;
  
  const handleTopUp = async () => {
    const amount = selectedAmount || parseFloat(customAmount);
    
    if (!amount || amount < 5) {
      alert('Minimum opwaardering is €5.00');
      return;
    }
    
    setLoading(true);
    try {
      // In a real app, this would process the payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user balance
      await updateProfile({ balance: user.balance + amount });
      
      alert(`Saldo succesvol opgewaardeerd met €${amount.toFixed(2)}!`);
      setSelectedAmount(null);
      setCustomAmount('');
    } catch (error) {
      console.error('Top up error:', error);
      alert('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Plus className="h-4 w-4 text-success-600" />;
      case 'quote_payment':
        return <CreditCard className="h-4 w-4 text-primary-600" />;
      case 'subscription':
        return <CreditCard className="h-4 w-4 text-secondary-600" />;
      default:
        return <Euro className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-success-600' : 'text-error-600';
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Balance Overview */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg text-white p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Mijn Saldo</h1>
                <div className="text-4xl font-bold">
                  €{user.balance.toFixed(2)}
                </div>
                <p className="text-primary-100 mt-2">
                  Beschikbaar voor uitgaven
                </p>
              </div>
              <div className="text-right">
                <CreditCard className="h-16 w-16 text-primary-200 mb-4" />
                <p className="text-primary-100">
                  Laatste update: vandaag
                </p>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('topup')}
                className={`flex-1 py-4 px-6 font-medium text-center relative ${
                  activeTab === 'topup'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Saldo Opwaarderen
                </div>
                {activeTab === 'topup' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-4 px-6 font-medium text-center relative ${
                  activeTab === 'history'
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center justify-center">
                  <History className="h-5 w-5 mr-2" />
                  Transactiegeschiedenis
                </div>
                {activeTab === 'history' && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  />
                )}
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'topup' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Saldo Opwaarderen</h2>
                  
                  {/* Quick Amounts */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Kies een bedrag
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {topUpAmounts.map((amount) => (
                        <motion.button
                          key={amount}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount('');
                          }}
                          className={`p-4 rounded-lg border-2 font-medium transition-all ${
                            selectedAmount === amount
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-primary-300 text-gray-700'
                          }`}
                        >
                          €{amount}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custom Amount */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Of voer een eigen bedrag in
                    </label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        placeholder="0.00"
                        min="5"
                        step="0.01"
                        className="input pl-10"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Minimum bedrag: €5.00
                    </p>
                  </div>
                  
                  {/* Payment Method */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Betaalmethode
                    </label>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CreditCard className="h-6 w-6 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800">Creditcard / Bancontact</p>
                          <p className="text-sm text-gray-500">Veilig betalen via onze partner</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Warning */}
                  <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-warning-600 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-warning-800 mb-1">Belangrijk</h3>
                        <p className="text-warning-700 text-sm">
                          Saldo opwaarderingen zijn niet refundeerbaar. Zorg ervoor dat je het juiste bedrag invoert.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Top Up Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTopUp}
                    disabled={loading || (!selectedAmount && !customAmount)}
                    className={`w-full btn btn-primary flex items-center justify-center ${
                      loading || (!selectedAmount && !customAmount)
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verwerken...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Waarder op €{(selectedAmount || parseFloat(customAmount) || 0).toFixed(2)}
                      </>
                    )}
                  </motion.button>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Transactiegeschiedenis</h2>
                  
                  {mockTransactions.length > 0 ? (
                    <div className="space-y-4">
                      {mockTransactions.map((transaction) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-4">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{transaction.description}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(transaction.date).toLocaleDateString('nl-NL', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${getTransactionColor(transaction.amount)}`}>
                              {transaction.amount > 0 ? '+' : ''}€{Math.abs(transaction.amount).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">{transaction.status}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Geen transacties</h3>
                      <p className="text-gray-500">Je hebt nog geen transacties uitgevoerd.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}