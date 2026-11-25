# Maidora Mobile App

Maidora is a Kenyan two-sided marketplace connecting domestic workers with employers.

## Current milestone: onboarding and authentication UI

This repository currently contains the Expo React Native onboarding prototype:
- Splash and welcome screens
- Maid / Employer role selection
- Shared registration form
- Phone or email verification selection
- Demo OTP verification (use `123456`)
- Role-specific basic profile onboarding
- Login screen (demo navigation)
- Separate Maid and Employer dashboard landing screens

> **Important:** Authentication and verification are currently frontend demonstrations. No real SMS, email, backend account creation, password storage, or KYC submission is connected yet. Do not use real personal information or production credentials in this prototype.

## Requirements
- Node.js LTS
- npm
- Expo Go on your phone (or an Android/iOS simulator)

## Run locally

```bash
npm install
npx expo start
```

Scan the QR code using Expo Go.

## Demo verification
Enter `123456` on the OTP screen. This simulates successful verification only.

## Project structure

```
App.js
src/
  components/
  screens/
  theme/
```

## Next milestone
Connect the UI to a secure backend API for registration, OTP delivery/validation, login, sessions, and profile persistence.
