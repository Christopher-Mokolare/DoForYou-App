import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#ff6b35',
  primaryLight: '#ff8c42',
  primaryDark: '#e55a2b',
  secondary: '#ffa726',
  background: '#f8f9fa',
  white: '#ffffff',
  black: '#000000',
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#e9ecef',
  success: '#28a745',
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  bodySecondary: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    color: colors.textLight,
  },
};

export const commonStyles = Object.assign(StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex1: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },

  // Headers
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h4,
    fontSize: 18,
  },

  // Typography
  title: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  subtitle: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },

  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    ...typography.h4,
    marginBottom: spacing.md,
  },

  // Buttons
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: spacing.sm,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },

  // Inputs
  inputContainer: {
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  // Task styles
  taskItem: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  taskArea: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  taskBudget: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    marginBottom: 4,
  },
  taskHelper: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 4,
  },

  // Payment styles
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  totalRow: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    marginTop: spacing.sm,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  fee: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
  },

  // Rating styles
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  starButton: {
    marginHorizontal: spacing.sm,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  // Confirmation buttons
  confirmButton: {
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    marginVertical: spacing.sm,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  rejectButton: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: 12,
    marginVertical: spacing.sm,
  },
  rejectButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },

  // Wallet styles
  walletCard: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    borderRadius: 12,
    marginBottom: spacing.xl,
  },
  walletTitle: {
    color: colors.white,
    fontSize: 16,
    opacity: 0.9,
  },
  walletBalance: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: spacing.sm,
  },
  walletStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  walletStat: {
    flex: 1,
  },
  walletStatLabel: {
    color: colors.white,
    fontSize: 12,
    opacity: 0.8,
  },
  walletStatValue: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  // Transaction styles
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionIcon: {
    width: 40,
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  transactionMethod: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  transactionNet: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },

  // Info cards
  infoCard: {
    backgroundColor: '#e3f2fd',
    padding: spacing.lg,
    borderRadius: 12,
    marginVertical: spacing.sm,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },

  // Warning cards
  warningCard: {
    backgroundColor: '#fff3e0',
    padding: spacing.lg,
    borderRadius: 12,
    marginVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 20,
  },

  // Empty states
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: spacing.lg,
  },

  // Character count
  characterCount: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
    marginTop: spacing.xs,
  },

  // Utility
  shadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
}), { colors });

export const screenWidth = width;
export const screenHeight = height;