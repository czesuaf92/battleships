# Battleships Game - AI Context Guide

> **Quick Reference for AI Assistants** - Read this first to understand the project efficiently.

## 🎯 Project Overview

**Type:** Mobile game (React Native + Expo)
**Language:** TypeScript
**Methodology:** TDD (Test-Driven Development)
**Platform:** iOS/Android/Web

**Game:** Classic Battleships (2 players, 10×10 board, turn-based naval combat)

**Documentation:**
- [BACKLOG.md](./BACKLOG.md) - Active tasks (Stages 7-10)
- [CHANGELOG.md](./CHANGELOG.md) - Completed work (Stages 1-6)
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Code style & workflow
- [README.md](./README.md) - Setup & gameplay

---

## 📁 Project Structure

```
battleships/
├── src/
│   ├── components/          # UI (React Native)
│   │   ├── Cell.tsx         # Single grid cell (5 states)
│   │   ├── Board.tsx        # 10×10 grid + labels
│   │   ├── GameScreen.tsx   # Main game UI + AI
│   │   └── ShipPlacementScreen.tsx # Ship placement UI
│   │
│   ├── logic/               # Game logic (pure TS, 98% coverage)
│   │   ├── board.ts         # Board creation
│   │   ├── ship-placement.ts # Placement rules (no overlap/touch)
│   │   ├── combat.ts        # Shot processing
│   │   ├── player.ts        # Player/fleet init
│   │   ├── game-state.ts    # State management
│   │   ├── turn-manager.ts  # Turn logic + hit bonus
│   │   └── auto-placement.ts # Random placement helper
│   │
│   ├── types/
│   │   └── game.ts          # All types & enums
│   │
│   ├── constants/
│   │   └── game.ts          # BOARD_SIZE = 10
│   │
│   └── utils/
│       └── coordinates.ts   # Position validation
│
├── __tests__/               # 117 tests, 98.26% coverage
├── BACKLOG.md               # Active tasks
├── CHANGELOG.md             # Completed stages
├── CONTRIBUTING.md          # Developer guide
└── README.md                # Project overview
```

---

## 🔑 Core Concepts

### Game Rules
1. **Board:** 10×10 grid (A-J columns, 1-10 rows)
2. **Fleet:** 1×4-cell, 2×3-cell, 3×2-cell, 4×1-cell ships (10 total)
3. **Placement:** No overlap, no touching (even diagonally)
4. **Combat:** HIT/SUNK = shoot again, MISS = turn switches
5. **Victory:** Destroy all enemy ships

### Key Types (from `src/types/game.ts`)
```typescript
Position { row: number, col: number }
CellStatus: EMPTY | SHIP | MISS | HIT | SUNK
Orientation: HORIZONTAL | VERTICAL
ShipType: CARRIER(4) | BATTLESHIP(3) | CRUISER(2) | SUBMARINE(1)
GamePhase: SETUP | BATTLE | GAME_OVER
PlayerId: PLAYER_1 | PLAYER_2
```

### Data Flow
```
SETUP phase → Player places ships → AI auto-places
                 ↓
            BATTLE phase
                 ↓
handleShot() → processTurn() → update board → check victory
                 ↓
         AI turn (if MISS) → repeat
```

---

## 🧩 Implementation Status

### ✅ Completed (Stages 1-6)
See [CHANGELOG.md](./CHANGELOG.md) for full details.

**Stage 1-2:** Project setup + game logic (TDD)
**Stage 3-4:** State management + playable UI
**Stage 5:** Manual ship placement
**Stage 6:** UX polish + smart AI

### 🚧 Active Work (Stage 7+)
See [BACKLOG.md](./BACKLOG.md) for current priorities.

**Stage 7:** Testing & quality (component tests, E2E)
**Stage 8:** Local multiplayer (hot-seat)
**Stage 9:** Mobile optimization (iOS/Android testing)
**Stage 10:** Advanced features (power-ups, achievements)

---

## 🛠️ Development Commands

```bash
# Run web (fastest for testing)
npm run web

# Run tests
npm test                  # Watch mode
npm run test:coverage     # Coverage report

# Type check
npx tsc --noEmit

# Git workflow
git checkout -b feature/name
# ... make changes ...
git add -A
git commit -m "feat: description"
gh pr create --title "..." --body "..."
```

