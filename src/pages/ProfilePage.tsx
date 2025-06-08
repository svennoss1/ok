import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/authService';
import Header from '../components/layout/Header';
import UserBadge from '../components/ui/UserBadge';
import { MessageSquare, CreditCard, Edit, Calendar, User as UserIcon, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '../contexts/AuthContext';

const API_URL = 'https://sexypraat.nl/api';

interface ProfileUpdateData {
  username?: string;
  email?: string;
  bio?: string;
  profilePicture?: string;
  bannerImage?: string;
}

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<ProfileUpdateData>({});
  
  useEffect(() => {
    loadUserProfile();
  }, [username, currentUser]);
  
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!username) {
        throw new Error('Username is required');
      }
      
      if (currentUser && username === currentUser.username) {
        setUser(currentUser);
        setLoading(false);
        setFormData({ bio: currentUser.bio });
        return;
      }
      
      const response = await fetch(`${API_URL}/auth.php?action=getUserByUsername&username=${encodeURIComponent(username)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to load profile');
      }
      
      const data = await response.json();
      
      if ('error' in data) {
        throw new Error(data.error);
      }
      
      if (!data || !data.id) {
        throw new Error('User not found');
      }
      
      setUser(data as User);
      setFormData({ bio: (data as User).bio });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileUpdate = async (updateData: ProfileUpdateData) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth.php?action=updateProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
          ...updateData
        }),
      });

      const data = await response.json();

      if ('error' in data) {
        throw new Error(data.error);
      }

      if (data.user) {
        setUser(data.user);
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner') => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setLoading(true);
      setError('');
      
      const formDataPayload = new FormData();
      formDataPayload.append('image', file);
      formDataPayload.append('type', type);
      formDataPayload.append('userId', user?.id?.toString() || '');
      
      const response = await fetch(`${API_URL}/upload.php`, {
        method: 'POST',
        body: formDataPayload,
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if ('error' in data) {
        throw new Error(data.error);
      }
      
      // Update profile with new image URL
      const imageUpdateData = {
        [type === 'profile' ? 'profilePicture' : 'bannerImage']: data.url
      };
      
      const updateResponse = await fetch(`${API_URL}/auth.php?action=updateProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id,
          ...imageUpdateData
        }),
      });

      const updateResult = await updateResponse.json();

      if ('error' in updateResult) {
        throw new Error(updateResult.error);
      }

      if (updateResult.user) {
        setUser(updateResult.user);
        setSuccess('Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }

    } catch (error) {
      console.error('Image upload error:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-2">Error</h2>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-2">User Not Found</h2>
            <p className="text-gray-500">The requested profile could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;
  
  const isOwnProfile = currentUser.id === user.id;
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Banner */}
            <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-400 relative">
              {user.bannerImage && (
                <img
                  src={user.bannerImage}
                  alt="Profile banner"
                  className="w-full h-full object-cover"
                />
              )}
              
              {isOwnProfile && (
                <label className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'banner')}
                  />
                  <Camera size={18} className="text-gray-700" />
                </label>
              )}
              
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
                    <img
                      src={user.profilePicture || '/assets/default-avatar.png'}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {isOwnProfile && (
                    <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'profile')}
                      />
                      <Camera size={18} className="text-gray-700" />
                    </label>
                  )}
                </div>
              </div>
            </div>
            
            {/* Profile info */}
            <div className="pt-20 px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-800 mr-3">{user.username}</h1>
                    {user.role && (
                      <UserBadge role={user.isAdmin ? 'admin' : user.isCreator ? 'creator' : user.role} size="md" />
                    )}
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <UserIcon size={16} className="mr-1" />
                    <span>
                      {user.gender === 'male' ? 'Man' : user.gender === 'female' ? 'Vrouw' : 'Anders'}, {calculateAge(user.birthDate)} jaar
                    </span>
                    <span className="mx-2">•</span>
                    <Calendar size={16} className="mr-1" />
                    <span>Lid sinds {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex mt-4 md:mt-0 space-x-3">
                  {!isOwnProfile && (
                    <button className="btn btn-primary flex items-center">
                      <MessageSquare size={18} className="mr-2" />
                      Bericht sturen
                    </button>
                  )}
                  
                  {isOwnProfile && (
                    <Link to="/balance" className="btn btn-secondary flex items-center">
                      <CreditCard size={18} className="mr-2" />
                      Saldo: €{user.balance.toFixed(2)}
                    </Link>
                  )}
                </div>
              </div>
              
              {/* Bio */}
              <div className="mt-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      value={formData.bio || user.bio || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={4}
                      placeholder="Vertel iets over jezelf..."
                    />
                    <div className="flex justify-end space-x-3">
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({ bio: user.bio });
                        }}
                      >
                        Annuleren
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={async () => {
                          await handleProfileUpdate({ bio: formData.bio });
                        }}
                        disabled={loading}
                      >
                        {loading ? 'Opslaan...' : 'Opslaan'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {user.bio || 'Nog geen bio toegevoegd.'}
                    </p>
                    {isOwnProfile && (
                      <button
                        className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                            setIsEditing(true);
                            setFormData({ bio: user.bio });
                        }}
                      >
                        <Edit size={18} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
                  {success}
                </div>
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Abonnement</h2>
              
              {user.role !== 'user' ? (
                <div>
                  <div className="flex items-center mb-4">
                    <UserBadge role={user.role} size="md" />
                    <span className="ml-2 text-gray-600">
                      Je huidige abonnement is actief tot 30 mei 2026
                    </span>
                  </div>
                  <Link to="/abonnementen" className="btn btn-secondary">
                    Abonnement beheren
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Upgrade je account voor meer functies en voordelen.
                  </p>
                  <Link to="/abonnementen" className="btn btn-primary">
                    Upgrade naar Premium
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}