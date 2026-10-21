import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { DatabaseService } from '../../services/databaseService';
import { ImageUtils } from '../../utils/imageUtils';

const APP_ICON = require('../../../assets/images/app_icon.png');

export const ProfileScreen: React.FC = () => {
  const { user, userProfile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tags'>('posts');
  const [uploading, setUploading] = useState(false);

  // Privacy dialog modal for avatar update
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [pendingBase64, setPendingBase64] = useState<string | null>(null);
  const [selectedPrivacy, setSelectedPrivacy] = useState<'Public' | 'Friends' | 'Only me'>('Public');

  const handlePickAndUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0]?.base64) {
        setPendingBase64(result.assets[0].base64);
        setPrivacyModalVisible(true);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Could not pick image');
    }
  };

  const confirmUpload = async () => {
    if (!pendingBase64) return;
    setPrivacyModalVisible(false);
    setUploading(true);

    try {
      await DatabaseService.updateProfilePicture(pendingBase64, selectedPrivacy);
      Alert.alert('Success', 'Profile picture updated and posted to your feed!');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to update profile picture');
    } finally {
      setUploading(false);
      setPendingBase64(null);
    }
  };

  const name = userProfile?.name || user?.displayName || 'User';
  const handle = `@${name.toLowerCase().replace(/\s+/g, '')}`;
  const postsCount = userProfile?.posts_count ?? 0;
  const followersCount = userProfile?.followers_count ?? 0;
  const followingCount = userProfile?.following_count ?? 0;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Image source={APP_ICON} style={styles.headerLogo} />
            <Text style={styles.headerTitle}>Tambayan</Text>
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.headerSubtitle}>Profile</Text>
            <TouchableOpacity onPress={signOut} style={styles.signOutIconBtn}>
              <Ionicons name="log-out-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner with Cover photo and Avatar */}
        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWvWMqlcLJ_9z7cp7kTMoOW3rF__41S2iJc2O7qv-6V3NiPABqaSKL9OZovFo786FIFPdoi0WVOrEprJTTI7UuAmqnINjrmYn9EfOnhOjVD5IJauPMJqDPl3SrHiG72FugqvM2eWFdeLO_HJvEdqSU48UXAenLPtpQ3Ib0P-hUGk1_YUdfFOEUBsQF2tOoBUrwWebz0ug-Zr1LBtdrS-IVtUEZUTIVqBBRmV-DYH-_G38j0qgW2UvFCg',
            }}
            style={styles.coverImage}
            resizeMode="cover"
          />

          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBorder}>
              <Image
                source={ImageUtils.getImageSource(userProfile?.profile_picture)}
                style={styles.avatarImage}
              />
            </View>

            <TouchableOpacity
              style={styles.cameraBadge}
              onPress={handlePickAndUpload}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="camera" size={18} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.infoSection}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userHandle}>{handle}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statColumn}>
              <Text style={styles.statCount}>{postsCount}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statColumn}>
              <Text style={styles.statCount}>{followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statColumn}>
              <Text style={styles.statCount}>{followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.editProfileBtn}>
              <Ionicons name="create-outline" size={16} color="#FFF" />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
              <Ionicons name="log-out-outline" size={16} color={Colors.error} />
              <Text style={styles.logoutBtnText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Strip */}
        <View style={styles.tabStrip}>
          <TouchableOpacity
            style={[styles.stripTab, activeTab === 'posts' && styles.stripTabActive]}
            onPress={() => setActiveTab('posts')}
          >
            <Text
              style={[
                styles.stripTabText,
                activeTab === 'posts' && styles.stripTabTextActive,
              ]}
            >
              Posts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stripTab, activeTab === 'saved' && styles.stripTabActive]}
            onPress={() => setActiveTab('saved')}
          >
            <Text
              style={[
                styles.stripTabText,
                activeTab === 'saved' && styles.stripTabTextActive,
              ]}
            >
              Saved
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stripTab, activeTab === 'tags' && styles.stripTabActive]}
            onPress={() => setActiveTab('tags')}
          >
            <Text
              style={[
                styles.stripTabText,
                activeTab === 'tags' && styles.stripTabTextActive,
              ]}
            >
              Tags
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentArea}>
          {activeTab === 'posts' && (
            <View style={styles.emptyState}>
              <Ionicons name="images-outline" size={48} color={Colors.outline} />
              <Text style={styles.emptyStateText}>Your posts will appear here</Text>
            </View>
          )}

          {activeTab === 'saved' && (
            <View style={styles.emptyState}>
              <Ionicons name="bookmark-outline" size={48} color={Colors.outline} />
              <Text style={styles.emptyStateText}>No saved items yet</Text>
            </View>
          )}

          {activeTab === 'tags' && (
            <View style={styles.emptyState}>
              <Ionicons name="pricetags-outline" size={48} color={Colors.outline} />
              <Text style={styles.emptyStateText}>No tagged posts yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Privacy Selection Modal for Uploading */}
      <Modal visible={privacyModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Profile Picture Privacy</Text>
            <Text style={styles.modalSubtitle}>
              Who can see this update published onto the community Feed?
            </Text>

            {(['Public', 'Friends', 'Only me'] as const).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.privacyOption,
                  selectedPrivacy === opt && styles.privacyOptionSelected,
                ]}
                onPress={() => setSelectedPrivacy(opt)}
              >
                <Ionicons
                  name={
                    opt === 'Public'
                      ? 'globe-outline'
                      : opt === 'Friends'
                      ? 'people-outline'
                      : 'lock-closed-outline'
                  }
                  size={20}
                  color={selectedPrivacy === opt ? Colors.primary : Colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.privacyOptionText,
                    selectedPrivacy === opt && styles.privacyOptionTextSelected,
                  ]}
                >
                  {opt}
                </Text>
                {selectedPrivacy === opt && (
                  <Ionicons name="checkmark" size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setPrivacyModalVisible(false);
                  setPendingBase64(null);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalSaveBtn} onPress={confirmUpload}>
                <Text style={styles.modalSaveText}>Save & Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerSafeArea: {
    backgroundColor: Colors.surface,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant + '30',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogo: {
    width: 28,
    height: 28,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  signOutIconBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  bannerContainer: {
    position: 'relative',
    marginBottom: 50,
  },
  coverImage: {
    width: '100%',
    height: 220,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -45,
    alignSelf: 'center',
  },
  avatarBorder: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: Colors.background,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Colors.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  userHandle: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
  },
  statCount: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.onSurface,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.outlineVariant,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  editProfileText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.error + '40',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  logoutBtnText: {
    color: Colors.error,
    fontWeight: '700',
    fontSize: 14,
  },
  tabStrip: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant + '40',
    marginHorizontal: 16,
  },
  stripTab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  stripTabActive: {
    borderBottomColor: Colors.primary,
  },
  stripTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  stripTabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabContentArea: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 24,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000070',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginBottom: 16,
    lineHeight: 18,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: Colors.surfaceContainer,
  },
  privacyOptionSelected: {
    backgroundColor: Colors.primary + '14',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  privacyOptionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  privacyOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    fontSize: 14,
  },
  modalSaveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  modalSaveText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
