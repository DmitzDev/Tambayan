import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { AuthService } from '../../services/authService';

const APP_ICON = require('../../../assets/images/app_icon.png');
const BG_LOGO = require('../../../assets/images/background_logo.png');

type Props = NativeStackScreenProps<any, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Notice', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await AuthService.signInWithEmail(email.trim(), password.trim());
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Notice', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await AuthService.signUpWithEmail(name.trim(), email.trim(), password.trim());
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <View style={styles.container}>
        {/* Subtle Background Watermark */}
        <Image source={BG_LOGO} style={styles.bgWatermark} resizeMode="contain" />

        {/* Ambient Gradient Blob */}
        <LinearGradient
          colors={['#FF7E4740', '#A4EBF930']}
          style={styles.gradientBlob}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Logo */}
          <View style={styles.logoWrapper}>
            <View style={styles.logoCard}>
              <Image source={APP_ICON} style={styles.logoImage} resizeMode="contain" />
            </View>
          </View>

          {/* App Title */}
          <Text style={styles.titleGradient}>Tambayan</Text>

          {/* Hero text */}
          <Text style={styles.heroTitle}>Your Campus.{'\n'}Your Community.</Text>
          <Text style={styles.heroSubtitle}>
            Connect with students, join discussions, and find events happening around you.
          </Text>

          {/* Auth Card with Tabs */}
          <View style={styles.authCard}>
            {/* Tab Switcher */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'login' && styles.tabButtonActive]}
                onPress={() => setActiveTab('login')}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'login' && styles.tabButtonTextActive,
                  ]}
                >
                  Log In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'register' && styles.tabButtonActive]}
                onPress={() => setActiveTab('register')}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'register' && styles.tabButtonTextActive,
                  ]}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            {activeTab === 'register' && (
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={Colors.onSurfaceVariant + '80'}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={Colors.onSurfaceVariant + '80'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.onSurfaceVariant + '80'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Submit Button */}
            {activeTab === 'login' ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.onPrimary} />
                ) : (
                  <View style={styles.buttonInner}>
                    <Text style={styles.primaryButtonText}>Log In</Text>
                    <Ionicons name="arrow-forward" size={18} color={Colors.onPrimary} />
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: Colors.secondary }]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.onSecondary} />
                ) : (
                  <View style={styles.buttonInner}>
                    <Text style={styles.primaryButtonText}>Create Account</Text>
                    <Ionicons name="person-add" size={18} color={Colors.onSecondary} />
                  </View>
                )}
              </TouchableOpacity>
            )}

            {activeTab === 'login' && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot your password?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Trending Hangouts Section */}
          <View style={styles.hangoutHeader}>
            <Text style={styles.hangoutTitle}>Trending Hangouts</Text>
            <TouchableOpacity>
              <Text style={styles.hangoutViewAll}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hangoutItem}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbJorDBmNNtkTRzRkfqm0Pv-IIupyPi6ktl1fyzxmdeXH2fispg05a07IVohj0tyss_JTjq_IIXshtQK9uGnUoPghsINu1d-ahe1txqlsaK7ls-4KtrHDBvdOlZQLiBCx3ceY4smuT5kDg0Waj36VVna0aBE7Y8Nxu2bt4Dd4IWfJCltTX2sh-VQj8z6LHvcTCE2QTZ9NO1ezbtTENBW_f_X4bepKVsrY190idlgiyw-cdvwzxxCvm2Q',
              }}
              style={styles.hangoutImage}
            />
            <View style={styles.hangoutMeta}>
              <Text style={styles.hangoutName}>The Daily Grind</Text>
              <Text style={styles.hangoutDesc}>Best espresso in the north...</Text>
              <View style={styles.activeTag}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>12 active</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.joinBtn}>
              <Text style={styles.joinBtnText}>Join</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.hangoutItem}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBgkrehetiQRmOgvnBQNVDev2Wz-hVhcVlpSANr_auuKGWXFEp-Nji8AhsXcN5d7_VyL28lz7WaojbuR3pYrz0nA-GXg4Fa2dcI0sL7KwVTT8TC1smuIFG_BzlcTjyj-Mj_edeu8TljbNoRmszytaZoK8sM6hiQov58SNIzACgyvaxPBkWvX_POP_8QadSv9MCZFFyVQxuYr2H2DeF097UUmQpmqd8h4isB_gGTP8xjqfVt4TTexnbhQ',
              }}
              style={styles.hangoutImage}
            />
            <View style={styles.hangoutMeta}>
              <Text style={styles.hangoutName}>Central Park Porch</Text>
              <Text style={styles.hangoutDesc}>Afternoon chess and chats</Text>
              <View style={styles.activeTag}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>8 active</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.joinBtn}>
              <Text style={styles.joinBtnText}>Join</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  bgWatermark: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 380,
    height: 380,
    opacity: 0.04,
  },
  gradientBlob: {
    position: 'absolute',
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCard: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  titleGradient: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: -1,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.onSurface,
    lineHeight: 32,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: 28,
  },
  authCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF99',
    marginBottom: 32,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 30,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 26,
  },
  tabButtonActive: {
    backgroundColor: Colors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  tabButtonTextActive: {
    color: Colors.onSurface,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.onSurface,
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: Colors.onPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  forgotBtn: {
    alignItems: 'center',
    marginTop: 14,
  },
  forgotText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  hangoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  hangoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  hangoutViewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  hangoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '60',
  },
  hangoutImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  hangoutMeta: {
    flex: 1,
    marginLeft: 14,
  },
  hangoutName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  hangoutDesc: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  activeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  joinBtn: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinBtnText: {
    color: Colors.onSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
