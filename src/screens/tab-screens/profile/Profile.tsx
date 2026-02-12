import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  clearUserSession,
  getUserSession,
  removeData,
  storeData,
} from '../../../services/helper/helper';
import ApiService from '../../../services/utils/HttpHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../../components/custom-header';
import { color_theme } from '../../../services/styles/Style';
import GTIcon from '../../../assets/icons';
import FullScreenLoader from '../../../components/full-screen-loader';
import GTIconButton from '../../../components/buttons/gt-icon-button';

interface ProfileModel {
  first_name: string;
  last_name: string;
  email_address: string;
  city: string;
  country: string;
  address: string;
  phone_number: string;
  banner_url?: string;
  profile_url?: string;
}

export default function Profile() {
  const [getProfileData, setGetProfileData] = useState<ProfileModel>();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  if (loading) <FullScreenLoader visible loaderColor={color_theme.primary} />;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { email } = await getUserSession();
      if (email) {
        const res = await ApiService.getFromAPI(
          `/route/end-point/${email}`,
          '',
        );
        if (res.success || res.status === 200) {
          setGetProfileData(res.user);
        }
      } else {
        const msg = 'Please login';
        Platform.OS === 'android'
          ? ToastAndroid.show(msg, ToastAndroid.LONG)
          : Alert.alert(msg);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Something went wrong';
      Platform.OS === 'android'
        ? ToastAndroid.show(msg, ToastAndroid.LONG)
        : Alert.alert(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, []);

  

  const logOut = async () => {
    await removeData('token');
    await removeData('email_address');
    navigation.replace('OnBoarding1');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <CustomHeader
        title="My Profile"
        rightIcon={
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between',gap:10 }}
          >
            <TouchableOpacity onPress={() => navigation.navigate('ProfileEdit')}>
              <GTIcon name={'edit'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={getProfile}>
              <GTIcon name={'refresh'} />
            </TouchableOpacity>
          </View>
        }
        rightIconColor={color_theme.primary}
        // onRightIconPress={() => navigation.navigate('ProfileEdit')}
      />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ===== Banner ===== */}
          <ImageBackground
            source={
              getProfileData?.banner_url
                ? { uri: getProfileData.banner_url }
                : undefined
            }
            style={styles.banner}
          >
            {/* Profile Image */}
            <View style={styles.avatarWrapper}>
              <Image
                source={
                  getProfileData?.profile_url
                    ? { uri: getProfileData.profile_url }
                    : undefined
                }
                style={styles.avatar}
              />
            </View>
          </ImageBackground>

          {/* ===== Profile Info ===== */}
          <View style={styles.profileSection}>
            <InfoRow icon="person" value={getProfileData?.first_name} />
            <InfoRow icon="dns" value={getProfileData?.last_name} />
            <InfoRow icon="email" value={getProfileData?.email_address} />
            <InfoRow icon="phone" value={getProfileData?.phone_number} />
            <InfoRow icon="location-city" value={getProfileData?.city} />
            <InfoRow icon="flag" value={getProfileData?.country} />
            <InfoRow icon="home" value={getProfileData?.address} />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* ===== Actions ===== */}
          <View style={styles.section}>
            <ActionRow
              icon="edit"
              label="Edit Profile"
              onPress={() => navigation.navigate('ProfileEdit')}
            />
            <ActionRow icon="lock" label="Change Password" onPress={() => navigation.navigate('ForgetPassword')} />
            <ActionRow icon="settings" label="Setting" onPress={() => navigation.navigate('Setting')} />
            <ActionRow icon="help" label="Help & Support" />
          </View>
          <View style={{ padding: 16 }}>
            <GTIconButton
              title={loading ? <FullScreenLoader visible /> : 'Log out'}
              bgColor={color_theme.mainBg}
              color={color_theme.primary}
              borderColor={color_theme.primary}
              borderWidth={1}
              onPress={logOut}
            />
            
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ================= Components ================= */

const InfoRow = ({ icon, value }: { icon: string; value?: string }) => (
  <View style={styles.row}>
    <View style={styles.iconCircle}>
      <GTIcon name={icon} color={color_theme.primary} />
    </View>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

const ActionRow = ({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.actionRow} onPress={onPress}>
    <View style={styles.iconCircle}>
      <GTIcon name={icon} />
    </View>
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

/* ================= Styles ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color_theme.mainBg,
  },
  container: {
    flex: 1,
    paddingBottom: Platform.OS === 'android' ? 0 : -16,
  },

  banner: {
    width: '100%',
    height: 200,
    backgroundColor: color_theme.primary,
  },

  avatarWrapper: {
    position: 'absolute',
    bottom: -50,
    left: 16,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#ccc',
  },

  profileSection: {
    paddingTop: Platform.OS === 'ios' ? 64 : 64,
    paddingHorizontal: 16,
  },

  section: {
    paddingHorizontal: 16,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: color_theme.primary + '10', // light accent
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  value: {
    fontSize: 15,
    color: '#000',
    flexShrink: 1,
  },

  divider: {
    height: 1,
    backgroundColor: color_theme.placeholderColor,
    marginVertical: 16,
    marginHorizontal: 16,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },

  actionText: {
    fontSize: 15,
    color: color_theme.primary,
  },
});
