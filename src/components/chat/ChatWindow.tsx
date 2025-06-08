import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import { useChat, Chat } from '../../contexts/ChatContext';
import { Send, MessageSquare, User } from 'lucide-react';
import UserBadge from '../ui/UserBadge';
import { Link } from 'react-router-dom';

export default function ChatWindow() {
  const { user } = useAuth();
  const { currentChat, messages, sendMessage, setCurrentChat, createPrivateChat, onlineUsers, chats } = useChat();
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ id: number; username: string } | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  useEffect(() => {
    // Restore last selected chat from localStorage
    const lastChatId = localStorage.getItem('lastChatId');
    if (lastChatId && chats.length > 0) {
      const found = chats.find(c => c.id === Number(lastChatId));
      if (found) setCurrentChat(found);
    }
  }, [chats]);
  
  if (!user || !currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h2 className="text-xl font-medium text-gray-700 mb-2">Welkom bij SexyPraat</h2>
          <p className="text-gray-500">Selecteer een chat om te beginnen</p>
        </div>
      </div>
    );
  }
  
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (message.trim() && currentChat) {
      sendMessage(message, user.id, currentChat.id);
      setMessage('');
    }
  };

  const handleProfileClick = (userId: number, username: string, messageId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUser({ id: userId, username });
    setSelectedMessageId(messageId);
  };

  const handleSetCurrentChat = (chat: Chat) => {
    setCurrentChat(chat);
    localStorage.setItem('lastChatId', String(chat.id));
    const section = chat.type === 'private' ? 'private' : 'public';
    localStorage.setItem('activeSection', section);
  };

  const handlePrivateMessage = async (userId: number, username: string) => {
    if (!user) return;
    
    try {
      const newChat = await createPrivateChat(user.id, userId);
      if (newChat) {
        handleSetCurrentChat(newChat);
        setSelectedUser(null);
        setSelectedMessageId(null);
      }
    } catch (error) {
      console.error('Failed to create private chat:', error);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    if (selectedUser && !target.closest('.profile-dropdown') && !target.closest('.profile-picture')) {
      setSelectedUser(null);
      setSelectedMessageId(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedUser]);
  
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <div className="flex-1">
          <h2 className="font-medium text-gray-800">{currentChat.name}</h2>
          <p className="text-xs text-gray-500">
            {currentChat.type === 'public' ? 'Publiek kanaal' : 'Privé gesprek'}
          </p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => {
            const isUserMessage = msg.userId === user.id;
            const showUserInfo = index === 0 || messages[index - 1]?.userId !== msg.userId;
            
            return (
              <div key={msg.id} className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} px-2 md:px-4`}>
                <div className={`max-w-[85%] md:max-w-[80%]`}>
                  {!isUserMessage && showUserInfo && msg.user && (
                    <div className="flex items-center mb-1 ml-12">
                      <p className="text-xs font-medium text-gray-700 mr-1">{msg.user.username}</p>
                      {msg.user.role && (
                        <UserBadge 
                          role={msg.user.isAdmin ? 'admin' : msg.user.isCreator ? 'creator' : msg.user.role} 
                          size="xs" 
                        />
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    {!isUserMessage && (
                      <div className="relative">
                        <div 
                          className="profile-picture w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden mr-2 mt-2 flex-shrink-0 cursor-pointer hover:opacity-90"
                          onClick={(e) => handleProfileClick(msg.userId, msg.user?.username || '', msg.id, e)}
                        >
                          <img 
                            src={msg.user?.profilePicture || '/assets/default-avatar.png'} 
                            alt={msg.user?.username || 'User'} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {selectedUser?.id === msg.userId && selectedMessageId === msg.id && (
                          <div className="profile-dropdown absolute left-0 top-12 bg-white rounded-lg shadow-lg py-2 w-48 z-10">
                            <Link 
                              to={`/profile/${selectedUser.username}`}
                              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(null);
                                setSelectedMessageId(null);
                              }}
                            >
                              <img
                                src={msg.user?.profilePicture || '/assets/default-avatar.png'}
                                alt={msg.user?.username || 'User'}
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <span>Bekijk profiel</span>
                            </Link>
                            <button 
                              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrivateMessage(selectedUser.id, selectedUser.username);
                              }}
                            >
                              <img
                                src={msg.user?.profilePicture || '/assets/default-avatar.png'}
                                alt={msg.user?.username || 'User'}
                                className="w-6 h-6 rounded-full mr-2"
                              />
                              <span>Privé bericht sturen</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className={`chat-bubble ${isUserMessage ? 'chat-bubble-user' : 'chat-bubble-other'} text-sm md:text-base`}>
                        <p className="break-words">{msg.text}</p>
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${isUserMessage ? 'text-right mr-2' : 'ml-2'}`}>
                        {format(new Date(msg.createdAt), 'HH:mm', { locale: nl })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Typ een bericht..."
            className="input flex-1 mr-2"
          />
          <button 
            type="submit" 
            disabled={!message.trim()}
            className="btn btn-primary"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}