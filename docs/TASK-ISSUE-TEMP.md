# Atomic Task Issue Template for GitHub Copilot
**Template for creating explicit atomic tasks that GitHub Copilot can execute independently**

---

## 🚨 CRITICAL: ATOMIC TASK PRINCIPLES

### ✅ ATOMIC TASK CHARACTERISTICS
- **Single Responsibility**: One clear, deliverable outcome
- **Independent Execution**: No dependency chains or multiplexing
- **Complete Isolation**: Each task creates its own feature branch
- **100% Self-Contained**: All requirements and specifications included
- **Build Validation**: Must pass `npm run build` with 100% success
- **Zero Linter Errors**: Must pass `npm run lint` with zero violations

### 🚫 FORBIDDEN PATTERNS
- ❌ **Chain Dependencies**: Task B depending on Task A completion
- ❌ **Multiplexing**: Multiple features in single task
- ❌ **Phase Sequencing**: "This depends on Phase X completion"
- ❌ **Incremental Builds**: Build failures allowed as intermediate steps
- ❌ **Shared Branches**: Multiple tasks on same feature branch

---

## 📋 Atomic Task Template Structure

### Title Format
```
[TASK-XXX-X] [Atomic]: [Single Deliverable Description]
```

### Body Template
```markdown
## [TASK-XXX-X] Atomic: [Single Deliverable]

### 🤖 EXECUTION MODE: [MANUAL | COPILOT] (MANDATORY)
**Current Mode: [MODE SETTING]**
- **MANUAL**: Human implementation required
- **COPILOT**: GitHub Copilot implementation required

### 🎯 SINGLE OBJECTIVE (MANDATORY)
**Complete this one specific deliverable end-to-end:**
- [EXACT single outcome this task must achieve]
- No additional features or modifications allowed

### 📦 DELIVERABLE (MANDATORY)
**This task creates ONE complete deliverable:**
- **File(s) Created**: [exact file paths that will be created]
- **Functionality Added**: [single specific functionality]
- **Integration Points**: [where this connects to existing code]

### 🏗️ TECHNICAL REQUIREMENTS
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Database**: Supabase (PostgreSQL)
- **UI Library**: shadcn/ui + Tailwind CSS
- **Authentication**: LINE LIFF v2 Native Auth
- **Testing**: Jest + Testing Library

### 📁 FILES TO CREATE (EXACT LIST)
```
src/[exact-path]/[filename].tsx
src/[exact-path]/[filename].test.tsx
lib/[exact-path]/[service].ts
```

### 🔧 EXACT IMPLEMENTATION REQUIREMENTS
- **No modifications to existing files** (unless specified)
- **Complete TypeScript interfaces** for all data structures
- **Comprehensive error handling** with user-friendly messages
- **Loading states** for all async operations
- **Accessibility compliance** (WCAG 2.1 AA)
- **Mobile-first responsive design** for LINE WebView

### 💾 DATABASE OPERATIONS (IF APPLICABLE)
```sql
-- EXACT SQL to execute (if any)
CREATE TABLE IF NOT EXISTS [table_name] (
  -- exact column definitions
);

