import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GTButton from '../../../../components/buttons/gt-button';
import { color_theme, font_theme } from '../../../../services/styles/Style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { height } = Dimensions.get('window');

export default function OnBoarding2() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  return (
       <>
       <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
    <ImageBackground
      source={require('../../../../assets/images/onB2.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.contentWrapper}>
          {/* Text */}
          <View style={styles.textSection}>
            <Text style={styles.heading}>Plan Trips. Book Instantly.</Text>

            <Text style={styles.subText}>
              Find the best flights, manage your bookings, and travel
              stress-free with a seamless experience.
            </Text>
          </View>

          {/* Button */}
          <View style={styles.buttonSection}>
            <GTButton
              title="Get Started"
              onPress={() => {
                navigation.replace('Login');
              }}
              borderRadius={26}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
       </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },

  contentWrapper: {
    minHeight: height * 0.35,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'flex-end',
  },

  textSection: {
    marginBottom: 16,
    gap: 10,
  },

  heading: {
    ...font_theme.headingLarge,
    color: color_theme.textWhite,
    lineHeight: 30,
  },

  subText: {
    ...font_theme.paragraph,
    color: color_theme.textWhite,
    opacity: 0.9,
    lineHeight: 20,
  },

  buttonSection: {
    marginTop: 4,
  },
});
