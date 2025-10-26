# Battleships - Product Backlog

> **Priority:** 🔥 Critical | ⭐ High | 📌 Medium | 💡 Nice-to-have

---

## 🚀 Stage 5: Manual Ship Placement UI

### 🔥 Critical
- [ ] Create ShipPlacementScreen component
  - Grid for placing ships
  - Ship selector (4x types, show count remaining)
  - Orientation toggle (horizontal/vertical)
  - Preview ship before placing
  - Validate placement (use existing `canPlaceShip()`)
  - "Clear All" button
  - "Random" button (use `autoPlaceShips()`)
  - "Start Battle" button (when all ships placed)

- [ ] Add placement phase to game flow
  - Start in SETUP phase
  - Player 1 places ships
  - Player 2 places ships (or auto-place for AI)
  - Transition to BATTLE phase

- [ ] Update GameScreen integration
  - Show ShipPlacementScreen when phase = SETUP
  - Show battle boards when phase = BATTLE

### ⭐ High
- [ ] Add drag-and-drop ship placement
  - Drag ship from palette to board
  - Rotate while dragging
  - Visual feedback (valid/invalid placement)

- [ ] Add placement tutorial/hints
  - First-time user guide
  - Highlight valid placement zones
  - Show ship spacing rules

---

## 🎨 Stage 6: UI/UX Polish

### ⭐ High
- [ ] Add animations
  - Fade-in on cell hit/miss
  - Explosion effect on ship sunk
  - Wave animation on water (background)
  - Ship placement animation

- [ ] Improve visual design
  - Better ship graphics (not just gray squares)
  - Water shader/texture
  - Hit/miss explosion sprites
  - Themed color schemes

- [ ] Add sound effects
  - Water splash (miss)
  - Explosion (hit)
  - Ship sinking sound
  - Victory/defeat music
  - Background ambient (waves)

### 📌 Medium
- [ ] Add game statistics
  - Hit/miss ratio
  - Shots fired
  - Accuracy percentage
  - Time played

- [ ] Add settings screen
  - Sound on/off
  - Music volume
  - Visual effects toggle
  - AI difficulty

- [ ] Improve AI opponent
  - Hunt mode (after first hit)
  - Target adjacent cells after hit
  - Probability-based targeting
  - Difficulty levels (Easy/Medium/Hard)

---

## 🧪 Stage 7: Testing & Quality

### ⭐ High
- [ ] Add UI component tests
  - Solve React Native + Expo + Jest config
  - Test Cell rendering
  - Test Board interactions
  - Test GameScreen state changes
  - OR use snapshot testing as alternative

- [ ] Add E2E tests
  - Full game playthrough
  - Ship placement flow
  - Victory/defeat scenarios
  - Edge cases

### 📌 Medium
- [ ] Improve test coverage
  - Cover edge cases in combat
  - Test all ship orientations
  - Test boundary conditions
  - Reach 100% coverage

- [ ] Add performance tests
  - Measure render time
  - Optimize re-renders
  - Profile memory usage

---

## 🌐 Stage 8: Multiplayer

### ⭐ High
- [ ] Local multiplayer (hot-seat)
  - Player 1 places ships → hide screen
  - Player 2 places ships → hide screen
  - Alternating turns
  - Don't show enemy ships

- [ ] Pass-and-play UX
  - "Pass device" screen between turns
  - Auto-hide opponent board
  - Turn timer

### 💡 Nice-to-have
- [ ] Online multiplayer
  - Choose backend: Firebase / Supabase / custom
  - Matchmaking system
  - Real-time updates
  - Chat functionality
  - Friend invites

- [ ] Replay system
  - Save game history
  - Watch replay
  - Share replay link

---

## 📱 Stage 9: Mobile Optimization

### ⭐ High
- [ ] Test on real iOS device
  - Fix simulator issues
  - Test performance
  - Test gestures

- [ ] Test on Android device
  - Ensure compatibility
  - Test different screen sizes
  - Optimize for tablets

### 📌 Medium
- [ ] Add responsive layouts
  - Portrait mode optimized
  - Landscape mode optimized
  - Tablet layouts (bigger boards)
  - Different screen densities

