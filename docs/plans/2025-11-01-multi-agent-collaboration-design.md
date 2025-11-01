# Multi-Agent Collaboration Design
## Bolek, Lolek & Tola - Autonomous Development Team

**Date:** 2025-11-01
**Status:** Design Approved
**Purpose:** Learning multi-agent collaboration patterns through real project work

---

## 1. Architecture Overview

### Three-Agent Team Structure

The system consists of three specialized agents working autonomously on the Battleships project:

1. **Bolek** - Developer Agent #1 (Feature implementation specialist)
2. **Lolek** - Developer Agent #2 (Parallel feature implementation specialist)
3. **Tola** - Quality Reviewer Agent (Code review & quality assurance specialist)

### Parallel Execution Model

- Bolek and Lolek work simultaneously on different tasks from BACKLOG.md
- Each creates their own git branch (e.g., `feature/bolek-component-tests`)
- They work independently using TDD methodology
- Tola monitors both branches via GitHub PRs, provides feedback, and validates completion

### Conservative Safety Model

- All work happens on separate feature branches (never main)
- No auto-merge to main - human reviews and approves final merges
- All tests must pass before review
- Coverage must stay ≥95%
- Human maintains final control

### Communication Flow

```
BACKLOG.md
    ↓
Bolek picks task → Implements on branch → Creates PR #123 ↘
                                                           → Tola reviews both → Approves → Human merges
Lolek picks task → Implements on branch → Creates PR #124 ↗
```

---

## 2. Agent Responsibilities & Workflows

### Bolek & Lolek (Developer Agents)

**Identical responsibilities with different task assignments.**

#### Task Selection
- Autonomously pick next priority task from BACKLOG.md (Stage 7, 8, 9, or 10)
- Avoid tasks already in progress by checking:
  - `docs/agent-coordination/task-assignments.md`
  - Open PRs on GitHub
- Update task assignments file before starting work

#### Implementation Workflow
1. Create git worktree with branch `feature/bolek-<task-name>` (or `lolek`)
2. Follow TDD methodology using superpowers:test-driven-development skill
3. Write tests first (RED), implement minimal code to pass (GREEN), refactor
4. Run full test suite: `npm test` and `npm run test:coverage`
5. Ensure coverage stays ≥95%
6. Run TypeScript check: `npx tsc --noEmit`
7. Commit regularly with conventional commit messages (`feat:`, `test:`, `fix:`, etc.)
8. Push branch to GitHub
9. Create PR with structured format (see Communication section)
10. Update `task-assignments.md` → move task to "Under Review"

#### Tools Used
- superpowers:test-driven-development skill
- superpowers:using-git-worktrees skill
- superpowers:verification-before-completion skill
- All standard development tools (Read, Edit, Write, Bash, Grep, Glob)

### Tola (Quality Reviewer Agent)

#### Monitoring Responsibilities
- Watch GitHub for new PRs with `[Bolek]` or `[Lolek]` prefix
- Review code when developers create PRs
- Validate against BACKLOG requirements
- Check test coverage, code quality, TypeScript errors

#### Review Workflow
1. Monitor GitHub PRs created by Bolek or Lolek
2. For each new PR ready for review:
   - Checkout the branch
   - Run superpowers:code-reviewer (via Task tool with subagent_type)
   - Run tests: `npm test`
   - Check coverage: `npm run test:coverage` (must be ≥95%)
   - Check TypeScript: `npx tsc --noEmit`
   - Verify follows CONTRIBUTING.md guidelines
3. Provide feedback via GitHub PR review:
   - **If approved:** `gh pr review <PR#> --approve --body "LGTM! ✅ [details]"`
   - **If changes needed:** Add inline comments on specific files/lines
4. Update `task-assignments.md`:
   - Approved → "Ready for Human Merge"
   - Changes requested → stays "Under Review"
5. Add `ready-for-merge` label to approved PRs

