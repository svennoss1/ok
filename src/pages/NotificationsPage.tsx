import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/layout/Header';
import { Bell, MessageSquare, CreditCard, Settings, Check, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const mockNotifications = [
  {
    id: 1,
    type: 'message',
    title: 'Nieuw bericht van Jessica',
    content: 'Je hebt een nieuw privébericht ontvangen',
    link: '/chat/private/4',
    isRead: false,
    createdAt: '2025-01-30T14:30:00Z'
  },
  {
    id: 2,
    type: 'quote',
    title: 'Nieuwe offerte ontvangen',
    content: 'Emma heeft je een offerte gestuurd voor €25.00',
    link: '/chat/private/5',
    isRead: false,
    createdAt: '2025-01-30T12:15:00Z'
  },
  {
    id: 3,
    type: 'subscription',
    title: 'VIP abonnement verlengd',
    content: 'Je VIP abonnement is automatisch verlengd',
    link: '/abonnementen',
    isRead: true,
    createdAt: '2025-01-28T09:00:00Z'
  },
  {
    id: 4,
    type: 'system',
    title: 'Welkom bij SexyPraat!',
    content: 'Bedankt voor je registratie. Ontdek alle functies van het platform.',
    link: '/chat',
    isRead: true,
    createdAt: '2025-01-25T16:45:00Z'
  }
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  if (!user) return null;
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-5 w-5 text-primary-600" />;
      case 'quote':
        return <CreditCard className="h-5 w-5 text-secondary-600" />;
      case 'subscription':
        return <Settings className="h-5 w-5 text-accent-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };
  
  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };
  
  const filteredNotifications = filter === 'unread'
    ? notifications.filter(notif => !notif.isRead)
    : notifications;
  
  const unreadCount = notifications.filter(notif => !notif.isRead).length;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Meldingen</h1>
                  <p className="text-gray-600 mt-1">
                    {unreadCount > 0 ? `${unreadCount} ongelezen meldingen` : 'Alle meldingen gelezen'}
                  </p>
                </div>
                
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="btn btn-secondary flex items-center"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Alles markeren als gelezen
                  </button>
                )}
              </div>
              
              {/* Filter Tabs */}
              <div className="flex mt-6 border-b border-gray-200">
                <button
                  onClick={() => setFilter('all')}
                  className={`py-2 px-4 font-medium border-b-2 transition-colors ${
                    filter === 'all'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Alle ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`py-2 px-4 font-medium border-b-2 transition-colors ${
                    filter === 'unread'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Ongelezen ({unreadCount})
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-4 shadow-sm">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium text-gray-800 mr-2">
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-600 mt-1">{notification.content}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {new Date(notification.createdAt).toLocaleDateString('nl-NL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Markeren als gelezen"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-error-600 transition-colors"
                          title="Verwijderen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {notification.link && (
                      <div className="mt-3 ml-14">
                        <a
                          href={notification.link}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          Bekijk →
                        </a>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {filter === 'unread' ? 'Geen ongelezen meldingen' : 'Geen meldingen'}
                  </h3>
                  <p className="text-gray-500">
                    {filter === 'unread'
                      ? 'Alle meldingen zijn gelezen.'
                      : 'Je hebt nog geen meldingen ontvangen.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}