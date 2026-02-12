import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  BackHandler,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import ApiService from '../../../services/utils/HttpHelper';
import {
  clearUserSession,
  getUserSession,
} from '../../../services/helper/helper';
import GTButton from '../../../components/buttons/gt-button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color_theme } from '../../../services/styles/Style';
import GTIcon from '../../../assets/icons';

export default function DeleteProfile() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetIndex, setSheetIndex] = useState(-1);

  const bottomSheetRef = useRef<BottomSheet>(null);

  /* ---------------- Snap Point ---------------- */
  const snapPoints = useMemo(() => ['50%'], []);

  /* ---------------- Backdrop ---------------- */
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  /* ---------------- Hardware Back Handling ---------------- */
  useEffect(() => {
    const backAction = () => {
      //  Agar sheet open hai
      if (sheetIndex >= 0) {
        bottomSheetRef.current?.close();
        return true; // screen back na ho
      }

      return false; // normal screen back
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => sub.remove();
  }, [sheetIndex]);

  /* ---------------- Delete API ---------------- */
  const deleteAccount = async () => {
    try {
      setLoading(true);
      const { token } = await getUserSession();

      if (token) {
        const res = await ApiService.deleteFromAPI(`/route/end-point`, token);
        console.log(res, 'Backend response');
        if (res.success || res.status === 200) {
          await clearUserSession();
          navigation.replace('OnBoarding1');
        }
      } else {
        const noTokenMsg = 'Please logged-in account';
        Platform.OS === 'android'
          ? ToastAndroid.show(noTokenMsg, ToastAndroid.LONG)
          : Alert.alert(noTokenMsg);
      }
    } catch (error: any) {
      console.log(error.message);

      const msg = error?.response?.data?.message || 'Something went wrong';

      Platform.OS === 'android'
        ? ToastAndroid.show(msg, ToastAndroid.LONG)
        : Alert.alert(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Reason Item ---------------- */
  const ReasonItem = ({ title }: { title: string }) => {
    const active = selectedReason === title;

    return (
      <TouchableOpacity
        style={[styles.reasonItem, active && styles.reasonActive]}
        onPress={() => setSelectedReason(title)}
      >
        <Text style={[styles.reasonText, active && styles.reasonTextActive]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        backgroundColor={sheetOpen ? 'rgba(0,0,0,0.0)' : color_theme.mainBg}
        barStyle={sheetOpen ? 'light-content' : 'dark-content'}
      />

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ paddingVertical: 20, marginLeft: -3 }}
      >
        <Text>
          <GTIcon name={'arrow-back-ios-new'} />
        </Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Delete Your Account</Text>

      <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={styles.paragraph}>
            We are sorry to see you go. Deleting your account will permanently
            remove your profile, transaction history, saved preferences, and all
            associated data from our platform. This action cannot be undone.
          </Text>

          <Text style={styles.paragraph}>
            When your account is deleted, all personal data including saved
            trips, payment records, preferences, and history will be permanently
            removed from our servers. We follow strict data protection policies
            to ensure your privacy remains secure even after deletion.
          </Text>

          <Text style={styles.paragraph}>
            If you are experiencing any technical issue, billing problem, or
            service dissatisfaction, we strongly recommend reaching out to our
            support team. Many issues can be resolved quickly without losing
            your valuable data.
          </Text>

          <Text style={styles.paragraph}>
            Please note that once your account is deleted, you will lose access
            to:
          </Text>

          <Text style={styles.bullet}>• Travel history and saved trips</Text>
          <Text style={styles.bullet}>• Payment & transaction details</Text>
          <Text style={styles.bullet}>
            • Saved preferences and profile information
          </Text>
          <Text style={styles.bullet}>• Loyalty points or rewards</Text>

          <Text style={styles.paragraph}>
            You will need to create a new account if you wish to use our
            services in the future. Make sure you have backed up any important
            information before continuing.
          </Text>
        </ScrollView>
      </View>

      {/* ----------- Delete Button ----------- */}

      <GTButton
        title="Delete My Account"
        onPress={() => {
          setSheetOpen(true);
          bottomSheetRef.current?.expand();
        }}
        borderRadius={26}
      />

      {/* ================= BOTTOM SHEET ================= */}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onChange={index => setSheetIndex(index)}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContainer}>
          <Text style={styles.sheetTitle}>
            Help us understand why you're leaving
          </Text>

          <Text style={styles.sheetDesc}>
            Your feedback helps us improve our services and provide better
            experience for our users.
          </Text>

          <ReasonItem title="Privacy concerns" />
          <ReasonItem title="App performance issues" />
          <ReasonItem title="Not satisfied with services" />
          <ReasonItem title="Switching to another platform" />

          <GTButton
            title="Confirm Delete Account"
            loading={loading}
            onPress={() => {
              if (!selectedReason) {
                Platform.OS === 'android'
                  ? ToastAndroid.show(
                      'Please select a reason',
                      ToastAndroid.SHORT,
                    )
                  : Alert.alert('Please select a reason');
                return;
              }
              deleteAccount();
            }}
            backgroundColor={color_theme.error}
            style={{ marginTop: 25 }}
            borderRadius={26}
          />
        </BottomSheetScrollView>
      </BottomSheet>
      {/* </View> */}
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color_theme.mainBg,
    padding: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },

  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },

  paragraph: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 14,
  },

  /* -------- Bottom Sheet -------- */

  sheetContainer: {
    padding: 16,
    // paddingBottom: 40,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },

  sheetDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },

  reasonItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  reasonActive: {
    borderColor: '#000',
    backgroundColor: '#f4f4f4',
  },

  reasonText: {
    fontSize: 14,
  },

  reasonTextActive: {
    fontWeight: '600',
  },

  bullet: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
    marginLeft: 8,
  },

  bottomBtnContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: color_theme.mainBg,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
});
