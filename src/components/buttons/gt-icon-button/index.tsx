// ----------------------------------------------------
// Author: Faizan Ansari
// Project: Ventyx E-Commerce App
// File: VAButton.tsx
// Description: Reusable, responsive button with icon and text
// ----------------------------------------------------

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { color_theme } from '../../../services/styles/Style';
import GTIcon from '../../../assets/icons';

const { width } = Dimensions.get('window');
const scale = width / 375;

interface GTIconButtonProps {
  title: string | React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  bgColor?: string;
  icon?: any; // require('../../assets/...') or Image source
  style?: any;
  color?: any;
  borderColor?: string;
  borderWidth?: string | any;
  iconName?: string;
  iconColor?: string;
  weightFont?: string | any;
  size?: number;
}

export default function GTIconButton(props: GTIconButtonProps) {
  const {
    title,
    onPress,
    disabled,
    bgColor = color_theme.primary,
    icon,
    style,
    color,
    borderColor,
    borderWidth,
    iconName,
    iconColor,
    weightFont,
    size,
  } = props;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? '#aaa' : bgColor,
          borderColor: borderColor,
          borderWidth: borderWidth,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {icon ? (
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      ) : (
        <View style={{ paddingRight: 5, paddingBottom: 2 }}>
          <GTIcon name={iconName} color={iconColor} size={size} />
        </View>
      )}
      <Text style={[styles.text, { color: color, fontWeight: weightFont }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 48 * scale,
    borderRadius: 8 * scale,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12 * scale,
  },
  icon: {
    width: 20 * scale,
    height: 20 * scale,
    marginRight: 12 * scale,
  },
  text: {
    color: '#fff',
    fontSize: 16 * scale,
    fontWeight: '500',
    textAlign: 'center',
  },
});