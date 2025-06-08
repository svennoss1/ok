# SexyPraat Platform

A modern chat and social platform built with React, TypeScript, and a custom PHP/MySQL backend.

## 🚀 Features

### User Management
- Secure authentication system with email/password
- Robust session management for persistent logins.
- User profiles with customizable details:
  - Profile picture and banner image
  - Personal information (name, gender, birth date)
  - Role-based access (premium, vip, royal, user)
- Age verification system
- Creator/Admin privileges
- Account verification status

### Chat System
- Public chat rooms
- Private messaging capabilities.
- Real-time messaging
- User presence indicators
- Chat sidebar with room navigation
- Users sidebar showing online members

### Monetization
- Subscription system with different tiers:
  - Premium
  - VIP
  - Royal
- Balance management system
- Payment processing

### Additional Features
- Notification system
- Settings management
- Profile customization
- Responsive design
- Dark/Light mode support

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Language**: TypeScript 5.5.3
- **Routing**: React Router DOM 6.22.3
- **State Management**: 
  - Zustand 4.5.2 (Client state)
  - TanStack Query 5.24.1 (Server state)
- **Forms**: React Hook Form 7.50.0
- **Validation**: Zod 3.22.4
- **Styling**: 
  - TailwindCSS 3.4.1
  - PostCSS 8.4.35
- **UI Components**:
  - Lucide React 0.344.0 (Icons)
  - Framer Motion 11.2.0 (Animations)
- **Build Tool**: Vite 5.4.2

### Backend
- **Language**: PHP 8.x
- **Database**: MySQL (managed via phpMyAdmin)
- **Authentication**: Custom PHP API (bcrypt for password hashing)
- **API**: Custom RESTful PHP endpoints

## 📁 Project Structure

```
project/
├── api/                 # PHP Backend API endpoints
│   ├── sessions_tmp/    # Session storage
│   └── uploads/         # Uploaded profile/banner images
├── src/
│   ├── components/
│   │   ├── chat/          # Chat-related components
│   │   ├── layout/        # Layout components
│   │   └── modals/        # Modal components
│   ├── contexts/
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── ChatContext.tsx    # Chat state
│   ├── pages/
│   │   ├── ChatPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── ...
│   ├── services/          # API services
│   ├── lib/              # Utility functions
│   └── data/             # Static data
└── public/              # Static assets
```

## 🔒 Security Features

- Secure password hashing with bcryptjs
- Age verification system
- Protected routes
- Robust PHP-based session management

## 💻 Development

### Prerequisites
- Node.js (Latest LTS version)
- npm or yarn
- PHP 8.x
- MySQL

### Setup
1. Clone the repository
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. **Backend Setup (PHP/MySQL)**:
   - Ensure you have a PHP 8.x environment with MySQL.
   - Import your database schema into your MySQL database (details on schema provided separately).
   - Configure `api/db-config.php` with your database credentials.
   - Ensure the `api/sessions_tmp` and `api/uploads` directories have write permissions for the web server.

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint checks

## 🌐 Deployment

The frontend application is built using Vite and can be deployed to any static hosting service. The backend is a PHP application and needs to be deployed on a server that supports PHP and MySQL (e.g., Apache with PHP-FPM).

### Build Process (Frontend)
1. Run `npm run build`
2. The built frontend files will be in the `dist` directory
3. Deploy the contents of `dist` to your static hosting service (e.g., root of your domain).

### Backend Deployment (PHP/MySQL)
1. Upload the entire `api/` directory to your web server (e.g., `public_html/api/` or `www/api/`).
2. Ensure `api/sessions_tmp` and `api/uploads` directories have appropriate write permissions (e.g., 755 or 775 depending on your server).
3. Your `.htaccess` file should be configured to handle routing for the React frontend and direct API requests to the `api/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🔧 Support

For support, please contact the development team or raise an issue in the repository. 