import React from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GTButton from '../../../components/buttons/gt-button';
import { color_theme } from '../../../services/styles/Style';
import LottieView from 'lottie-react-native';

const { height, width } = Dimensions.get('window');

export default function AccountVerified() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const goToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <ImageBackground
        source={require('../../../assets/images/accVerified.jpg')}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* Overlay */}
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.content}>
            <View style={styles.lottieWrapper}>
              <LottieView
                source={require('../../../components/confirm-animation/confirmation.json')}
                autoPlay
                loop={false}
                style={styles.lottie}
              />
            </View>
            <Text style={styles.title}>Account Verified</Text>

            <Text style={styles.subtitle}>
              Your account has been successfully verified.{'\n'}
              You can now continue and explore everything.
            </Text>

            <GTButton
              title="Continue to Login"
              borderRadius={28}
              onPress={() =>
                navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
              }
              style={styles.button}
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
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  lottieWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: 6,
  },

  lottie: {
    width: '100%',
    height: '100%',
  },
  safe: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 24,
    paddingBottom: 32,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center', // 👈 ADD THIS
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    color: color_theme.textWhite,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: color_theme.border,
    marginBottom: 26,
  },
  button: {
    marginTop: 6,
    width: '100%',
  },
});
