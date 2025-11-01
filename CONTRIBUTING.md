# Contributing to Battleships

Thank you for considering contributing to this project! This guide will help you get started with development, testing, and submitting changes.

---

## 🎯 Project Philosophy

> **Quality > Speed.** This is a TDD (Test-Driven Development) learning project.

**Core principles:**
- Write tests first (always)
- Keep coverage >95% (non-negotiable)
- Follow conventions (consistency matters)
- Ask questions (clarity saves time)
- Document decisions (future you will thank you)

---

## 📋 Table of Contents

1. [Getting Started](#-getting-started)
2. [Development Setup](#-development-setup)
3. [Git Workflow](#-git-workflow)
4. [Code Conventions](#-code-conventions)
5. [TDD Workflow](#-tdd-workflow)
6. [Testing Requirements](#-testing-requirements)
7. [Pull Request Process](#-pull-request-process)
8. [Code Review](#-code-review)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 8+ or **yarn** 1.22+
- **Git** 2.30+
- **Code editor** (VSCode, Cursor, WebStorm, etc.)
- **GitHub account** (for PRs)

### First-Time Setup

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/battleships.git
cd battleships

# 3. Add upstream remote
git remote add upstream https://github.com/czesuaf92/battleships.git

# 4. Install dependencies
npm install

# 5. Run tests to verify setup
npm test

# 6. Start dev server
npm run web
```

If all tests pass and the app loads, you're ready to contribute!

---

## 🛠️ Development Setup

### Available Commands

```bash
# Development
npm run web           # Start web dev server (fastest for testing)
npm run ios           # Start iOS simulator (requires Mac + Xcode)
npm run android       # Start Android emulator (requires Android Studio)
npm start             # Start Expo dev server (shows QR code)

# Testing
npm test              # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:ci       # Run all tests once (CI mode)

# Code Quality
npx tsc --noEmit      # TypeScript type checking
npm run lint          # ESLint (if configured)
```

### Project Structure

```
battleships/
├── src/
│   ├── components/       # React Native UI components
│   ├── logic/            # Game logic (pure TypeScript)
│   ├── types/            # TypeScript type definitions
│   ├── constants/        # Game constants
│   └── utils/            # Utility functions
│
├── __tests__/            # Test files (mirrors src/ structure)
│
├── docs/                 # Documentation
│   ├── BACKLOG.md        # Feature roadmap
│   ├── CHANGELOG.md      # Release history
│   └── CLAUDE.md         # AI assistant guide
│
└── .claude/              # Claude Code configuration
```

---

## 🌿 Git Workflow

### Branching Strategy

We use **feature branches** with descriptive names:

```bash
# Create new branch from main
git checkout main
git pull upstream main
git checkout -b feature/ship-rotation

# Or for bug fixes
git checkout -b fix/hit-detection

# Or for documentation
git checkout -b docs/update-readme
```

**Branch naming:**
- `feature/name` - New features
- `fix/name` - Bug fixes
- `test/name` - Test improvements
- `docs/name` - Documentation updates
- `refactor/name` - Code refactoring

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `test` - Test changes
- `docs` - Documentation
- `refactor` - Code refactoring (no behavior change)
- `style` - Formatting, whitespace
- `perf` - Performance improvements
- `chore` - Build process, dependencies

**Examples:**
```bash
feat: Add ship rotation with animation
fix: Correct hit detection for diagonal ships
test: Add tests for turn manager hit bonus
docs: Update BACKLOG.md with Stage 7 tasks
refactor: Extract combat logic to separate module
```

### Keeping Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on main
git rebase upstream/main

# If conflicts, resolve them and continue
git add .
git rebase --continue

# Force push to your fork (only your branch!)
git push --force-with-lease origin feature/your-feature
```

---

## 📝 Code Conventions

### File Naming

- **Source files:** `kebab-case.ts` (e.g., `ship-placement.ts`)
- **Components:** `PascalCase.tsx` (e.g., `GameScreen.tsx`)
- **Tests:** `*.test.ts` (e.g., `ship-placement.test.ts`)
- **Types:** `PascalCase` types in `game.ts`

### Naming Conventions

```typescript
// Functions: camelCase
function canPlaceShip(board: Board, ship: Ship): boolean { }

// Components: PascalCase
export function GameScreen() { }

// Types/Interfaces: PascalCase
interface GameState { }
type Position = { row: number, col: number }

// Enums: PascalCase
enum CellStatus { EMPTY, SHIP, MISS, HIT, SUNK }

// Constants: UPPER_SNAKE_CASE
const BOARD_SIZE = 10
const MAX_SHIPS = 10
```

### Import Organization

```typescript
// 1. External dependencies (alphabetical)
import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

// 2. Internal modules (alphabetical)
import { canPlaceShip, placeShip } from '../logic/ship-placement'
import { createBoard } from '../logic/board'

// 3. Types (alphabetical)
import type { Board, Ship, Position } from '../types/game'

// 4. Constants
import { BOARD_SIZE } from '../constants/game'
```

### Code Style

- **Indentation:** 2 spaces (not tabs)
- **Line length:** Max 100 characters
- **Semicolons:** Required
- **Quotes:** Single quotes (`'`) for strings
- **Trailing commas:** Yes (for multiline arrays/objects)

**Example:**
```typescript
export function placeShip(
  board: Board,
  ship: Ship,
  position: Position,
  orientation: Orientation,
): Board {
  // Validate placement
  if (!canPlaceShip(board, ship, position, orientation)) {
    throw new Error('Invalid ship placement')
  }

  // Clone board
  const newBoard = board.map(row => [...row])

  // Place ship cells
  for (let i = 0; i < ship.size; i++) {
    const { row, col } = orientation === 'HORIZONTAL'
      ? { row: position.row, col: position.col + i }
      : { row: position.row + i, col: position.col }

    newBoard[row][col] = CellStatus.SHIP
  }

  return newBoard
}
```

### Comments

```typescript
/**
 * JSDoc for public functions
 * @param board - Current game board
 * @param ship - Ship to place
 * @returns New board with ship placed
 */
export function placeShip(board: Board, ship: Ship): Board {
  // Inline comments for complex logic
  // Validate placement rules (no overlap, no touch)
  if (!canPlaceShip(board, ship)) {
    throw new Error('Invalid placement')
  }

  // TEMPORARY: Auto-placement will be removed in Stage 7
  return autoPlaceShip(board, ship)
}
```

---

## 🔴🟢♻️ TDD Workflow

**We follow strict Test-Driven Development:**

### 1. RED - Write Failing Test

```typescript
// __tests__/logic/ship-placement.test.ts
describe('canPlaceShip', () => {
  it('should return false when ship overlaps existing ship', () => {
    const board = createBoard()
    const ship1 = { id: 1, type: 'BATTLESHIP', size: 3, hits: 0 }
    const ship2 = { id: 2, type: 'CRUISER', size: 2, hits: 0 }

    // Place first ship
    placeShip(board, ship1, { row: 0, col: 0 }, 'HORIZONTAL')

    // Try to place second ship on top
    const result = canPlaceShip(board, ship2, { row: 0, col: 1 }, 'HORIZONTAL')

    expect(result).toBe(false)
  })
})
```

**Run test - it should FAIL:**
```bash
npm test ship-placement.test.ts
# ❌ Test fails (expected behavior not implemented)
```

### 2. GREEN - Write Minimal Code

```typescript
// src/logic/ship-placement.ts
export function canPlaceShip(
  board: Board,
  ship: Ship,
  position: Position,
  orientation: Orientation,
): boolean {
  // Check if ship would overlap existing ships
  for (let i = 0; i < ship.size; i++) {
    const { row, col } = orientation === 'HORIZONTAL'
      ? { row: position.row, col: position.col + i }
      : { row: position.row + i, col: position.col }

    if (board[row][col] !== CellStatus.EMPTY) {
      return false // Overlaps existing ship
    }
  }

  return true
}
```

**Run test - it should PASS:**
```bash
npm test ship-placement.test.ts
# ✅ Test passes
```

### 3. REFACTOR - Improve Code Quality

```typescript
// Refactor: Extract position calculation
function getShipPositions(
  position: Position,
  size: number,
  orientation: Orientation,
): Position[] {
  return Array.from({ length: size }, (_, i) =>
    orientation === 'HORIZONTAL'
      ? { row: position.row, col: position.col + i }
      : { row: position.row + i, col: position.col }
  )
}

export function canPlaceShip(
  board: Board,
  ship: Ship,
  position: Position,
  orientation: Orientation,
): boolean {
  const positions = getShipPositions(position, ship.size, orientation)
  return positions.every(pos => board[pos.row][pos.col] === CellStatus.EMPTY)
}
```

**Run test again - must still PASS:**
```bash
npm test ship-placement.test.ts
# ✅ Test still passes after refactor
```

---

## ✅ Testing Requirements

### Mandatory Requirements

| Requirement | Target | Current |
|-------------|--------|---------|
| Test Coverage | >95% | 98.26% |
| Test Count | All logic tested | 117 tests |
| All Tests Pass | 100% | ✅ |

### Running Tests

```bash
# Watch mode (recommended during development)
npm test

# Coverage report
npm run test:coverage
# Open coverage/lcov-report/index.html in browser

# CI mode (all tests, no watch)
npm run test:ci
```

### Writing Tests

**Test file structure:**
```typescript
import { canPlaceShip, placeShip } from '../src/logic/ship-placement'
import { createBoard } from '../src/logic/board'
import type { Board, Ship } from '../src/types/game'

describe('ship-placement', () => {
  let board: Board
  let ship: Ship

  beforeEach(() => {
    board = createBoard()
    ship = { id: 1, type: 'BATTLESHIP', size: 3, hits: 0 }
  })

  describe('canPlaceShip', () => {
    it('should allow placement in empty area', () => {
      const result = canPlaceShip(board, ship, { row: 0, col: 0 }, 'HORIZONTAL')
      expect(result).toBe(true)
    })

    it('should prevent overlap with existing ship', () => {
      placeShip(board, ship, { row: 0, col: 0 }, 'HORIZONTAL')
      const result = canPlaceShip(board, ship, { row: 0, col: 1 }, 'HORIZONTAL')
      expect(result).toBe(false)
    })

    it('should prevent placement out of bounds', () => {
      const result = canPlaceShip(board, ship, { row: 0, col: 9 }, 'HORIZONTAL')
      expect(result).toBe(false) // Would go beyond board
    })
  })
})
```

---

## 🔀 Pull Request Process

### Before Creating PR

**Checklist:**
- [ ] All tests pass (`npm test`)
- [ ] Coverage >95% (`npm run test:coverage`)
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Code follows conventions
- [ ] Commit messages follow format
- [ ] BACKLOG.md updated (if applicable)

### Creating PR

1. **Push your branch:**
   ```bash
   git push origin feature/your-feature
   ```

2. **Create PR on GitHub:**
   - Go to https://github.com/czesuaf92/battleships
   - Click "Pull requests" → "New pull request"
   - Select your branch
   - Fill out PR template

3. **PR Title Format:**
   ```
   feat: Add ship rotation feature
   fix: Correct hit detection logic
   ```

4. **PR Description Template:**
   ```markdown
   ## Summary
   Brief description of changes (1-3 sentences)

   ## Changes
   - Added ship rotation button
   - Updated placement logic
   - Added tests for rotation

   ## Testing
   - [ ] All existing tests pass
   - [ ] Added new tests for rotation
   - [ ] Manual testing on web/iOS/Android

   ## Screenshots (if UI changes)
   [Add screenshots here]

   ## Related Issues
   Closes #123
   Related to #456
   ```

### PR Review Process

1. **Automated checks:** GitHub Actions runs tests, coverage, linting
2. **Code review:** Maintainers review code, request changes if needed
3. **Address feedback:** Make changes, push updates
4. **Approval:** Once approved, PR will be merged
5. **Cleanup:** Delete your branch after merge

---

## 👀 Code Review

### What Reviewers Look For

- ✅ **Tests pass** and coverage >95%
- ✅ **Code quality** (readable, maintainable)
- ✅ **Conventions followed** (naming, structure)
- ✅ **No breaking changes** (or well documented)
- ✅ **Documentation updated** (if needed)

### Responding to Feedback

**Good response:**
```markdown
Thanks for the feedback! I've made the following changes:
- Extracted validation logic to separate function
- Added tests for edge cases
- Updated JSDoc comments

Ready for another review!
```

**If you disagree:**
```markdown
I see your point, but I chose this approach because [reason].
Alternative: [describe alternative]

Happy to discuss on a call if needed!
```

---

## 🐛 Reporting Issues

### Before Reporting

1. **Search existing issues:** Someone may have reported it
2. **Check BACKLOG.md:** It might be a known issue
3. **Test on latest main:** Issue might be fixed

### Issue Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: macOS 13.2
- Node: 18.16.0
- npm: 8.19.2
- Platform: Web / iOS / Android

## Screenshots
[Add if applicable]
```

---

## 💬 Communication

- **Questions:** Open a [GitHub Discussion](https://github.com/czesuaf92/battleships/discussions)
- **Bugs:** Open an [Issue](https://github.com/czesuaf92/battleships/issues)
- **Ideas:** Open a [Feature Request](https://github.com/czesuaf92/battleships/issues)
- **PRs:** Comment directly on the PR

---

## 📚 Additional Resources

- **React Native:** https://reactnative.dev/
- **Expo:** https://docs.expo.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Jest:** https://jestjs.io/docs/getting-started
- **Conventional Commits:** https://www.conventionalcommits.org/

---

## 🎉 Thank You!

Thank you for contributing to Battleships! Your effort helps make this project better for everyone.

**Questions?** Don't hesitate to ask in [Discussions](https://github.com/czesuaf92/battleships/discussions) or on your PR.

---

**Happy coding! ⚓**

_Last updated: November 1, 2025_
