import React from 'react';
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import GTButton from '../../../components/buttons/gt-button';
import { color_theme } from '../../../services/styles/Style';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { height, width } = Dimensions.get('window');

export default function TripConfirm() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <>
      <StatusBar translucent backgroundColor={'transparent'} barStyle={'light-content'} />
      <ImageBackground
        source={require('../../../assets/images/accVerified.jpg')}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safe}>
          <View style={styles.bottomContainer}>
            {/* LOTTIE ANIMATION */}
            <View style={styles.lottieWrapper}>
              <LottieView
                source={require('../../../components/confirm-animation/confirmation.json')}
                autoPlay
                loop={false}
                style={styles.lottie}
              />
            </View>

            {/* TITLE */}
            <Text style={styles.title}>Trip Confirmed</Text>

            {/* SUB TEXT */}
            <Text style={styles.sub}>
              Your journey is successfully planned.
              {'\n'}
              Have a safe and memorable trip!
            </Text>

            {/* BUTTON */}
            <GTButton
              title="Go to Home"
              borderRadius={26}
              style={{ marginTop: 18, width: '100%' }}
              onPress={() => navigation.replace('Home')}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },

  safe: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  bottomContainer: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    paddingBottom: 26,
    alignItems: 'center',
    minHeight: height * 0.36,
  },

  lottieWrapper: {
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: 6,
  },

  lottie: {
    width: '100%',
    height: '100%',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: color_theme.textWhite,
    marginTop: 4,
  },

  sub: {
    fontSize: 14,
    color: color_theme.divider,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
});
