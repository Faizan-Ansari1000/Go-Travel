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
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import InputField from '../../components/input-field';
import GTButton from '../../components/buttons/gt-button';
import FullScreenLoader from '../../components/full-screen-loader';
import GTIcon from '../../assets/icons';

import ApiService from '../../services/utils/HttpHelper';
import { getMachineDetail } from '../../services/helper/helper';
import { color_theme, font_theme } from '../../services/styles/Style';

interface ResetModel {
  new_password: string;
  confirm_new_password: string;
}

interface ErrorModel {
  [key: string]: string;
}

export default function ResetPassword() {
  const route = useRoute<any>();
  const { email_address, otp } = route.params;

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [model, setModel] = useState<ResetModel>({
    new_password: '',
    confirm_new_password: '',
  });

  const [error, setError] = useState<ErrorModel>({});
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(true);
  const [showConfirm, setShowConfirm] = useState(true);

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const err: ErrorModel = {};

    if (!model.new_password) err.new_password = 'Enter new password';
    else if (model.new_password.length < 6)
      err.new_password = 'Password must be at least 6 characters';

    if (!model.confirm_new_password)
      err.confirm_new_password = 'Confirm your password';
    else if (model.new_password !== model.confirm_new_password)
      err.confirm_new_password = 'Passwords do not match';

    setError(err);
    return Object.keys(err).length === 0;
  };

  /* ---------------- RESET PASSWORD ---------------- */

  const resetPassword = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const machine_detail = await getMachineDetail();

      const payload = {
        email_address: email_address,
        otp: otp,
        ...model,
        machine_detail,
      };

      const res = await ApiService.postFromAPI(
        '/route/end-point',
        payload,
        '',
      );
      console.log(res);

      if (res.success || res.status === 201) {
        Platform.OS === 'android'
          ? ToastAndroid.show(
              'Password updated successfully',
              ToastAndroid.SHORT,
            )
          : Alert.alert('Success', 'Password updated successfully');

        navigation.replace('PasswordChanged');
        setModel({ new_password: '', confirm_new_password: '' });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Reset failed';
      Platform.OS === 'android'
        ? ToastAndroid.show(msg, ToastAndroid.LONG)
        : Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const renderError = (key: keyof ErrorModel) =>
    error[key] && <Text style={styles.errorText}>{error[key]}</Text>;

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
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Create a new secure password for your account
              </Text>

              {/* NEW PASSWORD */}
              <View style={{ marginTop: 20 }}>
                <InputField
                  label="New password"
                  placeholder="Enter new password"
                  secureTextEntry={showNew}
                  value={model.new_password}
                  onChangeText={e =>
                    setModel(prev => ({ ...prev, new_password: e }))
                  }
                  borderColor={
                    error.new_password ? color_theme.error : color_theme.primary
                  }
                  rightIcon={
                    <GTIcon
                      name={showNew ? 'visibility-off' : 'visibility'}
                      color={color_theme.primary}
                    />
                  }
                  rightIconOnPress={() => setShowNew(!showNew)}
                />
                {renderError('new_password')}
              </View>

              {/* CONFIRM PASSWORD */}
              <View style={{ marginTop: 14 }}>
                <InputField
                  label="Confirm new password"
                  placeholder="Confirm new password"
                  secureTextEntry={showConfirm}
                  value={model.confirm_new_password}
                  onChangeText={e =>
                    setModel(prev => ({ ...prev, confirm_new_password: e }))
                  }
                  borderColor={
                    error.confirm_new_password
                      ? color_theme.error
                      : color_theme.primary
                  }
                  rightIcon={
                    <GTIcon
                      name={showConfirm ? 'visibility-off' : 'visibility'}
                      color={color_theme.primary}
                    />
                  }
                  rightIconOnPress={() => setShowConfirm(!showConfirm)}
                />
                {renderError('confirm_new_password')}
              </View>

              {/* BUTTON */}
              <View style={{ marginTop: 30 }}>
                <GTButton
                  borderRadius={26}
                  disabled={loading}
                  title={
                    loading ? <FullScreenLoader visible /> : 'Reset Password'
                  }
                  onPress={resetPassword}
                />
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
    textAlign: 'center',
    color: color_theme.textWhite,
  },
  subtitle: {
    ...font_theme.paragraph,
    textAlign: 'center',
    color: color_theme.textWhite,
    marginTop: 8,
  },
  errorText: {
    color: color_theme.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