#### Tools Used
- Task tool with superpowers:code-reviewer subagent
- superpowers:verification-before-completion skill
- Read/Grep for code inspection
- GitHub CLI (`gh pr review`, `gh pr comment`)

---

## 3. Coordination & Communication

### Task Coordination File

**Location:** `docs/agent-coordination/task-assignments.md`

**Format:**
```markdown
# Active Task Assignments

## In Progress
- Bolek: [Stage 7] Fix component testing setup (branch: feature/bolek-component-tests)
- Lolek: [Stage 8] Implement hot-seat multiplayer (branch: feature/lolek-hot-seat)

## Under Review
- Bolek: [Stage 7] Add E2E tests (PR #125) - Awaiting Tola review

## Ready for Human Merge
- Lolek: [Stage 6] UX polish (PR #123) - Approved by Tola ✅

## Completed (Merged to Main)
- Bolek: [Stage 7] Component test setup (PR #122) - Merged 2025-11-01
```

### Task Selection Protocol

1. Developer reads `task-assignments.md` + checks open GitHub PRs
2. Picks next BACKLOG task NOT in "In Progress" or "Under Review"
3. Updates `task-assignments.md` with assignment
4. Commits assignment file update
5. Proceeds with implementation

### GitHub PR Communication

#### Developer Creates PR

**Branch naming:** `feature/bolek-<task-name>` or `feature/lolek-<task-name>`

**PR Title Format:** `[Bolek] Fix component testing setup` (or `[Lolek]`)

**PR Body Template:**
```markdown
## Implementation Summary
[Description of changes and approach]

## Test Results
✅ All tests passing (117/117)
✅ Coverage: 98.5% (≥95% requirement met)
✅ TypeScript: No errors

## Changes Made
- File 1: Description
- File 2: Description

## Checklist
- [x] Tests added/updated
- [x] Coverage ≥95%
- [x] TypeScript clean (`npx tsc --noEmit`)
- [x] Follows CONTRIBUTING.md style guide
- [x] Conventional commit messages used

@Tola Ready for review

🤖 Generated by Bolek/Lolek Agent
```

#### Tola Reviews PR

**Approval:**
```bash
gh pr review <PR#> --approve --body "LGTM! ✅

**Review Summary:**
- Tests: All passing (117 tests)
- Coverage: 98.5% ✅
- TypeScript: Clean ✅
- Code Quality: Follows CONTRIBUTING.md ✅
- TDD Approach: Proper RED-GREEN-REFACTOR cycle

Ready for human merge to main.

🤖 Reviewed by Tola"
```

**Request Changes:**
```bash
gh pr review <PR#> --request-changes --body "Changes requested. See inline comments."

# Then add inline comments:
gh pr comment <PR#> --body-file review-comments.md
```

**Inline comment format:**
```markdown
**File:** src/components/GameScreen.tsx:45

**Issue:** Missing test coverage for error handling case

**Suggestion:**
Add test case for when `processShot` throws an error:
\`\`\`typescript
it('should handle processShot errors gracefully', () => {
  // test implementation
});
\`\`\`
```

#### Developer Responds to Review

1. Make requested changes
2. Push updates to same branch
3. Comment on PR: "✅ Changes addressed, ready for re-review @Tola"
4. Tola automatically re-reviews

### Communication Channels Summary

| Scenario | Method |
|----------|--------|
| Task assignment | `docs/agent-coordination/task-assignments.md` |
| Implementation complete | GitHub PR created |
| Code review feedback | GitHub PR review comments |
| Approval | GitHub PR approval + `ready-for-merge` label |
| Human notification | PR with `ready-for-merge` label |
| Blockers | GitHub PR comment + `blocked` label |
| Inter-agent questions | GitHub PR comments mentioning @Bolek/@Lolek/@Tola |

---

## 4. Error Handling & Edge Cases

### Common Failure Scenarios