-- EXACT RLS policies (if any)
ALTER POLICY ...;
```

### 🎨 UI/UX REQUIREMENTS
- **Design System**: Follow existing shadcn/ui patterns exactly
- **Mobile Optimization**: LINE WebView (320px minimum width)
- **Large Touch Targets**: 44px minimum for elderly users
- **High Contrast**: 4.5:1 minimum color contrast ratio
- **Thai Language Support**: Proper font loading and text handling

### 🧪 TESTING REQUIREMENTS
- **Unit Tests**: All functions and utilities (100% coverage)
- **Component Tests**: All React components using Testing Library
- **Integration Tests**: API routes and database operations
- **Manual Testing**: LINE WebView functionality verification

### ✅ ACCEPTANCE CRITERIA (100% MANDATORY)
- [ ] `npm run build` passes with **ZERO** errors or warnings
- [ ] `npm run lint` passes with **ZERO** violations
- [ ] `npx tsc --noEmit` passes (TypeScript compilation)
- [ ] All tests pass (`npm test`) with **ZERO** failures
- [ ] Single deliverable works end-to-end
- [ ] No unintended side effects
- [ ] Code follows project patterns exactly

### 🔄 GIT WORKFLOW (MANDATORY)
- **Branch Name**: `feature/task-[XXX]-[X]-[description]`
- **Source Branch**: MUST branch from latest `staging`
- **No Merge Conflicts**: Branch must be clean mergeable
- **Commit Format**:
  ```
  feat: [single deliverable]

  - Address TASK-XXX-X: [task title]
  - Complete atomic implementation
  - Build validation: 100% PASS (0 errors, 0 warnings)
  - Linter validation: 100% PASS (0 violations)
  - Tests: 100% PASS (0 failures)

  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude <noreply@anthropic.com>
  ```

### 🚨 VALIDATION CHECKLIST (MANDATORY BEFORE COMMIT)
- [ ] `npm run build` → Must show "✓ Compiled successfully"
- [ ] `npm run lint` → Must show "✓ Lint complete"
- [ ] `npm test` → Must show "✓ All tests passed"
- [ ] Manual test in LINE WebView (if applicable)
- [ ] No console errors in browser
- [ ] TypeScript compilation successful

### 📖 IMPLEMENTATION INSTRUCTIONS
**Follow exactly these steps:**

1. **Create Feature Branch** (MANDATORY FIRST STEP):
   ```bash
   git checkout staging
   git pull origin staging
   git checkout -b feature/task-[XXX]-[X]-[description]
   ```

2. **Implementation**: Build the single deliverable exactly as specified

3. **Validation** (MANDATORY BEFORE COMMIT):
   ```bash
   npm run build    # Must pass 100%
   npm run lint     # Must pass 100%
   npm test         # Must pass 100%
   ```

4. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: [single deliverable]..."
   ```

5. **Push Branch**:
   ```bash
   git push -u origin feature/task-[XXX]-[X]-[description]
   ```

### 🔗 RELATED CONTEXT (NO DEPENDENCIES)
- **Context Issue**: #[ISSUE-XXX] (for reference only)
- **No Task Dependencies**: This task must be executable independently
- **Reference Materials**: [relevant documentation links]

**Assign to**: [@human-executor | @copilot] (based on mode)
**Labels**: `atomic`, `[specific-technology]`, `independent-execution`, `[manual|copilot]`
```

---

## 🤖 MODE-BASED WORKFLOW SYSTEM

### Current Mode Tracking
**Global execution mode is stored in project settings:**
- **Default Mode**: MANUAL (human implementation)
- **Mode Switching**: Use `=mode` commands

### Mode Commands
```bash
=mode manual     # Switch to MANUAL mode (default)
=mode copilot     # Switch to COPILOT mode
=mode status      # Show current execution mode
```

### Task Creation by Mode
```bash
# Manual Mode (default)
=plan > [task description]                    # Creates task for human execution
=impl > [task-number]                        # Human implements task

# Copilot Mode
=mode copilot                                 # Switch to copilot mode
=plan > [task description]                    # Creates task for copilot execution
=impl > [task-number]                        # Copilot implements task
```

### Mode-Specific Behavior
**MANUAL Mode:**
- Task issues assigned to human executor
- =impl triggers manual implementation workflow
- Human performs all validation and commits

**COPILOT Mode:**
- Task issues assigned to @copilot
- =impl triggers copilot implementation workflow
- Copilot performs all validation and creates PRs

### Mode Persistence
- Mode setting persists throughout session
- Mode is stored in project configuration
- Can be changed anytime without affecting existing tasks

---

## 🚀 Atomic Task Examples

### Example 1: Database Table Creation
```markdown
## [TASK-009-1] Atomic: Create Members Database Table

