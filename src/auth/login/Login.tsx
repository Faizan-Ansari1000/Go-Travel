import React, { useState, useRef } from 'react';
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
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import InputField from '../../components/input-field';
import GTButton from '../../components/buttons/gt-button';
import GTIconButton from '../../components/buttons/gt-icon-button';
import FullScreenLoader from '../../components/full-screen-loader';
import { color_theme, font_theme } from '../../services/styles/Style';
import ApiService from '../../services/utils/HttpHelper';
import { storeData } from '../../services/helper/helper';
import OrSeparator from '../../components/or-separator';

interface LoginModel {
  email_address: string;
  password: string;
}

interface ErrorModel {
  [key: string]: string;
}

export default function Login() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const scrollRef = useRef<ScrollView>(null);

  const [model, setModel] = useState<LoginModel>({
    email_address: '',
    password: '',
  });
  const [error, setError] = useState<ErrorModel>({});
  const [loading, setLoading] = useState(false);

  /* ---------------- VALIDATIONS ---------------- */
  const validate = (): boolean => {
    const err: ErrorModel = {};
    if (!model.email_address.trim()) err.email_address = 'Enter email address';
    if (!model.password.trim()) err.password = 'Enter password';

    setError(err);
    return Object.keys(err).length === 0;
  };

  const loginAccount = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await ApiService.postFromAPI('/route/end-point', model, '');
      console.log(res);

      if (res.success || res.status === 201) {
        await storeData('token', res.token);
        await storeData('email_address', res.userProfile.email_address);
        navigation.replace('Home');
        setModel({ email_address: '', password: '' });
      }
    } catch (err: any) {
      Platform.OS === 'android'
        ? ToastAndroid.show(
            err.response?.data?.message || err.message,
            ToastAndroid.LONG,
          )
        : Alert.alert('Error', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderError = (key: keyof ErrorModel) =>
    error[key] ? <Text style={styles.errorText}>{error[key]}</Text> : null;

  /* ---------------- UI ---------------- */
  return (
   <>
   <StatusBar translucent
        backgroundColor="transparent"
        barStyle="light-content" />
 <ImageBackground
      source={require('../../assets/images/regImg.jpg')}
      style={styles.bg}
    >
      {/* Dark overlay */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login to your account</Text>

              {/* Email */}
              <View style={{ marginVertical: 10 }}>
                <InputField
                  placeholder="Enter registered email address"
                  label="Email address"
                  value={model.email_address}
                  onChangeText={e =>
                    setModel(prev => ({ ...prev, email_address: e }))
                  }
                  borderColor={
                    error.email_address
                      ? color_theme.error
                      : color_theme.primary
                  }
                  labelColor={color_theme.textWhite}
                />
                {renderError('email_address')}
              </View>

              {/* Password */}
              <View style={{ marginVertical: 10 }}>
                <InputField
                  placeholder="Enter password"
                  label="Password"
                  value={model.password}
                  onChangeText={e =>
                    setModel(prev => ({ ...prev, password: e }))
                  }
                  secureTextEntry
                  borderColor={
                    error.password ? color_theme.error : color_theme.primary
                  }
                  labelColor={color_theme.textWhite}
                />
                {renderError('password')}
              </View>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={{textAlign:'right',color: color_theme.textWhite,paddingRight:5,}}>Forgot Password</Text>
                </TouchableOpacity>

              {/* Login Button */}
              <View style={{ marginVertical: '7%' }}>
                <GTButton
                  title={
                    loading ? (
                      <FullScreenLoader
                        visible
                        loaderColor={color_theme.textWhite}
                      />
                    ) : (
                      'Login'
                    )
                  }
                  onPress={loginAccount}
                  disabled={loading}
                  borderRadius={26}
                />
              </View>

              <OrSeparator />

              <GTIconButton
                color={color_theme.textWhite}
                title="Sign up with Google"
                icon="google"
                onPress={() => {navigation.replace('Home')}}
                style={{ borderRadius: 26 }}
              />

              <View style={{ marginVertical: 20 }}>
                <GTIconButton
                  color={color_theme.textWhite}
                  title="Sign up with Facebook"
                  icon="facebook"
                  onPress={() => {}}
                  style={{ borderRadius: 26 }}
                />
              </View>

              {/* Signup Redirect */}
              <View style={styles.signupRow}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <Text
                  style={styles.signupBtn}
                  onPress={() => navigation.navigate('SignUp')}
                >
                  Sign Up
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
    marginBottom: 16,
  },
  errorText: {
    color: color_theme.error,
    fontSize: 14,
    marginTop: 2,
    paddingLeft:3,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  signupText: {
    color: color_theme.textLight,
  },
  signupBtn: {
    color: color_theme.border,
    fontWeight: '600',
  },
});
