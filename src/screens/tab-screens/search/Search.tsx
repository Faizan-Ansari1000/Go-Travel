import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import InputField from '../../../components/input-field';
import MyList from '../../../components/flat-list';
import GTButton from '../../../components/buttons/gt-button';
import { color_theme } from '../../../services/styles/Style';
import CustomHeader from '../../../components/custom-header';
import GTIcon from '../../../assets/icons';
import CustomModal from '../../../components/custom-modal';

interface TravelData {
  id: any;
  city: string;
  province: string;
  tripType: string;
  days: number;
  pricePKR: number;
  hotel: {
    name: string;
    stars: number;
    rating: number;
  };
  transport: string;
  activities: string[];
  available: boolean;
}

const { width } = Dimensions.get('window');
const scale = width / 375;

export default function Search() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [postData, setPostData] = useState<TravelData[]>([
    {
      id: 1,
      city: 'Lahore',
      province: 'Punjab',
      tripType: 'City Tour',
      days: 3,
      pricePKR: 35000,
      hotel: { name: 'PC Lahore', stars: 5, rating: 4.6 },
      transport: 'Bus',
      activities: ['Badshahi Mosque', 'Food Street', 'Lahore Fort'],
      available: true,
    },
    {
      id: 2,
      city: 'Karachi',
      province: 'Sindh',
      tripType: 'Beach Holiday',
      days: 4,
      pricePKR: 42000,
      hotel: { name: 'Movenpick', stars: 5, rating: 4.5 },
      transport: 'Flight',
      activities: ['Clifton Beach', 'Do Darya', 'Port Grand'],
      available: true,
    },
    {
      id: 3,
      city: 'Islamabad',
      province: 'ICT',
      tripType: 'City & Nature',
      days: 2,
      pricePKR: 28000,
      hotel: { name: 'Serena', stars: 5, rating: 4.7 },
      transport: 'Car',
      activities: ['Faisal Mosque', 'Monal', 'Daman-e-Koh'],
      available: true,
    },
    {
      id: 4,
      city: 'Murree',
      province: 'Punjab',
      tripType: 'Hill Station',
      days: 3,
      pricePKR: 30000,
      hotel: { name: 'Lockwood', stars: 4, rating: 4.2 },
      transport: 'Bus',
      activities: ['Mall Road', 'Patriata', 'Chair Lift'],
      available: false,
    },
    {
      id: 5,
      city: 'Hunza',
      province: 'Gilgit Baltistan',
      tripType: 'Mountain Adventure',
      days: 6,
      pricePKR: 75000,
      hotel: { name: 'Eagle Nest', stars: 4, rating: 4.8 },
      transport: 'Jeep',
      activities: ['Attabad Lake', 'Passu Cones', 'Baltit Fort'],
      available: true,
    },
    {
      id: 6,
      city: 'Skardu',
      province: 'Gilgit Baltistan',
      tripType: 'Adventure',
      days: 7,
      pricePKR: 82000,
      hotel: { name: 'Shangrila', stars: 4, rating: 4.7 },
      transport: 'Flight',
      activities: ['Deosai', 'Upper Kachura', 'Cold Desert'],
      available: true,
    },
    {
      id: 7,
      city: 'Naran',
      province: 'KPK',
      tripType: 'Nature',
      days: 4,
      pricePKR: 38000,
      hotel: { name: 'PTDC Naran', stars: 3, rating: 4.0 },
      transport: 'Bus',
      activities: ['Saif-ul-Malook', 'Waterfalls'],
      available: true,
    },
    {
      id: 8,
      city: 'Swat',
      province: 'KPK',
      tripType: 'Valley Tour',
      days: 5,
      pricePKR: 45000,
      hotel: { name: 'Swat Serena', stars: 4, rating: 4.4 },
      transport: 'Car',
      activities: ['Kalam', 'Malam Jabba', 'River View'],
      available: true,
    },
    {
      id: 9,
      city: 'Bahawalpur',
      province: 'Punjab',
      tripType: 'Historical',
      days: 3,
      pricePKR: 26000,
      hotel: { name: 'One Bahawalpur', stars: 4, rating: 4.1 },
      transport: 'Train',
      activities: ['Noor Mahal', 'Derawar Fort'],
      available: true,
    },
    {
      id: 10,
      city: 'Gwadar',
      province: 'Balochistan',
      tripType: 'Coastal',
      days: 4,
      pricePKR: 55000,
      hotel: { name: 'Zaver Pearl', stars: 4, rating: 4.3 },
      transport: 'Flight',
      activities: ['Gwadar Port', 'Hammerhead'],
      available: false,
    },

    {
      id: 11,
      city: 'Multan',
      province: 'Punjab',
      tripType: 'Spiritual',
      days: 2,
      pricePKR: 24000,
      hotel: { name: 'Avari Xpress', stars: 3, rating: 4.0 },
      transport: 'Bus',
      activities: ['Shrines', 'Multan Fort'],
      available: true,
    },
    {
      id: 12,
      city: 'Faisalabad',
      province: 'Punjab',
      tripType: 'City',
      days: 2,
      pricePKR: 22000,
      hotel: { name: 'Grand Regent', stars: 3, rating: 3.9 },
      transport: 'Car',
      activities: ['Clock Tower', 'Shopping'],
      available: true,
    },
    {
      id: 13,
      city: 'Sialkot',
      province: 'Punjab',
      tripType: 'City',
      days: 2,
      pricePKR: 21000,
      hotel: { name: 'Hotel Javson', stars: 3, rating: 3.8 },
      transport: 'Car',
      activities: ['Iqbal Manzil', 'Markets'],
      available: true,
    },
    {
      id: 14,
      city: 'Abbottabad',
      province: 'KPK',
      tripType: 'Hill City',
      days: 3,
      pricePKR: 32000,
      hotel: { name: 'Shimla Hills', stars: 4, rating: 4.2 },
      transport: 'Bus',
      activities: ['Nathia Gali', 'Sightseeing'],
      available: true,
    },
    {
      id: 15,
      city: 'Chitral',
      province: 'KPK',
      tripType: 'Cultural',
      days: 5,
      pricePKR: 68000,
      hotel: { name: 'PTDC Chitral', stars: 3, rating: 4.1 },
      transport: 'Jeep',
      activities: ['Kalash Valley', 'Chitral Fort'],
      available: true,
    },

    {
      id: 16,
      city: 'Kalash',
      province: 'KPK',
      tripType: 'Cultural',
      days: 4,
      pricePKR: 60000,
      hotel: { name: 'Kalash Inn', stars: 3, rating: 4.3 },
      transport: 'Jeep',
      activities: ['Festivals', 'Local Culture'],
      available: true,
    },
    {
      id: 17,
      city: 'Ziarat',
      province: 'Balochistan',
      tripType: 'Hill Station',
      days: 3,
      pricePKR: 36000,
      hotel: { name: 'PTDC Ziarat', stars: 3, rating: 4.0 },
      transport: 'Car',
      activities: ['Quaid Residency', 'Juniper Forest'],
      available: true,
    },
    {
      id: 18,
      city: 'Quetta',
      province: 'Balochistan',
      tripType: 'City',
      days: 3,
      pricePKR: 33000,
      hotel: { name: 'Serena Quetta', stars: 4, rating: 4.4 },
      transport: 'Flight',
      activities: ['Hanna Lake', 'Bazaar'],
      available: true,
    },
    {
      id: 19,
      city: 'Hyderabad',
      province: 'Sindh',
      tripType: 'City',
      days: 2,
      pricePKR: 23000,
      hotel: { name: 'Indus Hotel', stars: 3, rating: 3.9 },
      transport: 'Bus',
      activities: ['Pacco Qillo', 'Markets'],
      available: true,
    },
    {
      id: 20,
      city: 'Sukkur',
      province: 'Sindh',
      tripType: 'River View',
      days: 2,
      pricePKR: 25000,
      hotel: { name: 'Inter Pak Inn', stars: 3, rating: 4.0 },
      transport: 'Train',
      activities: ['Lansdowne Bridge', 'Indus View'],
      available: true,
    },

    {
      id: 21,
      city: 'Larkana',
      province: 'Sindh',
      tripType: 'Historical',
      days: 2,
      pricePKR: 24000,
      hotel: { name: 'Hotel Days Inn', stars: 3, rating: 3.8 },
      transport: 'Bus',
      activities: ['Mohenjo Daro'],
      available: true,
    },
    {
      id: 22,
      city: 'Khaplu',
      province: 'Gilgit Baltistan',
      tripType: 'Nature',
      days: 5,
      pricePKR: 70000,
      hotel: { name: 'Khaplu Palace', stars: 4, rating: 4.6 },
      transport: 'Jeep',
      activities: ['Khaplu Fort', 'Valley Views'],
      available: true,
    },
    {
      id: 23,
      city: 'Astore',
      province: 'Gilgit Baltistan',
      tripType: 'Adventure',
      days: 5,
      pricePKR: 68000,
      hotel: { name: 'PTDC Astore', stars: 3, rating: 4.2 },
      transport: 'Jeep',
      activities: ['Rama Lake', 'Meadows'],
      available: true,
    },
    {
      id: 24,
      city: 'Neelum Valley',
      province: 'AJK',
      tripType: 'Nature',
      days: 4,
      pricePKR: 52000,
      hotel: { name: 'Neelum View', stars: 3, rating: 4.4 },
      transport: 'Car',
      activities: ['Keran', 'Waterfalls'],
      available: true,
    },
    {
      id: 25,
      city: 'Muzaffarabad',
      province: 'AJK',
      tripType: 'City & Nature',
      days: 3,
      pricePKR: 34000,
      hotel: { name: 'Red Fort Hotel', stars: 3, rating: 4.1 },
      transport: 'Bus',
      activities: ['Red Fort', 'River View'],
      available: true,
    },

    {
      id: 26,
      city: 'Kotli',
      province: 'AJK',
      tripType: 'Nature',
      days: 3,
      pricePKR: 32000,
      hotel: { name: 'Green Valley Inn', stars: 3, rating: 4.0 },
      transport: 'Car',
      activities: ['Hills', 'Picnic'],
      available: true,
    },
    {
      id: 27,
      city: 'Thatta',
      province: 'Sindh',
      tripType: 'Heritage',
      days: 2,
      pricePKR: 27000,
      hotel: { name: 'Indus Hotel', stars: 3, rating: 4.0 },
      transport: 'Bus',
      activities: ['Makli Necropolis'],
      available: true,
    },
    {
      id: 28,
      city: 'Hingol',
      province: 'Balochistan',
      tripType: 'National Park',
      days: 3,
      pricePKR: 48000,
      hotel: { name: 'Camp Stay', stars: 2, rating: 4.1 },
      transport: 'Jeep',
      activities: ['Princess of Hope', 'Desert Safari'],
      available: true,
    },
    {
      id: 29,
      city: 'Rahim Yar Khan',
      province: 'Punjab',
      tripType: 'City',
      days: 2,
      pricePKR: 22000,
      hotel: { name: 'Hotel One', stars: 3, rating: 3.9 },
      transport: 'Bus',
      activities: ['City Tour'],
      available: true,
    },
    {
      id: 30,
      city: 'Dera Ghazi Khan',
      province: 'Punjab',
      tripType: 'Cultural',
      days: 2,
      pricePKR: 21000,
      hotel: { name: 'DG Khan Inn', stars: 3, rating: 3.8 },
      transport: 'Bus',
      activities: ['Local Culture'],
      available: true,
    },

    {
      id: 31,
      city: 'Okara',
      province: 'Punjab',
      tripType: 'City',
      days: 1,
      pricePKR: 18000,
      hotel: { name: 'Okara Guest House', stars: 2, rating: 3.6 },
      transport: 'Car',
      activities: ['Markets'],
      available: true,
    },
    {
      id: 32,
      city: 'Kasur',
      province: 'Punjab',
      tripType: 'Cultural',
      days: 1,
      pricePKR: 19000,
      hotel: { name: 'Kasur Inn', stars: 2, rating: 3.7 },
      transport: 'Car',
      activities: ['Bulleh Shah Shrine'],
      available: true,
    },
    {
      id: 33,
      city: 'Jhelum',
      province: 'Punjab',
      tripType: 'River Side',
      days: 2,
      pricePKR: 23000,
      hotel: { name: 'River View Hotel', stars: 3, rating: 4.0 },
      transport: 'Bus',
      activities: ['River Jhelum'],
      available: true,
    },
    {
      id: 34,
      city: 'Attock',
      province: 'Punjab',
      tripType: 'Historical',
      days: 1,
      pricePKR: 20000,
      hotel: { name: 'Attock Guest House', stars: 2, rating: 3.6 },
      transport: 'Car',
      activities: ['Attock Fort'],
      available: true,
    },
    {
      id: 35,
      city: 'Chaman',
      province: 'Balochistan',
      tripType: 'Border City',
      days: 2,
      pricePKR: 26000,
      hotel: { name: 'Chaman Inn', stars: 3, rating: 3.9 },
      transport: 'Bus',
      activities: ['Local Bazaar'],
      available: true,
    },

    {
      id: 36,
      city: 'Turbat',
      province: 'Balochistan',
      tripType: 'Cultural',
      days: 2,
      pricePKR: 28000,
      hotel: { name: 'Turbat Hotel', stars: 3, rating: 3.8 },
      transport: 'Flight',
      activities: ['Local Culture'],
      available: true,
    },
    {
      id: 37,
      city: 'Panjgur',
      province: 'Balochistan',
      tripType: 'Desert',
      days: 2,
      pricePKR: 29000,
      hotel: { name: 'Panjgur Inn', stars: 2, rating: 3.7 },
      transport: 'Car',
      activities: ['Desert View'],
      available: true,
    },
    {
      id: 38,
      city: 'Gilgit',
      province: 'Gilgit Baltistan',
      tripType: 'Mountain City',
      days: 4,
      pricePKR: 62000,
      hotel: { name: 'Gilgit Serena', stars: 4, rating: 4.5 },
      transport: 'Flight',
      activities: ['City Tour', 'River View'],
      available: true,
    },
    {
      id: 39,
      city: 'Dadu',
      province: 'Sindh',
      tripType: 'Nature',
      days: 2,
      pricePKR: 24000,
      hotel: { name: 'Dadu Guest House', stars: 2, rating: 3.6 },
      transport: 'Bus',
      activities: ['Gorakh Hill'],
      available: true,
    },
    {
      id: 40,
      city: 'Gorakh Hill',
      province: 'Sindh',
      tripType: 'Hill Station',
      days: 3,
      pricePKR: 48000,
      hotel: { name: 'Resort Camp', stars: 2, rating: 4.2 },
      transport: 'Jeep',
      activities: ['Hill Views', 'Camping'],
      available: true,
    },

    {
      id: 41,
      city: 'Mithi',
      province: 'Sindh',
      tripType: 'Desert Culture',
      days: 2,
      pricePKR: 26000,
      hotel: { name: 'Thar Inn', stars: 2, rating: 3.9 },
      transport: 'Car',
      activities: ['Thar Culture'],
      available: true,
    },
    {
      id: 42,
      city: 'Umerkot',
      province: 'Sindh',
      tripType: 'Historical',
      days: 2,
      pricePKR: 25000,
      hotel: { name: 'Umerkot Hotel', stars: 2, rating: 3.8 },
      transport: 'Bus',
      activities: ['Umerkot Fort'],
      available: true,
    },
    {
      id: 43,
      city: 'Badin',
      province: 'Sindh',
      tripType: 'Rural',
      days: 1,
      pricePKR: 19000,
      hotel: { name: 'Badin Rest House', stars: 2, rating: 3.5 },
      transport: 'Bus',
      activities: ['Local Life'],
      available: true,
    },
    {
      id: 44,
      city: 'Jacobabad',
      province: 'Sindh',
      tripType: 'City',
      days: 1,
      pricePKR: 18000,
      hotel: { name: 'Jacobabad Inn', stars: 2, rating: 3.4 },
      transport: 'Car',
      activities: ['City Tour'],
      available: true,
    },
    {
      id: 45,
      city: 'Shikarpur',
      province: 'Sindh',
      tripType: 'Heritage',
      days: 2,
      pricePKR: 23000,
      hotel: { name: 'Shikarpur Hotel', stars: 3, rating: 3.9 },
      transport: 'Bus',
      activities: ['Old City'],
      available: true,
    },

    {
      id: 46,
      city: 'Kohat',
      province: 'KPK',
      tripType: 'City',
      days: 2,
      pricePKR: 24000,
      hotel: { name: 'Kohat Inn', stars: 3, rating: 3.9 },
      transport: 'Car',
      activities: ['Local Bazaars'],
      available: true,
    },
    {
      id: 47,
      city: 'Bannu',
      province: 'KPK',
      tripType: 'Cultural',
      days: 2,
      pricePKR: 23000,
      hotel: { name: 'Bannu Hotel', stars: 3, rating: 3.8 },
      transport: 'Bus',
      activities: ['Local Food'],
      available: true,
    },
    {
      id: 48,
      city: 'Mansehra',
      province: 'KPK',
      tripType: 'Nature',
      days: 3,
      pricePKR: 34000,
      hotel: { name: 'Mansehra Inn', stars: 3, rating: 4.0 },
      transport: 'Bus',
      activities: ['Shogran'],
      available: true,
    },
    {
      id: 49,
      city: 'Shogran',
      province: 'KPK',
      tripType: 'Hill Station',
      days: 3,
      pricePKR: 40000,
      hotel: { name: 'Pine Park', stars: 3, rating: 4.3 },
      transport: 'Car',
      activities: ['Siri Paye'],
      available: true,
    },
    {
      id: 50,
      city: 'Sibi',
      province: 'Balochistan',
      tripType: 'Cultural',
      days: 1,
      pricePKR: 20000,
      hotel: { name: 'Sibi Guest House', stars: 2, rating: 3.6 },
      transport: 'Car',
      activities: ['Local Culture'],
      available: true,
    },
  ]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TravelData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const snapPoints = useMemo(() => ['50%'], []);

  useEffect(() => {
    const backAction = () => {
      //  Agar sheet open hai → sirf sheet close
      if (isSheetOpen) {
        bottomSheetRef.current?.close();
        setIsSheetOpen(false);
        return true; // screen back block
      }

      //  Agar sheet close hai → normal back
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isSheetOpen]);

  const filteredData = useMemo(() => {
    if (!search) return postData;
    return postData.filter(
      item =>
        item.city.toLowerCase().includes(search.toLowerCase()) ||
        item.pricePKR.toString().includes(search),
    );
  }, [search]);

  const openDetails = (item: TravelData) => {
    setSelectedItem(item);
    bottomSheetRef.current?.expand();
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
    />
  );

  return (
    <>
      <StatusBar
        backgroundColor={isSheetOpen ? 'rgba(0,0,0,0.0)' : color_theme.mainBg}
        barStyle={isSheetOpen ? 'light-content' : 'dark-content'}
      />
      {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
      <SafeAreaView style={styles.safe}>
        <CustomHeader
          title={
            showSearch ? (
              <View style={{ marginHorizontal: -(36 * scale) }}>
                <InputField
                  placeholder="Search city or price"
                  value={search}
                  onChangeText={setSearch}
                  autoFocus
                />
              </View>
            ) : (
              'Explore'
            )
          }
          titleColor={color_theme.primary}
          rightIcon={<GTIcon name={showSearch ? 'close' : 'search'} />}
          onRightIconPress={() => setShowSearch(!showSearch)}
        />

        <View style={{ padding: 16, paddingTop: 4 }}>
          <MyList<TravelData>
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.card}
                onPress={() => {
                  openDetails(item);
                  setIsSheetOpen(true); // 👈 instant update
                  bottomSheetRef.current?.expand();
                }}
              >
                <View style={styles.cardRow}>
                  {/* Left Highlight Container */}
                  <View style={styles.leftContainer}>
                    <Text style={styles.leftText}>{item.city.slice(0, 3)}</Text>
                  </View>

                  {/* Main Right Content */}
                  <View style={styles.rightContainer}>
                    <View style={styles.rowBetween}>
                      <Text style={styles.city}>{item.city}</Text>
                      <View style={styles.priceContainer}>
                        <Text style={styles.price}>Rs {item.pricePKR}</Text>
                      </View>
                    </View>

                    <Text style={styles.sub}>
                      {item.tripType} • {item.days} Days
                    </Text>

                    <Text style={styles.province}>{item.province}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* modal */}
        <CustomModal
          transparent={true}
          visible={isOpen}
          imageSource={{
            uri: 'https://static.vecteezy.com/system/resources/thumbnails/022/360/141/small/3d-folder-file-icon-illustration-png.png',
          }}
          onRequestClose={() => setIsOpen(false)}
          pera={`This information is displayed for ${'\n'}demonstration  purposes only and ${'\n'} does not represent actual or live data.`}
          // showButtons
        />

        {/* ---------------- Bottom Sheet ---------------- */}
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose
          onChange={index => {
            setIsSheetOpen(index >= 0);
          }}
          index={-1}
          backdropComponent={renderBackdrop}
          enableOverDrag={false}
          enableDynamicSizing={false}
        >
          {selectedItem && (
            <BottomSheetScrollView contentContainerStyle={styles.sheet}>
              {/* Header */}
              <View style={styles.sheetHeader}>
                <Text style={styles.city}>{selectedItem.city}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>Rs {selectedItem.pricePKR}</Text>
                </View>
              </View>

              <Text style={styles.subtitle}>
                {selectedItem.tripType} • {selectedItem.days} Days
              </Text>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Info Grid */}
              <View style={styles.grid}>
                <InfoCard label="Province" value={selectedItem.province} />
                <InfoCard label="Transport" value={selectedItem.transport} />
              </View>
              <View style={styles.grid}>
                <InfoCard label="Hotel" value={selectedItem.hotel.name} />
                <InfoCard
                  label="Rating"
                  value={`${selectedItem.hotel.rating} ⭐`}
                />
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Activities */}
              <Text style={styles.sectionTitle}>Activities</Text>
              <View style={styles.chips}>
                {selectedItem.activities.map((act, index) => (
                  <View
                    key={index}
                    style={[styles.chip, { backgroundColor: '#B3C3D5' }]}
                  >
                    <Text
                      style={[styles.chipText, { color: color_theme.primary }]}
                    >
                      {act}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={[styles.divider, { marginTop: -5 }]} />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.sectionTitle}>Hotel id</Text>
                <Text style={{ color: color_theme.placeholderColor }}>
                  {' '}
                  {selectedItem.id}
                </Text>
              </View>

              {/* CTA */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <GTButton
                  borderRadius={8}
                  style={{ width: '48.5%' }}
                  title="Book now"
                  onPress={() => setIsOpen(true)}
                />
                <GTButton
                  borderRadius={8}
                  backgroundColor={color_theme.divider}
                  textColor={color_theme.primary}
                  style={{
                    width: '48.5%',
                    borderColor: color_theme.primary,
                    borderWidth: 1,
                  }}
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    setIsSheetOpen(false)
                  }}
                  title="Cancel"
                />
              </View>
            </BottomSheetScrollView>
          )}
        </BottomSheet>
      </SafeAreaView>
      {/* </GestureHandlerRootView> */}
    </>
  );
}

