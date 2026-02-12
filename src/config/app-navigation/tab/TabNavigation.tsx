import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Text,
  Keyboard,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../../../screens/tab-screens/home/Home';
import {
  FavoriteIcon,
  HomeIcon,
  ProfileIcon,
  SearchIcon,
} from '../../../assets/svg-icons';
import { color_theme } from '../../../services/styles/Style';
import Search from '../../../screens/tab-screens/search/Search';
import Favorite from '../../../screens/tab-screens/favorite/Favorite';
import Profile from '../../../screens/tab-screens/profile/Profile';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');
const bgWidth = 70;

const tabs = [
  {
    name: 'Main',
    component: Home,
    icon: (focused: boolean) => (
      <HomeIcon
        width={22}
        height={22}
        color={focused ? color_theme.primary : color_theme.placeholderColor}
      />
    ),
  },
  {
    name: 'Search',
    component: Search,
    icon: (focused: boolean) => (
      <SearchIcon
        width={22}
        height={22}
        color={focused ? color_theme.primary : color_theme.placeholderColor}
      />
    ),
  },
  {
    name: 'Favorite',
    component: Favorite,
    icon: (focused: boolean) => (
      <FavoriteIcon
        width={22}
        height={22}
        color={focused ? color_theme.primary : color_theme.placeholderColor}
      />
    ),
  },
  {
    name: 'Profile',
    component: Profile,
    icon: (focused: boolean) => (
      <ProfileIcon
        width={22}
        height={22}
        color={focused ? color_theme.primary : color_theme.placeholderColor}
      />
    ),
  },
];

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      {tabs.map((screen, i) => (
        <Tab.Screen key={i} name={screen.name} component={screen.component} />
      ))}
    </Tab.Navigator>
  );
}

function CustomTabBar({ state, navigation }: any) {
  const translateX = useRef(new Animated.Value(0)).current;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const tabWidth = width / tabs.length;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start();
  }, [state.index]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (keyboardVisible) return null;

  return (
    <View style={styles.tabContainer}>
      {/* Animated BG behind active icon only */}
      <Animated.View
        style={[
          styles.animatedBg,
          {
            width: bgWidth,
            height: 32,
            transform: [
              {
                translateX: Animated.add(
                  translateX,
                  new Animated.Value(tabWidth / 2 - bgWidth / 2),
                ),
              },
            ],
          },
        ]}
      />

      {state.routes.map((route: any, i: number) => {
        const isFocused = state.index === i;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={i}
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.tabButton}
          >
            <View style={styles.iconWrapper}>{tabs[i].icon(isFocused)}</View>
            <Text
              style={[
                styles.tabText,
                {
                  color: isFocused
                    ? color_theme.textWhite
                    : color_theme.placeholderColor,
                },
              ]}
            >
              {tabs[i].name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor:color_theme.primary,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 5,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 45,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
  },
  tabText: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  animatedBg: {
    position: 'absolute',
    backgroundColor: color_theme.lightGreen,
    borderRadius: 20,
    top: 8,
    left: 0,
    zIndex: -1,
  },
});
