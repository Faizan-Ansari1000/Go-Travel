import React from 'react';
import {
  Image,
  Modal,
  ModalProps,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { color_theme } from '../../services/styles/Style';
import GTButton from '../buttons/gt-button';
import GTIcon from '../../assets/icons'; // Agar tumhara icon component ye hai

const { width } = Dimensions.get('window');
const scale = width / 375;

interface CustomModalProps extends ModalProps {
  visible: boolean;
  onRequestClose: () => void;

  // CONTENT
  title?: string;
  pera?: string;

  // IMAGE
  imageSource?: any; // require or uri
  imageBgColor?: string;
  imageSize?: number;

  // ICON (optional)
  iconName?: string;
  iconColor?: string;
  iconSize?: number;

  // BUTTONS
  showButtons?: boolean;
  leftBtnTitle?: string;
  rightBtnTitle?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export default function CustomModal(props: CustomModalProps) {
  const {
    visible,
    onRequestClose,

    title,
    pera,

    imageSource,
    imageBgColor = color_theme.info,
    imageSize = 70 * scale,

    iconName,
    iconColor = '#fff',
    iconSize = 40 * scale,

    showButtons = false,
    leftBtnTitle = 'Cancel',
    rightBtnTitle = 'OK',
    onLeftPress,
    onRightPress,

    ...rest
  } = props;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onRequestClose}
      {...rest}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              {/* IMAGE OR ICON */}
              {(imageSource || iconName) && (
                <View
                  style={[
                    styles.imageWrapper,
                    { backgroundColor: imageBgColor, width: imageSize, height: imageSize, borderRadius: imageSize / 2 },
                  ]}
                >
                  {imageSource && (
                    <Image
                      source={imageSource}
                      style={{
                        width: imageSize * 0.55,
                        height: imageSize * 0.55,
                        resizeMode: 'contain',
                      }}
                    />
                  )}

                  {!imageSource && iconName && (
                    <GTIcon name={iconName} size={iconSize} color={iconColor} />
                  )}
                </View>
              )}

              {/* TITLE */}
              {title && <Text style={styles.title}>{title}</Text>}

              {/* PERA */}
              {pera && <Text style={styles.pera}>{pera}</Text>}

              {/* BUTTONS */}
              {showButtons ? (
                <View style={styles.btnRow}>
                  <GTButton
                    title={leftBtnTitle}
                    onPress={onLeftPress || onRequestClose}
                    style={[styles.btnHalf, { borderWidth: 1 }]}
                    backgroundColor={color_theme.textWhite}
                    textColor={color_theme.primary}
                    borderRadius={8}
                  />

                  <GTButton
                    title={rightBtnTitle}
                    onPress={onRightPress}
                    style={styles.btnHalf}
                  />
                </View>
              ) : (
                <GTButton
                  title={rightBtnTitle}
                  onPress={onRequestClose}
                  borderRadius={26}
                  backgroundColor={color_theme.primary}
                  textColor={color_theme.textWhite}
                  style={{ width: '100%' }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16 * scale,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18 * scale,
    padding: 20 * scale,
    alignItems: 'center',
    elevation: 6,
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12 * scale,
  },
  title: {
    fontSize: 18 * scale,
    fontWeight: '700',
    color: color_theme.primary,
    marginBottom: 6 * scale,
    textAlign: 'center',
  },
  pera: {
    fontSize: 14 * scale,
    color: color_theme.placeholderColor,
    textAlign: 'center',
    marginBottom: 14 * scale,
    lineHeight: 20 * scale,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10 * scale,
    width: '100%',
  },
  btnHalf: {
    flex: 1,
  },
});
