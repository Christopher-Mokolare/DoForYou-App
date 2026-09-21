export interface User {
  id: number;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phoneNumber: string;
  contact?: string;
  address?: string;
  idNumber?: string;
  username?: string;
  dateOfBirth?: string;
  userType: 'creator' | 'runner' | 'both';
  isVerified: boolean;
  profileCompleted: boolean;
  profileCompletion?: number;
  rating: number;
  completedTasks: number;
  roles?: string;
  isAdmin?: boolean;
  canCreateTasks?: boolean;
  canAcceptTasks?: boolean;
  walletBalance?: number;
  createdAt: string;
  lastLoginAt?: string;
}

export type PaymentStatus = 'Pending' | 'EscrowHeld' | 'EscrowReleased' | 'PayoutPending' | 'Processing' | 'RunnerPaid' | 'PayoutReturned' | 'PayoutCancelled' | 'PayoutFailed' | 'DisputePending' | 'RefundPending' | 'Refunded' | 'Failed' | 'Expired';
export type TaskStatus = 'PendingPayment' | 'Posted' | 'Claimed' | 'InProgress' | 'Completed' | 'Confirmed' | 'RunnerPaid' | 'PayoutPending' | 'PayoutFailed' | 'DisputePending' | 'RefundPending' | 'Cancelled' | 'pending' | 'posted' | 'claimed' | 'in_progress' | 'completed' | 'confirmed' | 'cancelled';
export type Priority = 'Standard' | 'Urgent' | 'Low' | 'standard' | 'urgent' | 'low';

export interface Task {
  id: number;
  taskId: string;
  userName: string;
  userContact: string;
  createdByUserId: number;
  createdByUserName?: string;
  taskTitle?: string;
  title?: string;
  description?: string;
  taskDescription: string;
  category: string;
  area: string;
  dateNeeded: string;
  budget: number;
  notes?: string;
  paymentStatus: PaymentStatus;
  taskStatus: TaskStatus;
  helperName?: string;
  helperContact?: string;
  payoutAmount?: number;
  escrowStatus?: string;
  canConfirm?: boolean;
  canDispute?: boolean;
  acceptedByUserId?: number;
  createdByUser?: User;
  acceptedByUser?: User;
  runnerId?: number;
  runnerName?: string;
  runnerContact?: string;
  priority: Priority;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  progressUpdates?: ProgressUpdate[];
  canEdit?: boolean;
  canComplete?: boolean;
  canCancel?: boolean;
  posterName?: string;
  posterRating?: number;
  status?: string;
}

export interface ProgressUpdate { id: number; message: string; timestamp: string; userId: number; userName: string; }
export interface TaskMessage { id: number; taskId: string; senderId: number; senderName: string; content: string; timestamp: string; isRead: boolean; isCurrentUser?: boolean; }

export interface RegisterModel {
  firstName: string; lastName: string; email: string; password: string; phoneNumber: string;
  userType: 'creator' | 'runner' | 'both'; address: string; idNumber: string;
}
export interface LoginModel { email: string; password: string; }
export interface AuthResponse { success: boolean; message: string; user?: User; token?: string; refreshToken?: string; }
export interface ChangePasswordModel { currentPassword: string; newPassword: string; }
export interface CreateTaskData {
  taskDescription: string;
  title?: string;
  category: string;
  area: string;
  dateNeeded: string;
  budget: number;
  notes?: string;
  priority: Priority;
  termsAccepted?: boolean;
}
export interface ClaimTaskData { helperName: string; helperContact: string; termsAccepted?: boolean; }

export interface PaymentRecord { taskId: string; amount: number; status: string; date: string; description: string; }
export interface UserPreferences {
  canCreateTasks: boolean; canAcceptTasks: boolean; taskCreatorNotifications: boolean; taskRunnerNotifications: boolean;
  paymentNotifications: boolean; emailNotifications: boolean; smsNotifications: boolean;
  minTaskAmount?: number; maxTaskAmount?: number; preferredCategories?: string[]; preferredLocations?: string[];
  bankName?: string; accountNumber?: string; branchCode?: string; accountHolderName?: string;
}
export interface UserNotification {
  id: number; type: string; title: string; message: string; isRead: boolean; createdAt: string;
  relatedTaskId?: number; relatedTaskStringId?: string; taskId?: string;
}
export interface UserWallet { available: number; availableBalance: number; pendingPayouts: number; totalEarned: number; totalWithdrawn: number; }
export interface WalletTransaction { id: number; amount: number; transactionType: 'credit' | 'debit'; status: string; description: string; reference: string; createdAt: string; }
export interface WithdrawalRequest { amount: number; bankAccount: string; bankName: string; accountHolder: string; branchCode?: string; accountType?: string; }
export interface BankDetails { bankName: string; accountNumber: string; branchCode: string; accountHolderName: string; }
export interface TaskRating { rating: number; comment?: string; }
export interface TaskAppeal { id: number; taskId: number; reason: string; status: 'pending' | 'approved' | 'rejected'; adminResponse?: string; createdAt: string; }
export interface AuditLog { id: number; action: string; description: string; createdAt: string; }
export interface ForgotPasswordModel { email: string; }
export interface ResetPasswordModel { token: string; email: string; newPassword: string; }
export interface EmailVerificationModel { token: string; email: string; }

export interface PaginatedResponse<T> { success: boolean; count: number; page: number; pageSize: number; totalPages: number; tasks?: T[]; data?: T[]; }
export interface ApiResponse<T> { success: boolean; message?: string; data?: T; }
export interface DashboardStats { postedTasks: number; activeTasks: number; completedTasks: number; totalEarnings: number; }
export interface TaskFilter { search?: string; searchTerm?: string; category?: string; area?: string; minBudget?: number; maxBudget?: number; priority?: Priority; }
export type Errand = Task;
