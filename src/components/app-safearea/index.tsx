import React from 'react';
import { View, StatusBar, Platform, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color_theme } from '../../services/styles/Style';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function AppSafeArea({ children, style }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: color_theme.mainBg }}>
      <StatusBar
        translucent={Platform.OS === 'android'}
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[{ flex: 1 }, style]}   // ⭐ style merge
      >
        {children}
      </SafeAreaView>
    </View>
  );
}
