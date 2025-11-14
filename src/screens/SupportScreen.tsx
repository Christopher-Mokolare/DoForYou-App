import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SupportScreen = ({ navigation }: any) => {
  const supportOptions = [
    {
      title: 'Contact Support',
      subtitle: 'Get help from our team',
      icon: 'headset-outline',
      action: () => handleContactSupport(),
    },
    {
      title: 'WhatsApp Support',
      subtitle: '+27795258611',
      icon: 'logo-whatsapp',
      action: () => handleWhatsAppSupport(),
    },
    {
      title: 'Email Support',
      subtitle: 'info@doforyou.co.za',
      icon: 'mail-outline',
      action: () => handleEmailSupport(),
    },
    {
      title: 'FAQ',
      subtitle: 'Frequently asked questions',
      icon: 'help-circle-outline',
      action: () => handleFAQ(),
    },
    {
      title: 'Report a Problem',
      subtitle: 'Report bugs or issues',
      icon: 'bug-outline',
      action: () => handleReportProblem(),
    },
  ];

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Choose how you\'d like to contact us', [
      { text: 'WhatsApp', onPress: handleWhatsAppSupport },
      { text: 'Email', onPress: handleEmailSupport },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const handleWhatsAppSupport = () => {
    const phoneNumber = '+27795258611';
    const message = 'Hi, I need help with DoForYou app';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'WhatsApp is not installed on your device');
      }
    });
  };

  const handleEmailSupport = () => {
    const email = 'info@doforyou.co.za';
    const subject = 'DoForYou App Support';
    const body = 'Hi, I need help with the DoForYou app.\n\nPlease describe your issue:';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(url);
  };

  const handleFAQ = () => {
    Alert.alert('FAQ', 'Frequently Asked Questions will be available soon');
  };

  const handleReportProblem = () => {
    Alert.alert('Report Problem', 'Problem reporting feature will be available soon');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeSection}>
          <Ionicons name="help-circle" size={60} color="#ff6b35" />
          <Text style={styles.welcomeTitle}>How can we help you?</Text>
          <Text style={styles.welcomeSubtitle}>
            We're here to help you with any questions or issues you might have
          </Text>
        </View>

        <View style={styles.section}>
          {supportOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.supportItem}
              onPress={option.action}
            >
              <View style={styles.supportIcon}>
                <Ionicons name={option.icon as any} size={24} color="#ff6b35" />
              </View>
              <View style={styles.supportInfo}>
                <Text style={styles.supportTitle}>{option.title}</Text>
                <Text style={styles.supportSubtitle}>{option.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>App Information</Text>
          <Text style={styles.infoText}>Version: 1.0.0</Text>
          <Text style={styles.infoText}>Build: 1</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  supportIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff5f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  supportSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  infoSection: {
    backgroundColor: 'white',
    marginTop: 20,
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default SupportScreen;