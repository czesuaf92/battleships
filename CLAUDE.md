# Battleships Game - AI Context Guide

> **Quick Reference for AI Assistants** - Read this first to understand the project efficiently.

## 🎯 Project Overview

**Type:** Mobile game (React Native + Expo)
**Language:** TypeScript
**Methodology:** TDD (Test-Driven Development)
**Platform:** iOS/Android/Web

**Game:** Classic Battleships (2 players, 10x10 board, turn-based naval combat)

---

## 📁 Project Structure (Token-Optimized)

```
battleships/
├── src/
│   ├── components/          # UI (React Native)
│   │   ├── Cell.tsx         # Single grid cell (5 states)
│   │   ├── Board.tsx        # 10x10 grid + labels
│   │   └── GameScreen.tsx   # Main game UI + AI
│   │
│   ├── logic/               # Game logic (pure TS, 98% test coverage)
│   │   ├── board.ts         # Board creation
│   │   ├── ship-placement.ts # Placement rules (no overlap/touch)
│   │   ├── combat.ts        # Shot processing
│   │   ├── player.ts        # Player/fleet init
│   │   ├── game-state.ts    # State management
│   │   ├── turn-manager.ts  # Turn logic + hit bonus
│   │   └── auto-placement.ts # TEMPORARY: Random ship placement
│   │
│   ├── types/               # TypeScript definitions
│   │   └── game.ts          # All types & enums
│   │
│   ├── constants/
│   │   └── game.ts          # BOARD_SIZE = 10
│   │
│   └── utils/
│       └── coordinates.ts   # Position validation
│
├── __tests__/               # 117 tests, 98.26% coverage
├── App.tsx                  # Entry point
├── package.json
└── tsconfig.json
```

---

## 🔑 Core Concepts (Must Know)

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
createGameState() → initializeGame() → auto-place ships
                 ↓
              BATTLE phase
                 ↓
handleShot() → processTurn() → update board → check victory
                 ↓
         AI turn (if MISS) → repeat
```

---

## ⚡ Token Optimization Strategies

### 1. **DON'T Read These Files Unless Necessary**
- `package-lock.json` (huge, rarely needed)
- `node_modules/` (never)
- `coverage/` (test reports, auto-generated)
- `__tests__/` (unless fixing tests)

### 2. **Read These First for Context**
- `CLAUDE.md` ← YOU ARE HERE
- `BACKLOG.md` (todo list)
- `src/types/game.ts` (all types)
- `src/logic/index.ts` (exports overview)

### 3. **Use Grep/Glob Instead of Read**
- Search for functions: `grep "export function"`
- Find components: `glob "src/components/*.tsx"`
- Avoid reading entire files when searching

### 4. **Leverage Existing Tests**
- All logic is tested → trust the tests
- If logic works, don't re-read implementation
- Focus on new features

### 5. **Use AI Code Assistants**
When possible, delegate to:
- **GitHub Copilot** - Code completion
- **Cursor AI** - Quick refactors
- **Claude** (you) - Architecture, complex logic
- **GPT-4** - Documentation, explanations

---

## 🧩 Current Implementation Status

### ✅ Completed (Stages 1-4)
- [x] Project setup (Expo + TypeScript + Jest)
- [x] Board logic (creation, validation)
- [x] Ship placement (with strict rules)
- [x] Combat system (shots, hits, sinking)
- [x] Player management
- [x] Game state management
- [x] Turn system with hit bonus
- [x] UI components (Cell, Board, GameScreen)
- [x] AI opponent (random shots)
- [x] Victory/defeat detection

### 🚧 In Progress / TODO
See `BACKLOG.md` for complete list.

Priority items:
- [ ] Manual ship placement UI (replace auto-placement)
- [ ] Ship placement phase before battle
- [ ] Better UI/UX polish
- [ ] Animations and sound effects
- [ ] Multiplayer (local/online)

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

## 🐛 Known Issues / Quirks

1. **Component tests skipped:** React Native + Expo + Jest config is tricky
2. **Auto-placement is temporary:** Will be replaced with manual UI
3. **AI is basic:** Random shots, no strategy (intentional for now)
4. **No animations yet:** Game works but feels static
5. **Web-only tested:** Mobile (iOS/Android) not fully tested

---

## 💡 Tips for AI Assistants

### When Adding Features
1. Check `BACKLOG.md` for context
2. Read relevant `src/types/game.ts` types
3. Check existing tests in `__tests__/`
4. Follow TDD: test first, then implement
5. Update BACKLOG.md when done

### When Debugging
1. Check test output first
2. Use TypeScript errors as guide
3. Grep for error messages
4. Check `src/logic/` for game rules

### When Refactoring
1. Run tests before/after
2. Keep coverage above 95%
3. Don't break existing API
4. Update JSDoc if needed

### Avoid
- ❌ Reading entire files when you need 1 function
- ❌ Re-implementing tested logic
- ❌ Adding dependencies without asking
- ❌ Breaking changes without PR discussion
- ❌ Skipping tests for "speed"

---

## 📚 External Resources

- **React Native:** https://reactnative.dev/
- **Expo:** https://docs.expo.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Jest:** https://jestjs.io/docs/getting-started
- **Testing Library:** https://testing-library.com/docs/react-native-testing-library/intro

---

## 🤝 Git Workflow

Each stage = separate branch + PR:
```
main
 ├── feature/stage-1-setup (merged)
 ├── feature/stage-2-game-logic (merged)
 ├── feature/stage-3-game-state (merged)
 ├── feature/stage-4-board-ui (current)
 └── feature/stage-5-ship-placement (next)
```

**Commit Format:**
```
feat: Add ship placement UI
fix: Correct hit detection logic
test: Add tests for turn manager
docs: Update BACKLOG.md
```

---

## 📊 Quick Stats

- **Lines of Code:** ~2000 (excluding tests)
- **Test Coverage:** 98.26% statements, 100% functions
- **Total Tests:** 117 (all passing)
- **Dependencies:** Minimal (React Native, Expo, Jest)
- **Token Usage:** ~50k per full session (optimize!)

---

**Last Updated:** Stage 4 (Playable Game UI)
**Next:** Stage 5 (Manual Ship Placement)

---

> 💡 **Remember:** This project prioritizes clean code, tests, and learning over speed. Take your time, follow TDD, and ask questions if unclear!
