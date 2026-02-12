// ----------------------------------------------------
// Author: Faizan Ansari
// File: CustomHeader.tsx
// Description: Fully responsive, reusable header component
// ----------------------------------------------------

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { color_theme } from '../../services/styles/Style';


const { width } = Dimensions.get('window');
const scale = width / 375;

interface HeaderProps {
  bgColor?: string;
  title?: string | React.ReactNode;
  titleColor?: string;
  leftIcon?: string | React.ReactNode;
  rightIcon?: string | React.ReactNode;
  leftIconColor?: string;
  rightIconColor?: string;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void
}

export default function CustomHeader(props: HeaderProps) {
  const {
    bgColor = color_theme.mainBg,
    title = '',
    titleColor = '#000000',
    leftIcon,
    rightIcon,
    leftIconColor = '#000',
    rightIconColor = '#000',
    onLeftIconPress,
    onRightIconPress,
  } = props;

  const renderIcon = (
    icon: string | React.ReactNode,
    color: string,
    size: number,
  ) => {
    if (typeof icon === 'string') {
      return <MaterialIcons name={icon} size={size} color={color} />;
    } else if (React.isValidElement(icon)) {
      return icon;
    }
    return <View style={{ width: size }} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* LEFT ICON */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onLeftIconPress}
        style={styles.iconContainer}
      >
        {renderIcon(leftIcon, leftIconColor, 18 * scale)}
      </TouchableOpacity>

      {/* TITLE */}
     {typeof title === 'string' ? (
  <Text
    numberOfLines={1}
    style={[styles.title, { color: titleColor, fontSize: 16 * scale }]}
  >
    {title}
  </Text>
) : (
  <View style={styles.titleContainer}>
    {title}
  </View>
)}


      {/* RIGHT ICON */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onRightIconPress}
        style={styles.iconContainer}
      >
        {renderIcon(rightIcon, rightIconColor, 20 * scale)}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: color_theme.screenbackGround,
    paddingHorizontal: 16 * scale,
    paddingVertical: 6 * scale,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // elevation: 3,
    borderBottomColor: color_theme.placeholderColor,
    borderBottomWidth:0.3
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
  },
  iconContainer: {
    width: 35 * scale,
    height: 35 * scale,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
  flex: 1,
  justifyContent: 'center',
},

  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
  },
});