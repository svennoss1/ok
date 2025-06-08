import { Chat, Message } from '../contexts/ChatContext';
import { User } from '../contexts/AuthContext';

const API_URL = 'https://sexypraat.nl/api';

export class ChatService {
  static async getPublicChannels(): Promise<Chat[]> {
    try {
      const response = await fetch(`${API_URL}/chat.php?action=getPublicChannels`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      return [];
    }
  }
  
  static async getPrivateChats(userId: number): Promise<Chat[]> {
    try {
      const response = await fetch(`${API_URL}/chat.php?action=getPrivateChats&userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      return [];
    }
  }
  
  static async getChannelMessages(channelId: number, limit: number = 50): Promise<Message[]> {
    try {
      const response = await fetch(
        `${API_URL}/chat.php?action=getChannelMessages&channelId=${channelId}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );
      
      const data = await response.json();

      if ('error' in data) {
        console.error('Channel messages error:', data.error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Channel messages error:', error);
      return [];
    }
  }
  
  static async sendMessage(chatId: number, userId: number, text: string): Promise<Message | null> {
    try {
      const response = await fetch(`${API_URL}/chat.php?action=sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          channelId: chatId,
          userId: userId,
          content: text
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      return null;
    }
  }
  
  static async createPrivateChat(userId1: number, userId2: number): Promise<Chat | null> {
    try {
      const response = await fetch(`${API_URL}/chat.php?action=createPrivateChat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId1,
          userId2
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      return null;
    }
  }
  
  static async getOnlineUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_URL}/chat.php?action=getOnlineUsers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      const data = await response.json();

      if ('error' in data) {
        console.error('Online users error:', data.error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Online users error:', error);
      return [];
    }
  }
}