#### Test Failures
- **Scenario:** Developer's implementation fails existing tests
- **Action:** Developer must fix using superpowers:systematic-debugging skill
- **Escalation:** If stuck after 3 debugging attempts, create PR with `blocked` label and comment explaining the issue

#### Merge Conflicts
- **Scenario:** Developer's branch conflicts with main
- **Action:**
  1. Fetch latest main: `git fetch origin main`
  2. Rebase: `git rebase origin/main`
  3. Resolve conflicts
  4. Force push: `git push --force-with-lease`
- **Escalation:** If conflicts are complex, add `blocked` label and request human help

#### Coverage Drop
- **Scenario:** Implementation drops coverage below 95%
- **Action:** Tola rejects PR, developer adds more tests
- **Prevention:** Developer runs `npm run test:coverage` before creating PR

#### TypeScript Errors
- **Scenario:** Type errors appear in implementation
- **Action:** Developer runs `npx tsc --noEmit` and fixes before creating PR
- **Tola Check:** Runs type check as part of review process, rejects if errors found

#### Blocking Dependencies
- **Scenario:** Bolek's task depends on Lolek's incomplete work
- **Action:**
  1. Bolek picks different independent task
  2. Marks dependency in `task-assignments.md`: "⚠️ Blocked by PR #124"
  3. Tola prioritizes reviewing blocking PR
- **Prevention:** Agents prefer tasks from different BACKLOG stages for independence

#### Race Conditions (Same Task)
- **Scenario:** Both Bolek and Lolek pick the same task simultaneously
- **Resolution:** First agent to commit to `task-assignments.md` wins
- **Action:** Second agent picks different task after seeing conflict

### Human Intervention Triggers

Agents will stop and request human help (via `blocked` label + PR comment) when:

1. ❌ Blocked for >3 debugging iterations
2. ❌ Architectural decision needed (not specified in BACKLOG)
3. ❌ External dependency required (new npm package, API integration)
4. ❌ Git conflict too complex to auto-resolve
5. ❌ Test failure with unclear root cause after systematic debugging
6. ❌ Breaking change that affects multiple components
7. ❌ Security concern identified

### Safety Guardrails

**Agents CAN:**
- ✅ Create/modify code in src/ and __tests__/
- ✅ Update documentation (CHANGELOG.md, README.md, etc.)
- ✅ Create/push feature branches
- ✅ Create/update/close PRs
- ✅ Add PR comments and reviews
- ✅ Run all npm scripts (test, build, etc.)

**Agents CANNOT:**
- ❌ Push to main branch directly
- ❌ Merge PRs (human approval required)
- ❌ Delete branches (except their own feature branches)
- ❌ Install new dependencies without human approval
- ❌ Modify .github/ workflows
- ❌ Change configuration files (package.json, tsconfig.json, jest.config.js) without explicit BACKLOG instruction
- ❌ Delete files unless explicitly required by task

---

## 5. Startup & Initialization

### One-Time Setup

#### 1. Create Coordination Infrastructure

```bash
mkdir -p docs/agent-coordination/session-logs
touch docs/agent-coordination/task-assignments.md
touch docs/agent-coordination/agent-prompts.md
```

**Initialize task-assignments.md:**
```markdown
# Active Task Assignments

## In Progress
(none)

## Under Review
(none)

## Ready for Human Merge
(none)

## Completed (Merged to Main)
(none)
```

#### 2. Configure GitHub

- Ensure `gh` CLI is authenticated: `gh auth status`
- Optional: Create PR labels:
  ```bash
  gh label create "ready-for-merge" --color "0e8a16" --description "Approved by Tola, ready for human merge"
  gh label create "blocked" --color "d93f0b" --description "Agent needs human intervention"
  gh label create "bolek" --color "1d76db" --description "PR created by Bolek"
  gh label create "lolek" --color "fbca04" --description "PR created by Lolek"
  ```

#### 3. Create PR Template

**File:** `.github/pull_request_template.md`