/* ---------------- Small Component ---------------- */

const InfoCard = ({ label, value }: { label?: string; value: string }) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    // padding: 16,
    // paddingBottom: -30,
    backgroundColor: color_theme.mainBg,
  },

  card: {
    backgroundColor: color_theme.textWhite, // Clean white
    borderRadius: 18,
    marginBottom: 14,
    margin: 1,
    padding: 16,
    shadowColor: color_theme.placeholderColor,
    shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 0,
    elevation: 6, // Android shadow
    // borderColor: color_theme.accent,
    // borderWidth:1
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  leftContainer: {
    width: '20%',
    // height:120,
    backgroundColor: color_theme.primary, // Soft highlight
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    marginRight: 10,
  },

  leftText: {
    fontSize: 16,
    fontWeight: '700',
    color: color_theme.lightAccent,
  },

  rightContainer: {
    width: '75%',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  city: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121', // dark professional
  },

  priceContainer: {
    backgroundColor: color_theme.lightGreen, // soft green
    paddingHorizontal: 12,
    borderRadius: 20,
    paddingVertical: 6,
  },

  price: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
  },

  sub: {
    marginTop: 6,
    fontSize: 13,
    color: '#757575', // muted gray
  },

  province: {
    marginTop: 4,
    fontSize: 12,
    color: '#BDBDBD',
  },

  sheet: {
    padding: 20,
    // paddingBottom: 40,
  },

  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
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
    // flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  infoCard: {
    // width: '48%',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    // padding: 12,
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
    marginBottom: 20,
  },

  chip: {
    backgroundColor: color_theme.lightGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  chipText: {
    fontSize: 12,
    color: '#0A8F47',
    fontWeight: '500',
  },
});