### 🤖 EXECUTION MODE: COPILOT (MANDATORY)
**Current Mode: COPILOT**
- **COPILOT**: GitHub Copilot implementation required

### 🎯 SINGLE OBJECTIVE (MANDATORY)
**Complete this one specific deliverable end-to-end:**
- Create `members` table in Supabase with exact schema and RLS policies

### 📦 DELIVERABLE (MANDATORY)
**This task creates ONE complete deliverable:**
- **File(s) Created**: `lib/supabase/schema/members.sql`
- **Functionality Added**: Database table for LINE OA member registration
- **Integration Points**: Connects to existing Supabase client configuration

### 🤖 COPILOT IMPLEMENTATION INSTRUCTIONS
**GitHub Copilot must:**
1. Create feature branch from staging: `feature/task-009-1-members-database-table`
2. Create SQL schema file with exact table structure
3. Implement Row Level Security policies
4. Create TypeScript type definitions
5. Validate: `npm run build`, `npm run lint`, `npm test` (100% PASS)
6. Create pull request with proper documentation

### 🏗️ TECHNICAL REQUIREMENTS
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Database**: Supabase (PostgreSQL)
- **UI Library**: shadcn/ui + Tailwind CSS
- **Authentication**: LINE LIFF v2 Native Auth
- **Testing**: Jest + Testing Library

### 📁 FILES TO CREATE (EXACT LIST)
```
lib/supabase/schema/members.sql
lib/supabase/types/members.ts
```

### 💾 DATABASE OPERATIONS (MANDATORY)
```sql
-- File: lib/supabase/schema/members.sql
CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  line_user_id VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contact_info TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own data
CREATE POLICY "Users can view own profile"
  ON members
  FOR SELECT
  USING (line_user_id = auth.jwt() ->> 'line_user_id');

-- RLS Policy: Users can only insert their own data
CREATE POLICY "Users can insert own profile"
  ON members
  FOR INSERT
  WITH CHECK (line_user_id = auth.jwt() ->> 'line_user_id');

-- RLS Policy: Users can only update their own data
CREATE POLICY "Users can update own profile"
  ON members
  FOR UPDATE
  USING (line_user_id = auth.jwt() ->> 'line_user_id');
```

### 🔧 EXACT IMPLEMENTATION REQUIREMENTS
- **No modifications to existing files**
- **Complete TypeScript interfaces** for Member type
- **Comprehensive error handling** in database operations
- **Row Level Security** properly configured
- **Timestamps** for created_at and updated_at

### ✅ ACCEPTANCE CRITERIA (100% MANDATORY)
- [ ] `npm run build` passes with **ZERO** errors or warnings
- [ ] `npm run lint` passes with **ZERO** violations
- [ ] `npx tsc --noEmit` passes (TypeScript compilation)
- [ ] All tests pass (`npm test`) with **ZERO** failures
- [ ] SQL script executes successfully in Supabase
- [ ] TypeScript types compile without errors
- [ ] No unintended side effects

### 🔗 RELATED CONTEXT (NO DEPENDENCIES)
- **Context Issue**: #[ISSUE-008] (for reference only)
- **No Task Dependencies**: This task must be executable independently

**Assign to: @copilot**
**Labels**: `atomic`, `database`, `supabase`, `independent-execution`, `copilot`
```

### Example 2: React Component Creation (Manual Mode)
```markdown
## [TASK-009-2] Atomic: Create LoadingSpinner Component

### 🤖 EXECUTION MODE: MANUAL (MANDATORY)
**Current Mode: MANUAL**
- **MANUAL**: Human implementation required

### 🎯 SINGLE OBJECTIVE (MANDATORY)
**Complete this one specific deliverable end-to-end:**
- Create a reusable LoadingSpinner component with shadcn/ui patterns