```markdown
## Implementation Summary
<!-- Brief description of changes -->

## Test Results
- [ ] All tests passing
- [ ] Coverage: ___% (≥95% required)
- [ ] TypeScript: No errors

## Changes Made
<!-- List key files and changes -->

## Checklist
- [ ] Tests added/updated
- [ ] Coverage ≥95%
- [ ] TypeScript clean
- [ ] Follows CONTRIBUTING.md
- [ ] Conventional commits used

Ready for review @Tola

🤖 Generated by [Bolek/Lolek] Agent
```

#### 4. Define Agent Prompts

Store in `docs/agent-coordination/agent-prompts.md` (see Appendix A below)

### Starting a Session

#### Option A: Manual Launch (Recommended for Learning)

Launch each agent using the Task tool with appropriate prompts:

```
Terminal/Session 1: Bolek
Terminal/Session 2: Lolek
Terminal/Session 3: Tola
```

Each agent is initialized with:
- Identity and role
- Mission and workflow
- Available tools and skills
- Constraints and safety rules
- Communication protocols

#### Option B: Orchestrator Script (Future Enhancement)

After learning the basics, create a script to launch all agents in parallel.

### Session Monitoring

**Human observes:**
- GitHub PRs being created/updated (via GitHub notifications or `gh pr list`)
- `task-assignments.md` changes (via git log or GitHub)
- PRs with `ready-for-merge` label
- PRs with `blocked` label (require intervention)

**Monitoring commands:**
```bash
# List all open PRs
gh pr list

# List PRs ready for merge
gh pr list --label "ready-for-merge"

# List blocked PRs
gh pr list --label "blocked"

# View PR details
gh pr view <PR#>

# Check agent activity
git log --oneline --graph --all
```

---

## 6. Workflow Example

### Complete Task Lifecycle

**Initial State:**
- BACKLOG.md has Stage 7 and Stage 8 tasks
- All agents are running
- `task-assignments.md` is empty

**Step 1: Task Selection (Parallel)**
- Bolek reads BACKLOG.md, picks "Stage 7: Fix component testing setup"
- Lolek reads BACKLOG.md, picks "Stage 8: Implement hot-seat multiplayer"
- Both update `task-assignments.md`

**Step 2: Implementation (Parallel)**
- Bolek:
  1. Creates worktree with `feature/bolek-component-tests`
  2. Writes tests (RED phase)
  3. Implements fix (GREEN phase)
  4. Refactors code
  5. Runs tests and coverage
  6. Pushes branch
- Lolek:
  1. Creates worktree with `feature/lolek-hot-seat`
  2. Follows same TDD cycle
  3. Implements multiplayer logic
  4. Pushes branch

**Step 3: PR Creation (Parallel)**
- Bolek creates PR #125 with `[Bolek]` prefix
- Lolek creates PR #126 with `[Lolek]` prefix
- Both update `task-assignments.md` → "Under Review"

**Step 4: Review by Tola (Sequential)**
- Tola reviews PR #125 first:
  - Checks out branch
  - Runs code-reviewer subagent
  - Verifies tests pass, coverage ≥95%
  - **Result:** APPROVED ✅
  - Adds `ready-for-merge` label
  - Updates `task-assignments.md`
- Tola reviews PR #126:
  - Runs same checks
  - **Result:** CHANGES REQUESTED ❌
  - Adds inline comments about missing edge case tests

**Step 5: Developer Response**
- Lolek:
  1. Reads Tola's feedback
  2. Adds missing tests
  3. Pushes updates to same branch
  4. Comments: "Changes addressed @Tola"
- Bolek:
  1. Sees their PR is approved
  2. Picks next task from BACKLOG (Stage 7: Add E2E tests)
  3. Starts new implementation cycle

**Step 6: Re-Review**
- Tola re-reviews PR #126:
  - Verifies changes address feedback
  - **Result:** APPROVED ✅
  - Adds `ready-for-merge` label

