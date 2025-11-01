# Battleships - Product Backlog

> **Priority:** 🔥 Critical | ⭐ High | 📌 Medium | 💡 Nice-to-have
>
> **Completed stages:** See [CHANGELOG.md](./CHANGELOG.md) for Stages 1-6

---

## 📍 Current Status

**Last Completed:** Stage 6 (UX/AI Polish) - October 26, 2025
**Next Priority:** Stage 7 (Testing & Quality)
**Active Sprint:** Improving test infrastructure

### Recent Achievements
- ✅ Manual ship placement UI
- ✅ Smart AI with hunt mode
- ✅ Game statistics tracking
- ✅ Basic animations

---

## 🧪 Stage 7: Testing & Quality

### 🔥 Critical
- [ ] Fix React Native component testing setup
  - Jest + Expo + RN config conflicts
  - Research: Detox vs React Native Testing Library
  - Document solution in CONTRIBUTING.md
  - **Related:** `__tests__/` (currently skipped)

### ⭐ High
- [ ] Add UI component tests
  - Test Cell rendering (5 states: EMPTY/SHIP/MISS/HIT/SUNK)
  - Test Board interactions (touch handlers, grid layout)
  - Test GameScreen state changes (turn switching, victory)
  - Alternative: snapshot testing if mocking too complex
  - **Files:** `src/components/*.tsx`

- [ ] Add E2E tests
  - Full game playthrough (placement → battle → victory)
  - Ship placement validation flow
  - Victory/defeat scenarios
  - Edge cases (boundary shots, adjacent ships)
  - **Tool:** Detox or Maestro

### 📌 Medium
- [ ] Improve test coverage to 100%
  - Cover edge cases in `combat.ts:handleShot()`
  - Test all ship orientations in `ship-placement.ts`
  - Boundary conditions in `coordinates.ts`
  - **Current:** 98.26% coverage, 117 tests

- [ ] Add performance tests
  - Measure render time for Board component
  - Profile re-renders (React DevTools)
  - Memory usage during long games
  - **Target:** <16ms render time (60fps)

---

## 🌐 Stage 8: Local Multiplayer

### ⭐ High
- [ ] Implement hot-seat multiplayer
  - Player 1 places ships → "Pass device" screen
  - Player 2 places ships → "Pass device" screen
  - Alternating turns with screen hiding
  - Don't show enemy ships to current player
  - **Files:** `src/components/MultiplayerScreen.tsx` (new)

- [ ] Add pass-and-play UX
  - "Pass device to Player X" modal
  - Auto-hide opponent board during handoff
  - Optional turn timer (30s default)
  - Confirmation before showing board
  - **Design:** Similar to Words With Friends

### 💡 Nice-to-have
- [ ] Online multiplayer (deferred to Stage 8b)
  - Backend choice: Firebase Realtime DB
  - Matchmaking system (random or invite)
  - Real-time game updates
  - Chat functionality
  - Friend invites via share link

- [ ] Replay system
  - Save game history to AsyncStorage
  - Playback controls (play/pause/speed)
  - Share replay as JSON export

---

## 📱 Stage 9: Mobile Optimization

### 🔥 Critical
- [ ] Test on real iOS device
  - Run via Expo Go or standalone build
  - Test touch gestures (tap, long-press)
  - Verify performance (no lag on ship placement)
  - **Device:** iPhone 12+ or iPad

- [ ] Test on real Android device
  - Test multiple screen sizes (phone + tablet)
  - Verify touch responsiveness
  - Check for device-specific bugs
  - **Devices:** Samsung Galaxy, Google Pixel

### 📌 Medium
- [ ] Add responsive layouts
  - Portrait mode: vertical board stacking
  - Landscape mode: side-by-side boards
  - Tablet: larger boards (scalable cell size)
  - Handle different aspect ratios (notches, etc.)
  - **Files:** `src/components/Board.tsx` layout logic

- [ ] Improve accessibility
  - Screen reader support (labels for cells)
  - High contrast mode (WCAG AA compliant)
  - Font size options (small/medium/large)
  - Color-blind friendly palette (deuteranopia mode)
  - **Testing:** iOS VoiceOver + Android TalkBack

---

## 🚢 Stage 10: Advanced Features

### 💡 Nice-to-have
- [ ] Power-ups/Special abilities
  - **Sonar:** Reveal 3×3 area (1 use per game)
  - **Air strike:** Hit 5 random cells (1 use per game)
  - **Repair:** Restore 1 HIT to SHIP (1 use per game)
  - Balance: Optional game mode (classic vs power-ups)

- [ ] Different game modes
  - **Salvo:** Shots per turn = ships remaining
  - **Fog of war:** Only see 5×5 area around last hit
  - **Time attack:** Win in fewest turns (leaderboard)
  - **Custom fleet:** Choose ship sizes (10 total cells)

- [ ] Achievements system
  - "First Victory" - Win your first game
  - "Perfect Game" - Win without missing
  - "Quick Victory" - Win in <25 turns
  - "Win Streak" - Win 5 games in a row
  - Store in AsyncStorage, sync to backend later

