import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GTButton from '../../../components/buttons/gt-button';
import CustomHeader from '../../../components/custom-header';
import { color_theme } from '../../../services/styles/Style';
import GTIconButton from '../../../components/buttons/gt-icon-button';
import { useCallback, useMemo, useRef, useState } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import CustomModal from '../../../components/custom-modal';
import GTIcon from '../../../assets/icons';
import { getMachineDetail } from '../../../services/helper/helper';
import ApiService from '../../../services/utils/HttpHelper';
import FullScreenLoader from '../../../components/full-screen-loader';

const { width, height } = Dimensions.get('window');

export default function ReviewTrip() {
  const route = useRoute<any>();
  const { reviewTrip } = route.params;

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const images = reviewTrip.trip_images || [];
  const mainImage = images[0];

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['35%'], []);

  const openSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const deleteTrip = () => {
    setIsOpen(false);
    navigation.replace('Home');
  };

  // =============== API Integration ===============

  const postTrip = async () => {
    if (!reviewTrip) {
      const errMsg = 'Please plan the trip';
      Platform.OS === 'android'
        ? ToastAndroid.show(errMsg, ToastAndroid.LONG)
        : Alert.alert(errMsg);
    }
    try {
      setLoading(true);
      const machine_details = await getMachineDetail();
      const payload = {
        ...machine_details,
        ...reviewTrip,
      };
      const resp = await ApiService.postFromAPI('/route/end-point', payload, '');
      console.log(resp, 'API response');

      if (resp.success || resp.Status === 201) {
        navigation.replace('TripConfirm');
      }
    } catch (error: any) {
      console.log(error.message);
      const errMsg = error.response?.data?.message;
      Platform.OS === 'android'
        ? ToastAndroid.show(errMsg, ToastAndroid.LONG)
        : Alert.alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
    />
  );

  const Row = ({ label, value }: any) => (
    <View style={styles.rowItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader title="Review Trip" />

      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: height * 0.18 }}
        >
          <View style={styles.card}>
            {/* TOP */}
            <View style={styles.topRow}>
              <Image source={{ uri: mainImage }} style={styles.mainImage} />

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.title}>{reviewTrip.trip_title}</Text>
                <Text style={styles.budget}>PKR {reviewTrip.budget}</Text>
              </View>
            </View>

            {/* BASIC INFO */}
            <View style={styles.row}>
              <Row label="Country" value={reviewTrip.destination_country} />
              <Row label="City" value={reviewTrip.destination_city} />
            </View>

            <View style={styles.row}>
              <Row
                label="Start Date"
                value={new Date(reviewTrip.start_date).toDateString()}
              />
              <Row
                label="End Date"
                value={new Date(reviewTrip.end_date).toDateString()}
              />
            </View>

            <View style={styles.row}>
              <Row label="Travelers" value={reviewTrip.total_travelers} />
              <Row label="Transport" value={reviewTrip.transport_mode} />
            </View>

            <View style={styles.row}>
              <Row label="Hotel" value={reviewTrip.hotel_name} />
              <Row label="Status" value={reviewTrip.status} />
            </View>

            {/* DESCRIPTION */}
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.text}>{reviewTrip.description}</Text>

            {/* FOOD */}
            <Text style={styles.sectionTitle}>Food Preferences</Text>
            <View>
              <Text style={styles.text}>
                {reviewTrip.food_preferences?.join(', ')}
              </Text>
            </View>

            {/* NOTES */}
            <Text style={styles.sectionTitle}>Special Notes</Text>
            <Text style={styles.text}>{reviewTrip.special_notes}</Text>

            {/* TRAVELERS LIST */}
            {reviewTrip.travelers?.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Travelers</Text>
                {reviewTrip.travelers.map((t: any, i: number) => (
                  <Text key={i} style={styles.listText}>
                    {t.name} ({t.age} yrs)
                  </Text>
                ))}
              </>
            )}

            {/* ACTIVITIES */}
            {reviewTrip.activities?.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Activities</Text>
                {reviewTrip.activities.map((act: any, i: number) => (
                  <View key={i} style={styles.activityCard}>
                    <Text style={styles.actTitle}>{act.title}</Text>
                    <Text style={styles.text}>{act.description}</Text>
                    <Text style={styles.small}>
                      {act.time} • {act.location}
                    </Text>
                  </View>
                ))}
              </>
            )}

            {/* BOTTOM IMAGES */}
            {images.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 16 }}
              >
                {images.slice(1).map((img: string, i: number) => (
                  <Image
                    key={i}
                    source={{ uri: img }}
                    style={styles.smallImage}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </ScrollView>

        {/* FIXED BUTTON */}
        <View style={styles.bottomBtn}>
          <GTIconButton
            title="Edit and Delete"
            iconName="open-in-browser"
            bgColor={color_theme.mainBg}
            borderColor={color_theme.primary}
            borderWidth={1}
            onPress={openSheet}
            style={{ marginVertical: 6 }}
          />
          <GTButton
            title={
              loading ? (
                <FullScreenLoader
                  visible
                  text={'Please wait...'}
                  color={color_theme.primary}
                />
              ) : (
                'Confirm Trip'
              )
            }
            disabled={loading}
            onPress={postTrip}
          />
        </View>
      </View>
      <>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setIsOpen(false)}>
          <CustomModal
            transparent={true}
            visible={isOpen}
            onRequestClose={() => setIsOpen(false)}
            pera="This action is does not reversible"
            imageBgColor={color_theme.error}
            iconName="delete"
            iconSize={42}
            showButtons
            rightBtnTitle="Delete"
            onRightPress={deleteTrip}
            onLeftPress={() => setIsOpen(false)}
          />
        </TouchableOpacity>
      </>
      <>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose
          index={-1}
          backdropComponent={renderBackdrop}
          enableOverDrag={false}
          enableDynamicSizing={false}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text style={styles.sheetHeading}>Manage Your Trip</Text>
            <Text style={styles.sheetParagraph}>
              You can update trip details or delete this trip entirely. Please
              make sure all important information is saved before proceeding.
              Editing allows you to adjust trip dates, travelers, activities,
              and budget.
            </Text>
            <GTIconButton
              iconName="delete"
              title="Delete"
              color={color_theme.textWhite}
              onPress={() => setIsOpen(true)}
              bgColor={color_theme.error}
              iconColor={color_theme.textWhite}
              style={{ borderRadius: 26 }}
            />
            <GTIconButton
              style={{ top: 10 }}
              iconName="edit"
              title="Edit"
              iconColor={color_theme.textWhite}
              onPress={() => navigation.replace('PlanTrip')}
              color={color_theme.textWhite}
            />
          </BottomSheetView>
        </BottomSheet>
      </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color_theme.mainBg },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  mainImage: {
    width: width * 0.26,
    height: width * 0.26,
    borderRadius: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: color_theme.primary,
  },

  budget: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // items aamne-saamne
    marginTop: 10,
  },

  rowItem: { flex: 1 },

  label: { fontSize: 15, color: '#888' },

  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 4,
    color: color_theme.primary,
  },
  foontPref: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: color_theme.lightGreen,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  sheetHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: color_theme.primary,
    marginBottom: 6,
  },
  sheetParagraph: {
    fontSize: 14,
    color: color_theme.placeholderColor,
    lineHeight: 20,
    marginBottom: 12,
  },
  text: { fontSize: 13, color: '#333' },

  listText: { fontSize: 13, marginTop: 2, color: '#444' },

  activityCard: {
    backgroundColor: '#F3F5F9',
    // padding: 10,
    // gap: 6,
    borderRadius: 10,
    marginTop: 6,
  },

  actTitle: { fontWeight: '700', fontSize: 13 },

  small: { fontSize: 13, color: '#777' },

  smallImage: {
    width: 65,
    height: 65,
    borderRadius: 10,
    marginRight: 8,
  },

  bottomBtn: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: 'transparent',
  },
});
