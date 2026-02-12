import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import ApiService from '../../../services/utils/HttpHelper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FullScreenLoader from '../../../components/full-screen-loader';
import InputField from '../../../components/input-field';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { color_theme } from '../../../services/styles/Style';
import GTButton from '../../../components/buttons/gt-button';

/* ---------------- TYPES ---------------- */

interface Traveler {
  name?: string;
  age?: number;
}

interface Activity {
  title?: string;
  description?: string;
  time?: string;
  location?: string;
}

interface MyTrips {
  trip_title?: string;
  destination_country?: string;
  destination_city?: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  description?: string;
  hotel_name?: string;
  transport_mode?: string;
  total_travelers?: number;
  travelers?: Traveler[];
  activities?: Activity[];
  food_preferences?: string[];
  special_notes?: string;
  status?: string;
  trip_images?: string[];
}

/* ---------------- MAIN ---------------- */

export default function Favorite() {
  const [postData, setPostData] = useState<MyTrips[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<MyTrips | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
    />
  );

  /* -------- BACK BUTTON -------- */
  useEffect(() => {
    const backAction = () => {
      if (isSheetOpen && selectedTrip) {
        bottomSheetRef.current?.close();
        setSelectedTrip(null);
        setIsSheetOpen(false);
        return true;
      }

      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => sub.remove();
  }, [isSheetOpen, selectedTrip]);

  /* -------- API -------- */
  const getMyTrips = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ApiService.getFromAPI('/route/end-point', '');
      if (res.success || res.status === 200) setPostData(res.data);
    } catch (error: any) {
      const errMsg = error.response?.data?.message || 'Error';
      Platform.OS === 'android'
        ? ToastAndroid.show(errMsg, ToastAndroid.LONG)
        : Alert.alert(errMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMyTrips();
  }, []);

  const filteredData = searchTitle
    ? postData.filter(i =>
        i.trip_title?.toLowerCase().includes(searchTitle.toLowerCase()),
      )
    : postData;

  /* ---------------- UI ---------------- */

  return (
    <>
      <StatusBar
        backgroundColor={isSheetOpen ? 'rgba(0,0,0,0.0)' : color_theme.mainBg}
        barStyle={isSheetOpen ? 'light-content' : 'dark-content'}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: color_theme.mainBg }}>
          {/* SEARCH */}
          <View style={{ padding: 16 }}>
            <InputField
              placeholder="Search trip"
              value={searchTitle}
              onChangeText={setSearchTitle}
              rightIcon="search"
            />
          </View>

          {/* {loading ? (
          <FullScreenLoader visible text="Please wait..." />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => {
                  setSelectedTrip(item);
                  bottomSheetRef.current?.expand();
                }}
              >
                <ImageBackground
                  source={{
                    uri:
                      item.trip_images?.[0] ||
                      'https://via.placeholder.com/400',
                  }}
                  style={styles.cardImage}
                  imageStyle={{ borderRadius: 18 }}
                >
                  <View style={styles.overlay} />

                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.trip_title}</Text>
                    <Text style={styles.cardSub}>
                      {item.destination_city}, {item.destination_country}
                    </Text>

                    <View style={styles.rowBetween}>
                      <Text style={styles.cardBudget}>PKR {item.budget}</Text>
                      <Text style={styles.cardTravelers}>
                        {item.total_travelers} People
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        )} */}

          {loading ? (
            <FullScreenLoader visible text="Please wait..." />
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={{
                paddingHorizontal: 16,
                flexGrow: 1, // important for centering empty component
              }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    You don't have any trips yet
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedTrip(item);
                    setIsSheetOpen(true);
                    bottomSheetRef.current?.expand();
                  }}
                >
                  <ImageBackground
                    source={{
                      uri:
                        item.trip_images?.[0] ||
                        'https://via.placeholder.com/400',
                    }}
                    style={styles.cardImage}
                    imageStyle={{ borderRadius: 18 }}
                  >
                    <View style={styles.overlay} />

                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{item.trip_title}</Text>
                      <Text style={styles.cardSub}>
                        {item.destination_city}, {item.destination_country}
                      </Text>

                      <View style={styles.rowBetween}>
                        <Text style={styles.cardBudget}>PKR {item.budget}</Text>
                        <Text style={styles.cardTravelers}>
                          {item.total_travelers} People
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              )}
            />
          )}

          {/* -------- BOTTOM SHEET -------- */}
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose
            index={-1}
            backdropComponent={renderBackdrop}
            enableOverDrag={false}
            enableDynamicSizing={false}
            onClose={() => setSelectedTrip(null)}
            onChange={index => {
              setIsSheetOpen(index >= 0);
              if (index === -1) {
                setSelectedTrip(null); // safety cleanup
              }
            }}
          >
            {selectedTrip && (
              <BottomSheetScrollView contentContainerStyle={styles.sheet}>
                {/* ---------- IMAGES ---------- */}{' '}
                <View style={{ paddingHorizontal: -20 }}>
                  <FlatList
                    data={selectedTrip.trip_images || []}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 0 }} // yaha padding remove
                    ItemSeparatorComponent={() => <View style={{ width: 0 }} />} // extra spacing hataye
                    renderItem={({ item }) => (
                      <Image source={{ uri: item }} style={styles.sheetImage} />
                    )}
                  />
                </View>
                {/* HEADER */}
                <View style={styles.sheetHeader}>
                  <Text style={styles.city}>{selectedTrip.trip_title}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>PKR {selectedTrip.budget}</Text>
                  </View>
                </View>
                <Text style={styles.subtitle}>
                  {selectedTrip.destination_city} •{' '}
                  {selectedTrip.destination_country}
                </Text>
                {/* DIVIDER */}
                <View style={styles.divider} />
                {/* INFO GRID */}
                <View>
                  <View style={styles.grid}>
                    <InfoCard label="Hotel" value={selectedTrip.hotel_name} />
                    <InfoCard
                      label="Transport"
                      value={selectedTrip.transport_mode}
                    />
                  </View>

                  <View style={styles.grid}>
                    <InfoCard
                      label="Travelers"
                      value={`${selectedTrip.total_travelers}`}
                    />
                    <InfoCard label="Status" value={selectedTrip.status} />
                  </View>
                </View>
                {/* DIVIDER */}
                <View style={styles.divider} />
                {/* SCHEDULE */}
                <Text style={styles.sectionTitle}>Schedule</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    {/* Start Date */}
                    <View style={{ marginRight: 10 }}>
                      <Text
                        style={{ fontSize: 12, color: '#777', marginBottom: 2 }}
                      >
                        Start Date
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 20,
                          backgroundColor: '#B3C3D5',
                        }}
                      >
                        <Text style={styles.normalText}>
                          {new Date(
                            selectedTrip.start_date || '',
                          ).toDateString()}
                        </Text>
                      </View>
                    </View>

                    {/* End Date */}
                    <View>
                      <Text
                        style={{ fontSize: 12, color: '#777', marginBottom: 2 }}
                      >
                        End Date
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 20,
                          backgroundColor: '#B3C3D5',
                        }}
                      >
                        <Text style={styles.normalText}>
                          {new Date(selectedTrip.end_date || '').toDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                {/* DIVIDER */}
                <View style={styles.divider} />
                {/* FOOD */}
                <Text style={styles.sectionTitle}>Food Preferences</Text>
                <View style={styles.chips}>
                  {selectedTrip.food_preferences?.map((f, i) => (
                    <View
                      key={i}
                      style={[styles.chip, { backgroundColor: '#B3C3D5' }]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          { color: color_theme.primary },
                        ]}
                      >
                        {f}
                      </Text>
                    </View>
                  ))}
                </View>
                {/* DIVIDER */}
                <View style={styles.divider} />
                {/* ACTIVITIES */}
                <Text style={styles.sectionTitle}>Activities</Text>
                {selectedTrip.activities?.map((a, i) => (
                  <View key={i} style={styles.activityBox}>
                    <Text style={styles.activityTitle}>{a.title}</Text>
                    <Text style={styles.activityMeta}>
                      {a.time} • {a.location}
                    </Text>
                    <Text style={styles.activityDesc}>{a.description}</Text>
                  </View>
                ))}
                {/* DIVIDER */}
                <View style={styles.divider} />
                {/* TRAVELERS */}
                <Text style={styles.sectionTitle}>Travelers</Text>
                {selectedTrip.travelers?.map((t, i) => (
                  <View key={i} style={styles.travelerRow}>
                    <Text style={styles.normalText}>{t.name}</Text>
                    <Text style={styles.grayText}>{t.age} yrs</Text>
                  </View>
                ))}
                {/* DIVIDER */}
                <View style={styles.divider} />
                {/* NOTES */}
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.normalText}>
                  {selectedTrip.special_notes || 'No notes'}
                </Text>
                <View>
                  <GTButton
                    title={'Payment'}
                    onPress={() => navigation.navigate('Payment')}
                    borderRadius={26}
                    style={{ marginVertical: 10 }}
                  />
                </View>
              </BottomSheetScrollView>
            )}
          </BottomSheet>
        </SafeAreaView>
      </GestureHandlerRootView>
    </>
  );
}

