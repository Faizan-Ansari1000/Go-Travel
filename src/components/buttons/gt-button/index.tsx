// ----------------------------------------------------
// Author: Faizan Ansari
// Project: Ventyx E-Commerce App
// Description: Responsive, reusable button matching InputField dimensions
// ----------------------------------------------------

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { color_theme } from '../../../services/styles/Style';

const { width } = Dimensions.get('window');
const scale = width / 375;

interface GTButtonProps {
  title: string | any;
  onPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  loaderColor?: string;
  fontSize?: number;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | any;
  textStyle?: TextStyle;
  borderRadius?: number;
}

export default function GTButton(props: GTButtonProps) {
  const {
    title,
    onPress,
    backgroundColor = color_theme.primary,
    textColor = color_theme.textWhite,
    loaderColor = '#fff',
    fontSize = 14 * scale,
    loading = false,
    disabled = false,
    style,
    textStyle,
    borderRadius = 8 * scale, // same as InputField
  } = props;

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={!isDisabled ? onPress : undefined}
      style={[
        styles.button,
        {
          backgroundColor: isDisabled ? color_theme.disabled : backgroundColor,
          borderRadius,
        },
        style,
      ]}
      disabled={isDisabled}>
      {loading ? (
        <ActivityIndicator size="small" color={loaderColor} />
      ) : (
        <Text
          style={[
            styles.title,
            { color: textColor, fontSize },
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50 * scale, // matches InputField height
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    // fontWeight: '600',
  },
});


// usage
{
  /* <VAButton
        title={loading ? 'Processing...' : 'Submit'}
        onPress={handlePress}
        loading={loading}
        backgroundColor="#4D0218"
        textColor="#fff"
      /> */
}