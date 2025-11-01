# AI Assistant Configuration

This directory contains configuration and guidance for AI coding assistants working on this project.

## 📋 Quick Start for AI Assistants

**Essential reading order:**
1. [CLAUDE.md](../CLAUDE.md) - Complete project context & token optimization
2. [BACKLOG.md](../BACKLOG.md) - Active tasks (Stages 7-10)
3. [CHANGELOG.md](../CHANGELOG.md) - Completed work (Stages 1-6)
4. [src/types/game.ts](../src/types/game.ts) - Core data structures

**Total context cost:** ~4,000 tokens (vs 50k+ if reading everything)

---

## 🤖 AI Tool Delegation

Use the right tool for each task:

| Task Type | Recommended Tool | Why |
|-----------|------------------|-----|
| Architecture & planning | **Claude Code** | 200k context, reasoning, cross-file understanding |
| Complex game logic | **Claude Code** | TDD workflow, test analysis |
| Autocomplete & boilerplate | GitHub Copilot | Fast, context-aware suggestions |
| Quick refactors | Cursor AI | Multi-file edits, variable renames |
| Documentation | Claude Code / GPT-4 | Natural language generation |
| Type fixes | TypeScript LSP | Built-in, instant feedback |

---

## 🔍 Search Strategy

### When to Use Each Tool

**Use Grep (not Read) for:**
- Finding function definitions: `grep "export function canPlaceShip"`
- Searching across files: `grep "GamePhase" src/`
- Checking usage: `grep "handleShot" __tests__/`

**Use Glob (not ls) for:**
- Finding files by pattern: `glob "src/components/*.tsx"`
- Discovering structure: `glob "**/*test.ts"`

**Use Read only when:**
- Modifying that specific file
- TypeScript errors require full context
- Debugging specific implementation

