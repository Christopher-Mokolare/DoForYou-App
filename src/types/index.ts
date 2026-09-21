export interface User {
  id: number; firstName: string; lastName: string; name?: string; email: string; phoneNumber: string;
  contact?: string; address?: string; idNumber?: string; username?: string; dateOfBirth?: string;
  userType: 'creator' | 'runner' | 'both'; isVerified: boolean; profileCompleted: boolean;
  profileCompletion?: number; rating: number; completedTasks: number; roles?: string; isAdmin?: boolean;
  canCreateTasks?: boolean; canAcceptTasks?: boolean; createdAt: string; lastLoginAt?: string;
}
export type PaymentStatus = 'Pending' | 'EscrowHeld' | 'EscrowReleased' | 'Completed' | 'PayoutPending' | 'Processing' | 'RunnerPaid' | 'PayoutReturned' | 'PayoutCancelled' | 'PayoutFailed' | 'DisputePending' | 'RefundPending' | 'Refunded' | 'Failed' | 'Expired' | 'pending' | 'verified' | 'failed' | 'expired' | 'refunded' | 'escrow_held';
export type TaskStatus = 'PendingPayment' | 'Posted' | 'Claimed' | 'InProgress' | 'Completed' | 'Confirmed' | 'RunnerPaid' | 'PayoutPending' | 'PayoutFailed' | 'DisputePending' | 'RefundPending' | 'Cancelled' | 'draft' | 'posted' | 'claimed' | 'in_progress' | 'completed' | 'confirmed' | 'runner_paid' | 'cancelled' | 'disputed' | 'payout_pending' | 'refund_pending' | 'PayoutReturned' | 'PayoutCancelled' | 'Processing' | 'AwaitingFunds' | 'AwaitingBankDetails';
export type Priority = 'Standard' | 'Urgent' | 'Low' | 'Medium' | 'High' | 'standard' | 'urgent' | 'low' | 'medium' | 'high';
export interface Task {
  id:number; taskId:string; timestamp?:string; userName:string; userContact:string; createdByUserId:number;
  taskName?:string; taskTitle?:string; title?:string; description?:string; taskDescription:string; category:string; area:string;
  dateNeeded:string; budget:number; notes?:string; paymentStatus:PaymentStatus; taskStatus:TaskStatus;
  helperName?:string; helperContact?:string; helperEmail?:string; acceptedByUserId?:number; priority:Priority;
  createdAt:string; updatedAt?:string; completedAt?:string; payoutAmount?:number; payoutStatus?:string; payoutReference?:string; payoutInitiatedAt?:string; payoutCompletedAt?:string; escrowStatus?:string;
  escrowHoldUntil?:string; canAccept?:boolean; canConfirm?:boolean; canDispute?:boolean; canEdit?:boolean; canComplete?:boolean;
  canCancel?:boolean; createdByUser?:User; acceptedByUser?:User; runnerId?:number; runnerName?:string; runnerContact?:string;
  posterName?:string; posterRating?:number; status?:string;
}
export interface ProgressUpdate { id:number; message:string; timestamp:string; userId:number; userName:string; }
export interface TaskMessage { id:number; taskId:string; senderId:number; senderName:string; content:string; timestamp:string; isRead:boolean; isCurrentUser?:boolean; isSystem?:boolean; }
export interface TaskConversation { id:number; taskId:string; title:string; description:string; taskStatus:TaskStatus|string; chatClosed:boolean; completedAt?:string; participantName:string; participantId?:number; lastMessage?:string; lastMessageAt?:string; unreadCount:number; }
export interface RegisterModel { firstName:string; lastName:string; email:string; password:string; phoneNumber:string; userType:'creator'|'runner'|'both'; address:string; idNumber?:string; dateOfBirth?:string; }
export interface LoginModel { email:string; password:string; }
export interface AuthResponse { success:boolean; message:string; user?:User; token?:string; refreshToken?:string; expiration?:string; }
export interface ChangePasswordModel { currentPassword:string; newPassword:string; }
export interface CreateTaskData { taskName:string; taskDescription:string; category:string; area:string; dateNeeded:string; budget:number; notes?:string; priority:Priority; termsAccepted:boolean; }
export interface ClaimTaskData { helperName:string; helperContact:string; termsAccepted:boolean; }
export interface UserPreferences { canCreateTasks:boolean; canAcceptTasks:boolean; taskCreatorNotifications:boolean; taskRunnerNotifications:boolean; paymentNotifications:boolean; emailNotifications:boolean; smsNotifications:boolean; minTaskAmount?:number; maxTaskAmount?:number; preferredCategories?:string[]; preferredLocations?:string[]; bankName?:string; accountNumber?:string; branchCode?:string; accountHolderName?:string; }
export interface UserNotification { id:number; type:string; title:string; message:string; isRead:boolean; createdAt:string; relatedTaskId?:number; relatedTaskStringId?:string; taskId?:string; }
export interface BankAccount { id:number; bankName:string; accountNumber:string; accountHolderName:string; accountType:string; branchCode:string; isVerified:boolean; isDefault:boolean; }
export interface TaskRating { rating:number; comment?:string; }
export interface TaskAppeal { id:number; taskId:string; reason:string; status:'pending'|'approved'|'rejected'; adminResponse?:string; createdAt:string; }
export interface AuditLog { id:number; action:string; description:string; createdAt:string; }
export interface ForgotPasswordModel { email:string; }
export interface ResetPasswordModel { token:string; email:string; newPassword:string; }
export interface EmailVerificationModel { token:string; email:string; }
export interface TaskFilter { search?:string; searchTerm?:string; category?:string; area?:string; minBudget?:number; maxBudget?:number; priority?:Priority; }
export interface DashboardStats { totalUsers:number; totalTasks:number; activeTasks:number; completedTasks:number; totalRevenue:number; pendingPayments:number; [key:string]: number; }
export type Errand = Task;
