import { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Users, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatSidebar() {
  const { publicRooms, privateChats, setCurrentChat } = useChat();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'groups' | 'private' | 'friends'>('groups');
  
  if (!user) return null;
  
  return (
    <div className="bg-white h-full border-r border-gray-200 flex flex-col w-64 md:w-72">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 px-4 text-center font-medium relative ${
            activeTab === 'groups' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('groups')}
        >
          <span className="flex items-center justify-center">
            <MessageSquare size={18} className="mr-1" />
            <span>Groepen</span>
          </span>
          {activeTab === 'groups' && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
            />
          )}
        </button>
        
        <button
          className={`flex-1 py-3 px-4 text-center font-medium relative ${
            activeTab === 'private' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('private')}
        >
          <span className="flex items-center justify-center">
            <MessageSquare size={18} className="mr-1" />
            <span>Privé</span>
          </span>
          {activeTab === 'private' && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
            />
          )}
        </button>
        
        <button
          className={`flex-1 py-3 px-4 text-center font-medium relative ${
            activeTab === 'friends' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('friends')}
        >
          <span className="flex items-center justify-center">
            <Users size={18} className="mr-1" />
            <span>Vrienden</span>
          </span>
          {activeTab === 'friends' && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
            />
          )}
        </button>
      </div>
      
      {/* Content based on active tab */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'groups' && (
          <div className="p-2">
            <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Publieke Kanalen</h3>
            <ul className="space-y-1">
              {publicRooms.map((room) => (
                <li key={room.id}>
                  <button
                    className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-left"
                    onClick={() => setCurrentChat(room)}
                  >
                    <span className="w-8 h-8 flex items-center justify-center bg-primary-100 text-primary-800 rounded-full mr-3">
                      <MessageSquare size={16} />
                    </span>
                    <span className="flex-1 truncate">{room.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {activeTab === 'private' && (
          <div className="p-2">
            <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Privé Gesprekken</h3>
            {privateChats.length > 0 ? (
              <ul className="space-y-1">
                {privateChats.map((chat) => (
                  <li key={chat.id}>
                    <button
                      className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-100 text-left"
                      onClick={() => setCurrentChat(chat)}
                    >
                      <span className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full mr-3">
                        <MessageSquare size={16} />
                      </span>
                      <span className="flex-1 truncate">{chat.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500 italic">
                Nog geen privé gesprekken
              </div>
            )}
            
            <div className="px-3 py-2 mt-2">
              <button className="w-full flex items-center justify-center px-3 py-2 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100">
                <UserPlus size={16} className="mr-2" />
                <span>Nieuw gesprek</span>
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'friends' && (
          <div className="p-2">
            <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Vrienden</h3>
            <div className="p-4 text-center text-gray-500 italic">
              Je hebt nog geen vrienden toegevoegd
            </div>
            
            <div className="px-3 py-2 mt-2">
              <button className="w-full flex items-center justify-center px-3 py-2 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100">
                <UserPlus size={16} className="mr-2" />
                <span>Vrienden zoeken</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}