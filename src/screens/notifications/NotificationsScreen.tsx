import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { ImageUtils } from '../../utils/imageUtils';

const APP_ICON = require('../../../assets/images/app_icon.png');

export const NotificationsScreen: React.FC = () => {
  const { userProfile } = useAuth();
  const [filter, setFilter] = useState<'all' | 'mentions'>('mentions');
  const [likedTag, setLikedTag] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Image source={APP_ICON} style={styles.headerLogo} />
          <Text style={styles.headerTitle}>Tambayan</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.headerSubtitle}>Notifications</Text>
          <Image
            source={ImageUtils.getImageSource(userProfile?.profile_picture)}
            style={styles.headerAvatar}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Filter Row */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Mentions</Text>
          <View style={styles.segmentedContainer}>
            <TouchableOpacity
              style={[styles.segmentBtn, filter === 'all' && styles.segmentBtnActive]}
              onPress={() => setFilter('all')}
            >
              <Text
                style={[
                  styles.segmentText,
                  filter === 'all' ? styles.segmentTextActive : styles.segmentTextInactive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.segmentBtn, filter === 'mentions' && styles.segmentBtnActive]}
              onPress={() => setFilter('mentions')}
            >
              <Text
                style={[
                  styles.segmentText,
                  filter === 'mentions' ? styles.segmentTextActive : styles.segmentTextInactive,
                ]}
              >
                Mentions
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 1. Mention Notification */}
        <View style={styles.notificationCard}>
          <View style={styles.indicatorBar} />

          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGyalR9hC-dpxKGdbIY6iaFOotec2iDiZ-Yeo-ukPWfo3Z2uXVHVV3xzHQvb0hc6PsaO86cmLo0Xb0OAbiVstHWmz5KDRi8TcMS4lr2EJ7fTMaVszFGweG_njUfRoWeFXUCAdFTd5-KC8ZKPg-x6WYYD_fl9v2Ftv0FnMMP-bQy1fOlDmAuR9Cb_egcJ0NLYKnejiRLfMK7pcOH-ov1x7kJvh5kxCdrAYCyEK9DGazpjDzVxC8VOxaIg',
            }}
            style={styles.cardAvatar}
          />

          <View style={styles.cardContent}>
            <View style={styles.cardMetaHeader}>
              <Text style={styles.cardTitle}>
                <Text style={styles.authorBold}>Leo Mercer</Text> mentioned you
              </Text>
              <Text style={styles.cardTime}>12m</Text>
            </View>

            {/* Quoted Box */}
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>
                <Text style={styles.mentionHighlight}>@Alex Rivera</Text> you gotta check out this
                new spot downtown, they have the best cold brew!
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.replyButton}>
                <Ionicons name="arrow-undo" size={14} color={Colors.onSecondaryContainer} />
                <Text style={styles.replyButtonText}>Reply</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.viewPostButton}>
                <Ionicons name="eye-outline" size={14} color={Colors.secondary} />
                <Text style={styles.viewPostButtonText}>View Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2. Photo Tag Notification */}
        <View style={styles.notificationCard}>
          <View style={styles.avatarWithBadge}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfTpIuVCcL8IQ_WYiUPhHd-XnKEY2K98_fhE8uqiE4L6eZZGdoeFdm-SMN2HtzrhIQi26OEFZBRVzcqu7bghFZICWdt_u36ahntBQHgdD6i2blaCBHoc-Ye8FyEg-4a7mS_3lp-xhBRKG_QOUlw9uV_57w4gCZ8godrkv-ad-ibtt2YW1fUPQYg54YADvJzgVQ7OiQG2C1wl-FOB7jR4xmZjxn6lGqi8TqTxh7uYG5p9igU1swFToZ2w',
              }}
              style={styles.cardAvatar}
            />
            <View style={styles.tagIconBadge}>
              <Ionicons name="pricetag" size={10} color={Colors.onTertiaryContainer} />
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.cardMetaHeader}>
              <Text style={styles.cardTitle}>
                <Text style={styles.authorBold}>Maya Lin</Text> tagged you in a photo
              </Text>
              <Text style={styles.cardTime}>2h</Text>
            </View>

            {/* Photo preview row */}
            <View style={styles.tagPhotoRow}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIkS3NRKkcvd_SsBhzfcGTqb_fDvsmgdurS415d4d_d_rGA7puGeKMj0Z20Ob8Zndi5D-F_jzkEFqZ9YH3T9TMgyzcAtMmahHgGHucxYxWorCZ_xtvHxsdWuGLfnNWLDBVHgJjb_-8izAtsSjx-gGayCWTP0KIGVXZVJr7IrlEHs8_kLW1WVMsXHN3Xrx8w61knLAynTM343163VXuL0hZ3XBTcSuisrnWJIth60x4UbnMtpjwPMkUg',
                }}
                style={styles.tagPhotoThumb}
              />
              <View style={styles.tagPhotoMeta}>
                <Text style={styles.tagPhotoTitle}>Weekend Vibes ☕️</Text>
                <Text style={styles.tagPhotoCaption}>"Sunday morning crew..."</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.likeTagBtn,
                likedTag && { backgroundColor: Colors.primary + '18' },
              ]}
              onPress={() => setLikedTag(!likedTag)}
            >
              <Ionicons
                name={likedTag ? 'heart' : 'heart-outline'}
                size={15}
                color={likedTag ? Colors.primary : Colors.onSurface}
              />
              <Text
                style={[
                  styles.likeTagText,
                  likedTag && { color: Colors.primary, fontWeight: '700' },
                ]}
              >
                Like
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Group Chat Mention Notification */}
        <View style={styles.notificationCard}>
          <View style={styles.avatarWithBadge}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1WmXVoQo9s-t3288NVFbHQHx86wp16zr1fe8qRn6DhidFWAB7kf3vkmOSx1M2A57JGaXmp98sXTZvWZ3zHYLM-JtmXUwuGwZ4IqouHjh7VTEikgExpu5BEWNOIovzElUOf4fQMhIXaosBXZJktS_llQ_OiDXULkzHAO6wo75Nr65HzS4FphBPRRV3-myGYx3ShjRcwZnhVnoAUyKUIjAguAnoDsW0N3YjyQ_ozDiLQIhLuPbUtOjTcw',
              }}
              style={styles.cardAvatar}
            />
            <View style={[styles.tagIconBadge, { backgroundColor: Colors.secondary }]}>
              <Ionicons name="chatbubbles" size={10} color={Colors.onSecondary} />
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.cardMetaHeader}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                <Text style={styles.authorBold}>Sam Lee</Text> mentioned you in{' '}
                <Text style={styles.authorBold}>Indie Dev Hangout</Text>
              </Text>
              <Text style={styles.cardTime}>Yesterday</Text>
            </View>

            <Text style={styles.chatMessagePreview}>
              "Hey @Alex did you figure out that API issue yet?"
            </Text>

            <TouchableOpacity style={styles.openChatButton}>
              <Ionicons name="chatbubble" size={14} color={Colors.onSurfaceVariant} />
              <Text style={styles.openChatButtonText}>Open Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 24,
    padding: 3,
  },
  segmentBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  segmentBtnActive: {
    backgroundColor: Colors.secondaryContainer,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: Colors.onSecondaryContainer,
  },
  segmentTextInactive: {
    color: Colors.onSurfaceVariant,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  indicatorBar: {
    width: 4,
    height: 42,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginRight: 10,
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarWithBadge: {
    position: 'relative',
    marginRight: 12,
  },
  tagIconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.tertiaryContainer,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surfaceContainerLowest,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardMetaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
    marginRight: 6,
  },
  authorBold: {
    fontWeight: '700',
  },
  cardTime: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  quoteBox: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.quoteBorder,
    padding: 10,
    marginVertical: 8,
  },
  quoteText: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.onSurfaceVariant,
  },
  mentionHighlight: {
    color: Colors.primary,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  replyButtonText: {
    color: Colors.onSecondaryContainer,
    fontSize: 12,
    fontWeight: '700',
  },
  viewPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewPostButtonText: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  tagPhotoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  tagPhotoThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  tagPhotoMeta: {
    flex: 1,
  },
  tagPhotoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  tagPhotoCaption: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  likeTagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginTop: 4,
  },
  likeTagText: {
    fontSize: 12,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  chatMessagePreview: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
    marginVertical: 6,
  },
  openChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },
  openChatButtonText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
});
