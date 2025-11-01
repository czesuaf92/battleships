# ⚓ Battleships

A classic naval combat game built with React Native, Expo, and TypeScript. Challenge an AI opponent in strategic turn-based warfare on a 10×10 grid.

[![Test Coverage](https://img.shields.io/badge/coverage-98.26%25-brightgreen.svg)](./__tests__)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Expo](https://img.shields.io/badge/Expo-51-000020.svg)](https://expo.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

---

## 🎮 Features

- ✅ **Manual Ship Placement** - Strategic positioning with visual feedback
- ✅ **Smart AI Opponent** - Hunt mode targeting after first hit
- ✅ **Classic Rules** - No overlap, no touching, hit bonus mechanics
- ✅ **Real-time Statistics** - Hit/miss ratio, accuracy tracking
- ✅ **Smooth Animations** - Fade-in effects on hits and misses
- ✅ **Cross-platform** - iOS, Android, and Web support
- ✅ **98% Test Coverage** - TDD methodology with 117 passing tests

### Coming Soon
- 🚧 Local multiplayer (hot-seat)
- 🚧 Mobile optimization for iOS/Android
- 🚧 Sound effects and music
- 🚧 Advanced animations (explosions, waves)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** 8+ or **yarn** 1.22+
- **Expo CLI** (optional, but recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/battleships.git
cd battleships

# Install dependencies
npm install

# Start the development server
npm run web
```

The game will open in your browser at `http://localhost:19006`

### Other Platforms

```bash
# iOS (requires Mac + Xcode)
npm run ios

# Android (requires Android Studio)
npm run android

# Expo Go (scan QR code with Expo Go app)
npm start
```

---

## 📖 How to Play

### Game Setup
1. **Place your ships** on the 10×10 grid
   - 1× Carrier (4 cells)
   - 2× Battleships (3 cells each)
   - 3× Cruisers (2 cells each)
   - 4× Submarines (1 cell each)
2. Ships **cannot overlap** or **touch** (even diagonally)
3. Use **orientation toggle** (H/V) to rotate ships
4. Click **Random** for auto-placement, or **Clear All** to restart

### Battle Phase
1. **Click enemy board** to fire shots
2. **Hit** = Red X (shoot again!)
3. **Miss** = White circle (turn switches to AI)
4. **Sunk ship** = Dark red (all cells destroyed)
5. **Win** by sinking all enemy ships

### Strategy Tips
- Spread ships across the board (harder to find)
- Don't cluster ships together (AI exploits patterns)
- AI uses hunt mode after first hit (targets adjacent cells)

---

## 🎨 Screenshots

<!-- TODO: Add screenshots here -->
_Screenshots coming soon!_

**Game phases:**
- Ship Placement Screen
- Battle Board (Player vs AI)
- Victory/Defeat Screen

---

## 🛠️ Development

### Project Structure

```
battleships/
├── src/
│   ├── components/          # React Native UI
│   │   ├── Cell.tsx         # Grid cell component
│   │   ├── Board.tsx        # 10×10 game board
│   │   ├── GameScreen.tsx   # Battle UI + AI
│   │   └── ShipPlacementScreen.tsx
│   │
│   ├── logic/               # Game logic (98% coverage)
│   │   ├── board.ts
│   │   ├── ship-placement.ts
│   │   ├── combat.ts
│   │   ├── game-state.ts
│   │   └── turn-manager.ts
│   │
│   └── types/
│       └── game.ts          # TypeScript definitions
│
├── __tests__/               # 117 tests
├── BACKLOG.md               # Roadmap (Stages 7-10)
├── CHANGELOG.md             # History (Stages 1-6)
└── CONTRIBUTING.md          # Developer guide
```

### Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React Native + Expo 51 |
| **Language** | TypeScript 5.3 |
| **Testing** | Jest 29 + React Native Testing Library |
| **State** | React Hooks (useState) |
| **Styling** | StyleSheet API |
| **Methodology** | TDD (Test-Driven Development) |

### Running Tests

```bash
# Run all tests (watch mode)
npm test

# Run tests with coverage
npm run test:coverage

# Type checking
npx tsc --noEmit
```

**Current coverage:** 98.26% statements, 100% functions

---

## 📚 Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Git workflow, code style, PR process
- [CLAUDE.md](./CLAUDE.md) - AI assistant context guide
- [BACKLOG.md](./BACKLOG.md) - Feature roadmap (Stages 7-10)
- [CHANGELOG.md](./CHANGELOG.md) - Release history (Stages 1-6)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- How to set up your development environment
- Code conventions and style guide
- TDD workflow (RED-GREEN-REFACTOR)
- PR submission process

### Quick Contribution Guide

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Write tests first** (TDD methodology)
4. **Implement feature** (make tests pass)
5. **Run tests**: `npm test` (must pass, coverage >95%)
6. **Commit**: `git commit -m "feat: your feature"`
7. **Push**: `git push origin feature/your-feature`
8. **Open PR** with description

---

## 🗺️ Roadmap

### ✅ Completed (Stages 1-6)
- [x] Project setup + game logic (TDD)
- [x] State management + UI
- [x] Manual ship placement
- [x] Smart AI + animations

### 🚧 In Progress (Stage 7)
- [ ] Component testing (fix Jest + Expo config)
- [ ] E2E tests (Detox or Maestro)
- [ ] TypeScript strict mode
- [ ] Performance optimization

### 🔮 Planned (Stages 8-10)
- [ ] **Stage 8:** Local multiplayer (hot-seat)
- [ ] **Stage 9:** Mobile optimization (iOS/Android)
- [ ] **Stage 10:** Advanced features (power-ups, achievements)

See [BACKLOG.md](./BACKLOG.md) for detailed task breakdown.

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| **Lines of Code** | ~2,500 (excluding tests) |
| **Test Coverage** | 98.26% statements, 100% functions |
| **Total Tests** | 117 (all passing) |
| **Stages Completed** | 6 of 10 |
| **Development Time** | ~25 days (Oct 1 - Oct 26, 2025) |

---

## 🐛 Known Issues

- **Component tests skipped**: Jest + Expo + React Native Testing Library config conflicts (Stage 7 priority)
- **Mobile untested**: Only tested on web so far (Stage 9 priority)
- **TypeScript not strict**: `strict: false` in tsconfig (Stage 7 tech debt)

Full issue list in [BACKLOG.md#known-issues](./BACKLOG.md#-known-issues--tech-debt).

---

## 📝 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Native** team for the framework
- **Expo** team for the tooling
- **Jest** team for the testing framework
- **Classic Battleships** board game for the inspiration

---

## 📧 Contact

- **Author**: Damian Czechowski
- **GitHub**: [@czesuaf92](https://github.com/czesuaf92)
- **Issues**: [GitHub Issues](https://github.com/czesuaf92/battleships/issues)

---

**Built with ❤️ using TDD methodology**

_Last updated: November 1, 2025_
