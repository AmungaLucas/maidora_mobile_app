# Maidora Mobile App

Maidora is a Kenyan two-sided marketplace connecting domestic workers with employers.

## Current milestone: modular onboarding prototype

The app is built with Expo SDK 58, React Native and React Navigation.

### Current UI flows
- Splash and welcome screens
- Animated chat-style role selection with a role-specific explanation
- Shared account setup with password confirmation and explicit legal acknowledgement
- Foreground GPS permission request during signup, with manual county/town/area fallback
- Phone or email verification choice
- Demo OTP verification (use `123456`)
- Role-specific profile setup with location fields prefilled when reverse geocoding succeeds
- Separate maid and employer dashboards
- Non-blocking KYC reminder
- Profile-completion gates for applying, posting and messaging
- Reusable buttons, text fields, chat bubbles, choice cards and keyboard-aware screen container

### Location behavior
- Uses Expo Location foreground permission only; there is no background tracking.
- Signup attempts to capture coordinates and reverse-geocode a readable location.
- If permission is declined or reverse geocoding is unavailable, the user can enter county and town manually.
- A dashboard refreshes the device location if foreground permission is already granted.
- The confirmed marketplace profile location is kept separate from the latest device location.

> **Important prototype limitations:** This is still a frontend demonstration. Registration does not create a backend account, OTP is not sent, login is not authenticated, location is not persisted to a server, KYC is not implemented, and browse/post/apply/chat features are informational placeholders. Do not use real personal information or production credentials.

## Requirements
- Node.js 22.13.x or newer
- npm
- Expo Go compatible with SDK 58 (or a development build)

## Run locally

```bash
npm install
npx expo install --fix
npx expo-doctor
npx expo start --clear
```

Scan the QR code using Expo Go.

## Demo verification
Enter `123456` on the OTP screen. This simulates successful verification only.

## Project structure

```
App.js
src/
  components/
  navigation/
  screens/
    auth/
    dashboard/
    misc/
    onboarding/
    profile/
  services/
  theme/
```

## Next development milestone
Build the backend integration for secure registration, OTP delivery and validation, login/session handling, profile persistence, consent versioning, and authenticated location updates. Then implement actual job/maid browsing, posting, applications and messaging.