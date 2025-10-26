# AI Assistant Configuration

This directory contains configuration and guidance for AI coding assistants working on this project.

## 📋 Quick Start for AI Assistants

1. **Read First:** `/CLAUDE.md` - Complete project context
2. **Check Tasks:** `/BACKLOG.md` - What needs to be done
3. **Understand Types:** `/src/types/game.ts` - Core data structures
4. **Follow TDD:** Write tests first, then implementation

## 🤖 AI Tool Recommendations

### Primary: Claude Code (You!)
- **Use for:** Architecture, complex logic, refactoring, planning
- **Context limit:** 200k tokens
- **Strategy:** Leverage CLAUDE.md, use Grep/Glob, avoid reading large files

### Secondary: GitHub Copilot
- **Use for:** Autocomplete, boilerplate, simple functions
- **Integration:** Works in VSCode/Cursor
- **Strategy:** Let it handle repetitive code

### Tertiary: GPT-4 / ChatGPT
- **Use for:** Documentation, explanations, brainstorming
- **Strategy:** Copy specific code snippets for analysis

### Code-Specific: Cursor AI
- **Use for:** Quick refactors, variable renames, type fixes
- **Strategy:** Select code, ask for changes

## 💡 Token Optimization Tips

### DO:
- ✅ Read CLAUDE.md first (comprehensive context)
- ✅ Use Grep to search instead of Read
- ✅ Use Glob to find files by pattern
- ✅ Trust existing tests (98% coverage)
- ✅ Focus on changed files only
- ✅ Use TypeScript errors as guide

### DON'T:
- ❌ Read package-lock.json (115k lines!)
- ❌ Read all test files unless debugging tests
- ❌ Read node_modules (obviously)
- ❌ Re-read files you've already seen
- ❌ Read entire files when you need 1 function

## 🔍 Smart Search Patterns

Instead of reading files, use Grep:

```bash
# Find all exports
grep "export (function|const|class)"

# Find type definitions
grep "interface|type|enum" src/types/

# Find React components
glob "src/components/*.tsx"

# Find test files for a feature
glob "**/ship-placement*.test.ts"
```

## 🧩 Context Hierarchy (Read in Order)

1. **CLAUDE.md** (2k tokens) - Full project overview
2. **BACKLOG.md** (1.5k tokens) - Current tasks
3. **src/types/game.ts** (500 tokens) - Data structures
4. **Specific file you're working on** (variable)

**Total:** ~4k tokens vs 50k+ if you read everything!

## 🎯 Task-Specific Guidance

### Adding a New Feature
```
1. Check BACKLOG.md - is it planned?
2. Read relevant types from src/types/game.ts
3. Check existing tests in __tests__/
4. Write test first (TDD)
5. Implement feature
6. Update BACKLOG.md (mark as done)
```

### Fixing a Bug
```
1. Check error message / test failure
2. Grep for the failing function
3. Read that specific file
4. Fix + add test case
5. Run tests
```

### Refactoring
```
1. Run tests first (baseline)
2. Use TypeScript for type safety
3. Make changes
4. Run tests again (must pass)
5. Check coverage didn't drop
```

## 📊 Delegation Strategy

Delegate work based on complexity:

| Task | Best Tool |
|------|-----------|
| Complex architecture | Claude Code |
| Game logic (TDD) | Claude Code |
| Simple components | Copilot |
| Autocomplete | Copilot |
| Documentation | GPT-4 / Claude |
| Refactoring | Cursor AI |
| Type fixes | Cursor AI / TypeScript |

## 🔧 Claude Code Specific

### Use Task Agent for:
- Exploring large codebases
- Finding patterns across files
- Searching without reading everything

### Use Glob for:
- Finding files by pattern
- Discovering file structure

### Use Grep for:
- Searching code content
- Finding function definitions
- Checking usage

### Use Read only when:
- You need specific implementation details
- You're modifying that exact file
- TypeScript errors require context

## 🧪 Testing Strategy

- **Logic:** Jest tests in `__tests__/`
- **UI:** Skipped for now (config issues)
- **Coverage:** Must stay above 95%
- **Run before commit:** `npm test`

## 📝 Code Style

See CLAUDE.md → "Code Conventions" section for:
- Naming conventions
- TDD workflow
- Import organization
- Comment style

## 🚀 Workflow

```
feature/stage-N-description branch
  ↓
Write tests (RED)
  ↓
Implement (GREEN)
  ↓
Refactor
  ↓
Commit with conventional message
  ↓
Create PR
  ↓
Merge to main
```

## 🆘 When Stuck

1. **Check tests:** They often reveal the issue
2. **Check types:** TypeScript errors are your friend
3. **Grep for examples:** How is similar code done?
4. **Ask user:** Some decisions need human input

## 📚 References

- **Project:** /CLAUDE.md
- **Tasks:** /BACKLOG.md
- **Types:** /src/types/game.ts
- **Tests:** /__tests__/
- **Components:** /src/components/

---

**Remember:** Quality > Speed. This is a learning project with TDD methodology. Take time to understand, test thoroughly, and write clean code.