- [ ] Add accessibility
  - Screen reader support
  - High contrast mode
  - Font size options
  - Color-blind friendly palette

---

## 🚢 Stage 10: Advanced Features

### 💡 Nice-to-have
- [ ] Power-ups/Special abilities
  - Sonar (reveal 3x3 area)
  - Air strike (hit 5 random cells)
  - Repair (restore 1 hit point)

- [ ] Different game modes
  - Salvo (shots = ships remaining)
  - Fog of war (limited vision)
  - Time attack (fastest to win)
  - Custom fleet (choose your ships)

- [ ] Achievements system
  - First win
  - Perfect game (no misses)
  - Sink all ships in X turns
  - Win streak

- [ ] Leaderboards
  - Global rankings
  - Friend rankings
  - Season-based resets

---

## 🐛 Known Bugs / Tech Debt

### 🔥 Critical
- None currently

### ⭐ High
- [ ] Fix React Native component testing setup
  - Jest + Expo + RN config conflicts
  - Consider alternative: Detox for E2E

### 📌 Medium
- [ ] Remove auto-placement when manual UI is ready
  - Delete `src/logic/auto-placement.ts`
  - Update `initializeGame()` to skip auto-placement
  - Keep as "Random" button option

- [ ] Improve TypeScript strictness
  - Enable `strict: true` in tsconfig
  - Remove `any` types
  - Add stricter null checks

- [ ] Optimize bundle size
  - Analyze with `npx expo-cli build:web --analyze`
  - Code splitting
  - Lazy load screens

---

## 📝 Documentation

### 📌 Medium
- [ ] Add README.md
  - Project description
  - Setup instructions
  - Screenshots
  - How to play

- [ ] Add CONTRIBUTING.md
  - Code style guide
  - PR process
  - How to run tests

- [ ] Add inline code comments
  - Complex algorithms
  - Business logic explanations

### 💡 Nice-to-have
- [ ] Create video tutorial
  - How to play
  - How to contribute
  - Code walkthrough

- [ ] Write blog post
  - TDD journey
  - React Native learnings
  - Game development tips

---

## 🔧 Infrastructure

### 📌 Medium
- [ ] Add CI/CD pipeline
  - GitHub Actions
  - Run tests on PR
  - Auto-deploy to Expo/Web

- [ ] Add linting
  - ESLint config
  - Prettier config
  - Pre-commit hooks (husky)

- [ ] Add code quality tools
  - SonarQube
  - CodeClimate
  - Dependency security checks

---

## 📊 Analytics & Monitoring

### 💡 Nice-to-have
- [ ] Add analytics
  - Game plays
  - Average game duration
  - Most popular ship placements
  - Win rate by first/second player

- [ ] Add error tracking
  - Sentry integration
  - Crash reports
  - Performance monitoring

---

## 🎯 Current Sprint (Stage 5)

**Goal:** Replace auto-placement with manual ship placement UI

**Estimate:** 2-3 days

**Tasks:**
1. Design ShipPlacementScreen mockup
2. Create ship selector component (TDD)
3. Add drag-and-drop or tap-to-place logic
4. Integrate with game flow (SETUP → BATTLE)
5. Test and refine UX
6. Merge to main

---

## 📅 Roadmap (Next 30 Days)

| Week | Stage | Focus |
|------|-------|-------|
| 1 | 5 | Manual ship placement |
| 2 | 6 | UI/UX polish + animations |
| 3 | 7 | Testing + AI improvements |
| 4 | 8 | Local multiplayer |

---

## 💬 Questions / Decisions Needed

- [ ] Should we support custom fleet configurations? (e.g., 2×4-cell ships)
- [ ] AI difficulty: Always random, or add smart mode?
- [ ] Multiplayer priority: Local first, or online?
- [ ] Ship graphics: Realistic, cartoonish, or minimalist?
- [ ] Target audience: Kids, adults, or both?

---

**Last Updated:** After Stage 4 completion
**Next Review:** After Stage 5 PR merged
