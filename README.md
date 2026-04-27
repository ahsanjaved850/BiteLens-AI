# 🥗BiteLens AI

> **Your AI-powered nutrition companion** snap a photo of any meal and instantly get a full nutritional breakdown, track your daily macros, and stay on top of your health goals.

---

## 📱 Overview

BiteLens AI is a cross-platform mobile application built with **React Native (Expo)** that combines AI-powered meal analysis with a clean, intuitive nutrition tracking experience. Users simply photograph their food, and the app uses a backend AI model (via Supabase Edge Functions) to identify the meal, estimate its nutritional content, and log everything automatically.

---

## ✨ Features

### 🔐 Authentication
- Email and password sign-in and sign-up
- Persistent session management with AsyncStorage
- Secure, Supabase-backed authentication

### 🚀 Onboarding
- Multi-step onboarding flow (11 screens) collecting:
  - Name, gender, age, height, weight, goal weight
  - Fitness goal (e.g. lose weight, maintain, gain muscle)
  - Lifestyle/activity level
- Per-page validation with haptic feedback
- Smooth horizontal scroll with dot indicators

### 🏠 Home Screen
- **Today's Summary** card showing real-time calorie consumption vs. goal
- **Macronutrient breakdown** Protein, Carbs, Fats, Sugar, Sodium, Fiber each with color-coded progress bars
- **Recent Meals** list with meal images, timestamps, and inline macro tags
- Pull-to-refresh support
- Add Meal floating action button

### 📸 AI Meal Analysis (ImageExamine)
- Take a photo with the camera or pick from the gallery
- Image is converted to JPEG, compressed, and encoded as Base64
- Sent to an AI model via a **Supabase Edge Function** (keeps API keys server-side and secure)
- Returns: meal name, calories, protein, carbs, fats, sugar, sodium, fiber, and ingredients list
- Meal image is uploaded to **Supabase Storage**
- Full meal record is saved to the database automatically

### 🍽️ Meal Details Screen
- Full-screen meal image
- Total calorie display
- Macronutrient grid (Protein, Carbs, Fats)
- Additional nutrients list (Sugar, Sodium, Fiber)
- Ingredient list parsed from AI response
- AI-generated disclaimer notice

### 📊 Data Overview Screen
- Current weight and goal weight with update/log modals
- BMI score and category badge (Underweight / Normal / Overweight / Obese) with color coding
- Weight progress bar showing distance to goal
- Recalculates daily nutrition targets on weight update using `dataAnalysis` utility

### ⚙️ Settings Screen
- Profile card with user initials avatar
- Personal information display (name, age, gender)
- Physical details display (weight, height, goal weight)
- Support & Legal links (Help Center, Terms & Conditions)
- Danger Zone: account deletion with confirmation alert

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native with Expo |
| Navigation | Expo Router + React Navigation |
| Backend / Auth | Supabase (Auth, Database, Storage) |
| AI Analysis | Supabase Edge Functions (server-side API key) |
| State Management | React Hooks (useState, useEffect, useFocusEffect) |
| Session Persistence | AsyncStorage |
| Image Handling | expo-image-picker, expo-image-manipulator |
| Haptics | expo-haptics |
| Icons | @expo/vector-icons (Ionicons) |
| Styling | React Native StyleSheet |

---

## 🗂️ Project Structure

```
src/
├── Screens/
│   ├── Home/
│   │   ├── Home.tsx              # UI
│   │   ├── Home.logic.tsx        # Custom hook (useHome)
│   │   ├── Home.static.ts        # Constants, types, configs
│   │   └── Home.style.ts         # StyleSheet
│   ├── Data/
│   │   ├── Data.tsx
│   │   ├── Data.logic.tsx
│   │   ├── Data.static.ts
│   │   └── Data.style.ts
│   ├── Login/
│   │   ├── Login.tsx
│   │   ├── Login.logic.tsx
│   │   ├── Login.static.ts
│   │   └── login.style.ts
│   ├── Setting/
│   │   ├── Setting.tsx
│   │   ├── Setting.logic.tsx
│   │   ├── Setting.static.ts
│   │   └── Setting.style.ts
│   ├── MealDetails/
│   │   ├── MealDetails.tsx
│   │   ├── MealDetails.logic.tsx
│   │   ├── MealDetails.static.ts
│   │   └── mealDetails.style.ts
│   └── Onboarding/
│       ├── Onboarding.tsx
│       ├── Onboarding.logic.tsx
│       ├── Onboarding.static.ts
│       └── Onboarding.style.ts
├── components/
│   ├── ImageExamine/
│   │   ├── ImageExamine.tsx
│   │   ├── ImageExamine.logic.tsx
│   │   ├── ImageExamine.static.ts
│   │   └── imageExamine.style.ts
│   └── OnboardingFeatures/
│       ├── AppIntro.tsx
│       ├── Demo.tsx
│       ├── NameAdding.tsx
│       ├── GenderSelection.tsx
│       ├── BodyStatInput.tsx
│       ├── PhysiqueInput.tsx
│       ├── FitnessGoal.tsx
│       ├── LifeStyle.tsx
│       ├── MotivationSlide.tsx
│       ├── OtherApps.tsx
│       └── Completion.tsx
└── utils/
    └── supabase.ts               # Supabase client, meal helpers

backend/
├── auth.ts                       # signIn, signUp, signOut, getSession
├── getData.ts                    # getProfile, getInitialDetails, getTodayIntake
└── sendData.ts                   # updateBodyStats, updateDailyIntake, etc.
```

Each screen follows a consistent **three-file pattern**:
- `*.tsx` => pure UI, no business logic
- `*.logic.tsx` => custom hook encapsulating all state and handlers
- `*.static.ts` => constants, interfaces, and config objects
- `*.style.ts` => StyleSheet definitions

---

## 🗄️ Database Schema (Supabase)

| Table | Key Columns |
|---|---|
| `profile` | id, full_name, age, gender, weight, height, target_weight, goal, onboarding |
| `initial_details` | id, calories, protein, carbs, fat, sugar, sodium, fiber, bmi, bmi_category |
| `daily_meals` | id, user_id, name, calories, protein, carbs, fat, sugar, sodium, fiber, ingredients, meal_image, created_at |
| `daily_intake` | id, user_id, total_calories, total_protein, total_carbs, total_fat, total_sugar, total_sodium, total_fiber, created_at |