Full workflow details in [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 📝 Code Conventions

### Naming
- **Files:** kebab-case (`ship-placement.ts`)
- **Components:** PascalCase (`GameScreen.tsx`)
- **Functions:** camelCase (`canPlaceShip()`)
- **Types:** PascalCase (`GameState`, `Ship`)
- **Enums:** PascalCase (`CellStatus`, `PlayerId`)

### TDD Workflow
1. **RED:** Write failing test
2. **GREEN:** Write minimal code to pass
3. **REFACTOR:** Improve code quality

### Imports
- Use barrel exports (`from '../logic'`)
- Prefer named exports over default
- Group imports: external → internal → types

### Comments
- JSDoc for public functions
- Inline comments for complex logic
- Mark temporary code: `// TEMPORARY: ...`

Full style guide in [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 🎨 UI Component States

### Cell Visual States
- **EMPTY:** Blue water (#4a90a4)
- **SHIP:** Gray (#666666) - only on player board
- **MISS:** Blue + white circle
- **HIT:** Red (#ff6b6b) + white X
- **SUNK:** Dark red (#8b0000) + white X

### Board Layout
```
    A  B  C  D  E  F  G  H  I  J
 1 [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
 2 [ ][ ][■][■][■][ ][ ][ ][ ][ ]  ← Ship (3-cell)
 3 [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
 ...
10 [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
```

---

## 🤖 AI Development Guidelines

### Token Optimization

**DON'T read these unless necessary:**
- `package-lock.json` (huge, rarely needed)
- `node_modules/` (never)
- `coverage/` (test reports, auto-generated)
- `__tests__/` (unless fixing tests)

**Read these first for context:**
- `CLAUDE.md` ← YOU ARE HERE
- `BACKLOG.md` (active tasks)
- `CHANGELOG.md` (completed work)
- `src/types/game.ts` (all types)

**Use Grep/Glob instead of Read:**
- Search functions: `grep "export function"`
- Find components: `glob "src/components/*.tsx"`
- Avoid reading entire files when searching

**Leverage existing tests:**
- All logic is tested → trust the tests
- If logic works, don't re-read implementation
- Focus on new features

### Task Workflows

**When adding features:**
1. Check `BACKLOG.md` for context
2. Read relevant types from `src/types/game.ts`
3. Check existing tests in `__tests__/`
4. Follow TDD: test first, then implement
5. Update `BACKLOG.md` when done

**When debugging:**
1. Check test output first
2. Use TypeScript errors as guide
3. Grep for error messages
4. Check `src/logic/` for game rules

**When refactoring:**
1. Run tests before/after
2. Keep coverage above 95%
3. Don't break existing API
4. Update JSDoc if needed

### What to Avoid

- ❌ Reading entire files when you need 1 function
- ❌ Re-implementing tested logic
- ❌ Adding dependencies without asking
- ❌ Breaking changes without PR discussion
- ❌ Skipping tests for "speed"

---

## 🐛 Known Issues

### Current Issues
1. **Component testing blocked:** Jest + Expo + React Native config conflicts
   - **Status:** Deferred to Stage 7
   - **Solution:** Research Detox vs RNTL
   - **Details:** [BACKLOG.md#stage-7](./BACKLOG.md#-stage-7-testing--quality)

2. **Mobile not fully tested:** Web-only testing so far
   - **Status:** Stage 9 priority
   - **Need:** Real iOS/Android device testing

3. **TypeScript not strict:** `strict: false` in tsconfig.json
   - **Status:** Stage 7 tech debt
   - **Risk:** May have hidden type errors

### Recently Resolved
- ✅ ~~Auto-placement only~~ → Manual UI added (Stage 5)
- ✅ ~~Random AI~~ → Smart hunt mode (Stage 6)
- ✅ ~~No animations~~ → Fade-in effects (Stage 6)
- ✅ ~~No statistics~~ → Hit/miss tracking (Stage 6)

Full tech debt list in [BACKLOG.md](./BACKLOG.md#-known-issues--tech-debt).

---

## 📚 External Resources

| Resource | Link |
|----------|------|
| React Native | https://reactnative.dev/ |
| Expo | https://docs.expo.dev/ |
| TypeScript | https://www.typescriptlang.org/docs/ |
| Jest | https://jestjs.io/docs/getting-started |
| Testing Library | https://testing-library.com/docs/react-native-testing-library/intro |

---

## 🤝 Git Workflow

**Completed branches:**
```
main
 ├── feature/stage-1-setup (merged)
 ├── feature/stage-2-game-logic (merged)
 ├── feature/stage-3-game-state (merged)
 ├── feature/stage-4-board-ui (merged)
 └── feature/stage-5-6-placement-ux (merged)
```

**Next:** Stage 7 (testing) or Stage 8 (multiplayer)

**Commit format:**
```
feat: Add ship placement UI
fix: Correct hit detection logic
test: Add tests for turn manager
docs: Update documentation
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full workflow.

---

## 📊 Quick Stats

| Metric | Value |
|--------|-------|
| Lines of Code | ~2,500 (excluding tests) |
| Test Coverage | 98.26% statements, 100% functions |
| Total Tests | 117 (all passing) |
| Stages Completed | 6 of 10 |
| Dependencies | Minimal (React Native, Expo, Jest) |

---

**Last Updated:** 2025-11-01 (after Stage 6 completion)
**Current Stage:** Stage 7 (Testing & Quality)
**Next Priority:** Fix component testing setup

---

> 💡 **Project Philosophy:** Clean code, comprehensive tests, and learning over speed. Follow TDD, ask questions, and enjoy the process!
