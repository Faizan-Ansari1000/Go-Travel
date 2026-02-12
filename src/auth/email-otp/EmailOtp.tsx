import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  Alert,
  ImageBackground,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GTButton from '../../components/buttons/gt-button';
import FullScreenLoader from '../../components/full-screen-loader';
import ApiService from '../../services/utils/HttpHelper';
import { hideEmail } from '../../services/helper/helper';
import { color_theme } from '../../services/styles/Style';

export default function EmailOtp() {
  const route = useRoute<any>();
  const {  email_address, flowType } = route.params;

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  const maskedEmail = hideEmail(email_address);

  // =========================
  // Helpers
  // =========================
  const showError = (msg: string) => {
    Platform.OS === 'android'
      ? ToastAndroid.show(msg, ToastAndroid.LONG)
      : Alert.alert('Error', msg);
  };

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const updated = [...otpValues];
    updated[index] = text;
    setOtpValues(updated);

    if (hasError) setHasError(false);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpValid = () => {
    const joined = otpValues.join('');
    if (joined.length !== 4) {
      setHasError(true);
      showError('Please enter complete 4 digit OTP');
      return false;
    }
    return true;
  };

  // =========================
  // Verify OTP
  // =========================
  const verifyOtp = async () => {
    Keyboard.dismiss();

    if (!isOtpValid()) return;

    const payload = {
      email_address,
      otp: otpValues.join(''), 
      flowType,
    };

    try {
      setLoading(true);

      const res = await ApiService.postFromAPI(
        '/route/end-point',
        payload,
        '',
      );

      console.log(res, 'Resp');

      if (res.success || res.status === 201) {
        navigation.navigate('AccountVerified');

        Platform.OS === 'android'
          ? ToastAndroid.show('Successfully verified', ToastAndroid.LONG)
          : Alert.alert('Successfully verified');
        setOtpValues(['', '', '', '']);
      } else {
        setHasError(true);
        showError(res.message || 'Invalid OTP');
      }
    } catch (err: any) {
      setHasError(true);
      showError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Resend OTP
  // =========================
  const resendOtp = async () => {
    try {
      setResendLoading(true);

      await ApiService.postFromAPI(
        '/route/end-point', //
        { email_address },
        '',
      );

      Platform.OS === 'android'
        ? ToastAndroid.show('OTP resent successfully', ToastAndroid.SHORT)
        : Alert.alert('Success', 'OTP resent successfully');
    } catch (err: any) {
      showError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  // =========================
  // UI
  // =========================
  return (
  <>
  <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
    <ImageBackground
      source={require('../../assets/images/regImg.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              Enter the 4 digit code sent to{'\n'}
              <Text style={styles.email}>{maskedEmail}</Text>
            </Text>

            {/* OTP Inputs */}
            <View style={styles.otpRow}>
              {otpValues.map((val, index) => (
                <TextInput
                  key={index}
                  ref={ref => {
                    inputRefs.current[index] = ref;
                  }}
                  value={val}
                  onChangeText={text => handleChange(text, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[styles.otpInput, hasError && styles.otpInputError]}
                  autoFocus={index === 0}
                  placeholder="•"
                  placeholderTextColor="#bbb"
                />
              ))}
            </View>

            {/* Verify Button */}
            <GTButton
              disabled={loading}
              borderRadius={26}
              style={styles.verifyBtn}
              title={
                loading ? (
                  <FullScreenLoader
                    visible
                    loaderColor={color_theme.textLight}
                  />
                ) : (
                  'Verify OTP'
                )
              }
              onPress={verifyOtp}
            />

            {/* Resend */}
            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn’t receive code?</Text>

              <TouchableOpacity disabled={resendLoading} onPress={resendOtp}>
                <Text style={styles.resendBtn}>
                  {resendLoading ? 'Resending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  </>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)', // 👈 dullness control
  },

  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 6,
    color: color_theme.textWhite,
  },
  subtitle: {
    fontSize: 18,
    color: color_theme.border,
    marginBottom: 24,
    lineHeight: 20,
  },
  email: {
    fontWeight: '600',
    color: color_theme.textWhite,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  otpInput: {
   width: Platform.OS === 'ios' ? 85 : 75,
    height: Platform.OS === 'ios' ? 85 : 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ddd',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
    backgroundColor: '#fff',
  },
  otpInputError: {
    borderColor: 'red',
  },
  verifyBtn: {
    marginTop: 6,
  },
  resendRow: {
    marginTop: 22,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    color: color_theme.textWhite,
    marginBottom: 6,
  },
  resendBtn: {
    fontSize: 14,
    fontWeight: '600',
    color: color_theme.textWhite || '#0066ff',
  },
});
