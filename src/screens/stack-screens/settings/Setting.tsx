import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../../components/custom-header';
import GTIcon from '../../../assets/icons';
import { color_theme } from '../../../services/styles/Style';
import GTButton from '../../../components/buttons/gt-button';

export default function Setting() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);

  /* ---------------- Toast Helper ---------------- */

  const showMsg = (msg: string) => {
    Platform.OS === 'android'
      ? ToastAndroid.show(msg, ToastAndroid.SHORT)
      : Alert.alert(msg);
  };


  /* ---------------- Row Component ---------------- */

  const SettingRow = ({
    icon,
    title,
    onPress,
    rightComponent,
  }: {
    icon: string;
    title: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.row}
      onPress={onPress}
      disabled={!!rightComponent}
    >
      <View style={styles.iconCircle}>
        <GTIcon name={icon} size={20} color={color_theme.primary} />
      </View>

      <Text style={styles.rowText}>{title}</Text>

      <View style={{ marginLeft: 'auto' }}>
        {rightComponent || (
          <GTIcon name="chevron-right" size={20} color="#aaa" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader
        title="Settings"
        leftIcon={<GTIcon name="arrow-back-ios-new" />}
        onLeftIconPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------------- Account ---------------- */}
        <Text style={styles.sectionTitle}>Account</Text>

        <SettingRow
          icon="person"
          title="Edit Profile"
          onPress={() => navigation.navigate('ProfileEdit')}
        />

        <SettingRow
          icon="lock"
          title="Change Password"
          onPress={() => navigation.replace('ForgotPassword')}
        />

        <SettingRow
          icon="delete"
          title="Delete Account"
          onPress={() => navigation.navigate('DeleteProfile')}
        />

        {/* ---------------- Preferences ---------------- */}
        <Text style={styles.sectionTitle}>Preferences</Text>

        <SettingRow
          icon="notifications"
          title="Notifications"
          rightComponent={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: '#ccc',
                true: color_theme.primary,
              }}
            />
          }
        />

        <SettingRow
          icon="dark-mode"
          title="Dark Mode"
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: '#ccc',
                true: color_theme.primary,
              }}
            />
          }
        />

        <SettingRow
          icon="location-on"
          title="Location Access"
          rightComponent={
            <Switch
            
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{
                false: '#ccc',
                true: color_theme.primary,
              }}
            />
          }
        />

        {/* ---------------- Support ---------------- */}
        <Text style={styles.sectionTitle}>Support</Text>

        <SettingRow
          icon="help"
          title="Help & Support"
          onPress={() => showMsg('Help Screen')}
        />

        <SettingRow
          icon="info"
          title="About App"
          onPress={() => showMsg('App Info')}
        />

        <SettingRow
          icon="privacy-tip"
          title="Privacy Policy"
          onPress={() => showMsg('Privacy Policy')}
        />

        {/* ---------------- Logout ---------------- */}

        <View style={{ marginTop: 30, paddingHorizontal: 16 }}>
          <GTButton
            title="Logout"
            borderRadius={26}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= Styles ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color_theme.mainBg,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    marginLeft: 16,
    fontSize: 13,
    color: color_theme.primary,
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    // backgroundColor: '#fff',
  },

  iconCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: `${color_theme.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  rowText: {
    fontSize: 15,
    color: '#111',
  },
});
