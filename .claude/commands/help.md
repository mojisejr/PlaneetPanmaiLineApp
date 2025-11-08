# Workflow System Help

Complete guide to the Claude Code workflow system for atomic task management.

## Quick Start

```bash
# 1. Create context for discussion
/fcs > [topic-name]

# 2. Plan atomic tasks
/plan > [task description]

# 3. Implement tasks
/impl > [task-number]

# 4. Create pull requests
/pr > [feedback]

# 5. Daily retrospective
/rrr > [summary]
```

## Command Overview

### Context Management
- **/fcs** - Create/update Context Issues for iterative discussion
- Uses `/docs/ISSUE-TEMP.md` template
- Creates living documents for evolving requirements
- Status: Planning → Ready for Planning → Implementation Ready

### Task Management
- **/plan** - Create atomic Task Issues based on current mode
- Uses `/docs/TASK-ISSUE-TEMP.md` template
- Assigns tasks based on execution mode (MANUAL/COPILOT)
- Creates [TASK-XXX-X] GitHub issues

### Implementation
- **/impl** - Trigger implementation based on current mode
- MANUAL: Human implementation with Task tool execution
- COPILOT: GitHub Copilot auto-implementation via CLI
- Ensures 100% validation (build, lint, test)

### Mode Control
- **/mode** - Switch execution modes
- MANUAL: Human handles implementation (default)
- COPILOT: GitHub Copilot handles implementation
- Affects task assignment and execution method

### Code Review
- **/pr** - Create Pull Requests from feature branches
- ALWAYS targets staging branch (NEVER main)
- Includes validation status and feedback
- Never merges automatically

### Reflection
- **/rrr** - Create daily retrospective files and Issues
- Tracks accomplishments, challenges, and improvements
- Creates actionable items for future work

## Core Workflow Process

1. **Phase 1: Context Creation**
   ```bash
   /fcs > [topic-name]     # Initial discussion
   /fcs > [ISSUE-XXX]      # Iterative updates
   ```
   - Status: Planning → Ready for Planning

2. **Phase 2: Task Planning**
   ```bash
   /mode [manual|copilot]  # Set execution mode
   /plan > [task]          # Create atomic tasks
   ```
   - Context must be [Implementation Ready]

3. **Phase 3: Implementation**
   ```bash
   /impl > [task-number]   # Execute tasks
   /impl batch > 1,2,3     # Parallel execution
   ```
   - Follows mode-specific behavior

4. **Phase 4: Review & Merge**
   ```bash
   /pr > [feedback]        # Create PR (staging only)
   ```
   - Wait for user approval before merge

## Critical Safety Rules

❌ **NEVER merge PRs yourself** - Provide PR link and wait
❌ **NEVER target PR to main** - ALWAYS use staging branch
❌ **NEVER work on main/staging** - Always use feature branches
❌ **NEVER skip 100% validation** - Build, lint, test must pass
❌ **NEVER implement without task issue** - Must use /plan first

✅ **ALWAYS** sync staging before implementation
✅ **ALWAYS** use feature branch naming conventions
✅ **ALWAYS** ensure 100% build/lint/test success
✅ **ALWAYS** follow template-guided workflow

## Quality Standards

### Code Quality
- **TypeScript**: Strict mode, zero compilation errors
- **ESLint**: Zero violations allowed
- **Build**: 100% success rate (zero errors/warnings)
- **Tests**: 100% pass rate when implemented

### UI/UX Requirements
- **Mobile-First**: LINE WebView optimization (320px minimum)
- **Accessibility**: WCAG 2.1 AA compliance (4.5:1 contrast)
- **Large Touch Targets**: 44px minimum for elderly users
- **Performance**: ≤3 seconds load time on 4G/5G

## Template System

### Context Issue Template (`/docs/ISSUE-TEMP.md`)
- DISCUSSION LOG for session tracking
- ACCUMULATED CONTEXT for requirements
- PLANNING READINESS CHECKLIST for validation
- TECHNICAL ARCHITECTURE section

### Task Issue Template (`/docs/TASK-ISSUE-TEMP.md`)
- EXECUTION MODE field (MANDATORY)
- SINGLE OBJECTIVE requirements
- DELIVERABLE specifications
- ACCEPTANCE CRITERIA (100% validation)
- GIT WORKFLOW instructions

## Commands Reference

| Command | Purpose | Template Used | Mode-Dependent |
|---------|---------|---------------|----------------|
| /fcs | Context Management | ISSUETEMP.md | No |
| /plan | Task Planning | TASKISSUE.md | Yes |
| /impl | Implementation | - | Yes |
| /mode | Mode Control | - | No |
| /pr | Pull Request | - | Yes |
| /rrr | Retrospective | - | No |
| /help | System Help | - | No |

## Getting Help

For detailed information about any command:
- Check command-specific documentation in `.claude/commands/`
- Review CLAUDE.md for complete workflow rules
- Use `/help` to show this overview

## Example Workflow

```bash
# Start new feature development
/fcs > user authentication system
# (discuss requirements until ready)

/plan > Implement LINE LIFF authentication
# (creates TASK-001-1 assigned based on mode)

/impl > 1
# (executes task according to current mode)

/pr > Authentication complete, all tests passing
# (creates PR to staging, waits for approval)

/rrr > Completed authentication feature, deployed to staging
# (documents daily progress)
```