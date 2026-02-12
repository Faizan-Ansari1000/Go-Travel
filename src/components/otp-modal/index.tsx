import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color_theme } from '../../services/styles/Style';
import GTButton from '../buttons/gt-button';

interface OtpModalProps {
    transparent?: boolean;
  visible: boolean;
  otp: string;
  onRequestClose: () => void;
//   isDevMode?: boolean; // default false
}

export default function OtpModal(props: OtpModalProps) {
  const { visible, otp, onRequestClose,transparent } = props;

  // Agar production me ho, modal show na ho
//   if (!isDevMode) return null;

  return (
    <Modal
      transparent={transparent}
      visible={visible}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Developer OTP Info</Text>

            <Text style={styles.paragraph}>
              This OTP is only shown for testing purposes. It will not be
              visible to end users in production.
            </Text>

            <Text style={styles.otpText}>{otp || 'No OTP available'}</Text>

            <GTButton
              title="Close"
              onPress={onRequestClose}
              
              borderRadius={25}
              style={{ marginTop: 20,width:'100%' }}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: color_theme.primary,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  otpText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
});
