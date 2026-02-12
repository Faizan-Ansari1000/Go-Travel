import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getUserSession,
  requestGalleryPermission,
} from '../../../services/helper/helper';

import { launchImageLibrary } from 'react-native-image-picker';
import ApiService from '../../../services/utils/HttpHelper';

import CustomHeader from '../../../components/custom-header';
import GTIcon from '../../../assets/icons';
import InputField from '../../../components/input-field';
import GTButton from '../../../components/buttons/gt-button';
import FullScreenLoader from '../../../components/full-screen-loader';

import { color_theme } from '../../../services/styles/Style';

interface ProfileEditModel {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  banner_url?: string;
  profile_url?: string;
  city?: string;
  country?: string;
  address?: string;
}

interface ErrorModel {
  [key: string]: string;
}

export default function ProfileEdit() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [model, setModel] = useState<ProfileEditModel>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorModel>({});

  /* ---------------- Image Picker ---------------- */

  const pickImage = async (type: 'banner_url' | 'profile_url') => {
    const permission = await requestGalleryPermission();
    if (!permission) return;

    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if (!result.didCancel && result.assets?.length) {
      const uri = result.assets[0].uri;
      setModel({ ...model, [type]: uri });
    }
  };

  /* ---------------- Validations ---------------- */

  const validate = () => {
    const err: ErrorModel = {};

    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^03\d{9}$/;
    const cityRegex = /^[A-Za-z ]+$/;
    const addressRegex = /^[A-Za-z0-9#,\-.\s]+$/;

    if (model.first_name && !nameRegex.test(model.first_name))
      err.first_name = 'Invalid first name';

    if (model.last_name && !nameRegex.test(model.last_name))
      err.last_name = 'Invalid last name';

    if (model.phone_number && !phoneRegex.test(model.phone_number))
      err.phone_number = 'Phone must be like 03XXXXXXXXX';

    if (model.city && !cityRegex.test(model.city)) err.city = 'Invalid city';

    if (model.country && !cityRegex.test(model.country))
      err.country = 'Invalid country';

    if (model.address && !addressRegex.test(model.address))
      err.address = 'Invalid address';

    setError(err);
    return Object.keys(err).length === 0;
  };

  /* ---------------- Profile Update ---------------- */

  const profileEdit = async () => {
    const cleanModel = Object.fromEntries(
      Object.entries(model).filter(([_, v]) => v !== undefined && v !== ''),
    );

    if (Object.keys(cleanModel).length === 0) {
      Alert.alert('No Changes', 'Please update at least one field');
      return;
    }

    if (!validate()) return;

    try {
      setLoading(true);

      const { email } = await getUserSession();

      console.log(model);

      const res = await ApiService.putToAPI(
        `/route/end-point/${email}`,
        cleanModel,
      );
      console.log(res);

      if (res.success || res.status === 200) {
        const msg = 'Profile Updated Successfully';

        Platform.OS === 'android'
          ? ToastAndroid.show(msg, ToastAndroid.LONG)
          : Alert.alert(msg);

        navigation.goBack();
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Something went wrong';

      Platform.OS === 'android'
        ? ToastAndroid.show(msg, ToastAndroid.LONG)
        : Alert.alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderErrors = (key: keyof ErrorModel) =>
    error[key] && <Text style={styles.error}>{error[key]}</Text>;

  /* ---------------- UI ---------------- */

  return (
    <>
        <StatusBar
          backgroundColor={Platform.OS === 'android' ? color_theme.mainBg : color_theme.mainBg}
        />
      <SafeAreaView style={styles.safe}>
        <CustomHeader
          title="Edit Profile"
          leftIcon={<GTIcon name="arrow-back-ios-new" />}
          onLeftIconPress={() => navigation.goBack()}
        />

        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* -------- Banner -------- */}
            <View style={styles.bannerContainer}>
              <Image
                source={
                  model.banner_url
                    ? { uri: model.banner_url }
                    : {
                        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuq3joaHJkCS8gftpCUUR3Yg63O6kFWSO7fg&s',
                      }
                }
                style={styles.banner}
              />

              <TouchableOpacity
                style={styles.bannerEdit}
                onPress={() => pickImage('banner_url')}
              >
                <GTIcon name="edit" />
              </TouchableOpacity>

              {/* -------- Profile Image -------- */}
              <View style={styles.profileWrapper}>
                <Image
                  source={
                    model.profile_url
                      ? { uri: model.profile_url }
                      : {
                          uri: 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg',
                        }
                  }
                  style={styles.profileImage}
                />

                <TouchableOpacity
                  style={styles.cameraBtn}
                  onPress={() => pickImage('profile_url')}
                >
                  <GTIcon name="photo-camera" color={color_theme.textWhite} />
                </TouchableOpacity>
              </View>
            </View>

            {/* -------- Inputs -------- */}

            {/* <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 30}
          > */}
            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <InputField
                    placeholder="First Name"
                    value={model.first_name}
                    onChangeText={e => {
                      setModel({ ...model, first_name: e });
                      if (error.first_name)
                        setError({ ...error, first_name: '' });
                    }}
                    borderColor={
                      error.first_name
                        ? color_theme.error
                        : color_theme.textWhite
                    }
                  />
                  {renderErrors('first_name')}
                </View>

                <View style={styles.halfInput}>
                  <InputField
                    placeholder="Last Name"
                    value={model.last_name}
                    onChangeText={e => {
                      setModel({ ...model, last_name: e });
                      if (error.last_name)
                        setError({ ...error, last_name: '' });
                    }}
                    borderColor={
                      error.last_name
                        ? color_theme.error
                        : color_theme.textWhite
                    }
                  />
                  {renderErrors('last_name')}
                </View>
              </View>

              <View style={styles.input}>
                <InputField
                  placeholder="Phone Number"
                  value={model.phone_number}
                  keyboardType="number-pad"
                  onChangeText={e => {
                    setModel({ ...model, phone_number: e });
                    if (error.phone_number)
                      setError({ ...error, phone_number: '' });
                  }}
                  borderColor={
                    error.phone_number
                      ? color_theme.error
                      : color_theme.textWhite
                  }
                />
                {renderErrors('phone_number')}
              </View>

              <View style={styles.input}>
                <InputField
                  placeholder="City"
                  value={model.city}
                  onChangeText={e => {
                    setModel({ ...model, city: e });
                    if (error.city) setError({ ...error, city: '' });
                  }}
                  borderColor={
                    error.city ? color_theme.error : color_theme.textWhite
                  }
                />
                {renderErrors('city')}
              </View>

              <View style={styles.input}>
                <InputField
                  placeholder="Country"
                  value={model.country}
                  onChangeText={e => {
                    setModel({ ...model, country: e });
                    if (error.country) setError({ ...error, country: '' });
                  }}
                  borderColor={
                    error.country ? color_theme.error : color_theme.textWhite
                  }
                />
                {renderErrors('country')}
              </View>

              <View style={styles.input}>
                <InputField
                  placeholder="Address"
                  value={model.address}
                  onChangeText={e => {
                    setModel({ ...model, address: e });
                    if (error.address) setError({ ...error, address: '' });
                  }}
                  borderColor={
                    error.address ? color_theme.error : color_theme.textWhite
                  }
                />
                {renderErrors('address')}
              </View>

              <View style={{ marginVertical: '7%' }}>
                <GTButton
                  title={
                    loading ? (
                      <FullScreenLoader
                        visible
                        loaderColor={color_theme.textWhite}
                      />
                    ) : (
                      'Profile Updated'
                    )
                  }
                  onPress={profileEdit}
                  disabled={loading}
                  borderRadius={26}
                />
              </View>
            </View>
            {/* </KeyboardAvoidingView> */}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color_theme.mainBg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // dono inputs ke beech gap
    // marginVertical: 10,
    gap: 12, // optional, RN 0.70+ me support
  },
  halfInput: {
    flex: 1, // dono inputs equal width
  },
  bannerContainer: {
    height: 160,
    marginBottom: 70,
  },

  banner: {
    width: '100%',
    height: '100%',
  },

  bannerEdit: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
  },

  profileWrapper: {
    position: 'absolute',
    bottom: -50,
    left: 20,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },

  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: color_theme.primary,
    padding: 6,
    borderRadius: 20,
  },

  form: {
    paddingHorizontal: 20,
    // gap: 15,
  },
  input: {
    paddingTop: 15,
  },
  error: {
    color: color_theme.error,
    fontSize: 12,
  },
});
