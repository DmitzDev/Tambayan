import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';

const APP_ICON = require('../../../assets/images/app_icon.png');

type Props = NativeStackScreenProps<any, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Elastic bounce scale for the icon
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // 2. Delayed text fade in
    const textTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 800);

    // 3. Navigation after splash sequence
    const navTimer = setTimeout(() => {
      navigation.replace('Login');
    }, 3500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(navTimer);
    };
  }, [navigation, scaleAnim, fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image source={APP_ICON} style={styles.logo} resizeMode="contain" />
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, marginTop: 24 }}>
        <Text style={styles.appName}>Tambayan</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  appName: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -1,
  },
});
