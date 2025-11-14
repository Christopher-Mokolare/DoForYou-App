# DoForYou React Native App

A comprehensive task/errand marketplace mobile application built with React Native and Expo, connecting users who need tasks completed with service providers.

## 🚀 Features Implemented

### ✅ Core Features
- **Complete Authentication System** with JWT tokens and secure storage
- **Redux State Management** with persistence
- **Real-time Communication** via SignalR
- **Task Management** with filtering, search, and status tracking
- **Payment Integration** with PayFast (South African payment gateway)
- **User Preferences** and profile management
- **Push Notifications** system ready
- **Admin Dashboard** for system management
- **Offline Support** with data caching

### ✅ Architecture
- **C# .NET API Integration** - Compatible with existing Angular web app
- **Shared PostgreSQL Database** - Same database as web application
- **TypeScript** throughout the application
- **Modern React Native** with hooks and functional components
- **Secure Token Storage** using Keychain/Keystore
- **Comprehensive Error Handling**

## 🏗️ Project Structure

```
DoForYouApp/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── PostErrandScreen.tsx
│   │   ├── MyErrandsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── TaskFiltersScreen.tsx
│   │   ├── PaymentScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │   ├── UserPreferencesScreen.tsx
│   │   └── AdminDashboardScreen.tsx
│   ├── services/           # API services
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   ├── tasksService.ts
│   │   ├── userService.ts
│   │   ├── paymentService.ts
│   │   ├── signalRService.ts
│   │   ├── notificationsService.ts
│   │   └── adminService.ts
│   ├── store/              # Redux store
│   │   ├── index.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── tasksSlice.ts
│   │       ├── userSlice.ts
│   │       └── notificationsSlice.ts
│   ├── context/            # React Context
│   │   └── AuthContext.tsx
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── config/             # Configuration
│   │   └── api.ts
│   ├── utils/              # Utility functions
│   │   └── tokenStorage.ts
│   └── hooks/              # Custom hooks
│       └── useSignalR.ts
└── App.tsx                 # Main app component
```

## 🛠️ Technology Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **Expo Linear Gradient** for UI
- **React Hook Form** for forms
- **Date-fns** for date handling

### Backend Integration
- **C# .NET API** (same as Angular web app)
- **PostgreSQL Database** (shared with web app)
- **SignalR** for real-time communication
- **JWT Authentication**
- **PayFast Payment Gateway**

### Security & Storage
- **React Native Keychain** for secure token storage
- **AsyncStorage** for app data
- **Redux Persist** for state persistence
- **Axios Interceptors** for automatic token refresh

## 📱 Screens Overview

### Authentication Flow
- **LoginScreen** - User authentication with gradient design
- **RegisterScreen** - New user registration

### Main Application
- **HomeScreen** - Browse available tasks with search and filters
- **PostErrandScreen** - Create new tasks with payment integration
- **MyErrandsScreen** - View user's posted and claimed tasks
- **ProfileScreen** - User profile and settings

### Advanced Features
- **TaskFiltersScreen** - Comprehensive task filtering
- **PaymentScreen** - PayFast payment integration with WebView
- **NotificationsScreen** - Real-time notifications management
- **UserPreferencesScreen** - User settings and bank details
- **AdminDashboardScreen** - Admin system overview

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v20.19.4 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator
- C# .NET Backend running on localhost:5015

### Installation

1. **Install dependencies:**
```bash
cd DoForYouApp
npm install
# or run the installation script
npm run install-deps
```

2. **Configure API endpoints:**
Edit `src/config/api.ts` to match your backend URL:
```typescript
export const API_CONFIG = {
  baseUrl: 'http://localhost:5015', // Your C# .NET API URL
  apiKey: 'DFY_63c6ee01-0ba6-49e1-9f67-4b752c523267'
};
```

3. **Start the development server:**
```bash
npm start
```

