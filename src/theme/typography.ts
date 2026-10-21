import { TextStyle } from 'react-native';

export const Typography: Record<string, TextStyle> = {
  headlineLarge: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.32,
  },
  headlineMedium: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    lineHeight: 32,
  },
  titleMedium: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
  },
  bodyLarge: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 18,
    lineHeight: 28,
  },
  bodyMedium: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  labelLarge: {
    fontFamily: 'BeVietnamPro_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'BeVietnamPro_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  labelSmall: {
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 11,
    lineHeight: 14,
  },
};
