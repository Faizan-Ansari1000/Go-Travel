import {
  Dimensions,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import GTButton from '../../../components/buttons/gt-button';
import { color_theme } from '../../../services/styles/Style';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

export default function PasswordChanged() {
  const navigation = useNavigation<any>();

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
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {/* Success Icon */}
            <View style={styles.lottieWrapper}>
              <LottieView
                source={require('../../../components/confirm-animation/confirmation.json')}
                autoPlay
                loop={false}
                style={styles.lottie}
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>Password Changed 🎉</Text>
              <Text style={styles.subtitle}>
                Your password has been changed successfully. You can now login
                using your new password.
              </Text>
            </View>

            {/* Bottom Button */}
            <GTButton
              borderRadius={26}
              title="Go to Login"
              style={{ width: '100%' }}
              onPress={() => navigation.replace('Login')}
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
  safeArea: {
    flex: 1,
  },
  lottieWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 100,
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: 6,
  },

  lottie: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  iconWrapper: {
    marginTop: 80,
    alignItems: 'center',
  },
  icon: {
    width: 140,
    height: 140,
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: color_theme.textWhite,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: color_theme.textWhite,
    textAlign: 'center',
    lineHeight: 22,
    bottom: 10,
  },

  bottom: {
    marginBottom: 30,
  },
});
