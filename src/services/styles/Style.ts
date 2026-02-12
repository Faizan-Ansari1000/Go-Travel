// --------------------------------------------
// Author: Faizan Ansari
// Project: E-Commerce App
// Description: Global color & font theme file
// --------------------------------------------

import { TextStyle } from "react-native";

export const color_theme = {
  // ===== Main App Colors =====
  // primary: '#4D0218', // Button background color
  primary: '#000033', // Button background color
  mainBg: '#D1D5DC', // Default screen background
  accent: '#74D4FF', // Soft accent tone (use in cards or highlights)
  lightAccent:'#DFF2FE',
  lightGreen:'#DCFCE7',
  info: '#B8E6FE',
  lightError:'#FF6467',

  // ===== Text Colors =====
  textDark: '#5C5C5C', // Slightly darker than #808080 for better readability
  textLight: '#808080', // Secondary / paragraph text
  textWhite: '#FFFFFF', // For dark buttons or overlays

  // ===== Border & Divider Colors =====
  border: '#E5E7EB',
  divider: '#F2F2F2',

  // ===== Status Colors =====
  success: '#28A745',
  warning: '#FFC107',
  error: '#E7180B',

  placeholderColor:'#808080',
  black: '#000',
  // screenbackGround: '#FFEDD4',
  screenbackGround: '#D1D5DC',
  disabled:'#62748E'
};

// --------------------------------------------
// Global Font Styles
// --------------------------------------------
export const font_theme: {
  headingLarge: TextStyle;
  headingMedium: TextStyle;
  subTitle: TextStyle;
  paragraph: TextStyle;
  buttonText: TextStyle;
} = {
  headingLarge: {
    fontSize: 24,
    fontWeight: '700',   // ✅ now correctly typed
    color: color_theme.textDark,
  },
  headingMedium: {
    fontSize: 20,
    fontWeight: '600',
    color: color_theme.textDark,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: color_theme.textDark,
  },
  paragraph: {
    fontSize: 14,
    fontWeight: '400',
    color: color_theme.textLight,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: color_theme.textWhite,
  },
};