// ---------------------------------------------------
// Author: Faizan Ansari
// Project: Real-World E-Commerce App
// Description: Centralized Helper Functions File
// ---------------------------------------------------

import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================
// 1. PERMISSIONS HANDLERS
// ============================

// Request camera permission
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (err) {
    console.log('Camera permission error:', err);
    return false;
  }
};

// Request storage/gallery permission
export const requestGalleryPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const version = Platform.Version;
      const permission =
        version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const hasPermission = await PermissionsAndroid.check(permission);
      if (hasPermission) return true;

      const granted = await PermissionsAndroid.request(permission, {
        title: 'Gallery Permission Required',
        message:
          'This app needs access to your gallery to upload or choose images.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      });

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        Alert.alert(
          'Permission Denied',
          'Gallery access denied. Please allow it to select images.',
        );
        return false;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission Permanently Denied',
          'Please enable gallery access from settings.',
        );
        return false;
      }
      return false;
    }
    return true;
  } catch (err) {
    console.log('Gallery permission error:', err);
    return false;
  }
};

// Request location permission
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  } catch (err) {
    console.log('Location permission error:', err);
    return false;
  }
};

// ============================
// 2. LOCATION HANDLER
// ============================

// export const getCurrentLocation = async (): Promise<{
//   lat: number;
//   lng: number;
// } | null> => {
//   const hasPermission = await requestLocationPermission();
//   if (!hasPermission) {
//     Alert.alert('Permission Denied', 'Location permission is required.');
//     return null;
//   }
//   return new Promise(resolve => {
//     Geolocation.getCurrentPosition(
//       position => {
//         resolve({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       },
//       error => {
//         console.log('Location error:', error);
//         resolve(null);
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
//     );
//   });
// };

// ============================
// 3. GENERAL UTILITIES
// ============================

// Hide part of email address (e.g., f***n@gmail.com)
export const hideEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  const hiddenPart =
    name[0] + '*'.repeat(Math.max(0, name.length - 2)) + name.slice(-1);
  return `${hiddenPart}@${domain}`;
};


// Capitalize first letter of a string
export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Show alert easily
export const showAlert = (title: string, message: string) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

// Safe console log (disable in production)
export const logInfo = (label: string, data: any) => {
  if (__DEV__) {
    console.log(`🔹 ${label}:`, data);
  }
};

// ============================
// 4. VALIDATIONS
// ============================

export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// ============================
// Description: Returns full machine/device information in a structured object
// ============================

export async function getMachineDetail() {
  try {
    const brand = DeviceInfo.getBrand();
    const model = DeviceInfo.getModel();
    const deviceId = DeviceInfo.getDeviceId();
    const systemName = DeviceInfo.getSystemName();
    const systemVersion = DeviceInfo.getSystemVersion();
    const uniqueId = await DeviceInfo.getUniqueId();
    const isEmulator = await DeviceInfo.isEmulator();
    const manufacturer = await DeviceInfo.getManufacturer();
    const appVersion = DeviceInfo.getVersion();
    const buildNumber = DeviceInfo.getBuildNumber();
    const deviceName = await DeviceInfo.getDeviceName();

    return {
      brand,
      model,
      deviceId,
      systemName,
      systemVersion,
      uniqueId,
      manufacturer,
      isEmulator,
      appVersion,
      buildNumber,
      deviceName,
    };
  } catch (error) {
    console.log('Error fetching machine details:', error);
    return null;
  }
}

/**
 * Store any key/value pair
 */
export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(`[Storage] Saved ${key}`);
  } catch (error) {
    console.log(`[Storage] Error saving ${key}:`, error);
  }
};

/**
 * Get value by key
 */
export const getData = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.log(`[Storage] Error getting ${key}:`, error);
    return null;
  }
};

/**
 * Remove value by key
 */
export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`[Storage] Removed ${key}`);
  } catch (error) {
    console.log(`[Storage] Error removing ${key}:`, error);
  }
};

/**
 * Clear all storage
 */
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('[Storage] Cleared all data');
  } catch (error) {
    console.log('[Storage] Error clearing storage:', error);
  }
};

// ---------------------------
// Get complete user session
// ---------------------------
export const getUserSession = async (): Promise<{
  token: string | null;
  email: string | null;
}> => {
  try {
    const token = await getData('token');
    const email = await getData('email_address');
    return { token, email };
  } catch (error) {
    console.log('[AsyncStorage] Error getting session:', error);
    return { token: null, email: null };
  }
};

/**
 * Clear complete user session (token, email, userData)
 */
export const clearUserSession = async () => {
  try {
    await AsyncStorage.multiRemove(['token', 'email_address', 'userData']);
    console.log('[Storage] User session cleared successfully');
  } catch (error) {
    console.log('[Storage] Error clearing user session:', error);
  }
};


// usage of Async-storage
// import { storeData, getData, removeData } from './helpers/storageHelper';

// Save token & email after signup/login
// await storeData('token', res.data.token);
// await storeData('email_address', res.data.email_address);

// Get token & email for API calls
// const token = await getData('token');
// const email = await getData('email_address');

// Remove token/email (logout)
// await removeData('token');
// await removeData('email_address');



/**
 * Format Pakistan phone number on typing:
 * - Only replace starting 0 with +92 once
 * - No dash, rest of number user types as is
 */
export const formatPhoneNumber = (input: string) => {
  if (!input) return '';

  // Remove non-digit characters
  let digits = input.replace(/[^\d]/g, '');

  // Replace starting 0 with +92
  if (digits.startsWith('0')) {
    digits = '+92' + digits.slice(1);
  }

  return digits;
};

/**
 * Validate Pakistan phone number: +92 followed by 10 digits
 */
export const validatePhoneNumber = (phone: string) => {
  const regex = /^\+92\d{10}$/;
  return regex.test(phone);
};