4. **Run on device/simulator:**
```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

## 🔐 Authentication & Security

### JWT Token Management
- Secure storage using Keychain (iOS) / Keystore (Android)
- Automatic token refresh on expiration
- Proper logout and token cleanup

### API Security
- All requests include API key header
- Bearer token authentication
- Automatic retry on 401 errors
- Certificate pinning ready for production

## 🔄 Real-time Features

### SignalR Integration
- Real-time task status updates
- Live notifications
- Cross-platform synchronization with web app
- Automatic reconnection handling

### Supported Events
- `TaskStatusUpdated` - Task status changes
- `NewTaskPosted` - New tasks available
- `TaskClaimed` - Task claimed by user
- `NotificationReceived` - New notifications
- `PaymentStatusUpdated` - Payment confirmations

## 💳 Payment Integration

### PayFast Support
- South African payment gateway integration
- WebView-based payment flow
- Payment status tracking
- Transaction history

### Payment Flow
1. User selects task to pay for
2. App generates PayFast payment URL
3. WebView opens PayFast payment page
4. Payment completion redirects to app
5. Payment status updated via webhook

## 📊 State Management

### Redux Store Structure
```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean
  },
  tasks: {
    availableTasks: Task[],
    userTasks: Task[],
    filters: TaskFilter,
    pagination: PaginationInfo
  },
  user: {
    profile: User | null,
    preferences: UserPreferences | null,
    wallet: UserWallet | null
  },
  notifications: {
    notifications: UserNotification[],
    unreadCount: number
  }
}
```

## 🎨 UI/UX Design

### Design System
- **Primary Color:** #ff6b35 (Orange)
- **Gradient:** ['#ff6b35', '#ff8c42', '#ffa726']
- **Typography:** System fonts with proper hierarchy
- **Icons:** Ionicons from Expo Vector Icons

### Key Design Elements
- Gradient backgrounds for auth screens
- Card-based layouts for content
- Consistent button styling
- Proper loading states
- Error handling with user feedback

## 🔧 Configuration

### Environment Variables
Create `.env` file in project root:
```
API_BASE_URL=http://localhost:5015
PAYFAST_MERCHANT_ID=your_merchant_id
PAYFAST_MERCHANT_KEY=your_merchant_key
```

### Deep Linking
Configure for payment redirects:
```
doforyou://payment/success
doforyou://payment/cancel
```

## 🧪 Testing

### Available Scripts
```bash
npm test           # Run tests
npm run test:watch # Watch mode
npm run test:coverage # Coverage report
```

### Testing Strategy
- Unit tests for Redux slices
- Integration tests for API services
- Component testing with React Native Testing Library
- E2E testing with Detox (planned)

## 📦 Build & Deployment

### Development Build
```bash
expo build:android
expo build:ios
```

### Production Build
```bash
eas build --platform all
```

### App Store Deployment
- Configure app signing
- Set up CI/CD pipeline
- Configure crash reporting
- Set up analytics

## 🔮 Future Enhancements

### Planned Features
- **Biometric Authentication** - Fingerprint/Face ID
- **Camera Integration** - Photo uploads for task verification
- **Location Services** - GPS-based task filtering
- **Push Notifications** - Firebase Cloud Messaging
- **Offline Mode** - Enhanced offline capabilities
- **Chat System** - In-app messaging between users

### Performance Optimizations
- Image optimization and caching
- Bundle size optimization
- Memory usage optimization
- Network request optimization

## 🤝 Integration with Web App

### Shared Resources
- **Same Database** - PostgreSQL database shared with Angular web app
- **Same API** - C# .NET backend serves both applications
- **Real-time Sync** - SignalR ensures data consistency
- **User Accounts** - Users can switch between web and mobile seamlessly

### Cross-Platform Features
- Login on web, continue on mobile
- Real-time updates across platforms
- Shared notification system
- Consistent user experience

## 📞 Support

### Contact Information
- **Email:** info@doforyou.co.za
- **Phone:** 0795258611
- **WhatsApp:** +27795258611

### Documentation
- API Documentation: Available in backend project
- Component Documentation: Storybook (planned)
- User Guide: In-app help system (planned)

---

**DoForYou React Native App** - Connecting people through tasks, built with modern technology and best practices.