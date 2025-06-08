import { User } from '../contexts/AuthContext';
import { Chat, Message } from '../contexts/ChatContext';

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@sexypraat.nl',
    firstName: 'Admin',
    lastName: 'User',
    birthDate: '1990-01-01',
    gender: 'male',
    profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    balance: 1000,
    roleId: 1,
    role: 'premium',
    isCreator: false,
    isAdmin: true,
    isVerified: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    username: 'jessica',
    email: 'jessica@sexypraat.nl',
    firstName: 'Jessica',
    lastName: 'Smith',
    birthDate: '1995-05-15',
    gender: 'female',
    profilePicture: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    balance: 500,
    roleId: 2,
    role: 'vip',
    isCreator: true,
    isVerified: true,
    createdAt: '2023-02-01T00:00:00Z'
  },
  {
    id: 3,
    username: 'mark',
    email: 'mark@example.com',
    firstName: 'Mark',
    lastName: 'Johnson',
    birthDate: '1988-09-23',
    gender: 'male',
    profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    balance: 250,
    roleId: 3,
    role: 'royal',
    isCreator: false,
    isVerified: true,
    createdAt: '2023-03-10T00:00:00Z'
  },
  {
    id: 4,
    username: 'emma',
    email: 'emma@sexypraat.nl',
    firstName: 'Emma',
    lastName: 'Wilson',
    birthDate: '1992-07-12',
    gender: 'female',
    profilePicture: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=150',
    balance: 750,
    roleId: 2,
    role: 'vip',
    isCreator: true,
    isVerified: true,
    createdAt: '2023-04-05T00:00:00Z'
  },
  {
    id: 5,
    username: 'david',
    email: 'david@example.com',
    firstName: 'David',
    lastName: 'Brown',
    birthDate: '1991-11-30',
    gender: 'male',
    profilePicture: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
    balance: 100,
    roleId: 4,
    role: 'user',
    isCreator: false,
    isVerified: true,
    createdAt: '2023-05-15T00:00:00Z'
  }
];

export const mockChats: Chat[] = [
  {
    id: 1,
    name: 'Geil',
    type: 'public',
    createdBy: 1,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Pikant',
    type: 'public',
    createdBy: 1,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Babes',
    type: 'public',
    createdBy: 1,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Jessica & Mark',
    type: 'private',
    createdBy: 2,
    isActive: true,
    createdAt: '2023-02-15T00:00:00Z'
  },
  {
    id: 5,
    name: 'Emma & David',
    type: 'private',
    createdBy: 4,
    isActive: true,
    createdAt: '2023-03-20T00:00:00Z'
  }
];

export const mockMessages: Message[] = [
  {
    id: 1,
    chatId: 1,
    userId: 1,
    text: 'Welkom bij de Geil chat!',
    isDeleted: false,
    createdAt: '2023-01-01T12:00:00Z'
  },
  {
    id: 2,
    chatId: 1,
    userId: 2,
    text: 'Hoi allemaal! 💋',
    isDeleted: false,
    createdAt: '2023-01-01T12:05:00Z'
  },
  {
    id: 3,
    chatId: 1,
    userId: 3,
    text: 'Hoi Jessica! Leuk je hier te zien.',
    isDeleted: false,
    createdAt: '2023-01-01T12:10:00Z'
  },
  {
    id: 4,
    chatId: 2,
    userId: 1,
    text: 'Welkom bij de Pikant chat!',
    isDeleted: false,
    createdAt: '2023-01-01T12:00:00Z'
  },
  {
    id: 5,
    chatId: 3,
    userId: 1,
    text: 'Welkom bij de Babes chat!',
    isDeleted: false,
    createdAt: '2023-01-01T12:00:00Z'
  },
  {
    id: 6,
    chatId: 4,
    userId: 2,
    text: 'Hoi Mark, leuk dat je me een bericht stuurt!',
    isDeleted: false,
    createdAt: '2023-02-15T14:30:00Z'
  },
  {
    id: 7,
    chatId: 4,
    userId: 3,
    text: 'Hoi Jessica! Ik vind je profiel erg interessant.',
    isDeleted: false,
    createdAt: '2023-02-15T14:35:00Z'
  },
  {
    id: 8,
    chatId: 5,
    userId: 4,
    text: 'Hoi David, welkom op mijn privéchat.',
    isDeleted: false,
    createdAt: '2023-03-20T18:00:00Z'
  },
  {
    id: 9,
    chatId: 5,
    userId: 5,
    text: 'Dank je, Emma! Leuk om met je te chatten.',
    isDeleted: false,
    createdAt: '2023-03-20T18:05:00Z'
  }
];

export const mockRoles = [
  {
    id: 1,
    name: 'Premium',
    description: 'Premium gebruiker met extra voordelen',
    priceMonthly: 2.04,
    priceYearly: 24.48,
    features: [
      'Andere gebruikers blokkeren',
      'Opvallende Premium-badge',
      'Bovenaan in de online lijst',
      'Max. 2 privé groepen aanmaken',
      'Audio- en videogesprekken met iedereen'
    ]
  },
  {
    id: 2,
    name: 'VIP',
    description: 'VIP gebruiker met exclusieve voordelen',
    priceMonthly: 3.29,
    priceYearly: 39.48,
    features: [
      'Exclusieve VIP-badge',
      'Extra galerijfoto\'s',
      'Andere lettertypes',
      'Eigen profielbanner',
      'Tot 5 privé groepen',
      'Unieke chatachtergronden',
      'Alles van Premium'
    ]
  },
  {
    id: 3,
    name: 'Royal',
    description: 'Royal gebruiker met alle voordelen',
    priceMonthly: 4.15,
    priceYearly: 49.80,
    features: [
      'Royal-badge',
      'Aangepaste berichtstijl',
      'Onbeperkte privé groepen',
      'Upload je eigen chatachtergrond',
      'Advertentievrij gebruik',
      'Alles van VIP & Premium'
    ]
  }
];