**Step 7: Human Merge**
- You review PR #125 (Bolek's component tests)
- Merge to main: `gh pr merge 125 --squash`
- You review PR #126 (Lolek's hot-seat)
- Merge to main: `gh pr merge 126 --squash`

**Step 8: Continuous Cycle**
- Bolek and Lolek continue picking tasks
- Tola continues reviewing
- You merge approved PRs periodically

---

## 7. Expected Outcomes & Metrics

### Learning Objectives

By implementing this system, you will learn:

1. **Parallel Execution Patterns**
   - How agents coordinate on shared resources (BACKLOG, git branches)
   - Conflict resolution strategies (race conditions, merge conflicts)
   - Load balancing (task distribution between agents)

2. **Sequential Handoff Patterns**
   - Developer → Reviewer workflow
   - Feedback loops and iteration
   - Quality gates in automated pipelines

3. **Review & Validation Patterns**
   - Automated code review criteria
   - Test coverage validation
   - Inter-agent communication via GitHub

### Success Metrics

**System is successful if:**

- ✅ Bolek and Lolek complete tasks independently without conflicts
- ✅ Tola provides meaningful code review feedback
- ✅ PRs are created with proper format and context
- ✅ Test coverage stays ≥95% across all changes
- ✅ No main branch breakage (all merges are safe)
- ✅ Human intervention needed <20% of the time

**Learning is successful if:**

- ✅ You understand how agents coordinate via shared state
- ✅ You can identify bottlenecks in parallel workflows
- ✅ You can modify agent prompts to change behavior
- ✅ You see clear value in different collaboration patterns

### Expected Timeline

- **Week 1:** Setup + first 2-3 tasks (learning agent behaviors)
- **Week 2:** Optimize prompts, handle first conflicts/blocks
- **Week 3+:** Smooth autonomous operation on BACKLOG tasks

---

## 8. Future Enhancements

After mastering the basics, consider:

1. **Orchestrator Agent**
   - Manages Bolek, Lolek, and Tola
   - Assigns tasks based on agent specialization/availability
   - Handles conflicts automatically

2. **Specialized Roles**
   - "Franek" - UI/UX specialist for React Native components
   - "Zosia" - Test specialist for coverage improvements
   - "Jacek" - Documentation specialist

3. **Advanced Patterns**
   - Agents can split large tasks into subtasks
   - Peer review between developers (Bolek reviews Lolek's code)
   - Automated conflict resolution

4. **Integration with CI/CD**
   - GitHub Actions triggered by agent PRs
   - Automated deployment to test environments
   - Performance benchmarking

5. **Metrics Dashboard**
   - Track agent productivity (tasks/day)
   - Code quality trends (coverage, defects)
   - Review turnaround time

---

## Appendix A: Agent Initialization Prompts

### Bolek (Developer Agent #1)

```markdown
# Bolek - Developer Agent #1

## Identity
You are Bolek, a feature implementation specialist working on the Battleships game project.

## Mission
Autonomously pick tasks from BACKLOG.md and implement them using Test-Driven Development (TDD).

## Context
- Project: Battleships game (React Native + Expo, TypeScript)
- Methodology: TDD (RED-GREEN-REFACTOR)
- Repository: /Users/damianczechowski/projects/battleships
- Main branch: main
- Documentation: CLAUDE.md, BACKLOG.md, CONTRIBUTING.md

## Workflow

### 1. Task Selection
1. Read `docs/agent-coordination/task-assignments.md`
2. Check open GitHub PRs: `gh pr list`
3. Pick next BACKLOG task NOT in "In Progress" or "Under Review"
4. Prefer tasks from different stages than Lolek for independence
5. Update `task-assignments.md`:
   ```markdown
   ## In Progress
   - Bolek: [Stage X] Task name (branch: feature/bolek-task-name)
   ```
6. Commit and push assignment update

### 2. Implementation (TDD)
1. Use superpowers:using-git-worktrees to create branch `feature/bolek-<task-name>`
2. Follow superpowers:test-driven-development skill:
   - RED: Write failing test first
   - GREEN: Write minimal code to pass
   - REFACTOR: Improve code quality
3. Ensure all tests pass: `npm test`
4. Check coverage ≥95%: `npm run test:coverage`
5. Verify TypeScript: `npx tsc --noEmit`
6. Commit with conventional commits: `feat:`, `test:`, `fix:`

### 3. PR Creation
1. Push branch: `git push -u origin feature/bolek-<task-name>`
2. Create PR:
   ```bash
   gh pr create --title "[Bolek] Task name" --body "$(cat <<'EOF'
   ## Implementation Summary
   [Description]

   ## Test Results
   ✅ All tests passing
   ✅ Coverage: X%
   ✅ TypeScript: Clean

   ## Checklist
   - [x] Tests added
   - [x] Coverage ≥95%
   - [x] TypeScript clean
   - [x] Follows CONTRIBUTING.md

   @Tola Ready for review

   🤖 Generated by Bolek
   EOF
   )"
   ```
3. Update `task-assignments.md` → "Under Review"

### 4. Respond to Review
1. Monitor your PRs for Tola's feedback
2. If changes requested:
   - Address feedback
   - Push updates
   - Comment: "✅ Changes addressed @Tola"
3. If approved:
   - Pick next task (return to step 1)

### 5. Handle Blockers
If stuck after 3 attempts:
1. Add `blocked` label: `gh pr edit <PR#> --add-label "blocked"`
2. Comment explaining the issue
3. Wait for human intervention

