import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { DatabaseService, FeedPost } from '../../services/databaseService';
import { ImageUtils } from '../../utils/imageUtils';

const APP_ICON = require('../../../assets/images/app_icon.png');

export const FeedScreen: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Post Creation State
  const [modalVisible, setModalVisible] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newImageBase64, setNewImageBase64] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<'Public' | 'Friends' | 'Only me'>('Public');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Like states (local toggle)
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({
    sample_text_1: true,
  });

  useEffect(() => {
    const unsubscribe = DatabaseService.subscribeFeedPosts((fetchedPosts) => {
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePickPostImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      setNewImageBase64(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleCreatePost = async () => {
    if (!newContent.trim() && !newImageBase64) {
      Alert.alert('Empty Post', 'Please write something or attach an image.');
      return;
    }

    setIsSubmitting(true);
    try {
      await DatabaseService.createPost(newContent.trim(), newImageBase64, privacy);
      setNewContent('');
      setNewImageBase64(null);
      setModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to publish post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderPrivacyIcon = (priv: string) => {
    if (priv === 'Friends') return 'people-outline';
    if (priv === 'Only me') return 'lock-closed-outline';
    return 'globe-outline';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Image source={APP_ICON} style={styles.headerLogo} />
          <Text style={styles.headerTitle}>Tambayan</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.headerSubtitle}>Feed</Text>
          <Image
            source={ImageUtils.getImageSource(userProfile?.profile_picture)}
            style={styles.headerAvatar}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Create Post Card */}
        <View style={styles.createCard}>
          <View style={styles.createRow}>
            <Image
              source={ImageUtils.getImageSource(userProfile?.profile_picture)}
              style={styles.createAvatar}
            />
            <TouchableOpacity
              style={styles.createInputPlaceholder}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.createPlaceholderText}>What's on your mind?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.createActionsRow}>
            <View style={styles.createIconButtons}>
              <TouchableOpacity style={styles.createIconButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="image" size={20} color={Colors.secondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.createIconButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="location" size={20} color={Colors.secondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.createIconButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="happy" size={20} color={Colors.secondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.postButtonSmall} onPress={() => setModalVisible(true)}>
              <Text style={styles.postButtonSmallText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Real-time Dynamic Posts from Firestore */}
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.authorRow}>
                  <Image
                    source={ImageUtils.getImageSource(post.author_avatar)}
                    style={styles.authorAvatar}
                  />
                  <View style={styles.authorMeta}>
                    <Text style={styles.authorName}>{post.author_name || 'User'}</Text>
                    <View style={styles.privacyRow}>
                      <Text style={styles.postTime}>Just now · </Text>
                      <Ionicons
                        name={renderPrivacyIcon(post.privacy) as any}
                        size={12}
                        color={Colors.onSurfaceVariant}
                      />
                      <Text style={styles.privacyText}>{post.privacy}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={20} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>

              {post.content ? <Text style={styles.postBody}>{post.content}</Text> : null}

              {post.image_data ? (
                <Image
                  source={ImageUtils.getImageSource(post.image_data)}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              ) : null}

              <View style={styles.divider} />

              <View style={styles.interactionRow}>
                <TouchableOpacity
                  style={styles.interactionBtn}
                  onPress={() => toggleLike(post.id)}
                >
                  <Ionicons
                    name={likedPosts[post.id] ? 'heart' : 'heart-outline'}
                    size={20}
                    color={likedPosts[post.id] ? Colors.primary : Colors.onSurfaceVariant}
                  />
                  <Text
                    style={[
                      styles.interactionText,
                      likedPosts[post.id] && { color: Colors.primary },
                    ]}
                  >
                    {(post.likes_count || 0) + (likedPosts[post.id] ? 1 : 0)}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.interactionBtn}>
                  <Ionicons name="chatbubble-outline" size={19} color={Colors.onSurfaceVariant} />
                  <Text style={styles.interactionText}>{post.comments_count || 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.interactionBtn}>
                  <Ionicons name="share-social-outline" size={19} color={Colors.onSurfaceVariant} />
                  <Text style={styles.interactionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Static Rich Demo Posts Matching Flutter Template */}
        {/* Post 1: Maya Santos */}
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.authorRow}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACFBIHwbaJ908djnjfwrXucubrYLDMc8nQVG-ptoBHF6G_TSoe3hUgp68k0J56s1dzJrqFYyS4M-Fhd2hcAIbQ-jCBygI-QzRBbLzPhPO7q7DSN1E7pN_FtklNEELpTsPNDr-n_4wqivuJ_QdkDN97v5u1SlWT6Xx2CTAW5BD0btHA8hhKSilxvp9jG4uCuVayUuCNYuVDPSN5VCPQBJsHoet9G6YKEGSG5HSsvmstHQ9EXZfxmGZRNQ',
                }}
                style={styles.authorAvatar}
              />
              <View style={styles.authorMeta}>
                <Text style={styles.authorName}>Maya Santos</Text>
                <Text style={styles.postTime}>2 hours ago</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <Text style={styles.postBody}>
            Found this amazing hidden cafe in Poblacion. The cold brew is incredible, and the vibe is
            perfect for getting some work done. Highly recommend! ☕️✨
          </Text>

          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjpbBeExaQ57m--TIpm6A4-HZFM86Yt7n4jyN6kcr0_rwGVf5xIICwUQnlwWke1iZGA4qN9c-95e01BZ4ojalnWvp77c68MVpIV0XrccDY-LpdD_jwdezWVGxRxdOqB758kPbGf0Suh-43y4oqp2gYj1ilsYXc4-xkZQAG5jsvEkVQz7NR9wtgRcFSfLd9WJm4mMuFUs4GjAkM8-WZaDJiMI3J5ahtPhOlzGtIX5XibtSavRcVq9aabQ',
            }}
            style={styles.postImage}
            resizeMode="cover"
          />

          <View style={styles.divider} />

          <View style={styles.interactionRow}>
            <TouchableOpacity style={styles.interactionBtn} onPress={() => toggleLike('sample_maya')}>
              <Ionicons
                name={likedPosts['sample_maya'] ? 'heart' : 'heart-outline'}
                size={20}
                color={likedPosts['sample_maya'] ? Colors.primary : Colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.interactionText,
                  likedPosts['sample_maya'] && { color: Colors.primary },
                ]}
              >
                24
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.interactionBtn}>
              <Ionicons name="chatbubble-outline" size={19} color={Colors.onSurfaceVariant} />
              <Text style={styles.interactionText}>5</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.interactionBtn}>
              <Ionicons name="share-social-outline" size={19} color={Colors.onSurfaceVariant} />
              <Text style={styles.interactionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Post 2: Leo Reyes */}
        <View style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={styles.authorRow}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvEgxgUcH76omxbd-Ms1j8j8Xv5KCdaOinWhBL4f4EwRS2KZ2q8fuDkrbcvOqgp79pYGX4ub-txD0OPFxtkvZUNlCfMxDZS192xwHn-z81URATNS8utjWHtIIawIRKR8RUiMlh1Vs7hwL017SWGA16ObiOGh7KcnRzul6I5qQQYhctHw97L-s3mNqNyQhm_42dWXVrAEuaM8Ijl38Km5LI-_TkKvzSL9UEY6Cv5Un7Vl5ADzGO07x1yQ',
                }}
                style={styles.authorAvatar}
              />
              <View style={styles.authorMeta}>
                <Text style={styles.authorName}>Leo Reyes</Text>
                <Text style={styles.postTime}>5 hours ago</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <Text style={styles.postBody}>
            Anyone down for a quick run at UP Diliman later this afternoon? Need to burn off the weekend
            lechon! 🏃‍♂️
          </Text>

          <View style={styles.tagsRow}>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>#Fitness</Text>
            </View>
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>#Running</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.interactionRow}>
            <TouchableOpacity
              style={styles.interactionBtn}
              onPress={() => toggleLike('sample_text_1')}
            >
              <Ionicons
                name={likedPosts['sample_text_1'] ? 'heart' : 'heart-outline'}
                size={20}
                color={likedPosts['sample_text_1'] ? Colors.primary : Colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.interactionText,
                  likedPosts['sample_text_1'] && { color: Colors.primary },
                ]}
              >
                12
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.interactionBtn}>
              <Ionicons name="chatbubble-outline" size={19} color={Colors.onSurfaceVariant} />
              <Text style={styles.interactionText}>8</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.interactionBtn}>
              <Ionicons name="share-social-outline" size={19} color={Colors.onSurfaceVariant} />
              <Text style={styles.interactionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Create Post Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.onSurface} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="What's happening?"
              placeholderTextColor={Colors.onSurfaceVariant + '80'}
              multiline
              value={newContent}
              onChangeText={setNewContent}
            />

            {newImageBase64 ? (
              <View style={styles.modalImagePreviewContainer}>
                <Image source={{ uri: newImageBase64 }} style={styles.modalImagePreview} />
                <TouchableOpacity
                  style={styles.modalRemoveImage}
                  onPress={() => setNewImageBase64(null)}
                >
                  <Ionicons name="close-circle" size={26} color="#FFF" />
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={styles.modalFooter}>
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.actionIcon} onPress={handlePickPostImage}>
                  <Ionicons name="image-outline" size={24} color={Colors.secondary} />
                </TouchableOpacity>

                {/* Privacy Toggle */}
                <TouchableOpacity
                  style={styles.privacyPill}
                  onPress={() => {
                    const next =
                      privacy === 'Public' ? 'Friends' : privacy === 'Friends' ? 'Only me' : 'Public';
                    setPrivacy(next);
                  }}
                >
                  <Ionicons
                    name={renderPrivacyIcon(privacy) as any}
                    size={14}
                    color={Colors.secondary}
                  />
                  <Text style={styles.privacyPillText}>{privacy}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.publishButton}
                onPress={handleCreatePost}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.publishButtonText}>Publish</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
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
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  createCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  createAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  createInputPlaceholder: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  createPlaceholderText: {
    color: Colors.onSurfaceVariant,
    fontSize: 14,
  },
  createActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
  },
  createIconButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  createIconButton: {
    padding: 4,
  },
  postButtonSmall: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  postButtonSmallText: {
    color: Colors.onPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  postCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#001F24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  authorMeta: {
    gap: 2,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  postTime: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  privacyText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginLeft: 2,
  },
  postBody: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.onSurface,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tagBadge: {
    backgroundColor: Colors.tertiaryContainer,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    color: Colors.onTertiaryContainer,
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.surfaceVariant + '80',
    marginVertical: 8,
  },
  interactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  interactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  interactionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  modalInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: Colors.onSurface,
  },
  modalImagePreviewContainer: {
    position: 'relative',
    marginVertical: 12,
  },
  modalImagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  modalRemoveImage: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant + '40',
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    padding: 6,
  },
  privacyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  privacyPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onSecondaryContainer,
  },
  publishButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  publishButtonText: {
    color: Colors.onPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
});