- [ ] Leaderboards
  - Global rankings (wins, win rate, avg turns)
  - Friend rankings (local network)
  - Season-based resets (monthly)
  - Requires: online multiplayer (Stage 8b)

---

## 🐛 Known Issues & Tech Debt

### 🔥 Critical
_None currently_

### ⭐ High
- [ ] Component testing blocked
  - **Issue:** Jest + Expo + React Native Testing Library conflicts
  - **Solution:** Migrate to Detox or fix Jest config
  - **Link:** `__tests__/components/` (all skipped)
  - **Priority:** Stage 7

### 📌 Medium
- [ ] Auto-placement still in codebase
  - **Issue:** `src/logic/auto-placement.ts` no longer primary method
  - **Solution:** Keep as "Random" button, document as helper
  - **Action:** Update JSDoc comments to clarify usage
  - **Link:** `src/logic/auto-placement.ts:10`

- [ ] TypeScript strictness
  - **Issue:** `strict: false` in tsconfig.json
  - **Solution:** Enable strict mode + fix type errors
  - **Risk:** May break existing code, needs testing
  - **Link:** `tsconfig.json:5`

- [ ] Bundle size optimization
  - **Issue:** No code splitting, all screens load at once
  - **Solution:** Lazy load GameScreen, ShipPlacementScreen
  - **Tool:** `npx expo-cli build:web --analyze`
  - **Target:** <500 KB initial bundle

---

## 📝 Documentation Tasks

### 📌 Medium
- [x] ~~Add README.md~~ → **In progress** (this refactor)
- [x] ~~Add CONTRIBUTING.md~~ → **In progress** (this refactor)
- [x] ~~Add CHANGELOG.md~~ → **Completed** (2025-11-01)

### 💡 Nice-to-have
- [ ] Inline code comments
  - Complex algorithms (AI hunt mode, placement validation)
  - Business logic explanations
  - **Files:** `src/logic/combat.ts`, `src/components/GameScreen.tsx`

- [ ] Video tutorial
  - How to play Battleships
  - How to contribute (code walkthrough)
  - Post on YouTube + link in README

- [ ] Blog post about TDD journey
  - React Native + TypeScript + Jest learnings
  - Game development best practices
  - Share on Dev.to or Medium

---

## 🔧 Infrastructure

### 📌 Medium
- [ ] CI/CD pipeline
  - GitHub Actions workflow
  - Run tests on every PR
  - Auto-deploy web build to Vercel/Netlify
  - **File:** `.github/workflows/ci.yml` (new)

- [ ] Code quality tools
  - ESLint strict rules (no `any`, prefer-const, etc.)
  - Prettier auto-format on save
  - Pre-commit hooks via Husky
  - **Files:** `.eslintrc.js`, `.prettierrc`

- [ ] Security & monitoring
  - Dependabot for dependency updates
  - Snyk for vulnerability scanning
  - Optional: Sentry for crash reporting (Stage 10)

---

## 📊 Analytics (Future)

### 💡 Nice-to-have
- [ ] Game analytics
  - Track: games played, avg duration, win rate
  - Most popular ship placements (heatmap)
  - Win rate: first player vs second player
  - **Tool:** Firebase Analytics or custom backend

- [ ] Error tracking
  - Sentry integration for React Native
  - Crash reports with stack traces
  - Performance monitoring (slow renders)

---

## 📅 Roadmap (Next 30 Days)

| Week | Stage | Focus | Priority |
|------|-------|-------|----------|
| 1-2 | 7 | Fix testing infrastructure + add E2E tests | 🔥 Critical |
| 3 | 8 | Local multiplayer (hot-seat) | ⭐ High |
| 4 | 9 | Mobile device testing (iOS + Android) | ⭐ High |
| Future | 10 | Advanced features (power-ups, leaderboards) | 💡 Nice-to-have |

**Decision:** Prioritize Stage 7 (testing) before new features to ensure code quality.

---

## 💬 Open Questions

- [ ] Should we support custom fleet configurations? (e.g., 2×4-cell battleships)
  - **Consideration:** Affects game balance, placement algorithm
  - **Decision:** Deferred to Stage 10 (custom game modes)

- [ ] Ship graphics style: Realistic, cartoonish, or minimalist?
  - **Current:** Minimalist (gray rectangles)
  - **Feedback needed:** User preference survey?
  - **Priority:** Stage 10 (visual polish)

- [ ] Online multiplayer backend: Firebase vs Supabase vs custom?
  - **Firebase:** Easy setup, real-time DB, free tier generous
  - **Supabase:** Open-source, PostgreSQL, better for complex queries
  - **Custom:** Full control, requires backend development
  - **Decision:** Firebase (Stage 8b) for MVP, migrate to Supabase if needed

---

**Last Updated:** 2025-11-01
**Next Review:** After Stage 7 completion
**Archive:** Completed stages moved to [CHANGELOG.md](./CHANGELOG.md)
