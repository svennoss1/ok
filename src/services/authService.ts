import { User } from '../contexts/AuthContext';

const API_URL = 'https://sexypraat.nl/api'; // API endpoint on your Strato hosting

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/auth.php?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  static async register(data: RegisterData): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/auth.php?action=register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  static async getUserById(id: number): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/auth.php?action=getUser&id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }

  static async updateProfile(userId: number, data: {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    bannerImage?: string;
    bio?: string;
  }): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/auth.php?action=updateProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...data
        }),
      });

      const responseData = await response.json();

      if ('error' in responseData) {
        throw new Error(responseData.error);
      }

      return responseData;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
}