**Full token optimization guide:** [CLAUDE.md#ai-development-guidelines](../CLAUDE.md#-ai-development-guidelines)

---

## 🎯 Task Workflows

### Adding a Feature
```
1. Check BACKLOG.md → Is it planned? What stage?
2. Read types from src/types/game.ts → Understand data structures
3. Check existing tests → How is similar logic tested?
4. Write test first (RED) → Define expected behavior
5. Implement (GREEN) → Minimal code to pass
6. Refactor → Clean up, optimize
7. Update BACKLOG.md → Mark task complete or add notes
```

**TDD details:** [CLAUDE.md#code-conventions](../CLAUDE.md#-code-conventions)

### Fixing a Bug
```
1. Read error message → What failed?
2. Check test output → Which test? What assertion?
3. Grep for function → Find implementation
4. Read specific file → Understand context
5. Fix + add test case → Prevent regression
6. Verify coverage → Must stay >95%
```

**Debugging tips:** [CLAUDE.md#task-workflows](../CLAUDE.md#task-workflows)

### Refactoring
```
1. Run tests (baseline) → Ensure all passing
2. Make changes → Use TypeScript for safety
3. Run tests again → Must still pass
4. Check coverage → Should not drop
5. Update JSDoc → If public API changed
```

---

## 🧪 Testing Requirements

| Requirement | Target | Current |
|-------------|--------|---------|
| Test Coverage | >95% | 98.26% |
| Test Count | All logic tested | 117 tests |
| TDD Workflow | Mandatory | RED-GREEN-REFACTOR |
| Run Before Commit | Always | `npm test` |

**Component tests:** Currently skipped (Jest + Expo config issues). Deferred to Stage 7.

**Test infrastructure:** See [BACKLOG.md#stage-7](../BACKLOG.md#-stage-7-testing--quality)

---

## 📝 Code Conventions

**Quick reference** (full details in [CLAUDE.md#code-conventions](../CLAUDE.md#-code-conventions)):

- **Files:** `kebab-case.ts`
- **Components:** `PascalCase.tsx`
- **Functions:** `camelCase()`
- **Types:** `PascalCase`
- **Imports:** External → Internal → Types
- **Comments:** JSDoc for public, inline for complex logic

**Git workflow:** [CONTRIBUTING.md](../CONTRIBUTING.md)

---

## 🚀 Development Cycle

```
Current state check (BACKLOG.md)
         ↓
Create feature branch (git checkout -b feature/name)
         ↓
Write failing test (RED)
         ↓
Implement minimal code (GREEN)
         ↓
Refactor & optimize
         ↓
Verify tests pass + coverage (npm test)
         ↓
Commit (conventional format: feat/fix/test/docs)
         ↓
Push + create PR (gh pr create)
         ↓
Review + merge → main
```

**Current stage:** Stage 6 complete, Stage 7 (testing) next

---

## 🔧 Claude Code Specific

### Tools Available

1. **Task (subagents):** For multi-step exploration, complex searches
2. **Glob:** File pattern matching (fast, efficient)
3. **Grep:** Code content search (use instead of `grep` command)
4. **Read:** File reading (use sparingly, prefer Grep)
5. **Edit:** Targeted edits (use for small changes)
6. **Write:** Full file writes (for new files or major refactors)

### Best Practices

- **Parallel tool calls:** When searching multiple patterns, call Grep/Glob in parallel
- **Avoid redundant reads:** If file already read in conversation, reference previous read
- **Use Task agents:** For open-ended exploration or multi-step searches
- **Trust tests:** 98% coverage means logic is verified, don't re-read unless changing

**Permissions configured in:** `.claude/settings.local.json`

---

## 🐛 Known Limitations

### Current Blockers
1. **Component testing:** Jest + Expo + React Native Testing Library config conflicts
   - **Workaround:** Focus on logic tests (98% coverage)
   - **Fix planned:** Stage 7 (research Detox vs RNTL)

2. **Mobile testing:** Web-only so far
   - **Status:** Stage 9 priority
   - **Need:** Real iOS/Android device testing

3. **TypeScript strictness:** Not enabled (`strict: false`)
   - **Risk:** May have hidden type errors
   - **Fix planned:** Stage 7 tech debt

**Full issue list:** [BACKLOG.md#known-issues](../BACKLOG.md#-known-issues--tech-debt)

---

## 🆘 When Stuck

### Debugging Checklist
1. ✅ Check test output → What exactly failed?
2. ✅ Check TypeScript errors → Red squiggles are hints
3. ✅ Grep for similar code → How is it done elsewhere?
4. ✅ Read CLAUDE.md → Project-specific patterns
5. ✅ Check BACKLOG.md → Is this a known issue?
6. ✅ Ask user → Some decisions need human input

### Common Issues
| Issue | Solution |
|-------|----------|
| "Can't find type X" | Read `src/types/game.ts` |
| "Test failing" | Check `__tests__/` for context |
| "How to run X?" | See [CLAUDE.md#development-commands](../CLAUDE.md#-development-commands) |
| "What's the workflow?" | See [CONTRIBUTING.md](../CONTRIBUTING.md) |

---

## 📚 Documentation Links

| File | Purpose | When to Read |
|------|---------|--------------|
| [CLAUDE.md](../CLAUDE.md) | Complete project context | **Always start here** |
| [BACKLOG.md](../BACKLOG.md) | Active tasks (Stages 7-10) | Before starting work |
| [CHANGELOG.md](../CHANGELOG.md) | Completed work history | For context on past decisions |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Git workflow & code style | Before first commit |
| [README.md](../README.md) | Setup & gameplay | For end-user perspective |
| [src/types/game.ts](../src/types/game.ts) | Type definitions | When working with game logic |

---

## 💡 Project Philosophy

> **Quality > Speed.** This is a TDD learning project.
>
> - Write tests first (always)
> - Keep coverage >95% (non-negotiable)
> - Follow conventions (consistency matters)
> - Ask questions (clarity saves time)
> - Document decisions (future you will thank you)

**Full philosophy:** [CLAUDE.md#project-philosophy](../CLAUDE.md#project-philosophy)

---

**Last Updated:** 2025-11-01 (after Stages 5-6 completion)
**Configuration:** `.claude/settings.local.json`
**Ignore patterns:** `.claudeignore`
