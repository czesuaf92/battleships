# Changelog

All notable changes to the Battleships project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Stage 6] - 2025-10-26

### Added
- ✅ Basic animations (fade-in on hit/miss)
- ✅ Hunt mode AI - targets adjacent cells after hit
- ✅ Game statistics display (hit/miss ratio, shots fired, accuracy)
- ✅ Mobile-ready UI improvements

### Implementation
- Added `Animated.View` for cell state transitions (`src/components/Cell.tsx`)
- Implemented smart AI targeting in `getAIShot()` with hunt mode
- Created statistics tracking in game state
- Enhanced UX with visual feedback

**Commits:** [aa1e313](https://github.com/czesuaf92/battleships/commit/aa1e313)

---

## [Stage 5] - 2025-10-20

### Added
- ✅ Manual ship placement UI
- ✅ ShipPlacementScreen component with ship selector
- ✅ Orientation toggle (horizontal/vertical)
- ✅ Visual validation (red border for invalid placements)
- ✅ "Clear All" and "Random" buttons
- ✅ SETUP phase in game flow
- ✅ Ship drag preview on board

### Implementation
- Created `ShipPlacementScreen.tsx` with interactive grid
- Integrated with existing `canPlaceShip()` validation logic
- Added placement phase before battle
- Player 1 places manually, AI auto-places

**Commits:** [9f0f832](https://github.com/czesuaf92/battleships/commit/9f0f832)

---

## [Stage 4] - 2025-10-15

### Added
- ✅ Complete playable game UI (React Native)
- ✅ `Cell.tsx` component with 5 visual states
- ✅ `Board.tsx` component with 10×10 grid + labels
- ✅ `GameScreen.tsx` with dual boards (player + enemy)
- ✅ AI opponent with random targeting
- ✅ Victory/defeat detection
- ✅ Game reset functionality

### Implementation
- Cell states: EMPTY (blue water), SHIP (gray), MISS (white circle), HIT (red X), SUNK (dark red X)
- Touch handlers for shooting
- Turn-based gameplay loop
- Auto-placement for both players

**Pull Request:** [#3](https://github.com/czesuaf92/battleships/pull/3)
**Commits:** [34f468f](https://github.com/czesuaf92/battleships/commit/34f468f)

---

## [Stage 3] - 2025-10-10

### Added
- ✅ Game state management (`game-state.ts`)
- ✅ Player initialization (`player.ts`)
- ✅ Fleet creation logic
- ✅ Turn manager with hit bonus mechanic
- ✅ Victory condition detection
- ✅ Complete game flow coordination

### Implementation
- `createGameState()` - initializes full game
- `initializeGame()` - creates players + auto-places ships
- `processTurn()` - handles shots + turn switching
- Hit bonus rule: HIT/SUNK = shoot again, MISS = turn switches
- 117 tests, 98.26% coverage

**Pull Request:** [#2](https://github.com/czesuaf92/battleships/pull/2)
**Commits:** [715448a](https://github.com/czesuaf92/battleships/commit/715448a)

---

## [Stage 2] - 2025-10-05

### Added
- ✅ Board creation and validation (`board.ts`)
- ✅ Ship placement logic with strict rules (`ship-placement.ts`)
- ✅ Combat system (`combat.ts`)
- ✅ Shot processing (hit/miss/sunk detection)
- ✅ No-overlap and no-touch placement rules

### Rules Implemented
- Ships cannot overlap
- Ships cannot touch (even diagonally)
- Shots track HIT/MISS/SUNK states
- Full ship destruction = SUNK status for all cells

### Tests
- 50+ tests for game logic
- Full TDD methodology (RED-GREEN-REFACTOR)
- Edge cases covered (boundaries, ship adjacency)

**Pull Request:** [#1](https://github.com/czesuaf92/battleships/pull/1)
**Commits:** [ffc7926](https://github.com/czesuaf92/battleships/commit/ffc7926)

---

## [Stage 1] - 2025-10-01

### Added
- ✅ Project setup (Expo + React Native + TypeScript)
- ✅ Jest configuration for testing
- ✅ TypeScript config with strict mode
- ✅ Core type definitions (`src/types/game.ts`)
- ✅ Project structure (logic/, components/, constants/)
- ✅ Git workflow established

### Project Structure
```
battleships/
├── src/
│   ├── types/game.ts       # Core types (Position, CellStatus, etc.)
│   ├── constants/game.ts   # BOARD_SIZE = 10
│   ├── utils/coordinates.ts
│   ├── logic/              # Game logic (pure TS)
│   └── components/         # UI (React Native)
├── __tests__/
├── App.tsx
├── package.json
└── tsconfig.json
```

### Configuration
- Expo SDK 51
- TypeScript 5.3
- Jest 29 + React Native Testing Library
- ESLint + Prettier (basic config)

**Commits:** [b929a81](https://github.com/czesuaf92/battleships/commit/b929a81), [6f46c96](https://github.com/czesuaf92/battleships/commit/6f46c96)

---

## Technical Debt & Decisions

### Completed Features
| Stage | Feature | Implementation Date | Status |
|-------|---------|-------------------|--------|
| 1 | Project Setup | 2025-10-01 | ✅ Complete |
| 2 | Game Logic | 2025-10-05 | ✅ Complete |
| 3 | State Management | 2025-10-10 | ✅ Complete |
| 4 | Playable UI | 2025-10-15 | ✅ Complete |
| 5 | Manual Placement | 2025-10-20 | ✅ Complete |
| 6 | UX/AI Polish | 2025-10-26 | ✅ Partially complete |

### Known Issues Resolved
- ❌ ~~Auto-placement only~~ → ✅ Manual placement UI added (Stage 5)
- ❌ ~~Random AI~~ → ✅ Smart hunt mode AI (Stage 6)
- ❌ ~~No statistics~~ → ✅ Hit/miss tracking (Stage 6)
- ❌ ~~No animations~~ → ✅ Basic fade-in animations (Stage 6)

### Design Decisions
- **Target audience:** All ages (simple rules, clean UI)
- **Multiplayer priority:** Local first (hot-seat), online later
- **AI difficulty:** Smart mode implemented (Stage 6), difficulty levels deferred
- **Testing approach:** TDD for all game logic, component tests deferred
- **Ship graphics:** Minimalist (gray rectangles) for now, themed graphics deferred

---

## Statistics

### Test Coverage
- **Stage 2-3:** 98.26% statements, 100% functions
- **Total Tests:** 117 (all passing)
- **Lines of Code:** ~2,000 (excluding tests)

### Development Timeline
- **Total Duration:** ~25 days (Oct 1 - Oct 26)
- **Stages Completed:** 6 of 10
- **Next Priority:** Stage 7 (Testing) or Stage 8 (Multiplayer)

---

**Archive Date:** 2025-11-01
**Archived From:** BACKLOG.md
**Reason:** Completed stages moved to CHANGELOG for token optimization

---

## Legend

- ✅ **Complete** - Fully implemented and tested
- 🚧 **In Progress** - Partially implemented
- ⏸️ **Deferred** - Planned but postponed
- ❌ **Cancelled** - No longer planned
