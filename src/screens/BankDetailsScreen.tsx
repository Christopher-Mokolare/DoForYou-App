import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { bankingAPI } from '../services/api';
import { commonStyles, colors } from '../styles/commonStyles';

export default function BankDetailsScreen({ navigation }: any) {
  const [banks, setBanks] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ accountNumber: '', accountHolderName: '', accountType: 'Savings' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [b, a] = await Promise.all([bankingAPI.getBanks(), bankingAPI.getAccounts()]);
      setBanks(b); setAccounts(a);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Unable to load banking details.');
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!selected || !form.accountNumber || !form.accountHolderName) {
      Alert.alert('Required', 'Select a bank and complete the account details.'); return;
    }
    setSaving(true);
    try {
      await bankingAPI.addAccount({
        ...form,
        bankGroupId: selected.bankGroupId,
        bankName: selected.name,
        branchCode: selected.branchCode,
      });
      Alert.alert('Success', 'Bank account added. It must be verified before runner payouts can be released.', [
        { text: 'OK', onPress: async () => { await load(); navigation.goBack(); } }
      ]);
      setForm({ accountNumber: '', accountHolderName: '', accountType: 'Savings' });
      setSelected(null);
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to add bank account.');
    } finally { setSaving(false); }
  };

  if (loading) return <SafeAreaView style={commonStyles.container}><View style={commonStyles.centerContent}><ActivityIndicator size="large" color={colors.primary} /></View></SafeAreaView>;

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.primary} /></TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Bank Accounts</Text><View style={{ width: 24 }} />
      </View>
      <ScrollView style={commonStyles.content}>
        <View style={commonStyles.infoCard}>
          <Ionicons name="shield-checkmark" size={24} color={colors.success} />
          <Text style={commonStyles.infoText}>Verified bank accounts are used for direct runner payouts. The retired wallet withdrawal flow is not used.</Text>
        </View>
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Your accounts</Text>
          {accounts.length === 0 ? <Text style={{ color: colors.text }}>No bank accounts added yet.</Text> :
            accounts.map(a => <View key={a.id} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <Text style={{ fontWeight: '700', color: '#333' }}>{a.bankName}</Text>
              <Text style={{ color: '#666', marginTop: 4 }}>{a.accountHolderName} · {a.accountNumber}</Text>
              <Text style={{ color: a.isVerified ? colors.success : colors.warning, marginTop: 4 }}>{a.isVerified ? '✓ Verified' : 'Verification required'}</Text>
            </View>)}
        </View>
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Add bank account</Text>
          <Text style={commonStyles.label}>Bank</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>{banks.map(b =>
              <TouchableOpacity key={b.bankGroupId} onPress={() => setSelected(b)} style={{ padding: 10, borderWidth: 1, borderColor: selected?.bankGroupId === b.bankGroupId ? colors.primary : '#ddd', borderRadius: 20 }}>
                <Text style={{ color: selected?.bankGroupId === b.bankGroupId ? colors.primary : '#666' }}>{b.name}</Text>
              </TouchableOpacity>)}</View>
          </ScrollView>
          <Text style={commonStyles.label}>Account holder</Text>
          <TextInput style={commonStyles.input} value={form.accountHolderName} onChangeText={v => setForm(f => ({ ...f, accountHolderName: v }))} />
          <Text style={commonStyles.label}>Account number</Text>
          <TextInput style={commonStyles.input} value={form.accountNumber} onChangeText={v => setForm(f => ({ ...f, accountNumber: v.replace(/\D/g, '') }))} keyboardType="numeric" />
          <Text style={commonStyles.label}>Account type</Text>
          <TextInput style={commonStyles.input} value={form.accountType} onChangeText={v => setForm(f => ({ ...f, accountType: v }))} />
          <TouchableOpacity style={[commonStyles.primaryButton, saving && commonStyles.disabledButton]} onPress={save} disabled={saving}>
            <Text style={commonStyles.primaryButtonText}>{saving ? 'Saving...' : 'Add Bank Account'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
