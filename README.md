# EKAM

**One unified wellness super-app.** EKAM gamifies personal growth across five pillars — Mind, Discipline, Wellness, Wisdom, and Wealth — using RPG-style progression, Ayurvedic time blocks, and blockchain rewards.

Built with React Native (Expo SDK 54), designed as a dark editorial "Digital Sanctuary."

---

## Features

### Gamification Engine
- Character progression with Levels, XP, HP, Coins, and EKAM tokens
- 5 skill pillars: Mind, Discipline, Wellness, Wisdom, Wealth
- 8-tier rank system: Novice, Apprentice, Adept, Expert, Master, Grandmaster, Legendary, Mythic
- Streak multipliers (1.0x to 3.0x) at 7, 30, 100, and 365 day milestones
- Difficulty scaling: Easy, Normal, Hardcore

### Peher — Ayurvedic Time Blocks
Organizes your day into 8 sacred time blocks (3 hours each):

| Peher | Time | Focus |
|-------|------|-------|
| Usha | 12 AM – 3 AM | Deep rest |
| Prabhat | 3 AM – 6 AM | Awakening |
| Poorvahna | 6 AM – 9 AM | Morning ritual |
| Madhyahna | 9 AM – 12 PM | Peak focus |
| Aparahna | 12 PM – 3 PM | Sustained work |
| Sayahna | 3 PM – 6 PM | Wind down |
| Sandhya | 6 PM – 9 PM | Reflection |
| Nisha | 9 PM – 12 AM | Rest |

### Wellness Tracking
- **Workouts**: Strength, cardio, flexibility, HIIT, yoga with 3 difficulty levels
- **Meditation**: Breathing, mindfulness, body scan, gratitude, focus sessions
- **Nutrition**: Meal logging with macros (calories, protein, carbs, fat, water)
- **Body Analyzer**: Body metrics tracking and analysis

### Six Jars Finance
Budgeting system based on T. Harv Eker's method:
- Necessities (55%), Freedom (10%), Education (10%), Long-term Savings (10%), Play (10%), Give (5%)
- Income allocation, expense tracking, and transaction history

### Mentor Library
- Personal wisdom database with 8 categories (Productivity, Business, Philosophy, Health, Spirituality, Science, Finance, Leadership)
- Track ideas, book recommendations, and create custom mentors

### Habits & Quests
- Good/bad habit tracking with streak rewards and HP penalties
- Task system with difficulty-scaled XP rewards
- Peher-aware task assignment

### Time-Aware Journaling
- Entries organized by Peher time blocks
- Tagging system: work, personal, follow-up, idea, urgent
- Pin, search, and date filtering

### Blockchain Integration
- EKAM ERC-20 token on Polygon
- 100M total supply cap, 1,000 daily reward cap per user
- Streak-based multiplier rewards
- Burnable token support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.81.5 + Expo SDK 54 |
| Navigation | Expo Router 6 (file-based) |
| State | Zustand 5 + AsyncStorage |
| Animation | Reanimated 4 + Gesture Handler |
| Typography | Noto Serif (headlines) + Plus Jakarta Sans (body) |
| Blockchain | Solidity (ERC-20 on Polygon) |
| Language | TypeScript 5.9 |

---

## Project Structure

```
EKAM/
├── app/                        # Expo Router screens
│   ├── (auth)/                 # Welcome & onboarding
│   ├── (tabs)/                 # Main tab navigation
│   │   ├── wellness/           # Wellness module screens
│   │   └── mentors/            # Mentor library screens
│   ├── _layout.tsx             # Root layout
│   └── index.tsx               # Entry router
├── modules/                    # Feature modules
│   ├── journal/                # Peher-based journaling
│   ├── wellness/               # Workouts, meditation, nutrition
│   ├── finance/                # Six Jars budgeting
│   └── mentors/                # Wisdom library
├── core/                       # Core systems
│   ├── gamification/           # RPG engine, types, rewards
│   ├── peher.ts                # Ayurvedic time block system
│   ├── store/                  # Zustand global store
│   └── theme/                  # Colors, typography, spacing
├── components/                 # Shared UI (GlowCard, AnimatedButton, ProgressBar)
├── contracts/                  # Solidity smart contracts
└── assets/                     # Icons, splash, fonts
```

---

## Design

Dark editorial theme — "Digital Sanctuary":

- **Background**: `#131317`
- **Sacred Gold** (primary): `#F2C35B`
- **Astral Blue** (secondary): `#ADCBDA`
- **Starlight Violet** (tertiary): `#FAB0FF`

Pillar accents: Mind `#ADCBDA` · Discipline `#FAB0FF` · Wellness `#10B981` · Wisdom `#F2C35B` · Wealth `#48BFE3`

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Build APK for testing
npx eas-cli build --platform android --profile preview
```

---

## License

Private — Shoonya
