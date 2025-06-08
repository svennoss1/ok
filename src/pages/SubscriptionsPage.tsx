import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import { Crown, Award, Shield, Check, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const subscriptionPlans = [
  {
    id: 1,
    name: 'Premium',
    description: 'Premium gebruiker met extra voordelen',
    priceMonthly: 2.04,
    priceYearly: 24.48,
    icon: Shield,
    color: 'accent',
    features: [
      'Andere gebruikers blokkeren',
      'Opvallende Premium-badge',
      'Bovenaan in de online lijst',
      'Max. 2 privé groepen aanmaken',
      'Audio- en videogesprekken met iedereen'
    ]
  },
  {
    id: 2,
    name: 'VIP',
    description: 'VIP gebruiker met exclusieve voordelen',
    priceMonthly: 3.29,
    priceYearly: 39.48,
    icon: Award,
    color: 'secondary',
    popular: true,
    features: [
      'Exclusieve VIP-badge',
      'Extra galerijfoto\'s',
      'Andere lettertypes',
      'Eigen profielbanner',
      'Tot 5 privé groepen',
      'Unieke chatachtergronden',
      'Alles van Premium'
    ]
  },
  {
    id: 3,
    name: 'Royal',
    description: 'Royal gebruiker met alle voordelen',
    priceMonthly: 4.15,
    priceYearly: 49.80,
    icon: Crown,
    color: 'purple',
    features: [
      'Royal-badge',
      'Aangepaste berichtstijl',
      'Onbeperkte privé groepen',
      'Upload je eigen chatachtergrond',
      'Advertentievrij gebruik',
      'Alles van VIP & Premium'
    ]
  }
];

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState<string | null>(null);
  
  if (!user) return null;
  
  const handleSubscribe = async (planId: number) => {
    setLoading(planId.toString());
    try {
      // In a real app, this would process the subscription
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Abonnement succesvol geactiveerd!');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setLoading(null);
    }
  };
  
  const currentPlan = user.role || 'user';
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Abonnementen</h1>
            <p className="text-xl text-gray-600 mb-8">
              Upgrade je account voor meer functies en voordelen
            </p>
            
            {/* Billing Cycle Toggle */}
            <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Maandelijks
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Jaarlijks
                <span className="ml-1 text-xs bg-success-100 text-success-800 px-2 py-0.5 rounded-full">
                  Bespaar 20%
                </span>
              </button>
            </div>
          </div>
          
          {/* Current Plan */}
          {currentPlan !== 'user' && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Huidig Abonnement</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-primary-600 capitalize">{currentPlan}</p>
                  <p className="text-gray-600">Actief tot 30 mei 2026</p>
                </div>
                <button className="btn btn-secondary">
                  Abonnement Beheren
                </button>
              </div>
            </div>
          )}
          
          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan, index) => {
              const Icon = plan.icon;
              const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
              const isCurrentPlan = currentPlan === plan.name.toLowerCase();
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden relative ${
                    plan.popular ? 'ring-2 ring-primary-500' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-primary-500 text-white text-center py-2 text-sm font-medium">
                      Meest Gekozen
                    </div>
                  )}
                  
                  <div className={`p-6 ${plan.popular ? 'pt-12' : ''}`}>
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${plan.color}-100 flex items-center justify-center`}>
                        <Icon className={`h-8 w-8 text-${plan.color}-600`} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                      <p className="text-gray-600 mt-1">{plan.description}</p>
                    </div>
                    
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-800">
                        €{price.toFixed(2)}
                      </div>
                      <div className="text-gray-600">
                        per {billingCycle === 'monthly' ? 'maand' : 'jaar'}
                      </div>
                      {billingCycle === 'yearly' && (
                        <div className="text-sm text-success-600 mt-1">
                          €{(plan.priceMonthly * 12 - plan.priceYearly).toFixed(2)} bespaard per jaar
                        </div>
                      )}
                    </div>
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isCurrentPlan || loading === plan.id.toString()}
                      className={`w-full btn ${
                        isCurrentPlan
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : plan.popular
                          ? 'btn-primary'
                          : 'btn-secondary'
                      } flex items-center justify-center`}
                    >
                      {loading === plan.id.toString() ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verwerken...
                        </>
                      ) : isCurrentPlan ? (
                        'Huidig Plan'
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Upgrade naar {plan.name}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Balance Notice */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mt-8">
            <div className="flex items-start">
              <CreditCard className="h-6 w-6 text-primary-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-primary-800 mb-1">Betaling via Saldo</h3>
                <p className="text-primary-700 mb-2">
                  Abonnementen worden betaald via je account saldo. 
                  Je huidige saldo is <strong>€{user.balance.toFixed(2)}</strong>.
                </p>
                <p className="text-sm text-primary-600">
                  Zorg ervoor dat je voldoende saldo hebt voordat je een abonnement activeert.
                </p>
              </div>
            </div>
          </div>
          
          {/* FAQ */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Veelgestelde Vragen</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Kan ik mijn abonnement opzeggen?</h3>
                <p className="text-gray-600">
                  Ja, je kunt je abonnement op elk moment opzeggen. Je behoudt toegang tot de functies tot het einde van je betaalperiode.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Krijg ik een refund bij opzegging?</h3>
                <p className="text-gray-600">
                  Nee, conform onze gebruikersvoorwaarden zijn er geen refunds mogelijk.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Kan ik upgraden of downgraden?</h3>
                <p className="text-gray-600">
                  Ja, je kunt op elk moment upgraden naar een hoger plan. Downgrades gaan in bij de volgende betaalperiode.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}