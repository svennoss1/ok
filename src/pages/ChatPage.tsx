import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import Header from '../components/layout/Header';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import UsersSidebar from '../components/chat/UsersSidebar';
import { Menu, X, Users, MessageSquare } from 'lucide-react';

export default function ChatPage() {
  const { user } = useAuth();
  const { currentChat } = useChat();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  // Close sidebars when chat changes on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setShowSidebar(false);
      setShowUsers(false);
    }
  }, [currentChat]);

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Chat list sidebar - visible by default on desktop */}
        <div className="hidden md:block w-64 lg:w-72 flex-shrink-0">
          <ChatList />
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden fixed bottom-20 left-4 z-50 p-3 bg-primary-500 text-white rounded-full shadow-lg"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          {showSidebar ? <X size={24} /> : <MessageSquare size={24} />}
        </button>

        {/* Mobile chat list sidebar */}
        <div className={`
          md:hidden fixed inset-y-0 left-0 z-40
          transform transition-transform duration-200 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          w-64 lg:w-72
        `}>
          <ChatList />
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatWindow />
        </div>

        {/* Users sidebar - visible by default on desktop */}
        <div className="hidden md:block w-64 lg:w-72 flex-shrink-0">
          <UsersSidebar />
        </div>

        {/* Mobile users button */}
        <button
          className="md:hidden fixed bottom-20 right-4 z-50 p-3 bg-primary-500 text-white rounded-full shadow-lg"
          onClick={() => setShowUsers(!showUsers)}
        >
          {showUsers ? <X size={24} /> : <Users size={24} />}
        </button>

        {/* Mobile users sidebar */}
        <div className={`
          md:hidden fixed inset-y-0 right-0 z-40
          transform transition-transform duration-200 ease-in-out
          ${showUsers ? 'translate-x-0' : 'translate-x-full'}
          w-64 lg:w-72
        `}>
          <UsersSidebar />
        </div>

        {/* Overlay for mobile */}
        {(showSidebar || showUsers) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => {
              setShowSidebar(false);
              setShowUsers(false);
            }}
          />
        )}
      </div>
    </div>
  );
}