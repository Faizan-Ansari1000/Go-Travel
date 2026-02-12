import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ApiService from '../../services/utils/HttpHelper';
import InputField from '../../components/input-field';
import GTButton from '../../components/buttons/gt-button';
import FullScreenLoader from '../../components/full-screen-loader';
import { color_theme, font_theme } from '../../services/styles/Style';

interface ForgotModel {
  email_address: string;
}

interface ErrorModel {
  [key: string]: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [model, setModel] = useState<ForgotModel>({ email_address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorModel>({});

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const err: ErrorModel = {};

    if (!model.email_address.trim()) err.email_address = 'Enter email address';
    else if (!emailRegex.test(model.email_address.trim()))
      err.email_address = 'Enter a valid email address';

    setError(err);
    return Object.keys(err).length === 0;
  };

  /* ---------------- API ---------------- */
  const forgotPassword = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await ApiService.postFromAPI(
        '/route/end-point',
        model,
        '',
      );

      if (res?.success || res?.status === 200) {
        console.log(res, 'backend res', res.otp);

          setTimeout(() => {
            navigation.replace('ForgotOtp', {
              email_address: model.email_address,
              flowType: 'forgot',
              otp: res.otp,
            });
          }, 1500);

        setModel({ email_address: '' });
      }
    } catch (err: any) {
      Platform.OS === 'android'
        ? ToastAndroid.show(
            err?.response?.data?.message || 'Something went wrong',
            ToastAndroid.LONG,
          )
        : Alert.alert(
            'Error',
            err?.response?.data?.message || 'Something went wrong',
          );
    } finally {
      setLoading(false);
    }
  };

  const renderError = (key: keyof ErrorModel) =>
    error[key] ? <Text style={styles.errorText}>{error[key]}</Text> : null;

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
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
         
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>
                Enter your registered email and we’ll send you a verification
                code
              </Text>

              {/* Email */}
              <View style={{ marginVertical: 12 }}>
                <InputField
                  label="Email address"
                  labelColor={color_theme.textWhite}
                  placeholder="Enter your email"
                  value={model.email_address}
                  onChangeText={e => {
                    setModel({ email_address: e });
                    if (error.email_address)
                      setError(prev => ({ ...prev, email_address: '' }));
                  }}
                  borderColor={
                    error.email_address
                      ? color_theme.error
                      : color_theme.primary
                  }
                />
                {renderError('email_address')}
              </View>

              {/* Button */}
              <View style={{ marginTop: 24 }}>
                <GTButton
                  title={
                    loading ? (
                      <FullScreenLoader
                        visible
                        loaderColor={color_theme.textWhite}
                      />
                    ) : (
                      'Send OTP'
                    )
                  }
                  onPress={forgotPassword}
                  disabled={loading}
                  borderRadius={26}
                />
              </View>

              {/* Back to login */}
              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Remember your password?</Text>
                <Text
                  style={styles.loginBtn}
                  onPress={() => navigation.goBack()}
                >
                  Login
                </Text>
              </View>
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
  safe: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  title: {
    ...font_theme.headingLarge,
    textAlign: 'center',
    color: color_theme.textWhite,
    marginBottom: 6,
  },
  subtitle: {
    ...font_theme.paragraph,
    textAlign: 'center',
    color: color_theme.textWhite,
    marginBottom: 20,
  },
  errorText: {
    color: color_theme.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
    gap: 6,
  },
  loginText: {
    color: color_theme.textLight,
  },
  loginBtn: {
    color: color_theme.border,
    fontWeight: '600',
  },
});