/* ---------- SMALL INFO CARD ---------- */
const InfoCard = ({ label, value }: any) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '-'}</Text>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  card: { marginBottom: 16, borderRadius: 18, overflow: 'hidden' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
    textAlign: 'center',
  },

  cardImage: { height: 190, justifyContent: 'flex-end' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  cardContent: { padding: 16 },

  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },

  cardSub: { color: '#ddd', marginTop: 4 },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  cardBudget: { color: '#4CAF50', fontWeight: '700' },

  cardTravelers: { color: '#fff' },

  sheet: {
    padding: 16,
  },
  sheetImage: {
    paddingHorizontal: -20,
    width: 220,
    height: 150,
    borderRadius: 14,
    marginRight: 10,
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  city: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
  },

  priceContainer: {
    backgroundColor: color_theme.lightGreen,
    paddingHorizontal: 12,
    borderRadius: 20,
    paddingVertical: 6,
  },

  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: color_theme.placeholderColor,
  },

  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  infoCard: {
    width: '48%',
    backgroundColor: '#CAD5E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  infoLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // marginBottom: 20,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    fontSize: 12,
    fontWeight: '500',
  },

  activityBox: {
    backgroundColor: '#CAD5E2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },

  activityTitle: {
    fontWeight: '700',
    fontSize: 14,
  },

  activityMeta: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },

  activityDesc: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },

  travelerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  normalText: {
    fontSize: 14,
  },

  grayText: {
    fontSize: 13,
    color: '#777',
  },
});
