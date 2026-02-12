import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  StatusBar,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

import InputField from '../../components/input-field';
import GTButton from '../../components/buttons/gt-button';
import { color_theme } from '../../services/styles/Style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function Payment() {
  const sheetRef = useRef<BottomSheet>(null);
  const previewRef = useRef<any>(null);

  const snapPoints = useMemo(() => ['40%'], []);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // ===== Form State =====
  const [form, setForm] = useState({
    amount: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardHolder: '',
  });

  const [error, setError] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardHolder: '',
    amount: '',
  });

  // ===== Handle Form Input =====
  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
    if (field !== 'amount') setError({ ...error, [field]: '' });
  };

  const validate = () => {
    let valid = true;
    let newError = { ...error };

    if (!form.amount || form.amount.length < 3) {
      newError.amount = 'Amount must be greater than 50';
      valid = false;
    }

    if (!form.cardNumber || form.cardNumber.length < 16) {
      newError.cardNumber = 'Card number must be 16 digits';
      valid = false;
    }
    if (!form.expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
      newError.expiry = 'Expiry must be MM/YY';
      valid = false;
    }
    if (!form.cvv || form.cvv.length !== 3) {
      newError.cvv = 'CVV must be 3 digits';
      valid = false;
    }
    if (!form.cardHolder || !/^[A-Za-z ]{3,}$/.test(form.cardHolder.trim())) {
      newError.cardHolder = 'Enter valid card holder name';
      valid = false;
    }

    setError(newError);
    return valid;
  };

  // ===== Simulate Payment =====
  const handlePayment = () => {
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      sheetRef.current?.expand();
      setIsSheetOpen(true);
    }, 2000);
  };

  useEffect(() => {
    const backAction = () => {
      if (isSheetOpen) {
        sheetRef.current?.close();
        setIsSheetOpen(false);
        return true;
      }

      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }

      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => {} },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: true },
      );
      return true; // prevent default back
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => sub.remove();
  }, [isSheetOpen, navigation]);

  // ===== Save Receipt Image =====
  const handleSaveImage = async () => {
    try {
      const uri = await previewRef.current.capture();
      await CameraRoll.save(uri, { type: 'photo' });
      setPreviewVisible(false);
      Alert.alert('Success', 'Receipt saved to gallery');
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Could not save receipt');
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  // ===== Dynamic Receipt UI =====
  const ReceiptUI = () => (
    <View style={styles.receiptContainer}>
      <Text style={styles.sheetTitle}>Payment Receipt</Text>
      <ReceiptRow label="Amount" value={`PKR ${form.amount}`} />
      <ReceiptRow
        label="Transaction ID"
        value={`TXN${Math.floor(Math.random() * 1000000)}`}
      />
      <ReceiptRow
        label="Card Number"
        value={
          form.cardNumber ? `**** **** **** ${form.cardNumber.slice(-4)}` : ''
        }
      />
      <ReceiptRow label="Expiry" value={form.expiry} />
      <ReceiptRow label="Paid To" value="JazzCash / Dummy Wallet" />
      <ReceiptRow label="Card Holder" value={form.cardHolder} />
    </View>
  );

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={isSheetOpen ? 'rgba(0,0,0,0)' : color_theme.mainBg}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: color_theme.mainBg }}>
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Online Payment</Text>

          <InputField
            label="Amount"
            placeholder="Enter amount"
            value={form.amount}
            onChangeText={e => {
              handleChange('amount', e);

              setError(prev => ({
                ...prev,
                amount: '',
              }));
            }}
            keyboardType="number-pad"
            borderColor={
              error.amount ? color_theme.error : color_theme.textWhite
            }
          />
          {error.amount && <Text style={styles.error}>{error.amount}</Text>}

          <View style={{ marginTop: 10, marginBottom: 3 }}>
            <InputField
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={form.cardNumber}
              onChangeText={e => {
                handleChange('cardNumber', e);

                setError(prev => ({
                  ...prev,
                  cardNumber: '',
                }));
              }}
              borderColor={
                error.cardNumber ? color_theme.error : color_theme.textWhite
              }
              keyboardType="number-pad"
              maxLength={16}
            />
            {error.cardNumber && (
              <Text style={styles.error}>{error.cardNumber}</Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <InputField
                label="Expiry"
                placeholder="MM/YY"
                value={form.expiry}
                onChangeText={e => {
                  handleChange('expiry', e);

                  setError(prev => ({
                    ...prev,
                    expiry: '',
                  }));
                }}
                borderColor={
                  error.expiry ? color_theme.error : color_theme.textWhite
                }
                maxLength={5}
              />
              {error.expiry && <Text style={styles.error}>{error.expiry}</Text>}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <InputField
                label="CVV"
                placeholder="***"
                value={form.cvv}
                onChangeText={e => {
                  handleChange('cvv', e);

                  setError(prev => ({
                    ...prev,
                    cvv: '',
                  }));
                }}
                borderColor={
                  error.cvv ? color_theme.error : color_theme.textWhite
                }
                secureTextEntry
                maxLength={3}
              />
              {error.cvv && <Text style={styles.error}>{error.cvv}</Text>}
            </View>
          </View>

          <View style={{ marginVertical: 6 }}>
            <InputField
              label="Card Holder Name"
              placeholder="Faizan Ansari"
              value={form.cardHolder}
              onChangeText={e => {
                handleChange('cardHolder', e);

                setError(prev => ({
                  ...prev,
                  cardHolder: '',
                }));
              }}
              borderColor={
                error.cardHolder ? color_theme.error : color_theme.textWhite
              }
            />
            {error.cardHolder && (
              <Text style={styles.error}>{error.cardHolder}</Text>
            )}
          </View>

          <GTButton
            title={loading ? 'Processing...' : `Pay PKR ${form.amount}`}
            onPress={handlePayment}
            disabled={loading}
            style={{ marginTop: 20 }}
            borderRadius={26}
          />
        </ScrollView>

        {/* ===== Bottom Sheet ===== */}
        <BottomSheet
          ref={sheetRef}
          index={-1}
          snapPoints={snapPoints}
          backdropComponent={renderBackdrop}
          enablePanDownToClose
          onChange={index => setIsSheetOpen(index >= 0)}
        >
          <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
            <ReceiptUI />
            <GTButton
              title="Download Receipt"
              onPress={() => setPreviewVisible(true)}
              style={{ marginTop: 20 }}
              borderRadius={26}
            />
          </BottomSheetScrollView>
        </BottomSheet>

        {/* ===== Preview Modal ===== */}
        <Modal visible={previewVisible} transparent animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalCard}>
              <Text style={styles.previewTitle}>Receipt Preview</Text>
              <ViewShot
                ref={previewRef}
                options={{ format: 'png', quality: 1 }}
              >
                <ReceiptUI />
              </ViewShot>
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <GTButton
                  title="Cancel"
                  backgroundColor={color_theme.textWhite}
                  style={{
                    flex: 1,
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: color_theme.primary,
                  }}
                  textColor={color_theme.primary}
                  borderRadius={26}
                  onPress={() => setPreviewVisible(false)}
                />
                <GTButton
                  title="Save"
                  style={{ flex: 1 }}
                  borderRadius={26}
                  onPress={handleSaveImage}
                />
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

// ===== Receipt Row Component =====
const ReceiptRow = ({ label, value }: any) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: color_theme.primary,
  },
  row: { flexDirection: 'row', marginTop: 10 },
  error: {
    color: color_theme.error,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  receiptContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: color_theme.primary,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  detailLabel: { color: '#555', fontSize: 14 },
  detailValue: { fontWeight: '600', fontSize: 14, color: '#222' },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: color_theme.primary,
  },
});
