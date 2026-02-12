import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native';
import GTButton from '../../../components/buttons/gt-button';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../../components/custom-header';
import { color_theme } from '../../../services/styles/Style';
import GTIcon from '../../../assets/icons';
import { requestGalleryPermission } from '../../../services/helper/helper';
import { launchImageLibrary } from 'react-native-image-picker';
import { useState } from 'react';
import GTIconButton from '../../../components/buttons/gt-icon-button';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 16 * 2 - 12 * 2) / 3; // 3 per row

interface ImagesModel {
  trip_images: string[];
}

export default function TripImages() {
  const route = useRoute<any>();
  const { trip } = route.params;

  const [model, setModel] = useState<ImagesModel>({ trip_images: [] });
  const [selected, setSelected] = useState<string[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  /* ================= GALLERY ================= */
  const openGalllery = async () => {
    const getPermissions = await requestGalleryPermission();
    if (!getPermissions) return;

    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 20,
    });

    if (!result.didCancel && result.assets) {
      const uris = result.assets.map(a => a.uri).filter(Boolean) as string[];

      setModel(prev => ({
        trip_images: [...prev.trip_images, ...uris],
      }));
    }
  };

  /* ================= LONG PRESS SELECT ================= */
  const handleLongPress = (uri: string) => {
    setSelected(prev => (prev.includes(uri) ? prev : [...prev, uri]));
  };

  const handlePress = (uri: string) => {
    if (selected.length === 0) return;

    setSelected(prev =>
      prev.includes(uri) ? prev.filter(i => i !== uri) : [...prev, uri],
    );
  };

  /* ================= DELETE ================= */
  const deleteImages = () => {
    if (selected.length === 0) return;

    Alert.alert('Delete', 'Delete selected images?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: () => {
          setModel(prev => ({
            trip_images: prev.trip_images.filter(
              img => !selected.includes(img),
            ),
          }));
          setSelected([]);
        },
      },
    ]);
  };

  /* ================= SEND ================= */
  const sentData = () => {
  // Strong validation
  if (
    !model.trip_images ||
    !Array.isArray(model.trip_images) ||
    model.trip_images.length === 0
  ) {
    const errMsg = 'Please select at least 1 image';

    if (Platform.OS === 'android') {
      ToastAndroid.show(errMsg, ToastAndroid.LONG);
    } else {
      Alert.alert('Error', errMsg);
    }

    return; // VERY IMPORTANT
  }

  const payload = {
    ...trip,
    trip_images: model.trip_images,
  };

  console.log(payload, 'All Data');

  navigation.navigate('ReviewTrip', { reviewTrip: payload });
};


  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader
        title="Select Images"
        rightIcon={
          selected.length > 0 ? (
            <GTIcon name="delete" color={color_theme.error} size={22} />
          ) : null
        }
        rightIconColor={
          selected.length > 0 ? color_theme.error : color_theme.primary
        }
        onRightIconPress={selected.length > 0 ? deleteImages : openGalllery}
      />

      <View style={{ flex: 1, padding: 16 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* GRID */}
          <View style={styles.grid}>
            {model.trip_images.map(uri => {
              const isSelected = selected.includes(uri);
              return (
                <TouchableOpacity
                  key={uri}
                  activeOpacity={0.8}
                  onLongPress={() => handleLongPress(uri)}
                  delayLongPress={1500}
                  onPress={() => handlePress(uri)}
                  style={[
                    styles.imageWrapper,
                    isSelected && styles.selectedBorder,
                  ]}
                >
                  <Image source={{ uri }} style={styles.image} />
                  {isSelected && (
                    <View style={styles.overlay}>
                      <GTIcon name="check" color={color_theme.textWhite} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.bottomBtn}>
          <GTIconButton
            iconName="add-photo-alternate"
            title="Open Gallery"
            bgColor={color_theme.mainBg}
            borderColor={color_theme.primary}
            borderWidth={1}
            color={color_theme.primary}
            style={{ marginVertical: 6 }}
            iconColor={color_theme.primary}
            onPress={openGalllery}
          />
          <GTButton title="Next" onPress={sentData} />
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: color_theme.mainBg,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },

  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  selectedBorder: {
    borderWidth: 3,
    borderColor: color_theme.error,
  },

  overlay: {
    position: 'absolute',
    right: 6,
    top: 6,
    backgroundColor: color_theme.primary,
    borderRadius: 12,
    padding: 4,
  },
  bottomBtn: {
    position: 'absolute',
    bottom: 1,
    left: 16,
    right: 16,
  },
});
