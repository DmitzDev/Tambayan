import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { ImageUtils } from '../../utils/imageUtils';

const APP_ICON = require('../../../assets/images/app_icon.png');

export const DiscoveryScreen: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Image source={APP_ICON} style={styles.headerLogo} />
          <Text style={styles.headerTitle}>Tambayan</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.headerSubtitle}>Discovery</Text>
          <Image
            source={ImageUtils.getImageSource(userProfile?.profile_picture)}
            style={styles.headerAvatar}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.onSurfaceVariant} />
          <TextInput
            placeholder="Search Tambayan..."
            placeholderTextColor={Colors.onSurfaceVariant + '80'}
            style={styles.searchInput}
          />
        </View>

        {/* Trending Now */}
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingRow}
        >
          <View style={[styles.trendChip, { backgroundColor: Colors.tertiaryContainer + '30' }]}>
            <Text style={[styles.trendHash, { color: Colors.tertiary }]}>#</Text>
            <Text style={styles.trendLabel}>LocalEats</Text>
          </View>
          <View style={[styles.trendChip, { backgroundColor: Colors.secondaryContainer + '50' }]}>
            <Text style={[styles.trendHash, { color: Colors.secondary }]}>#</Text>
            <Text style={styles.trendLabel}>StreetArt</Text>
          </View>
          <View style={[styles.trendChip, { backgroundColor: Colors.primaryContainer + '40' }]}>
            <Text style={[styles.trendHash, { color: Colors.primary }]}>#</Text>
            <Text style={styles.trendLabel}>WeekendVibes</Text>
          </View>
          <View style={[styles.trendChip, { backgroundColor: Colors.tertiaryContainer + '30' }]}>
            <Text style={[styles.trendHash, { color: Colors.tertiary }]}>#</Text>
            <Text style={styles.trendLabel}>OpenMicNight</Text>
          </View>
        </ScrollView>

        {/* Discover Communities */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Discover Communities</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.communitiesRow}>
          {/* Large Card: Coffee Lovers */}
          <TouchableOpacity style={styles.largeCommCard} activeOpacity={0.9}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSjMPG2pvNkFYC67ecq3TdN2QRavsHiCqleet5AaB-pzMpXbmrzCFh8dHK3cLuh6fcRo2DeHk-Oj0CIAzrGlktzTud2WYAYqOcS1d2hmcQG64PsgI2DEO5B5isGYWrmn4iwETiW74kzeFC5Tl65MZVzbZkkksrh-oWesKmebhA5aQ4rpuhg-w6kV56uQqfN16BspD5MOM3YDrbabfSebcq5dwd-jF-h_W3z0--vVHYiAZO2k8_e7uK8A',
              }}
              style={styles.largeCommImage}
            />
            <View style={styles.largeCommOverlay}>
              <Text style={styles.largeCommTitle}>Coffee Lovers</Text>
              <Text style={styles.largeCommMembers}>1.2k members</Text>
            </View>
          </TouchableOpacity>

          {/* Small Cards */}
          <View style={styles.smallCommColumn}>
            <TouchableOpacity
              style={[styles.smallCommCard, { backgroundColor: Colors.secondaryContainer }]}
            >
              <Ionicons name="color-palette" size={24} color={Colors.onSecondaryContainer} />
              <Text style={[styles.smallCommTitle, { color: Colors.onSecondaryContainer }]}>
                Urban Art{'\n'}Collective
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.smallCommCard, { backgroundColor: Colors.tertiaryContainer }]}
            >
              <Ionicons name="leaf" size={24} color={Colors.onTertiaryContainer} />
              <Text style={[styles.smallCommTitle, { color: Colors.onTertiaryContainer }]}>
                City Park{'\n'}Meetups
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Meet Locals */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Meet Locals</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.localsRow}
        >
          {/* Local 1 */}
          <View style={styles.localCard}>
            <View style={styles.localAvatarContainer}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzpDzeta0mZFrk7HtimqtHx36Sy61CC6wau4uI7H_y4wL4ZkkbqS1L7eAtK9fb3zGnuqPRlkB6TxkFYs00lmiukvvrHYRP5aFULNe8lF5UvEHdRZi8MZc1jhlZ4NDS3J5JpYxVlmhHmYNJFC36i5isNf3n0YcXRoD9uVJ0JFLM95kMUmXdh4dKbn12QS2-BIp77SpF0wq3CTzuOpa8VSgUWuICp3Z2fwzuDBOqKYl91_GMd0vzN2hQxg',
                }}
                style={styles.localAvatar}
              />
              <View style={styles.onlineBadge} />
            </View>
            <Text style={styles.localName}>Maya R.</Text>
            <Text style={styles.localTitle}>Photographer</Text>
            <TouchableOpacity style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>

          {/* Local 2 */}
          <View style={styles.localCard}>
            <View style={styles.localAvatarContainer}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0sMktUTtknJ77TznbQomRY6LxUfRbiL6L7SJslUiHq_nVmWjd0LLvZ5PV8_g0xZBy64-Y9-j6XzsiIF5O_IThqoDRxt49ccewtnPiX_WqlQU1AwsaqNs9-6vKvX9PkUBdp0gVB3CBGGHoZ8Paa-fHV9ZGKnwcEyC78lFhMtLvIuqNaYWcA_bK0HvhqUEAM4PWQ4i03rD1B5lHe12PFmqREnNz14Ro3q-B0t0jxKAIQ7OasADQ8W8ksg',
                }}
                style={styles.localAvatar}
              />
            </View>
            <Text style={styles.localName}>Leo J.</Text>
            <Text style={styles.localTitle}>Local Guide</Text>
            <TouchableOpacity style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>

          {/* Local 3 */}
          <View style={styles.localCard}>
            <View style={styles.localAvatarContainer}>
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeq7dLix1MoT5INi7m-DGuk_dLi4r1-H45Mr3MdFdZjJmxfRWNAJJyC6z4uvyX2iHpGpdpg9fPR4g6SeqPJIUFFis0BXx2kwG-6EwQ1dgGhZHmfVtcfJ_Y3tppT6mZYuY6pPV3ZRR-h-YgA9yWem5eyyur4vw7DlDdyu5AVFgWiYR1sDDGSU7jrulbVx9GoENRSfO-WKyXDNJYp7JQco64c_sm93yLHUFsn0rebQSdjVIHH3LKi-6ITw',
                }}
                style={styles.localAvatar}
              />
            </View>
            <Text style={styles.localName}>Sam T.</Text>
            <Text style={styles.localTitle}>Artist</Text>
            <TouchableOpacity style={styles.connectButton}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Spotlight */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Spotlight</Text>
        <View style={styles.spotlightCard}>
          <View style={styles.spotlightHeader}>
            <View style={styles.spotlightIconBg}>
              <Ionicons name="time-outline" size={20} color={Colors.onSecondaryContainer} />
            </View>
            <View>
              <Text style={styles.spotlightTitle}>Weekend Flea Market</Text>
              <Text style={styles.spotlightSub}>Hosted by Local Makers</Text>
            </View>
          </View>

          <View style={styles.spotlightImageContainer}>
            <Image
              source={{
                uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZGzhNuXhLLs6wBfMDjnhfXeLCkDlCPtAjAGb_O3m8-j2kW1-VM_W-jRc1WYSoYRx6_MWW-_PHEdDP5Vs1HsaXExbvmArhekAVDzjt-tdH8DHtROBHY4kcrpkCkj0pFFKK6FD6kSDGy8pJk-JeFqsVRt6rsYZcFqIyXADVeeOjsXdBnbfeZoCgTJyuXhn2rXAMW-VUUIrazLkhZ_K9RXFKndttIzeN599rUl30Q4lsXlGPiJuxh99PVw',
              }}
              style={styles.spotlightImage}
            />
            <View style={styles.tomorrowBadge}>
              <Ionicons name="calendar-outline" size={14} color={Colors.onSurface} />
              <Text style={styles.tomorrowText}>Tomorrow</Text>
            </View>
          </View>

          <Text style={styles.spotlightDesc} numberOfLines={2}>
            Join us this Saturday for a celebration of local craft! Over 50 vendors, live acoustic
            music, and the best food trucks in town.
          </Text>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.onSurface,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onSurface,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  trendingRow: {
    gap: 8,
    paddingBottom: 4,
  },
  trendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  trendHash: {
    fontWeight: '700',
    fontSize: 15,
  },
  trendLabel: {
    fontWeight: '600',
    fontSize: 14,
    color: Colors.onSurface,
  },
  communitiesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  largeCommCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  largeCommImage: {
    width: '100%',
    height: '100%',
  },
  largeCommOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: '#00000080',
  },
  largeCommTitle: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  largeCommMembers: {
    color: '#FFFFFFCC',
    fontSize: 12,
    marginTop: 2,
  },
  smallCommColumn: {
    flex: 1,
    gap: 12,
  },
  smallCommCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
  },
  smallCommTitle: {
    fontWeight: '700',
    fontSize: 13,
    lineHeight: 16,
  },
  localsRow: {
    gap: 14,
    paddingBottom: 4,
  },
  localCard: {
    width: 130,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '40',
  },
  localAvatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  localAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  localName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  localTitle: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginBottom: 10,
  },
  connectButton: {
    backgroundColor: Colors.primary + '18',
    paddingVertical: 6,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
  },
  connectButtonText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  spotlightCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariant + '30',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  spotlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  spotlightIconBg: {
    backgroundColor: Colors.secondaryContainer,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotlightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  spotlightSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  spotlightImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  spotlightImage: {
    width: '100%',
    height: 160,
  },
  tomorrowBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFFEE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tomorrowText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  spotlightDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.onSurfaceVariant,
  },
});
