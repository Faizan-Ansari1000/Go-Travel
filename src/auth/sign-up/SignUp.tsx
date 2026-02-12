import React, { useRef, useState } from 'react';
import {
  Alert,
  ImageBackground,
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

import InputField from '../../components/input-field';
import GTButton from '../../components/buttons/gt-button';
import GTIconButton from '../../components/buttons/gt-icon-button';
import OrSeparator from '../../components/or-separator';
import PasswordStrengthChecker from '../../components/password-strength-checker';

import { color_theme, font_theme } from '../../services/styles/Style';
import ApiService from '../../services/utils/HttpHelper';
import { storeData } from '../../services/helper/helper';
import GTIcon from '../../assets/icons';
import FullScreenLoader from '../../components/full-screen-loader';

/* ---------------- TYPES ---------------- */

interface SignUpModel {
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

interface ErrorModel {
  [key: string]: string;
}

/* ---------------- REGEX ---------------- */

const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)?$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------------- COMPONENT ---------------- */

export default function SignUp() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const scrollRef = useRef<ScrollView>(null);

  const [model, setModel] = useState<SignUpModel>({
    first_name: '',
    last_name: '',
    email_address: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState<ErrorModel>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  /* ---------------- HANDLERS ---------------- */

  const onChange = (key: keyof SignUpModel, value: string) => {
    setModel(prev => ({ ...prev, [key]: value }));
    if (error[key]) setError(prev => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const err: ErrorModel = {};

    if (!model.first_name.trim()) err.first_name = 'Enter first name';
    else if (!nameRegex.test(model.first_name.trim()))
      err.first_name = 'Only letters, one space allowed';

    if (!model.last_name.trim()) err.last_name = 'Enter last name';
    else if (!nameRegex.test(model.last_name.trim()))
      err.last_name = 'Only letters, one space allowed';

    if (!model.email_address.trim()) err.email_address = 'Enter email address';
    else if (!emailRegex.test(model.email_address))
      err.email_address = 'Enter valid email';

    if (!model.phone_number.trim()) err.phone_number = 'Enter phone number';

    if (!model.password) err.password = 'Enter password';

    if (!model.confirm_password) err.confirm_password = 'Confirm password';

    if (
      model.password &&
      model.confirm_password &&
      model.password !== model.confirm_password
    )
      err.confirm_password = 'Passwords do not match';

    setError(err);
    return Object.keys(err).length === 0;
  };

  const createAccount = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await ApiService.postFromAPI('/route/end-point', model, '');
      console.log(res, 'Backend resp');

      if (res.success || res.status === 201) {
        await storeData('token', res.token);
        await storeData('email_address', res.user.email_address);
        navigation.navigate('EmailOtp', {
          email_address: res.user.email_address,
          flowType: 'signup',
        });
      }
    } catch (err: any) {
      Platform.OS === 'android'
        ? ToastAndroid.show(err?.response?.data?.message, ToastAndroid.LONG)
        : Alert.alert(err.response?.data?.message);
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
        style={[styles.bg]}
      >
        {/* Dark overlay */}
        <View style={styles.overlay} />

        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
          >
            {/* <>
            // only for dev mode
              <OtpModal
                transparent={true}
                visible={isOpen}
                otp={otpValue}
                onRequestClose={() => setIsOpen(false)}
              />
            </> */}
            {/* CARD */}
            <View>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Start planning your journeys today
              </Text>

              {/* NAME */}
              <View style={styles.row}>
                <View style={styles.half}>
                  <InputField
                    placeholder="Enter first name"
                    labelColor={color_theme.border}
                    label="First name"
                    value={model.first_name}
                    onChangeText={e => onChange('first_name', e)}
                    borderColor={
                      error.first_name ? color_theme.error : color_theme.primary
                    }
                  />
                  {renderError('first_name')}
                </View>

                <View style={styles.half}>
                  <InputField
                    placeholder="Enter last name"
                    labelColor={color_theme.textWhite}
                    label="Last name"
                    value={model.last_name}
                    onChangeText={e => onChange('last_name', e)}
                    borderColor={
                      error.last_name ? color_theme.error : color_theme.primary
                    }
                  />
                  {renderError('last_name')}
                </View>
              </View>

              <View style={{ marginVertical: 10 }}>
                <InputField
                  placeholder="Enter email address"
                  labelColor={color_theme.textWhite}
                  label="Email address"
                  value={model.email_address}
                  onChangeText={e => onChange('email_address', e)}
                  borderColor={
                    error.email_address
                      ? color_theme.error
                      : color_theme.primary
                  }
                />
                {renderError('email_address')}
              </View>

              <View style={{ marginVertical: 10 }}>
                <InputField
                  keyboardType="number-pad"
                  placeholder="Enter phone number "
                  labelColor={color_theme.textWhite}
                  label="Phone number"
                  value={model.phone_number}
                  onChangeText={e => onChange('phone_number', e)}
                  borderColor={
                    error.phone_number ? color_theme.error : color_theme.primary
                  }
                />
                {renderError('phone_number')}
              </View>

              <View style={{ marginVertical: 10 }}>
                <InputField
                  placeholder="Enter password"
                  labelColor={color_theme.textWhite}
                  label="Password"
                  secureTextEntry={showPassword}
                  value={model.password}
                  onChangeText={e => onChange('password', e)}
                  rightIcon={
                    <GTIcon
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      color={color_theme.primary}
                    />
                  }
                  rightIconOnPress={() => setShowPassword(!showPassword)}
                  borderColor={
                    error.password ? color_theme.error : color_theme.primary
                  }
                />
                <PasswordStrengthChecker password={model.password} />
                {renderError('password')}
              </View>

              <View style={{ marginVertical: 10 }}>
                <InputField
                  placeholder="Enter confirm-password"
                  labelColor={color_theme.textWhite}
                  label="Confirm password"
                  secureTextEntry={showConfirmPassword}
                  value={model.confirm_password}
                  onChangeText={e => onChange('confirm_password', e)}
                  rightIcon={
                    <GTIcon
                      name={
                        showConfirmPassword ? 'visibility-off' : 'visibility'
                      }
                      color={color_theme.primary}
                    />
                  }
                  rightIconOnPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  borderColor={
                    error.confirm_password
                      ? color_theme.error
                      : color_theme.primary
                  }
                />
                {renderError('confirm_password')}
              </View>

              <View style={{ marginVertical: '7%' }}>
                <GTButton
                  title={
                    loading ? (
                      <FullScreenLoader
                        visible
                        loaderColor={color_theme.textWhite}
                      />
                    ) : (
                      'Create Account'
                    )
                  }
                  onPress={createAccount}
                  disabled={loading}
                  borderRadius={26}
                />
              </View>

              <OrSeparator />

              <GTIconButton
                color={color_theme.textWhite}
                title="Sign up with Google"
                icon="google"
                onPress={() => {}}
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

              {/* LOGIN */}
              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <Text
                  style={styles.loginBtn}
                  onPress={() => navigation.navigate('Login')}
                >
                  Login
                </Text>
              </View>
            </View>
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
    // paddingBottom: 40,
  },

  title: {
    ...font_theme.headingLarge,
    textAlign: 'center',
    color: color_theme.textWhite,
  },

  subtitle: {
    ...font_theme.paragraph,
    textAlign: 'center',
    marginBottom: 16,
    color: color_theme.textWhite,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  half: {
    flex: 1,
  },

  errorText: {
    color: color_theme.error,
    fontSize: 12,
    left: 3,
    // marginTop: 4,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
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
