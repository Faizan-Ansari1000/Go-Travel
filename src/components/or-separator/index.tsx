import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 375;

interface OrSeparatorProps {
  text?: string;
  marginVertical?: any ;
}

export default function OrSeparator({
  text = 'OR',
  marginVertical = 20,
}: OrSeparatorProps) {
  return (
    <View style={[styles.container, { marginVertical }]}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal:2
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  text: {
    marginHorizontal: 10 * scale,
    fontSize: 14 * scale,
    color: '#808080',
    fontWeight: '500',
  },
});