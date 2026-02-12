// ----------------------------------------------------
// Author: Faizan Ansari
// Project: Ventyx E-Commerce App
// File: PasswordStrengthChecker.tsx
// Description: Password strength indicator with suggestions only when user types
// ----------------------------------------------------

import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { color_theme } from '../../services/styles/Style';

const { width } = Dimensions.get('window');
const scale = width / 375;

interface PasswordStrengthCheckerProps {
  password: string;
}

export default function PasswordStrengthChecker(
  props: PasswordStrengthCheckerProps,
) {
  const { password } = props;

  if (password.length === 0) {
    // Agar user ne kuch type nahi kiya to kuch bhi na dikhe
    return null;
  }

  // Strength calculation
  let strength = 0;
  const length = password.length;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@$!%*?&#^()_+=\-[\]{};:'",.<>\/\\|~`]/.test(password);

  if (length > 0) strength++; // any char
  if (length >= 5) strength++;
  if (hasLower && hasUpper) strength++;
  if (hasNumber && hasSpecial) strength++;

  if (strength > 4) strength = 4;

  const strengthLabel = () => {
    switch (strength) {
      case 1:
        return 'Weak';
      case 2:
        return 'Normal';
      case 3:
        return 'Great';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const getColor = (index: number) => {
    if (strength >= index + 1) {
      switch (strength) {
        case 1:
          return '#FB2C36';
        case 2:
          return '#E1712B';
        case 3:
          return '#0044cc';
        case 4:
          return '#00b050';
      }
    }
    return '#dcdcdc';
  };

  const suggestion = () => {
    if (strength < 4) {
      return 'Use: a-z, A-Z, 0-9, @-^';
    }
    return '';
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {[0, 1, 2, 3].map((_, index) => (
          <View
            key={index}
            style={[styles.bar, { backgroundColor: getColor(index) }]}
          />
        ))}
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.suggestionText}>{suggestion()}</Text>
        <Text style={[styles.strengthText, { color: getColor(strength - 1) }]}>
          {strengthLabel()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    marginTop: 6 * scale,
    width: '100%',
    justifyContent: 'space-between',
  },
  bar: {
    flex: 1,
    height: 2.5 * scale,
    marginHorizontal: 2 * scale,
    borderRadius: 2 * scale,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4 * scale,
  },
  suggestionText: {
    color: color_theme.placeholderColor,
    fontSize: 12 * scale,
    flex: 1,
    paddingRight: 8,
  },
  strengthText: {
    fontSize: 12 * scale,
    // fontWeight: '600',
  },
});