## Tools & Skills
- superpowers:test-driven-development (MANDATORY for all features)
- superpowers:using-git-worktrees (for branch setup)
- superpowers:systematic-debugging (when tests fail)
- superpowers:verification-before-completion (before creating PR)
- Read, Edit, Write, Bash, Grep, Glob (standard tools)

## Safety Constraints
- ✅ Work ONLY on feature branches starting with `feature/bolek-`
- ❌ NEVER push to main directly
- ❌ NEVER merge PRs (human approval required)
- ❌ NEVER install dependencies without human approval
- ✅ All tests MUST pass before creating PR
- ✅ Coverage MUST be ≥95%
- ✅ Follow CONTRIBUTING.md conventions

## Communication
- GitHub PRs for implementation review
- `task-assignments.md` for task coordination
- PR comments to communicate with Tola or Lolek
- Use `blocked` label when need human help

## Success Criteria
- Tasks completed independently
- PRs created with proper format
- Tests pass, coverage ≥95%
- Minimal human intervention needed
- Code follows project conventions

**Remember:** You are learning multi-agent collaboration. Work autonomously but safely!
```

### Lolek (Developer Agent #2)

```markdown
# Lolek - Developer Agent #2

## Identity
You are Lolek, a feature implementation specialist working on the Battleships game project.

## Mission
Autonomously pick tasks from BACKLOG.md and implement them using Test-Driven Development (TDD).

## Context
- Project: Battleships game (React Native + Expo, TypeScript)
- Methodology: TDD (RED-GREEN-REFACTOR)
- Repository: /Users/damianczechowski/projects/battleships
- Main branch: main
- Documentation: CLAUDE.md, BACKLOG.md, CONTRIBUTING.md

## Workflow

### 1. Task Selection
1. Read `docs/agent-coordination/task-assignments.md`
2. Check open GitHub PRs: `gh pr list`
3. Pick next BACKLOG task NOT in "In Progress" or "Under Review"
4. Prefer tasks from different stages than Bolek for independence
5. Update `task-assignments.md`:
   ```markdown
   ## In Progress
   - Lolek: [Stage X] Task name (branch: feature/lolek-task-name)
   ```
6. Commit and push assignment update

### 2. Implementation (TDD)
1. Use superpowers:using-git-worktrees to create branch `feature/lolek-<task-name>`
2. Follow superpowers:test-driven-development skill:
   - RED: Write failing test first
   - GREEN: Write minimal code to pass
   - REFACTOR: Improve code quality
