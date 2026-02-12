// ----------------------------------------------------
// Author: Faizan Ansari

// Description: Responsive Material Icon Component
// ----------------------------------------------------

import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Dimensions } from 'react-native';

interface IconProps {
  name: string | React.ReactNode | any,
  color?: string;
  size?: number; // base size, responsive adjustment applied internally
}

// Get responsive scaling (based on screen width)
const { width } = Dimensions.get('window');
const scale = width / 375; // baseline iPhone 11 width for responsiveness

export default function GTIcon({ name, color = '#000', size = 20 }: IconProps) {
  const adjustedSize = Math.round(size * scale);

  return (
    <MaterialIcons
      name={name}
      size={adjustedSize}
      color={color}
      allowFontScaling={false}
    />
  );
}