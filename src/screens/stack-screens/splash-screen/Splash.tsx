import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getUserSession } from '../../../services/helper/helper';
import FullScreenLoader from '../../../components/full-screen-loader';
import { color_theme } from '../../../services/styles/Style';

export default function Splash() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);

      const { token } = await getUserSession();

      // Thoda delay splash feel ke liye (optional)
      setTimeout(() => {
        if (token) {
          navigation.replace('Home');
        } else {
          navigation.replace('OnBoarding1');
        }
      }, 1200);
    } catch (error) {
      if (Platform.OS === 'android') {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Please wait</Text>

        {loading && <FullScreenLoader visible />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color_theme.mainBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: color_theme.primary,
    fontStyle:'italic',
    marginBottom: 20,
  },
  loader: {
    marginTop: 10,
  },
});
