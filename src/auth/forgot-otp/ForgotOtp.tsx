import React, { useRef, useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ApiService from '../../services/utils/HttpHelper';
import GTButton from '../../components/buttons/gt-button';
import FullScreenLoader from '../../components/full-screen-loader';
import { color_theme, font_theme } from '../../services/styles/Style';
import { hideEmail } from '../../services/helper/helper';
import OtpModal from '../../components/otp-modal';

interface ErrorModel {
  otp?: string;
}

export default function ForgotOtp() {
  const route = useRoute<any>();
  const { email_address, flowType, otp } = route.params;

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  
  const [error, setError] = useState<ErrorModel>({});
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef<TextInput[]>([]);
  const getEmail = hideEmail(email_address);

  /* ---------------- OTP HANDLERS ---------------- */

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otpValues];
    updated[index] = value;
    setOtpValues(updated);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    if (error.otp) setError({});
  };

  const isOtpValid = () => {
    if (otpValues.some(v => v === '')) {
      setError({ otp: 'Enter complete OTP' });
      return false;
    }
    return true;
  };

  /* ---------------- VERIFY OTP ---------------- */

  const verifyOtp = async () => {
    if (!isOtpValid()) return;

    try {
      setLoading(true);

      const payload = {
        email_address,
        otp: otpValues.join(''),
        flowType,
      };

      const res = await ApiService.postFromAPI(
        '/route/end-point',
        payload,
        '',
      );
      console.log(res, 'backend res');

      if (res.success || res.status === 200) {
        Platform.OS === 'android'
          ? ToastAndroid.show('OTP verified', ToastAndroid.SHORT)
          : Alert.alert('Success', 'OTP verified');
       
        navigation.replace('ResetPassword', {
          email_address: email_address,
          otp: otp,
        });
        setOtpValues(['', '', '', '']);
      }
    } catch (err: any) {
      Platform.OS === 'android'
        ? ToastAndroid.show(err?.response?.data?.message, ToastAndroid.LONG)
        : Alert.alert(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND OTP ---------------- */

  const resendOtp = async () => {
    if (timer > 0) return;

    try {
      setResendLoading(true);
      await ApiService.postFromAPI(
        '/route/end-point',
        { email_address },
        '',
      );

      setTimer(30);
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev === 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      Alert.alert('Error', 'Unable to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

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
    >
      <View style={styles.overlay} />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 4-digit code sent to{'\n'}
              {getEmail}
            </Text>

            {/* OTP INPUTS */}
            <View style={styles.otpRow}>
              {otpValues.map((val, index) => (
                <TextInput
                  key={index}
                  ref={ref => {
                    inputsRef.current[index] = ref!;
                  }}
                  style={[
                    styles.otpInput,
                    error.otp && { borderColor: color_theme.error },
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={val}
                  onChangeText={v => handleOtpChange(v, index)}
                />
              ))}
            </View>

            {error.otp && <Text style={styles.errorText}>{error.otp}</Text>}

            {/* VERIFY BUTTON */}
            <View style={{ marginTop: 30 }}>
              <GTButton
                title={loading ? <FullScreenLoader visible /> : 'Verify OTP'}
                disabled={loading}
                onPress={verifyOtp}
                borderRadius={26}
              />
            </View>

            {/* RESEND */}
            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn’t receive the code?</Text>

              <TouchableOpacity onPress={resendOtp} disabled={timer > 0}>
                <Text style={[styles.resendBtn, timer > 0 && { opacity: 0.5 }]}>
                  {resendLoading
                    ? 'Sending...'
                    : timer > 0
                    ? `Resend in ${timer}s`
                    : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
     </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  container: {
    padding: 16,
  },
  title: {
    ...font_theme.headingLarge,
    fontSize: 34,
    color: color_theme.textWhite,
  },
  subtitle: {
    ...font_theme.headingMedium,

    color: color_theme.textWhite,
    marginVertical: 12,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  otpInput: {
    width: Platform.OS === 'ios' ? 85 : 75,
    height: Platform.OS === 'ios' ? 85 : 80,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: color_theme.textWhite,
    textAlign: 'center',
    fontSize: 22,
    color: color_theme.primary,
  },
  errorText: {
    color: color_theme.error,
    textAlign: 'center',
    marginTop: 10,
  },
  resendRow: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    color: color_theme.textLight,
  },
  resendBtn: {
    marginTop: 6,
    color: color_theme.border,
    fontWeight: '600',
  },
});
