import { useAuth, User } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import UserBadge from '../ui/UserBadge';
import { useEffect } from 'react';

export default function UsersSidebar() {
  const { user: currentUser } = useAuth();
  const { onlineUsers, refreshOnlineUsers } = useChat();
  
  // Refresh online users every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshOnlineUsers();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [refreshOnlineUsers]);
  
  // Filter out offline users
  const activeUsers = onlineUsers.filter(user => {
    const isOnline = user.lastLogin && new Date(user.lastLogin).getTime() > Date.now() - 300000; // 5 minutes
    return isOnline;
  });
  
  // Sort users by role and online status
  const sortedUsers = [...activeUsers].sort((a, b) => {
    // Admin first
    if (a.isAdmin && !b.isAdmin) return -1;
    if (!a.isAdmin && b.isAdmin) return 1;
    
    // Creators second
    if (a.isCreator && !b.isCreator) return -1;
    if (!a.isCreator && b.isCreator) return 1;
    
    // Then by role (royal > vip > premium > user)
    const roleOrder: Record<string, number> = { royal: 1, vip: 2, premium: 3, user: 4, admin: 0, creator: 0 };
    const aRoleValue = a.role ? roleOrder[a.role] : 4;
    const bRoleValue = b.role ? roleOrder[b.role] : 4;
    
    if (aRoleValue !== bRoleValue) {
      return aRoleValue - bRoleValue;
    }
    
    // Finally alphabetically
    return a.username.localeCompare(b.username);
  });
  
  // Group users by role for display
  const adminUsers = sortedUsers.filter(u => u.isAdmin);
  const creatorUsers = sortedUsers.filter(u => u.isCreator && !u.isAdmin);
  const vipUsers = sortedUsers.filter(u => u.role === 'vip' && !u.isCreator && !u.isAdmin);
  const premiumUsers = sortedUsers.filter(u => u.role === 'premium' && !u.isCreator && !u.isAdmin);
  const regularUsers = sortedUsers.filter(u => u.role === 'user' && !u.isCreator && !u.isAdmin);
  
  if (!currentUser) return null;

  // Add current user to online users if not already included
  const allOnlineUsers = [...sortedUsers];
  if (!allOnlineUsers.find(u => u.id === currentUser.id)) {
    allOnlineUsers.push(currentUser);
  }
  
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-full bg-white border-r border-gray-200 w-64 lg:w-72">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-700">Online gebruikers</h2>
          <p className="text-sm text-gray-500">{allOnlineUsers.length} online</p>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {adminUsers.length > 0 && (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Administrators</h3>
              <ul className="space-y-1">
                {adminUsers.map(user => (
                  <UserListItem key={user.id} user={user} />
                ))}
              </ul>
            </div>
          )}
          
          {creatorUsers.length > 0 && (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Creators</h3>
              <ul className="space-y-1">
                {creatorUsers.map(user => (
                  <UserListItem key={user.id} user={user} />
                ))}
              </ul>
            </div>
          )}
          
          {vipUsers.length > 0 && (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">VIP</h3>
              <ul className="space-y-1">
                {vipUsers.map(user => (
                  <UserListItem key={user.id} user={user} />
                ))}
              </ul>
            </div>
          )}
          
          {premiumUsers.length > 0 && (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Premium</h3>
              <ul className="space-y-1">
                {premiumUsers.map(user => (
                  <UserListItem key={user.id} user={user} />
                ))}
              </ul>
            </div>
          )}
          
          {regularUsers.length > 0 && (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Gebruikers</h3>
              <ul className="space-y-1">
                {regularUsers.map(user => (
                  <UserListItem key={user.id} user={user} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden flex flex-col h-full bg-white border-r border-gray-200 w-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-700">Online gebruikers</h2>
          <p className="text-sm text-gray-500">{allOnlineUsers.length} online</p>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {adminUsers.length > 0 && (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Administrators</h3>
              <ul className="space-y-1">
                {adminUsers.map(user => (
                  <MobileUserListItem key={user.id} user={user} />
                ))}
              </ul>
            </div>
          )}
          
          {creatorUsers.length > 0 && (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Creators</h3>
              <ul className="space-y-1">
                {creatorUsers.map(user => (
                  <MobileUserListItem key={user.id} user={user} />
                ))}
              </ul>
            </div>
          )}
          
          {vipUsers.length > 0 && (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">VIP</h3>
              <ul className="space-y-1">
                {vipUsers.map(user => (
                  <MobileUserListItem key={user.id} user={user} />
                ))}
              </ul>
            </div>
          )}
          
          {premiumUsers.length > 0 && (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Premium</h3>
              <ul className="space-y-1">
                {premiumUsers.map(user => (
                  <MobileUserListItem key={user.id} user={user} />
                ))}
              </ul>
            </div>
          )}
          
          {regularUsers.length > 0 && (
            <div className="p-2">
              <h3 className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Gebruikers</h3>
              <ul className="space-y-1">
                {regularUsers.map(user => (
                  <MobileUserListItem key={user.id} user={user} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface UserListItemProps {
  user: User;
}

function UserListItem({ user }: UserListItemProps) {
  return (
    <li className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50">
      <div className="relative mr-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
          <img 
            src={user.profilePicture || '/assets/default-avatar.png'} 
            alt={user.username}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/assets/default-avatar.png';
            }}
          />
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <p className="text-sm font-medium text-gray-800 truncate mr-1">
            {user.username}
          </p>
          <UserBadge role={user.isAdmin ? 'admin' : user.isCreator ? 'creator' : user.role} />
        </div>
        <p className="text-xs text-gray-500 truncate">
          {user.bio || 'Nog geen bio toegevoegd'}
        </p>
      </div>
    </li>
  );
}

function MobileUserListItem({ user }: UserListItemProps) {
  return (
    <li className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50">
      <div className="relative mr-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
          <img 
            src={user.profilePicture || '/assets/default-avatar.png'} 
            alt={user.username}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/assets/default-avatar.png';
            }}
          />
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <p className="text-sm font-medium text-gray-800 truncate mr-1">
            {user.username}
          </p>
          <UserBadge role={user.isAdmin ? 'admin' : user.isCreator ? 'creator' : user.role} />
        </div>
        <p className="text-xs text-gray-500 truncate">
          {user.bio || 'Nog geen bio toegevoegd'}
        </p>
      </div>
    </li>
  );
}