import { Crown, Award, Shield, Heart } from 'lucide-react';

interface UserBadgeProps {
  role: 'admin' | 'creator' | 'vip' | 'premium' | 'royal' | 'user';
  size?: 'xs' | 'sm' | 'md';
}

export default function UserBadge({ role, size = 'sm' }: UserBadgeProps) {
  const getSize = () => {
    switch (size) {
      case 'xs':
        return 'text-[10px] py-0.5 px-1.5';
      case 'sm':
        return 'text-xs py-0.5 px-1.5';
      case 'md':
        return 'text-sm py-1 px-2';
      default:
        return 'text-xs py-0.5 px-1.5';
    }
  };
  
  const getIconSize = () => {
    switch (size) {
      case 'xs':
        return 10;
      case 'sm':
        return 12;
      case 'md':
        return 14;
      default:
        return 12;
    }
  };
  
  // Don't render badge for regular users
  if (role === 'user') return null;
  
  let badgeClass = '';
  let label = '';
  let icon = null;
  
  switch (role) {
    case 'admin':
      badgeClass = 'badge-admin';
      label = 'Admin';
      icon = <Shield size={getIconSize()} className="mr-0.5" />;
      break;
    case 'creator':
      badgeClass = 'badge-creator';
      label = 'Creator';
      icon = <Heart size={getIconSize()} className="mr-0.5" />;
      break;
    case 'vip':
      badgeClass = 'badge-vip';
      label = 'VIP';
      icon = <Award size={getIconSize()} className="mr-0.5" />;
      break;
    case 'premium':
      badgeClass = 'badge-premium';
      label = 'Premium';
      icon = null;
      break;
    case 'royal':
      badgeClass = 'badge-royal';
      label = 'Royal';
      icon = <Crown size={getIconSize()} className="mr-0.5" />;
      break;
    default:
      return null;
  }
  
  return (
    <span className={`badge ${badgeClass} ${getSize()} flex items-center`}>
      {icon}
      {label}
    </span>
  );
}