import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ChatService } from '../services/chatService';
import { User, useAuth } from './AuthContext';

export interface Message {
  id: number;
  chatId: number;
  userId: number;
  text: string;
  isDeleted: boolean;
  createdAt: string;
  user?: User;
}

export interface Chat {
  id: number;
  name: string;
  type: 'public' | 'private' | 'group';
  createdBy: number;
  isActive: boolean;
  createdAt: string;
  messages?: Message[];
  participants?: User[];
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  publicRooms: Chat[];
  privateChats: Chat[];
  onlineUsers: User[];
  setCurrentChat: (chat: Chat) => void;
  sendMessage: (text: string, userId: number, chatId: number) => Promise<boolean>;
  createPrivateChat: (userId1: number, userId2: number) => Promise<Chat | null>;
  loadMessages: (chatId: number) => Promise<void>;
  refreshOnlineUsers: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get public rooms and private chats
  const publicRooms = chats.filter(chat => chat.type === 'public');
  const privateChats = chats.filter(chat => chat.type === 'private' || chat.type === 'group');
  
  const loadChats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [publicChannels, privateChannels] = await Promise.all([
        ChatService.getPublicChannels(),
        Promise.resolve([])
      ]);
      
      setChats([...publicChannels, ...privateChannels]);
      
      // If we have public channels and no current chat, set the first one
      if (publicChannels.length > 0 && !currentChat) {
        setCurrentChat(publicChannels[0]);
      }
    } catch (error) {
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, [currentChat]);
  
  const loadMessages = useCallback(async (chatId: number) => {
    try {
      setError(null);
      const chatMessages = await ChatService.getChannelMessages(chatId);
      setMessages(chatMessages);
    } catch (error) {
      setError('Failed to load messages');
    }
  }, []);
  
  const refreshOnlineUsers = useCallback(async () => {
    try {
      setError(null);
      const users = await ChatService.getOnlineUsers();
      setOnlineUsers(users);
    } catch (error) {
      setError('Failed to refresh online users');
    }
  }, []);
  
  // Load initial data
  useEffect(() => {
    loadChats();
    refreshOnlineUsers();
  }, []); // Empty dependency array since these should only run once on mount
  
  // Set up polling for real-time updates
  useEffect(() => {
    if (!currentChat) return;
    
    let isPolling = true;
    
    const pollData = async () => {
      if (!isPolling) return;
      
      try {
        // Check if we're online before polling
        if (!navigator.onLine) {
          setOnlineUsers([]);
          return;
        }

        await Promise.all([
          loadMessages(currentChat.id),
          refreshOnlineUsers()
        ]);
      } catch (error) {
        console.error('Polling error:', error);
        // If there's an error, assume we're offline
        setOnlineUsers([]);
      }
    };
    
    // Initial load
    pollData();
    
    // Set up interval
    const interval = setInterval(pollData, 3000);
    
    // Add online/offline event listeners
    const handleOnline = () => {
      pollData();
    };
    
    const handleOffline = () => {
      setOnlineUsers([]);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Add visibility change listener
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setOnlineUsers([]);
      } else {
        pollData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      isPolling = false;
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentChat?.id, loadMessages, refreshOnlineUsers]);
  
  // Load messages when current chat changes
  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat.id);
    } else {
      setMessages([]);
    }
  }, [currentChat?.id]); // Only depend on currentChat.id
  
  const sendMessage = async (text: string, userId: number, chatId: number): Promise<boolean> => {
    try {
      setError(null);
      const newMessage = await ChatService.sendMessage(chatId, userId, text);
      if (newMessage) {
        setMessages(prevMessages => [...prevMessages, newMessage]);
        return true;
      }
      return false;
    } catch (error) {
      setError('Failed to send message');
      return false;
    }
  };
  
  const createPrivateChat = async (userId1: number, userId2: number): Promise<Chat | null> => {
    try {
      setError(null);
      const newChat = await ChatService.createPrivateChat(userId1, userId2);
      if (newChat) {
        // Get the other user's information
        const otherUser = onlineUsers.find(user => user.id === userId2);
        if (otherUser) {
          // Update the chat with the other user's information
          newChat.name = otherUser.username;
          newChat.participants = [otherUser];
        }
        await loadChats();
        setCurrentChat(newChat);
      }
      return newChat;
    } catch (error) {
      setError('Failed to create private chat');
      return null;
    }
  };
  
  // Load private chats when online users change
  useEffect(() => {
    const loadPrivateChats = async () => {
      if (user?.id) {
        const privateChats = await ChatService.getPrivateChats(user.id);
        // Update chat names and participants with current user information
        const updatedChats = privateChats.map(chat => {
          // Find the other user in the chat
          let otherUser = chat.participants?.find(u => u.id !== user.id);
          // If not found or missing profilePicture, try to get from onlineUsers
          if ((!otherUser || !otherUser.profilePicture) && chat.participants) {
            const found = onlineUsers.find(u => chat.participants?.some(p => p.id === u.id) && u.id !== user.id);
            if (found) otherUser = found;
          }
          if (otherUser) {
            return {
              ...chat,
              name: otherUser.username,
              participants: [otherUser]
            };
          }
          return chat;
        });
        setChats(prevChats => {
          const publicChats = prevChats.filter(c => c.type === 'public');
          return [...publicChats, ...updatedChats];
        });
    }
  };
    loadPrivateChats();
  }, [user?.id, onlineUsers]);
  
  return (
    <ChatContext.Provider value={{ 
      chats,
      currentChat,
      messages,
      publicRooms,
      privateChats,
      onlineUsers,
      setCurrentChat,
      sendMessage,
      createPrivateChat,
      loadMessages,
      refreshOnlineUsers,
      loading,
      error
    }}>
      {children}
    </ChatContext.Provider>
  );
}