### 📦 DELIVERABLE (MANDATORY)
**This task creates ONE complete deliverable:**
- **File(s) Created**: `components/ui/loading-spinner.tsx`, `components/ui/loading-spinner.test.tsx`
- **Functionality Added**: Loading spinner with accessibility features
- **Integration Points**: Can be imported and used throughout the application

### 👨‍💻 MANUAL IMPLEMENTATION INSTRUCTIONS
**Human developer must:**
1. Create feature branch from staging: `feature/task-009-2-loading-spinner-component`
2. Implement React component following shadcn/ui patterns
3. Add comprehensive TypeScript interfaces
4. Include accessibility features (ARIA, reduced motion)
5. Write unit tests using Testing Library
6. Validate: `npm run build`, `npm run lint`, `npm test` (100% PASS)
7. Commit with proper message format and create pull request

### 🏗️ TECHNICAL REQUIREMENTS
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **UI Library**: shadcn/ui + Tailwind CSS
- **Testing**: Jest + Testing Library

### 📁 FILES TO CREATE (EXACT LIST)
```
components/ui/loading-spinner.tsx
components/ui/loading-spinner.test.tsx
```

### 🔧 EXACT IMPLEMENTATION REQUIREMENTS
- **No modifications to existing files**
- **Complete TypeScript interfaces** for props
- **Accessibility compliance** (ARIA labels, reduced motion)
- **Mobile-friendly sizing** for LINE WebView
- **shadcn/ui design patterns** consistency

### 🎨 UI/UX REQUIREMENTS
- **Design System**: Follow existing shadcn/ui patterns exactly
- **Mobile Optimization**: LINE WebView (320px minimum width)
- **Large Touch Targets**: 44px minimum for elderly users
- **High Contrast**: 4.5:1 minimum color contrast ratio
- **Reduced Motion**: Respect prefers-reduced-motion

### ✅ ACCEPTANCE CRITERIA (100% MANDATORY)
- [ ] `npm run build` passes with **ZERO** errors or warnings
- [ ] `npm run lint` passes with **ZERO** violations
- [ ] `npx tsc --noEmit` passes (TypeScript compilation)
- [ ] All tests pass (`npm test`) with **ZERO** failures
- [ ] Component renders correctly
- [ ] Accessibility tests pass
- [ ] No unintended side effects

### 🔗 RELATED CONTEXT (NO DEPENDENCIES)
- **Context Issue**: #[ISSUE-008] (for reference only)
- **No Task Dependencies**: This task must be executable independently

**Assign to: [your-github-username]
**Labels**: `atomic`, `component`, `ui`, `independent-execution`, `manual`
```

---

## 🎯 MODE-SPECIFIC COMMANDS

### Manual Mode Commands
```bash
=plan > [task description]              # Create atomic task for manual implementation
=impl > [task-number]                  # Implement task manually
=mode status                           # Show current mode (should show MANUAL)
```

### Copilot Mode Commands
```bash
=mode copilot                          # Switch to COPILOT mode
=plan > [task description]              # Create atomic task for copilot implementation
=impl > [task-number]                  # Trigger copilot implementation
=mode status                           # Show current mode (should show COPILOT)
```

### Mode Switching Behavior
```bash
# Start in MANUAL mode (default)
=plan > create UI component               # Task assigned to human

# Switch to COPILOT mode
=mode copilot

# Now tasks will be assigned to copilot
=plan > create database table             # Task assigned to @copilot

# Switch back to MANUAL mode
=mode manual

