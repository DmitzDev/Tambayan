# Tambayan Mobile (React Native + Expo)

A community and campus mobile application converted from Flutter to **React Native (TypeScript) with Expo**.

## 📱 Features

- **Auth & Onboarding**:
  - Elastic spring animated **Splash Screen**.
  - **Login & Registration** tabs with ambient blurred gradient backdrop, Firebase Auth integration, and "Trending Hangouts" previews.
- **Feed**:
  - Real-time Firestore post subscription.
  - Interactive post creation bar (text + image upload + privacy filter).
  - Like toggling, comment counts, and share actions.
- **Discovery (Explore)**:
  - Search bar.
  - Trending hashtag tags (`#LocalEats`, `#StreetArt`, `#WeekendVibes`, etc.).
  - Community cards grid ("Coffee Lovers", "Urban Art Collective", "City Park Meetups").
  - "Meet Locals" profile cards carousel with connect actions.
  - Featured "Weekend Flea Market" spotlight event card.
- **Notifications (Inbox)**:
  - Filter pills for All vs. Mentions.
  - Quoted mention cards with reply and view post actions.
  - Photo tag notifications with thumbnail previews and like actions.
  - Group chat mention notifications.
- **Profile**:
  - Scenic cover banner and circular avatar.
  - Instant avatar picker (`expo-image-picker`) with a **privacy dialog** ("Public", "Friends", "Only me") that synchronizes the profile picture to Firestore and automatically posts the update to the community feed.
  - Post, Follower, and Following stats counters.
  - Tabbed views for Posts, Saved items, and Tagged photos.
  - Sign out functionality.

---

## 🛠️ Tech Stack

- **Framework**: React Native (Expo SDK 58)
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **Backend**: Firebase Auth & Cloud Firestore
- **Typography**: Google Fonts (Plus Jakarta Sans & Be Vietnam Pro)
- **Icons**: Expo Vector Icons (`Ionicons`)
- **Media**: Expo Image Picker (with Base64 encoding)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app on iOS or Android (optional, for physical device preview)

### Installation

```bash
git clone git@github.com:DmitzDev/Tambayan-Mobile.git
cd Tambayan-Mobile
npm install
```

### Running Locally

```bash
# Start the Expo development server
npm start

# Or directly target a platform:
npm run android
npm run ios
npm run web
```

Scan the QR code in your terminal with the **Expo Go** app (Android) or Camera (iOS) to view the app on your mobile device.