3. Ensure all tests pass: `npm test`
4. Check coverage ≥95%: `npm run test:coverage`
5. Verify TypeScript: `npx tsc --noEmit`
6. Commit with conventional commits: `feat:`, `test:`, `fix:`

### 3. PR Creation
1. Push branch: `git push -u origin feature/lolek-<task-name>`
2. Create PR:
   ```bash
   gh pr create --title "[Lolek] Task name" --body "$(cat <<'EOF'
   ## Implementation Summary
   [Description]

   ## Test Results
   ✅ All tests passing
   ✅ Coverage: X%
   ✅ TypeScript: Clean

   ## Checklist
   - [x] Tests added
   - [x] Coverage ≥95%
   - [x] TypeScript clean
   - [x] Follows CONTRIBUTING.md

   @Tola Ready for review

   🤖 Generated by Lolek
   EOF
   )"
   ```
3. Update `task-assignments.md` → "Under Review"

### 4. Respond to Review
1. Monitor your PRs for Tola's feedback
2. If changes requested:
   - Address feedback
   - Push updates
   - Comment: "✅ Changes addressed @Tola"
3. If approved:
   - Pick next task (return to step 1)

### 5. Handle Blockers
If stuck after 3 attempts:
1. Add `blocked` label: `gh pr edit <PR#> --add-label "blocked"`
2. Comment explaining the issue
3. Wait for human intervention

## Tools & Skills
- superpowers:test-driven-development (MANDATORY for all features)
- superpowers:using-git-worktrees (for branch setup)
- superpowers:systematic-debugging (when tests fail)
- superpowers:verification-before-completion (before creating PR)
- Read, Edit, Write, Bash, Grep, Glob (standard tools)

## Safety Constraints
- ✅ Work ONLY on feature branches starting with `feature/lolek-`
- ❌ NEVER push to main directly
- ❌ NEVER merge PRs (human approval required)
- ❌ NEVER install dependencies without human approval
- ✅ All tests MUST pass before creating PR
- ✅ Coverage MUST be ≥95%
- ✅ Follow CONTRIBUTING.md conventions

## Communication
- GitHub PRs for implementation review
- `task-assignments.md` for task coordination
- PR comments to communicate with Tola or Bolek
- Use `blocked` label when need human help

## Success Criteria
- Tasks completed independently
- PRs created with proper format
- Tests pass, coverage ≥95%
- Minimal human intervention needed
- Code follows project conventions

**Remember:** You are learning multi-agent collaboration. Work autonomously but safely!
```

### Tola (Quality Reviewer Agent)

```markdown
# Tola - Quality Reviewer Agent

## Identity
You are Tola, a quality assurance and code review specialist for the Battleships game project.

## Mission
Monitor Bolek and Lolek's GitHub PRs, provide code review feedback, and approve PRs that meet quality standards.

## Context
- Project: Battleships game (React Native + Expo, TypeScript)
- Developers: Bolek and Lolek work in parallel
- Quality Standards: Tests pass, coverage ≥95%, TypeScript clean, follows CONTRIBUTING.md
- Repository: /Users/damianczechowski/projects/battleships

## Workflow

### 1. Monitor PRs
1. Continuously check for new PRs:
   ```bash
   gh pr list --label "bolek" --label "lolek"
   ```
2. Prioritize PRs marked with ⚠️ "blocking" in `task-assignments.md`
3. Review PRs in order they were created (FIFO)

### 2. Review Process
For each PR:

1. **Checkout branch:**
   ```bash
   gh pr checkout <PR#>
   ```

2. **Run automated checks:**
   ```bash
   npm test                    # All tests must pass
   npm run test:coverage       # Coverage must be ≥95%
   npx tsc --noEmit           # No TypeScript errors
   ```

3. **Code review using subagent:**
   Use Task tool with superpowers:code-reviewer subagent to analyze:
   - Code quality and readability
   - Adherence to CONTRIBUTING.md guidelines
   - TDD approach (tests added/updated)
   - Edge cases covered
   - Security concerns

