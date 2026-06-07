<div align="center">

# Orca

### AI-Powered Calorie & Weight Tracking for iOS

_Lose weight smarter — track calories, monitor progress, and stay on target._

</div>

---

## Overview

Orca is an iOS application that helps users achieve their weight loss goals through intelligent calorie tracking, personalised nutrition targets, and visual weight progress monitoring. Built with React Native (Expo) and powered by Supabase on the backend, Orca provides a seamless and data-driven experience from onboarding through to goal completion.

---

## Features

### 🎯 Personalised Onboarding

- Collects user details: name, gender, age, height, current weight, target weight, and fitness goal
- Persists onboarding data locally via AsyncStorage before account creation
- Calculates BMI, TDEE, and personalised macro targets (calories, protein, carbs, fat, sugar, sodium, fiber) on signup using the **Mifflin-St Jeor equation**

### 📊 Weight Progress Tracking

- Visual SVG line graph showing weight trend over time
- Every weight entry is stored as a timestamped row in `weight_logs` — full history preserved
- First weight entry seeded automatically on signup from onboarding data
- Goal weight displayed as a dashed reference line on the graph
- Pull-to-refresh to sync latest data

### 🍽️ Meal & Calorie Logging

- Log meals with full nutritional breakdown: calories, protein, carbs, fat, sugar, sodium, fiber
- AI-powered meal image scanning
- Daily intake accumulates across multiple meals per day
- Delete a meal and totals automatically decrement
- Historical meal lookup by date

### 📈 Body Metrics Dashboard

- BMI score with colour-coded category (Underweight / Normal / Overweight / Obese)
- Daily macro targets vs. actual intake
- Weight progress bar showing distance to goal
- Nutrition sourced from WHO, NIH, and peer-reviewed guidelines (cited in-app)

### 🔐 Authentication

- Email & password sign up / sign in via Supabase Auth
- Session persisted locally with AsyncStorage
- RevenueCat integration for subscription management
- Secure sign out with full session cleanup

---

## Key Design Decisions

**Weight history as immutable rows** — every weigh-in is a new `INSERT` into `weight_logs`, never an upsert. This preserves the full timeline needed to draw a smooth graph curve and enables future analytics (streaks, averages, trends).

**Profile table stays as source of truth for current weight** — the `profile` table continues to be upserted with the latest weight for display purposes. `weight_logs` is purely historical.

**Non-fatal weight log on signup** — if the initial `weight_logs` insert fails during account creation, signup still completes. A missing first graph point is a UX inconvenience; a broken signup flow is not acceptable.

**Optimistic UI on weight log** — the graph updates immediately in state when a user logs their weight, before the DB re-fetch completes, so the experience feels instant.

---

## Health Data Sources

All health calculations in Orca are based on established scientific guidelines:

- **BMI** — [WHO Body Mass Index Classification](https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index)
- **TDEE** — [Mifflin-St Jeor Equation (PubMed)](https://pubmed.ncbi.nlm.nih.gov/15883556/)
- **Macronutrients** — [Dietary Reference Intakes — National Academies](https://nap.nationalacademies.org/catalog/10490)
- **Weight Management** — [NIH Weight Management Guidelines](https://www.niddk.nih.gov/health-information/weight-management)

> **Disclaimer:** Information provided by Orca is for general wellness purposes only and does not constitute medical advice. Consult a healthcare professional before making significant changes to your diet or exercise routine.

---

## License

This project is private and proprietary. All rights reserved.
