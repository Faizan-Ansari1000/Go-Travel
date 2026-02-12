import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
  LayoutAnimation,
  UIManager,
  ToastAndroid,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../../../components/input-field';
import GTButton from '../../../components/buttons/gt-button';
import GTIconButton from '../../../components/buttons/gt-icon-button';
import GTIcon from '../../../assets/icons';
import { color_theme } from '../../../services/styles/Style';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomHeader from '../../../components/custom-header';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Interfaces
interface Traveler {
  name: string;
  age: number;
}

interface Activity {
  title: string;
  description: string;
  time: string;
  location: string;
}

interface TripDataModel {
  trip_title: string;
  destination_country: string;
  destination_city: string;
  start_date: string;
  end_date: string;
  budget: number;
  description: string;
  hotel_name: string;
  transport_mode: string;
  total_travelers: number;
  travelers: Traveler[];
  activities: Activity[];
  food_preferences: string[];
  special_notes: string;
  is_public: boolean;
  status: string;
}

interface ErrorModel {
  [key: string]: string;
}

export default function PlanTrip() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollRef = useRef<ScrollView>(null);

  const [model, setModel] = useState<TripDataModel>({
    trip_title: '',
    destination_country: '',
    destination_city: '',
    start_date: '',
    end_date: '',
    budget: 0,
    description: '',
    hotel_name: '',
    transport_mode: '',
    total_travelers: 0,
    travelers: [],
    activities: [],
    food_preferences: [],
    special_notes: '',
    is_public: false,
    status: 'Planning',
  });

  const [error, setError] = useState<ErrorModel>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sheetError, setSheetError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingDate, setEditingDate] = useState<'start' | 'end'>('start');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const snapPoints = useMemo(() => ['50%'], []);

  // Handle Android Back
  useEffect(() => {
    const backAction = () => {
      if (isSheetOpen) {
        bottomSheetRef.current?.close();
        setIsSheetOpen(false);
        return true; //  screen back block
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isSheetOpen]);

  /** ----------------- Helpers ----------------- */
  const validateTripTitle = (title: string) => {
    const regex = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)?$/;
    return regex.test(title.trim());
  };

  const handleChange = (key: keyof TripDataModel, value: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setModel(prev => ({ ...prev, [key]: value }));
    setError(prev => ({ ...prev, [key]: '' })); // clear error
  };

  const scrollToError = (y: number) => {
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  /** ----------------- Validation ----------------- */
  const validateForm = (): ErrorModel => {
    const err: ErrorModel = {};

    if (!model.trip_title.trim()) err.trip_title = 'Trip title required';
    else if (!validateTripTitle(model.trip_title))
      err.trip_title =
        'Invalid title. Only letters, numbers, single space allowed';

    if (!model.destination_country.trim())
      err.destination_country = 'Country required';

    if (!model.destination_city.trim()) err.destination_city = 'City required';

    if (!model.budget || isNaN(Number(model.budget)))
      err.budget = 'Valid budget required';

    if (!model.hotel_name || model.hotel_name.trim() === '')
      err.hotel_name = 'Hotel name required';

    if (!model.transport_mode || model.transport_mode.trim() === '')
      err.transport_mode = 'Transport mode required';

    if (!model.total_travelers || isNaN(Number(model.total_travelers)))
      err.total_travelers = 'Number of travelers required';

    if (!model.description || model.description.trim() === '')
      err.description = 'Description required';

    if (!model.food_preferences || model.food_preferences.length === 0)
      err.food_preferences = 'Select at least one food preference';

    if (!model.special_notes || model.special_notes.trim() === '')
      err.special_notes = 'Please add special notes';

    if (!startDate || !endDate) err['dates'] = 'Please set trip dates';

    return err;
  };

  /** ----------------- Travelers / Activities ----------------- */
  const handleTravelerChange = (
    index: number,
    key: keyof Traveler,
    value: any,
  ) => {
    const updated = [...model.travelers];
    updated[index] = { ...updated[index], [key]: value };
    setModel(prev => ({ ...prev, travelers: updated }));
  };

  const addTraveler = () => {
    setModel(prev => ({
      ...prev,
      travelers: [...prev.travelers, { name: '', age: 0 }],
    }));
  };

  const removeTraveler = (index: number) => {
    const updated = model.travelers.filter((_, i) => i !== index);
    setModel(prev => ({ ...prev, travelers: updated }));
  };

  const handleActivityChange = (
    index: number,
    key: keyof Activity,
    value: string,
  ) => {
    const updated = [...model.activities];
    updated[index] = { ...updated[index], [key]: value };
    setModel(prev => ({ ...prev, activities: updated }));
  };

  const addActivity = () => {
    setModel(prev => ({
      ...prev,
      activities: [
        ...prev.activities,
        { title: '', description: '', time: '', location: '' },
      ],
    }));
  };

  const removeActivity = (index: number) => {
    const updated = model.activities.filter((_, i) => i !== index);
    setModel(prev => ({ ...prev, activities: updated }));
  };

  /** ----------------- Bottom Sheet / Dates ----------------- */
  const handleConfirmDates = () => {
    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      const errMsg = 'Please set both start and end dates';
      Platform.OS === 'android'
        ? ToastAndroid.show(errMsg, ToastAndroid.LONG)
        : Alert.alert(errMsg);
      return;
    }

    setSheetError('');

    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();

    handleChange('start_date', startISO);
    handleChange('end_date', endISO);

    bottomSheetRef.current?.close();
  };

  const handleOpenDatePicker = (field: 'start' | 'end') => {
    setEditingDate(field);
    setShowDatePicker(true);
  };

  /** ----------------- Submit Form ----------------- */
  const handleSubmit = () => {
    const err = validateForm();
    if (Object.keys(err).length > 0) {
      setError(err);

      // Scroll to first error
      const firstErrorField = Object.keys(err)[0];
      const fieldOrder = [
        'trip_title',
        'destination_country',
        'destination_city',
        'budget',
        'hotel_name',
        'transport_mode',
        'total_travelers',
        'description',
        'food_preferences',
        'special_notes',
      ];
      const yOffset = fieldOrder.indexOf(firstErrorField) * 90;
      if (yOffset >= 0) scrollToError(yOffset);

      Alert.alert('Error', 'Please correct the highlighted fields');
      return;
    }

    const tripData = {
      ...model,
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
    };

    navigation.navigate('TripImages', { trip: tripData });
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
    />
  );

  /** ----------------- Render ----------------- */
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        <StatusBar
          backgroundColor={isSheetOpen ? 'rgba(0,0,0,0.0)' : color_theme.mainBg}
          barStyle={isSheetOpen ? 'light-content' : 'dark-content'}
        />

        <CustomHeader
          title="Plan Your Trip"
          leftIcon="arrow-back-ios-new"
          onLeftIconPress={() => navigation.goBack()}
        />
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16 }}
          >
            {/* Trip Title */}
            <View style={styles.inputCOntainer}>
              <InputField
                label="Trip Title"
                placeholder="Summer Vacation"
                value={model.trip_title}
                onChangeText={e => handleChange('trip_title', e)}
                borderColor={
                  error.trip_title ? color_theme.error : color_theme.textWhite
                }
              />
              {error.trip_title && (
                <Text style={styles.error}>{error.trip_title}</Text>
              )}
            </View>

            {/* Country + City */}
            <View style={styles.row}>
              <View style={styles.flex1}>
                <InputField
                  label="Destination Country"
                  placeholder="Pakistan"
                  value={model.destination_country}
                  onChangeText={e => handleChange('destination_country', e)}
                  borderColor={
                    error.destination_country
                      ? color_theme.error
                      : color_theme.textWhite
                  }
                />
                {error.destination_country && (
                  <Text style={styles.error}>{error.destination_country}</Text>
                )}
              </View>
              <View style={styles.flex1}>
                <InputField
                  label="Destination City"
                  placeholder="Hunza"
                  value={model.destination_city}
                  onChangeText={e => handleChange('destination_city', e)}
                  borderColor={
                    error.destination_city
                      ? color_theme.error
                      : color_theme.textWhite
                  }
                />
                {error.destination_city && (
                  <Text style={styles.error}>{error.destination_city}</Text>
                )}
              </View>
            </View>

            {/* Budget */}
            <View style={styles.inputCOntainer}>
              <InputField
                label="Budget"
                placeholder="150000"
                keyboardType="numeric"
                value={model.budget === 0 ? '' : String(model.budget)}
                onChangeText={e => handleChange('budget', Number(e))}
                borderColor={color_theme.textWhite}
              />
              {error.budget && <Text style={styles.error}>{error.budget}</Text>}
            </View>

            {/* Hotel Name */}
            <View style={styles.inputCOntainer}>
              <InputField
                label="Hotel Name"
                placeholder="Hunza Serena Inn"
                value={model.hotel_name}
                onChangeText={e => handleChange('hotel_name', e)}
                borderColor={
                  error.hotel_name ? color_theme.error : color_theme.textWhite
                }
              />
              {error.hotel_name && (
                <Text style={styles.error}>{error.hotel_name}</Text>
              )}
            </View>

            {/* Transport Mode */}
            <View style={styles.inputCOntainer}>
              <InputField
                label="Transport Mode"
                placeholder="Car"
                value={model.transport_mode}
                onChangeText={e => handleChange('transport_mode', e)}
                borderColor={
                  error.transport_mode
                    ? color_theme.error
                    : color_theme.textWhite
                }
              />
              {error.transport_mode && (
                <Text style={styles.error}>{error.transport_mode}</Text>
              )}
            </View>
            <View style={styles.inputCOntainer}>
              <GTIconButton
                style={{ marginTop: 5 }}
                iconName="av-timer"
                bgColor={color_theme.mainBg}
                borderColor={color_theme.primary}
                borderWidth={1}
                color={color_theme.primary}
                iconColor={color_theme.primary}
                title="Set Schedule"
                onPress={() => {
                  setIsSheetOpen(true); // 👈 instant update
                  bottomSheetRef.current?.expand();
                }}
              />
            </View>
            {/* Total Travelers */}
            <View style={styles.inputCOntainer}>
              <InputField
                label="Total Travelers"
                placeholder="3"
                keyboardType="numeric"
                value={
                  model.total_travelers === 0
                    ? ''
                    : String(model.total_travelers)
                }
                onChangeText={e => handleChange('total_travelers', Number(e))}
                borderColor={
                  error.total_travelers
                    ? color_theme.error
                    : color_theme.textWhite
                }
              />
              {error.total_travelers && (
                <Text style={styles.error}>{error.total_travelers}</Text>
              )}
            </View>

            {/* Description */}
            <View style={styles.inputCOntainer}>
              <InputField
                label="Description"
                placeholder="Trip description..."
                value={model.description}
                onChangeText={e => handleChange('description', e)}
                borderColor={
                  error.description ? color_theme.error : color_theme.textWhite
                }
                multiline
              />
              {error.description && (
                <Text style={styles.error}>{error.description}</Text>
              )}
            </View>

            {/* Food Preferences */}
            <View style={styles.inputCOntainer}>
              <InputField
                label="Food Preferences"
                placeholder="BBQ, Fast Food, Local Cuisine"
                value={model.food_preferences.join(', ')}
                onChangeText={text =>
                  handleChange(
                    'food_preferences',
                    text.split(',').map(s => s.trim()),
                  )
                }
                borderColor={
                  error.food_preferences
                    ? color_theme.error
                    : color_theme.textWhite
                }
              />
              {error.food_preferences && (
                <Text style={styles.error}>{error.food_preferences}</Text>
              )}
            </View>

            {/* Special Notes */}
            <View style={styles.inputCOntainer}>
              <InputField
                label="Special Notes"
                placeholder="Vegetarian for one traveler"
                value={model.special_notes}
                onChangeText={e => handleChange('special_notes', e)}
                borderColor={
                  error.special_notes
                    ? color_theme.error
                    : color_theme.textWhite
                }
                multiline
              />
              {error.special_notes && (
                <Text style={styles.error}>{error.special_notes}</Text>
              )}
            </View>

            {/* Bottom Sheet Trigger */}

            {/* Submit Button */}
            <GTButton
              title="Submit Trip"
              borderRadius={26}
              onPress={handleSubmit}
            />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose
          index={-1}
          backdropComponent={renderBackdrop}
          enableOverDrag={false}
          enableDynamicSizing={false}
          onChange={index => {
            setIsSheetOpen(index >= 0);
          }}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.bottomSheet}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Date Picker */}
            <Text style={styles.sheetTitle}>Select Trip Dates</Text>
            <View style={styles.row}>
              <View style={styles.half}>
                <InputField
                  label="Start Date"
                  placeholder="Select start date"
                  value={startDate ? startDate.toDateString() : ''}
                  editable={false}
                  borderColor={
                    sheetError ? color_theme.error : color_theme.primary
                  }
                  rightIcon={
                    <GTIcon name="date-range" color={color_theme.primary} />
                  }
                  rightIconOnPress={() => handleOpenDatePicker('start')}
                />
              </View>
              <View style={styles.half}>
                <InputField
                  label="End Date"
                  placeholder="Select end date"
                  value={endDate ? endDate.toDateString() : ''}
                  editable={false}
                  borderColor={
                    sheetError ? color_theme.error : color_theme.primary
                  }
                  rightIcon={
                    <GTIcon name="date-range" color={color_theme.primary} />
                  }
                  rightIconOnPress={() => handleOpenDatePicker('end')}
                />
              </View>
            </View>

            {/* Travelers */}
            <Text style={styles.sectionTitle}>Travelers</Text>
            {model.travelers.map((traveler, index) => (
              <View key={index} style={styles.card}>
                <InputField
                  label="Name"
                  value={traveler.name}
                  onChangeText={t => handleTravelerChange(index, 'name', t)}
                />
                <InputField
                  label="Age"
                  keyboardType="numeric"
                  value={String(traveler.age)}
                  onChangeText={t =>
                    handleTravelerChange(index, 'age', Number(t))
                  }
                />
                <GTButton
                  title="Remove Traveler"
                  borderRadius={12}
                  backgroundColor={'#f8d7da'}
                  textColor="#721c24"
                  onPress={() => removeTraveler(index)}
                />
              </View>
            ))}
            <GTButton
              title="Add Traveler"
              borderRadius={8}
              style={{ borderWidth: 1, borderColor: color_theme.primary }}
              backgroundColor={color_theme.textWhite}
              textColor={color_theme.primary}
              onPress={addTraveler}
            />

            {/* Activities */}
            <Text style={styles.sectionTitle}>Activities</Text>
            {model.activities.map((act, index) => (
              <View key={index} style={styles.card}>
                <InputField
                  label="Title"
                  value={act.title}
                  onChangeText={t => handleActivityChange(index, 'title', t)}
                />
                <InputField
                  label="Description"
                  value={act.description}
                  onChangeText={t =>
                    handleActivityChange(index, 'description', t)
                  }
                />
                <InputField
                  label="Time"
                  value={act.time}
                  onChangeText={t => handleActivityChange(index, 'time', t)}
                />
                <InputField
                  label="Location"
                  value={act.location}
                  onChangeText={t => handleActivityChange(index, 'location', t)}
                />
                <GTButton
                  title="Remove Activity"
                  borderRadius={8}
                  backgroundColor={color_theme.lightError}
                  textColor={color_theme.textWhite}
                  onPress={() => removeActivity(index)}
                />
              </View>
            ))}
            <GTButton
              title="Add Activity"
              borderRadius={8}
              style={{ borderWidth: 1, borderColor: color_theme.primary }}
              backgroundColor={color_theme.textWhite}
              textColor={color_theme.primary}
              onPress={addActivity}
            />
            <GTButton title="Confirm" onPress={handleConfirmDates} />
          </BottomSheetScrollView>
        </BottomSheet>

        <DatePicker
          modal
          mode="date"
          open={showDatePicker}
          date={
            editingDate === 'start'
              ? startDate || new Date()
              : endDate || new Date()
          }
          onConfirm={date => {
            if (editingDate === 'start') {
              setStartDate(date);
              setModel(prev => ({ ...prev, start_date: date.toISOString() }));
            } else {
              setEndDate(date);
              setModel(prev => ({ ...prev, end_date: date.toISOString() }));
            }
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color_theme.mainBg },
  row: { flexDirection: 'row', gap: 12, paddingBottom: 10 },
  inputCOntainer: { paddingBottom: 10 },
  half: { flex: 1 },
  flex1: { flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  card: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color_theme.primary,
    gap: 8,
  },
  error: { color: color_theme.error, fontSize: 13, paddingLeft: 3 },
  bottomSheet: { padding: 16, gap: 10, paddingBottom: 26 },
  sheetTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
});
