# FitFlex

FitFlex is a fitness app for Android built with React Native (CLI) and TypeScript. It helps you pick a workout, follow it with a timer, track your weight and photos, and keep a history of your activities.

## Features

- Sign up and log in, with a short quiz about your goal, level and gender
- PIN code and biometric lock
- Workouts screen: video recommendations from YouTube, filters by muscle group, activity picker
- Progress screen: weight tracking with a chart, goal settings and a photo gallery
- History screen: calendar with your activities, add and delete records
- Profile menu: change name, language (English / Ukrainian), dark and light theme, invite a friend from contacts
- Workout session with a timer, a pause with countdown, and GPS distance for outdoor activities
- Offline banner when there is no internet
- Local notifications
- First-launch tour of the main screens

## Tech stack

| Area | Libraries |
| --- | --- |
| Core | React Native CLI, TypeScript |
| Navigation | `@react-navigation/native`, `@react-navigation/bottom-tabs`, `react-native-gesture-handler`, `react-native-safe-area-context` |
| State | `mobx`, `mobx-react-lite` |
| Styles and theme | `react-native-extended-stylesheet`, custom fonts (Manrope), dark / light theme, `react-native-splash-screen` |
| Localization | `i18next`, `react-i18next` (English, Ukrainian) |
| Graphics | `react-native-svg`, `react-native-svg-transformer`, `@react-native-masked-view/masked-view` |
| UI | `@gorhom/bottom-sheet`, `react-native-reanimated`, `react-native-flash-message`, `react-native-copilot`, `@native-html/render`, `react-native-date-picker` |
| Storage and security | `react-native-encrypted-storage`, `@react-native-async-storage/async-storage`, `react-native-biometrics` |
| Device features | `react-native-permissions`, `react-native-image-picker`, `@react-native-community/geolocation`, `@react-native-community/netinfo`, `react-native-device-info`, `react-native-contacts`, `react-native-share`, `@react-native-clipboard/clipboard`, `react-native-notifications` |
| Web and network | `react-native-webview`, `react-native-config` |

## Project structure

```
src/
  assets/        fonts and svg icons
  components/    shared components (Gradient, Sheet)
  languages/     i18next setup and translations
  navigation/    app navigator
  screens/
    auth/        login and registration screen and quiz
    security/    PIN setup and lock screen
    workouts/    main workouts screen
    progress/    progress screen
    history/     history screen
    profile/     profile menu
  services/      auth, security, notifications, YouTube API
  store/         MobX stores (user, fitness, theme)
  theme/         common styles
  utils/         helpers and the activities list
```

## Getting started

### Requirements

- Node.js 22.11 or newer and npm
- JDK 17
- Android Studio with Android SDK and an emulator, or a phone with USB debugging
- Environment set up as described in the [React Native guide](https://reactnative.dev/docs/set-up-your-development-environment) (Android)

### Install

```bash
git clone https://github.com/sotluf/fitflex-app.git
cd fitflex-app
npm install
```

### Add your own files

The project needs some files with private keys. They are not in the repository, so you have to add them yourself.

**1. `.env` in the project root.** Copy `.env.example` to `.env` and fill it in:

```
RAPID_API_KEY=your_rapidapi_key
RAPID_API_HOST=your_rapidapi_host
```

The keys come from a YouTube search API on [RapidAPI](https://rapidapi.com). Without them the app works, but the workout videos do not load.

**2. `android/app/src/main/res/values/firebase.xml`.** Firebase configuration for Android notifications. Create this file with the values from your own Firebase project (Firebase console, Project settings, Android app).

### Run

Start Metro in one terminal:

```bash
npx react-native start
```

Run the app on an emulator or a connected phone in another terminal:

```bash
npx react-native run-android
```
