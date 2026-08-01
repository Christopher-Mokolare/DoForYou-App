import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { userAPI, paymentAPI } from '../services/api';
import { commonStyles, colors } from '../styles/commonStyles';
import { UserWallet, PaymentRecord } from '../types';

interface Props {
  navigation: any;
}

const WalletScreen: React.FC<Props> = ({ navigation }) => {
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [transactions, setTransactions] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [walletData, transactionData] = await Promise.all([
        userAPI.getWallet(),
        paymentAPI.getPaymentHistory()
      ]);
      setWallet(walletData);
      setTransactions(transactionData || []);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      Alert.alert('Error', 'Failed to load wallet data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWalletData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTransactionIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'failed': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getTransactionColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return colors.success;
      case 'pending': return colors.warning;
      case 'failed': return colors.error;
      default: return colors.text;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 16, color: colors.text }}>Loading wallet...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>My Wallet</Text>
        <TouchableOpacity onPress={() => navigation.navigate('BankDetails')}>
          <Ionicons name="card" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={commonStyles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {wallet && (
          <View style={commonStyles.walletCard}>
            <View style={styles.balanceHeader}>
              <Text style={commonStyles.walletTitle}>Available Balance</Text>
              <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
                <Ionicons name="refresh" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={commonStyles.walletBalance}>R{wallet.availableBalance.toFixed(2)}</Text>
            
            <View style={commonStyles.walletStats}>
              <View style={commonStyles.walletStat}>
                <Text style={commonStyles.walletStatLabel}>💰 Total Earned</Text>
                <Text style={[commonStyles.walletStatValue, { color: colors.success }]}>R{wallet.totalEarned.toFixed(2)}</Text>
              </View>
              <View style={commonStyles.walletStat}>
                <Text style={commonStyles.walletStatLabel}>💳 Total Spent</Text>
                <Text style={[commonStyles.walletStatValue, { color: colors.error }]}>R{wallet.totalSpent.toFixed(2)}</Text>
              </View>
            </View>

            {wallet.escrowBalance > 0 && (
              <View style={styles.escrowInfo}>
                <Ionicons name="lock-closed" size={16} color={colors.warning} />
                <Text style={styles.escrowText}>
                  R{wallet.escrowBalance.toFixed(2)} in escrow (pending tasks)
                </Text>
              </View>
            )}
            
            <View style={styles.lastUpdated}>
              <Text style={styles.lastUpdatedText}>
                Last updated: {new Date().toLocaleTimeString()}
              </Text>
            </View>
          </View>
        )}

        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Recent Transactions</Text>
          
          {transactions.length === 0 ? (
            <View style={commonStyles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color={colors.textLight} />
              <Text style={commonStyles.emptyStateText}>No transactions yet</Text>
            </View>
          ) : (
            transactions.map((transaction) => (
              <View key={transaction.id} style={commonStyles.transactionItem}>
                <View style={commonStyles.transactionIcon}>
                  <Ionicons 
                    name={getTransactionIcon(transaction.status)} 
                    size={24} 
                    color={getTransactionColor(transaction.status)} 
                  />
                </View>
                <View style={commonStyles.transactionDetails}>
                  <Text style={commonStyles.transactionMethod}>
                    {transaction.paymentMethod} {transaction.paymentMethod === 'Task Earning' ? '💰' : '💳'}
                  </Text>
                  <Text style={commonStyles.transactionDate}>{formatDate(transaction.createdAt)}</Text>
                  <Text style={[commonStyles.transactionStatus, { color: getTransactionColor(transaction.status) }]}>
                    {transaction.status.toUpperCase()}
                  </Text>
                </View>
                <View style={commonStyles.transactionAmount}>
                  <Text style={[commonStyles.transactionAmountText, {
                    color: transaction.paymentMethod === 'Task Earning' ? colors.success : colors.error
                  }]}>
                    {transaction.paymentMethod === 'Task Earning' ? '+' : '-'}R{transaction.amount.toFixed(2)}
                  </Text>
                  {transaction.amountNet && transaction.amountNet !== transaction.amount && (
                    <Text style={commonStyles.transactionNet}>
                      Net: R{transaction.amountNet.toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[commonStyles.secondaryButton, styles.actionButton]}
            onPress={() => navigation.navigate('BankDetails')}
          >
            <Ionicons name="card-outline" size={20} color={colors.primary} />
            <Text style={commonStyles.secondaryButtonText}>Bank Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[commonStyles.primaryButton, styles.actionButton]}
            onPress={() => {
              if (!wallet || wallet.availableBalance <= 0) {
                Alert.alert('No Balance', 'You have no available balance to withdraw.');
                return;
              }
              Alert.alert(
                'Withdraw Funds',
                `Available balance: R${wallet.availableBalance.toFixed(2)}

To withdraw funds, please ensure your bank details are up to date.`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Update Bank Details', onPress: () => navigation.navigate('BankDetails') },
                  { 
                    text: 'Request Withdrawal', 
                    onPress: async () => {
                      try {
                        const result = await paymentAPI.requestWithdrawal(wallet.availableBalance, {});
                        Alert.alert(result.success ? 'Success' : 'Error', result.message);
                        if (result.success) {
                          loadWalletData(); // Refresh wallet data
                        }
                      } catch (error) {
                        Alert.alert('Error', 'Failed to request withdrawal. Please try again.');
                      }
                    }
                  }
                ]
              );
            }}
          >
            <Ionicons name="cash-outline" size={20} color={colors.white} />
            <Text style={commonStyles.primaryButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  balanceHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  refreshButton: {
    padding: 4,
  },
  escrowInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 8,
  },
  escrowText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.warning,
    fontWeight: '500' as const,
  },
  lastUpdated: {
    marginTop: 12,
    alignItems: 'center' as const,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic' as const,
  },
  actionButtons: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 8,
  },
};

export default WalletScreen;