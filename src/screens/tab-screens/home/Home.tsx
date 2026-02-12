import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color_theme } from '../../../services/styles/Style';
import GTButton from '../../../components/buttons/gt-button';
import CustomHeader from '../../../components/custom-header';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import AppSafeArea from '../../../components/app-safearea';

export default function Home() {
  const navigation = useNavigation<any>();

  const { width } = Dimensions.get('window');
  const scale = width / 375;

 

  return (
    // <SafeAreaView style={styles.safe}>
    <SafeAreaView style={styles.safe}>
      <CustomHeader
        title="Home"
        titleColor={color_theme.primary}
        leftIcon="sort"
        onLeftIconPress={() => navigation.openDrawer()}
      />

      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 50: 20 }}
        >
          {/* HERO / WELCOME */}
          <View style={styles.heroBox}>
            <Text style={styles.heroTitle}>Plan Your Next Journey ✈️</Text>
            <Text style={styles.heroSub}>
              Discover destinations, compare packages and book your dream trip
              with confidence.
            </Text>

            <GTButton
              title="Start Planning Your Trip"
              borderRadius={26}
              onPress={() => navigation.navigate('PlanTrip')}
              style={{ marginTop: 14 }}
            />
          </View>

          {/* QUICK ACTIONS */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickRow}>
            {['Search', 'Bookings', 'Wishlist', 'Support'].map((item, i) => (
              <TouchableOpacity key={i} style={styles.quickCard}>
                <Text style={styles.quickText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CATEGORIES */}
          <Text style={styles.sectionTitle}>Popular Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {[
              'Beach',
              'Mountains',
              'City',
              'Adventure',
              'Nature',
              'Historical',
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.hCard}>
                <Text style={styles.hCardTitle}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* DEAL BANNER */}
          <View style={styles.dealBox}>
            <Text style={styles.dealTitle}>Limited Time Offer</Text>
            <Text style={styles.dealSub}>
              Get up to 30% discount on northern tours this month.
            </Text>
            <GTButton title="Grab Deal" borderRadius={24} />
          </View>

          {/* FEATURES */}
          <Text style={styles.sectionTitle}>Why Choose Us</Text>

          {[
            {
              t: 'Best Prices',
              s: 'Affordable packages with no hidden charges.',
            },
            {
              t: 'Verified Hotels',
              s: 'Only trusted and top rated accommodations.',
            },
            {
              t: '24/7 Support',
              s: 'Dedicated support whenever you need help.',
            },
            {
              t: 'Secure Payments',
              s: 'Safe and encrypted booking system.',
            },
          ].map((item, i) => (
            <View key={i} style={styles.featureCard}>
              <Text style={styles.featureTitle}>{item.t}</Text>
              <Text style={styles.featureSub}>{item.s}</Text>
            </View>
          ))}

          {/* FINAL CTA */}
          <View style={{ padding: 16, paddingBottom: -16 }}>
            <GTButton
              title="Explore Trip"
              borderRadius={26}
            />
          </View>
        </ScrollView>
      </View>
      </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color_theme.mainBg,
    // paddingBottom: Platform.OS === 'android' ? '25%': 0
  },

  welcomeBox: {
    margin: 16,
    backgroundColor: color_theme.lightAccent,
    padding: 16,
    borderRadius: 16,
  },

  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: color_theme.primary,
  },

  heroBox: {
    margin: 16,
    backgroundColor: color_theme.lightAccent,
    padding: 18,
    borderRadius: 18,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: color_theme.primary,
  },

  heroSub: {
    marginTop: 8,
    fontSize: 14,
    color: color_theme.placeholderColor,
  },

  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  quickCard: {
    width: '48%',
    height: 100,
    backgroundColor: color_theme.lightAccent,
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },

  quickText: {
    fontWeight: '700',
    color: color_theme.primary,
  },

  dealBox: {
    margin: 16,
    backgroundColor: color_theme.primary,
    padding: 16,
    borderRadius: 18,
  },

  dealTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },

  dealSub: {
    marginVertical: 6,
    fontSize: 13,
    color: '#eee',
  },

  welcomeSub: {
    marginTop: 6,
    fontSize: 14,
    color: color_theme.placeholderColor,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
    color: color_theme.primary,
  },

  /* Horizontal Card */
  hCard: {
    width: 'auto',
    // height: 80,
    backgroundColor: color_theme.lightAccent,
    borderRadius: 26,
    padding: 12,
    marginRight: 12,
    justifyContent: 'space-between',
  },

  hCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: color_theme.primary,
  },

  hCardSub: {
    fontSize: 12,
    color: '#0A8F47',
  },

  /* Feature Cards */
  featureCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: color_theme.lightAccent,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: color_theme.primary,
  },

  featureSub: {
    marginTop: 4,
    fontSize: 13,
    color: color_theme.placeholderColor,
  },
});