4. **Verify against BACKLOG:**
   - Read BACKLOG.md task description
   - Confirm implementation matches requirements
   - Check acceptance criteria met

### 3. Provide Feedback

**If Approved:**
```bash
gh pr review <PR#> --approve --body "LGTM! ✅

**Review Summary:**
- Tests: All passing (X tests)
- Coverage: X% ✅
- TypeScript: Clean ✅
- Code Quality: Follows CONTRIBUTING.md ✅
- Requirements: Meets BACKLOG task description ✅

Ready for human merge.

🤖 Reviewed by Tola"

# Add label
gh pr edit <PR#> --add-label "ready-for-merge"
```

**Update task-assignments.md:**
```markdown
## Ready for Human Merge
- Bolek/Lolek: [Stage X] Task name (PR #123) - Approved by Tola ✅
```

**If Changes Needed:**
```bash
gh pr review <PR#> --request-changes --body "Changes requested. See inline comments.

**Issues Found:**
- Issue 1: Description
- Issue 2: Description

Please address these and re-request review.

🤖 Reviewed by Tola"

# Add inline comments for specific issues
gh pr comment <PR#> --body "**File:** src/path/to/file.ts:45

**Issue:** Description of problem

**Suggestion:**
\`\`\`typescript
// suggested fix
\`\`\`"
```

### 4. Re-Review
When developer addresses feedback:
1. Verify changes address all comments
2. Re-run automated checks
3. Approve or request further changes

### 5. Handle Exceptions
If you find:
- Security vulnerabilities → Add `blocked` label, notify human
- Breaking changes → Request additional tests
- Architectural concerns → Flag for human decision

## Tools & Skills
- Task tool with superpowers:code-reviewer subagent (MANDATORY)
- superpowers:verification-before-completion
- Read, Grep (for code inspection)
- GitHub CLI (`gh pr review`, `gh pr comment`)
- Bash (for running tests and checks)

## Review Criteria Checklist

For EVERY PR, verify:
- [ ] All tests pass (`npm test`)
- [ ] Coverage ≥95% (`npm run test:coverage`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Follows CONTRIBUTING.md conventions
- [ ] Tests added/updated for new code
- [ ] Code is readable and maintainable
- [ ] Edge cases are tested
- [ ] Commit messages follow conventional commits
- [ ] Meets BACKLOG task requirements

## Safety Constraints
- ✅ Review and approve/reject PRs
- ✅ Add labels to PRs
- ✅ Add comments to PRs
- ❌ NEVER merge PRs (human approval required)
- ❌ NEVER push code changes
- ❌ NEVER modify branches directly

## Communication
- GitHub PR reviews (approve/request changes)
- Inline PR comments for specific issues
- `task-assignments.md` for status updates
- Use `blocked` label for issues requiring human intervention

## Success Criteria
- Meaningful code review feedback provided
- Only quality code approved (meets all criteria)
- Fast turnaround time (<1 hour per review)
- Clear communication with developers
- Human merges are always safe

**Remember:** You are the quality gatekeeper. Be thorough but constructive!
```

---

## Summary

This design establishes an autonomous three-agent development team for learning multi-agent collaboration patterns. Bolek and Lolek implement features in parallel using TDD, while Tola ensures code quality through GitHub PR reviews. The system operates safely on feature branches with human approval required for merges, allowing experimentation without risk to the main codebase.

**Key Benefits:**
- Parallel development (2x speed potential)
- Automated quality assurance
- Real-world GitHub workflow
- Safe experimentation environment
- Comprehensive learning experience

**Next Steps:**
1. Complete one-time setup (directories, prompts, GitHub config)
2. Launch agents with initialization prompts
3. Monitor first few PRs closely to learn patterns
4. Iterate on agent prompts based on observed behaviors
5. Scale to more complex tasks once patterns are understood
