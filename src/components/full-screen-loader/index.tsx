// ----------------------------------------------------
// Author: Faizan Ansari
// Project: Ventyx E-Commerce App
// File: FullScreenLoader.tsx
// Description: Full-screen loading overlay with ActivityIndicator
// ----------------------------------------------------

import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Modal,
  Text,
} from 'react-native';
import { color_theme } from '../../services/styles/Style';
import { SafeAreaView } from 'react-native-safe-area-context';

// Responsive scaling
const { width, height } = Dimensions.get('window');
const scale = width / 375;

interface FullScreenLoaderProps {
  visible?: boolean;
  loaderColor?: string;
  backgroundOpacity?: number;
  text?:string | any;
  color?: string
}

export default function FullScreenLoader(props: FullScreenLoaderProps) {
  const {
    visible = false,
    loaderColor = color_theme.textWhite,
    backgroundOpacity = 0.3,
    text,
    color,
  } = props;

  return (
   <SafeAreaView style={{flex:1}}>
     <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      {/* 🔧 Fix: Add transparent background instead of white */}
      <View
        style={[
          styles.overlay,
          { backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})` },
        ]}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={40 * scale} color={loaderColor} />
          <Text style={{color: color}}>{text}</Text>
        </View>
      </View>
    </Modal>
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: 'transparent', //
    justifyContent: 'center',
    alignItems: 'center',
  },
});