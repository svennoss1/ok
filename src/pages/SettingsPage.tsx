import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import { Save, User, Bell, Shield, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [settings, setSettings] = useState({
    notification_email: true,
    notification_quotes: true,
    notification_messages: true,
    notification_subscriptions: true,
    privacy_profile: 'public',
    privacy_online_status: true,
    theme_preference: 'light',
    language: 'nl'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  if (!user) return null;
  
  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, this would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Save settings error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-800">Instellingen</h1>
              <p className="text-gray-600 mt-1">Beheer je account en privacy instellingen</p>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Profile Settings */}
              <div>
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 text-primary-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-800">Profiel Instellingen</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voornaam
                    </label>
                    <input
                      type="text"
                      value={user.firstName || ''}
                      onChange={(e) => updateProfile({ firstName: e.target.value })}
                      className="input"
                      placeholder="Je voornaam"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Achternaam
                    </label>
                    <input
                      type="text"
                      value={user.lastName || ''}
                      onChange={(e) => updateProfile({ lastName: e.target.value })}
                      className="input"
                      placeholder="Je achternaam"
                    />
                  </div>
                </div>
              </div>
              
              {/* Notification Settings */}
              <div>
                <div className="flex items-center mb-4">
                  <Bell className="h-5 w-5 text-primary-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-800">Meldingen</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">Email meldingen</p>
                      <p className="text-sm text-gray-500">Ontvang meldingen via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notification_email}
                        onChange={(e) => setSettings({...settings, notification_email: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">Bericht meldingen</p>
                      <p className="text-sm text-gray-500">Meldingen voor nieuwe berichten</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notification_messages}
                        onChange={(e) => setSettings({...settings, notification_messages: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">Offerte meldingen</p>
                      <p className="text-sm text-gray-500">Meldingen voor nieuwe offertes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notification_quotes}
                        onChange={(e) => setSettings({...settings, notification_quotes: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Privacy Settings */}
              <div>
                <div className="flex items-center mb-4">
                  <Shield className="h-5 w-5 text-primary-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-800">Privacy</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profiel zichtbaarheid
                    </label>
                    <select
                      value={settings.privacy_profile}
                      onChange={(e) => setSettings({...settings, privacy_profile: e.target.value})}
                      className="input"
                    >
                      <option value="public">Openbaar</option>
                      <option value="private">Privé</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">Online status tonen</p>
                      <p className="text-sm text-gray-500">Laat anderen zien wanneer je online bent</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy_online_status}
                        onChange={(e) => setSettings({...settings, privacy_online_status: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Theme Settings */}
              <div>
                <div className="flex items-center mb-4">
                  <Palette className="h-5 w-5 text-primary-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-800">Uiterlijk</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thema
                  </label>
                  <select
                    value={settings.theme_preference}
                    onChange={(e) => setSettings({...settings, theme_preference: e.target.value})}
                    className="input"
                  >
                    <option value="light">Licht</option>
                    <option value="dark">Donker</option>
                    <option value="auto">Automatisch</option>
                  </select>
                </div>
              </div>
              
              {/* Save Button */}
              <div className="pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={loading}
                  className={`btn btn-primary flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Opslaan...' : 'Instellingen Opslaan'}
                </motion.button>
                
                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-success-600 text-sm mt-2"
                  >
                    Instellingen succesvol opgeslagen!
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}