// User Management Types
export interface User {
  id: number;
  name: string;
  email: string;
  contact: string;
  isVerified: boolean;
  profileCompleted: boolean;
  rating: number;
  completedTasks: number;
  walletBalance?: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  roles?: string[];
  isAdmin?: boolean;
  canCreateTasks?: boolean;
  canAcceptTasks?: boolean;
}

// Task Management Types
export type PaymentStatus = 'pending' | 'verified' | 'failed' | 'expired' | 'refunded';
export type TaskStatus = 'draft' | 'posted' | 'claimed' | 'in_progress' | 'completed' | 'confirmed' | 'runner_paid' | 'cancelled' | 'rejected' | 'under_review';
export type Priority = 'standard' | 'urgent' | 'low';

export interface Task {
  id: number;
  taskId: string;
  timestamp: string;
  userName: string;
  userContact: string;
  createdByUserId: number;
  taskDescription: string;
  area: string;
  dateNeeded: string;
  budget: number;
  runnerAmount: number;
  platformFee: number;
  notes?: string;
  paymentStatus: PaymentStatus;
  taskStatus: TaskStatus;
  helperName?: string;
  helperContact?: string;
  helperEmail?: string;
  acceptedByUserId?: number;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  confirmedAt?: string;
  paidToRunnerAt?: string;
  termsAccepted: boolean;
  createdByUserName: string;
  createdByUserContact: string;
  createdByUserEmail: string;
}

// Authentication Types
export interface RegisterModel {
  name: string;
  email: string;
  contact: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface LoginModel {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  refreshToken?: string;
  expiration?: string;
}

export interface ChangePasswordModel {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Task Creation Types
export interface CreateTaskData {
  taskDescription: string;
  area: string;
  dateNeeded: string;
  budget: number;
  notes?: string;
  termsAccepted: boolean;
  priority: Priority;
}

export interface PaymentBreakdown {
  originalAmount: number;
  platformFee: number;
  runnerAmount: number;
  feePercentage: number;
}

export interface ClaimTaskData {
  helperName: string;
  helperContact: string;
}

// Payment Types
export interface PaymentRecord {
  id: number;
  taskId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  payFastPaymentId?: string;
  amountGross?: number;
  amountFee?: number;
  amountNet?: number;
  failureReason?: string;
  payFastData?: string;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
}

// User Preferences Types
export interface UserPreferences {
  id: number;
  userId: number;
  canCreateTasks: boolean;
  canAcceptTasks: boolean;
  taskCreatorNotifications: boolean;
  taskRunnerNotifications: boolean;
  paymentNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  minTaskAmount?: number;
  maxTaskAmount?: number;
  preferredCategories?: string;
  preferredLocations?: string;
  bankName?: string;
  accountNumber?: string;
  branchCode?: string;
  accountHolderName?: string;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface UserNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  taskId?: number;
  createdAt: string;
}

export interface NotificationPayload {
  type: 'task_claimed' | 'task_completed' | 'payment_received' | 'task_update';
  taskId?: string;
  title: string;
  body: string;
  data?: any;
}

// Wallet Types
export interface UserWallet {
  id: number;
  userId: number;
  availableBalance: number;
  escrowBalance: number;
  totalEarned: number;
  totalSpent: number;
  bankName?: string;
  accountNumber?: string;
  branchCode?: string;
  accountHolderName?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  data: T[];
  timestamp: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Filter Types
export interface TaskFilter {
  area?: string;
  minBudget?: number;
  maxBudget?: number;
  priority?: Priority;
  status?: TaskStatus;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

// PayFast Types
export interface PayFastConfig {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
}

// Errand type (for backward compatibility)
export interface Errand {
  _id: string;
  id?: number;
  title: string;
  description: string;
  area: string;
  price: number;
  runnerAmount?: number;
  platformFee?: number;
  status: TaskStatus;
  priority?: Priority;
  dateNeeded?: string;
  assignee?: {
    id: number;
    name: string;
    email: string;
  };
  poster?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}