# Tasks will be assigned to human again
=plan > implement auth logic              # Task assigned to human
```

---

## 📝 Atomic Task Creation Guidelines

### 1. Single Deliverable Focus
- **One Thing Only**: Each task must create exactly one deliverable
- **Complete End-to-End**: Deliverable must be fully functional when task completes
- **No Partial Work**: Don't split logical units into multiple tasks

### 2. Complete Independence
- **No Dependencies**: Task must not require completion of other tasks
- **Self-Contained**: All requirements included in single issue
- **Standalone Execution**: Copilot can start and complete without context from other tasks

### 3. Zero-Tolerance Quality Standards
- **Build 100% Success**: `npm run build` must pass with zero errors/warnings
- **Lint 100% Success**: `npm run lint` must pass with zero violations
- **Tests 100% Success**: All tests must pass with zero failures
- **Type Safety**: TypeScript compilation must pass completely

### 4. Exact Specifications
- **Precise File Paths**: Specify exact file locations and names
- **Detailed Requirements**: Include all technical specifications
- **Complete Examples**: Provide code examples and patterns to follow

### 5. Branch Isolation
- **One Branch Per Task**: Each atomic task gets its own feature branch
- **Clean Merges**: Branches must be mergeable without conflicts
- **Independent**: Branch does not depend on other feature branches

### 🚨 VALIDATION CHECKLIST BEFORE CREATING ATOMIC TASKS
- [ ] **Single Deliverable**: Task creates exactly one thing
- [ ] **No Dependencies**: Task can be executed independently
- [ ] **Complete Requirements**: All specifications included
- [ ] **Testable**: Success criteria are measurable
- [ ] **Build Ready**: Requirements ensure 100% build success
- [ ] **Lint Ready**: Requirements ensure zero lint violations

---

## ⚡ GitHub CLI Commands for Atomic Tasks

```bash
# Create atomic task issue
gh issue create \
  --title "[TASK-XXX-X] Atomic: [Single Deliverable]" \
  --body "$(cat docs/ISSUE-TEMP.md | sed -n '/## \[TASK-XXX-X\] Atomic:/,/```/p')" \
  --assignee @copilot \
  --label "atomic" \
  --label "independent-execution"

# Monitor atomic task progress
gh issue list --assignee @copilot --label "atomic" --state open

# Review atomic task PR
gh pr list --author @copilot --label "atomic"
```

---

## 🎯 Best Practices for Atomic Task Management

### Before Creating Atomic Tasks
1. **Break Down Features**: Split large features into smallest atomic units
2. **Verify Independence**: Ensure no task depends on another task
3. **Specify Exact Requirements**: Include all technical details
4. **Define Success Criteria**: Make acceptance criteria measurable

### During Task Creation
1. **Use Template**: Always use the atomic task template
2. **Be Specific**: Provide exact file paths and implementation details
3. **Include Examples**: Show expected code patterns and structures
4. **Test Requirements**: Specify all testing requirements

### After Task Assignment
1. **Monitor Progress**: Check build and lint results continuously
2. **Review Code**: Thoroughly review all pull requests
3. **Validate Independence**: Ensure task truly executed independently
4. **Track Metrics**: Monitor success rates and quality indicators

### Common Anti-Patterns to Avoid
- ❌ **Multiple Deliverables**: Creating more than one thing in a task
- ❌ **Task Dependencies**: Task B requiring Task A completion
- ❌ **Incremental Builds**: Allowing build failures as intermediate steps
- ❌ **Shared Branches**: Multiple tasks on same feature branch
- ❌ **Partial Requirements**: Incomplete specifications leading to confusion

---

## 📊 Atomic Task Performance Metrics

### Key Metrics to Track
- **Task Independence Rate**: Percentage of tasks that execute without dependencies
- **First-Time Success Rate**: Percentage of tasks that pass all validations on first attempt
- **Build Success Rate**: Percentage of atomic tasks with 100% build success
- **Lint Success Rate**: Percentage of atomic tasks with zero lint violations
- **Test Coverage**: Average test coverage for atomic task deliverables

### Quality Indicators
- **Zero Tolerance**: Any build failure, lint violation, or test failure is unacceptable
- **Complete Isolation**: Tasks must be truly independent
- **Specification Clarity**: Clear, detailed specifications reduce rework
- **Consistent Patterns**: Following established patterns improves success rates

---

*Last Updated: Use `date +"%Y-%m-%d %H:%M:%S"` to get current timestamp*
*Repository: PlaneetPanmaiLineApp*