import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  StatusBar,
  ToastAndroid,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import TabNavigation from '../tab/TabNavigation';
import { HomeIcon } from '../../../assets/svg-icons';
import { color_theme } from '../../../services/styles/Style';
import { getUserSession } from '../../../services/helper/helper';
import ApiService from '../../../services/utils/HttpHelper';
import GTIcon from '../../../assets/icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Drawer = createDrawerNavigator();

// ----------------------------
// Drawer Screens Configuration
// ----------------------------
const drawerScreens = [
  {
    name: 'Tabs',
    component: TabNavigation,
    icon: (focused: boolean) => (
      <HomeIcon
        height={20}
        width={20}
        color={focused ? color_theme.primary : color_theme.placeholderColor}
      />
    ),
  },
];

// ----------------------------
// Custom Drawer Content Component
// ----------------------------
const CustomDrawerContent = ({ navigation }: any) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { email } = await getUserSession();
      if (!email) {
        ToastAndroid.show('User session not found!', ToastAndroid.SHORT);
        return;
      }

      const res = await ApiService.getFromAPI(`/route/end-point/${email}`, '');
      if (res?.success) {
        setProfile(res.user);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error loading profile';
      Platform.OS === 'android'
        ? ToastAndroid.show(msg, ToastAndroid.LONG)
        : Alert.alert(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleLogout = () => {
    setLogoutModal(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor={
            logoutModal ? 'rgba(0,0,0,0.5)' : color_theme.screenbackGround
          }
          barStyle="dark-content"
        />

        <View style={styles.profileSection}>
          {loading ? (
            <ActivityIndicator size="small" color={color_theme.primary} />
          ) : (
            <>
              <Image
                source={{
                  uri:
                    profile?.profile_url ||
                    'https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg',
                }}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>
                {profile?.first_name
                  ? `${profile?.first_name} ${profile?.last_name || ''}`
                  : 'Guest User'}
              </Text>
              <Text style={styles.profileEmail}>
                {profile?.email_address || 'No email found'}
              </Text>
            </>
          )}
        </View>

        <DrawerContentScrollView contentContainerStyle={{ paddingTop: 0 }}>
          {drawerScreens.map((screen, index) => (
            <DrawerItem
              key={index}
              label={({ focused }) => (
                <Text
                  style={{
                    color: focused
                      ? color_theme.primary
                      : color_theme.placeholderColor || '#8e8e93',
                    fontSize: 14,
                    fontWeight: focused ? '600' : '400',
                  }}
                >
                  {screen.name}
                </Text>
              )}
              icon={({ focused }) => screen.icon(focused)}
              focused={navigation.getState().index === index}
              onPress={() => navigation.navigate(screen.name)}
              style={[
                styles.drawerItem,
                navigation.getState().index === index && {
                  backgroundColor: color_theme.mainBg,borderRadius:26,
                },
              ]}
            />
          ))}
        </DrawerContentScrollView>

        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setLogoutModal(true)}
          >
            <GTIcon name="logout" size={22} color={color_theme.primary} />
            <Text style={styles.bottomText}>LogOut</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <GTIcon name="info" size={22} color={color_theme.primary} />
            <Text style={styles.bottomText}>Info</Text>
          </TouchableOpacity>
        </View>

        <Modal transparent visible={logoutModal} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                Are you sure you want to logout?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: color_theme.primary },
                  ]}
                  onPress={handleLogout}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                  onPress={() => setLogoutModal(false)}
                >
                  <Text>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

// ----------------------------
// Main Drawer Navigation Component
// ----------------------------
export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: color_theme.primary,
        drawerInactiveTintColor: color_theme.placeholderColor || '#8e8e93',
        drawerStyle: { width: 260 },
        drawerType: 'front',
      }}
    >
      {drawerScreens.map((screen, index) => (
        <Drawer.Screen
          key={index}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Drawer.Navigator>
  );
}

// ----------------------------
// Styles
// ----------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#F8F9FA',
    marginBottom: 10,
    borderBottomWidth: 0.3,
    borderColor: '#ddd',
  },
  profileImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: color_theme.primary,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#012C22',
  },
  profileEmail: {
    fontSize: 13,
    color: '#666',
  },

  drawerItem: {
    height: 48,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
    marginHorizontal: 6,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderTopWidth: 0.4,
    borderTopColor: '#ccc',
  },
  iconButton: {
    padding: 8,
    alignItems: 'center',
  },
  bottomText: {
    marginTop: 4,
    fontSize: 13,
    color: '#333',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
});
