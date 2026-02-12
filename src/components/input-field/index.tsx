
import React, { forwardRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  TextInputProps,
} from 'react-native';
import { color_theme } from '../../services/styles/Style';

const { width } = Dimensions.get('window');
const scale = width / 375;

interface InputFieldProps extends TextInputProps {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftIconOnPress?: () => void;
  rightIconOnPress?: () => void;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  borderRadius?: number;
  label?: string;
  labelColor?: string;
}

// ✅ forwardRef add kiya, component khud ka structure bilkul same rakha
const InputField = forwardRef<TextInput, InputFieldProps>((props, ref) => {
  const {
    value,
    placeholder,
    onChangeText,
    leftIcon,
    rightIcon,
    leftIconOnPress,
    rightIconOnPress,
    borderColor = '#d5d8dc',
    backgroundColor = '#fff',
    textColor = '#000',
    fontSize = 14 * scale,
    borderRadius = 8 * scale,
    label,
    labelColor = '#808080',
    style,
    ...rest
  } = props;

  return (
    <View>
      {label ? (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.container,
          {
            borderColor: value && value.trim() ? color_theme.primary : borderColor,
            borderRadius,
            backgroundColor,
          },
        ]}
      >
        {leftIcon ? (
          <TouchableOpacity
            onPress={leftIconOnPress}
            activeOpacity={0.7}
            style={styles.iconContainer}
          >
            {leftIcon}
          </TouchableOpacity>
        ) : null}

        <TextInput
          ref={ref} // ✅ ref added
          style={[styles.textInput, { color: textColor, fontSize }, style]}
          placeholder={placeholder}
          placeholderTextColor="#808080"
          value={value}
          onChangeText={onChangeText}
          {...rest} // ✅ existing rest props untouched
        />

        {rightIcon ? (
          <TouchableOpacity
            onPress={rightIconOnPress}
            activeOpacity={0.7}
            style={styles.iconContainer}
          >
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
});

export default InputField;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12 * scale,
    height: 46 * scale,
  },
  textInput: {
    flex: 1,
    paddingVertical: 0,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4 * scale,
  },
  label: {
    fontSize: 13 * scale,
    marginBottom: 3 * scale,
  },
});
