import { useAuth } from '../../contexts/AuthContext';
import { useChat, Chat } from '../../contexts/ChatContext';
import { MessageSquare } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export default function ChatList() {
  const { user } = useAuth();
  const { currentChat, setCurrentChat, publicRooms, privateChats } = useChat();
  const [activeSection, setActiveSection] = useState<'public' | 'private'>('public');
  const hasRestoredChat = useRef(false);

  const handleSetCurrentChat = (chat: Chat) => {
    setCurrentChat(chat);
    localStorage.setItem('lastChatId', String(chat.id));
    const section = chat.type === 'private' ? 'private' : 'public';
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
  };

  useEffect(() => {
    if (hasRestoredChat.current) return;
    // Restore last selected chat and section from localStorage
    const lastChatId = localStorage.getItem('lastChatId');
    const lastSection = localStorage.getItem('activeSection');
    if (lastSection === 'private' || lastSection === 'public') {
      setActiveSection(lastSection);
    }
    if (lastChatId) {
      const allChats = [...publicRooms, ...privateChats];
      const found = allChats.find(c => c.id === Number(lastChatId));
      if (found) handleSetCurrentChat(found);
    }
    hasRestoredChat.current = true;
  }, [publicRooms.length, privateChats.length]);

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Public channels */}
      <div className="p-4">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Publieke kanalen</h2>
        <div className="space-y-1">
          {publicRooms.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSetCurrentChat(chat)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-left ${
                currentChat?.id === chat.id && activeSection === 'public'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare size={18} className="mr-3 flex-shrink-0" />
              <span className="truncate">{chat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Private chats */}
      <div className="p-4 border-t border-gray-200">
        <h2 className="text-sm font-medium text-gray-500 mb-2">Privé gesprekken</h2>
        <div className="space-y-1">
          {privateChats.map((chat) => {
            const otherUser = chat.participants?.find(p => p.id !== user?.id);
            return (
              <button
                key={chat.id}
                onClick={() => handleSetCurrentChat(chat)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left ${
                  currentChat?.id === chat.id && activeSection === 'private'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="relative mr-3 flex-shrink-0">
                  <img
                    src={otherUser?.profilePicture || '/assets/default-avatar.png'}
                    alt={otherUser?.username || 'User'}
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/default-avatar.png';
                    }}
                  />
                  {otherUser?.lastLogin && new Date(otherUser.lastLogin).getTime() > Date.now() - 300000 && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                  )}
                </div>
                <span className="truncate">{otherUser?.username || chat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 