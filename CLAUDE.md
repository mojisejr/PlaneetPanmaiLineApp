## Project Overview

**Project Name**: Praneet Panmai Line App (Premium Member Calculator)

**Repository**: https://github.com/mojisejr/PlaneetPanmaiLineApp.git
**Supabase Project ID**: fefvihkpzubuqykdjeoj

**Description**: ระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิกเท่านั้น (Members-only Calculator) ผ่าน LIFF สำหรับร้านต้นทุเรียน เพื่อสร้าง premium value ให้กับการเป็นสมาชิก LINE OA และลดต้นทุนการดำเนินงาน (MVP)

---

## ⚠️ CRITICAL SAFETY RULES

### 🚨 FORBIDDEN ACTIONS (NEVER ALLOWED)
- ❌ **NEVER merge PRs yourself** - Provide PR link and wait for user instructions
- ❌ **NEVER target PR to main branch** - ALWAYS use staging branch as target (staging → main only direction)
- ❌ **NEVER work on main/staging branches** - Always use feature branches
- ❌ **NEVER delete critical files** (.env, .git/, node_modules/, package.json, lib/database/)
- ❌ **NEVER commit sensitive data** (API keys, passwords, secrets) - Use environment variables
- ❌ **NEVER skip 100% validation** (build, lint, test) - Must pass completely
- ❌ **NEVER use git push --force** - Only use --force-with-lease when absolutely necessary
- ❌ **NEVER implement without task issue** - Must use =plan command first

### 📋 MANDATORY WORKFLOW RULES
- ✅ **ALWAYS** sync staging branch before any implementation: `git checkout staging && git pull origin staging`
- ✅ **ALWAYS** verify task issue exists: `[TASK-XXX-X]` before `=impl`
- ✅ **ALWAYS** use feature branch naming: `feature/task-[number]-[description]`
- ✅ **ALWAYS** ensure 100% build success before commit: `npm run build`
- ✅ **ALWAYS** ensure 100% lint pass before commit: `npm run lint`
- ✅ **ALWAYS** use template-guided workflow with proper context validation
- ✅ **ALWAYS** deploy to staging before production (staging → main only direction)
- ✅ **ALWAYS** target PR to staging branch - NEVER target main branch directly

---

## 📋 Workflow System

### Template Integration
**Context Issue Template** - `/docs/ISSUE-TEMP.md`:
- Used for: `=fcs > [topic-name]` or `=fcs > [ISSUE-XXX]`
- Creates living document for iterative discussion
- Contains: DISCUSSION LOG, ACCUMULATED CONTEXT, PLANNING READINESS CHECKLIST

**Task Issue Template** - `/docs/TASK-ISSUE-TEMP.md`:
- Used for: `=plan > [task description]`
- Creates atomic tasks based on current mode (MANUAL/COPILOT)
- Contains: EXECUTION MODE field, 100% validation requirements

### Mode-Based Execution System
**Default Mode**: MANUAL (human implementation)

**Mode Commands**:
```bash
=mode manual     # Tasks assigned to human developer
=mode copilot     # Tasks assigned to @github-copilot
=mode status      # Show current execution mode
```

**Mode-Specific Behavior**:
- **MANUAL Mode**: `=plan` creates tasks assigned to human, `=impl` triggers Task tool execution (Option B)
- **COPILOT Mode**: `=plan` creates tasks assigned to @github-copilot, `=impl` assigns via GitHub CLI (Option A)

### Core Commands
```bash
# Context Management
=fcs > [topic-name]           # Create new Context Issue using /docs/ISSUE-TEMP.md
=fcs > [ISSUE-XXX]            # Update existing Context Issue using /docs/ISSUE-TEMP.md
=fcs list                     # Show all active Context Issues

# Task Management
=plan > [task description]      # Create Task Issue using /docs/TASK-ISSUE-TEMP.md (assigned by current mode)
=impl > [task-number]          # Implementation workflow (triggers based on current mode)
=impl batch > [task-numbers]   # Parallel execution of multiple tasks (comma-separated)
=impl status                   # Monitor implementation progress across all modes
=pr > [feedback]               # Create Pull Request from pushed feature branch (ALWAYS target staging branch - NEVER main)

# Other Commands
=rrr > [message]              # Create daily retrospective file and Issue
```

### Template-Driven Workflow Process
1. **Phase 1**: `=fcs > [topic]` → Create initial context issue
2. **Phase 2**: `=fcs > [ISSUE-XXX]` → Update context iteratively
3. **Phase 3**: Context reaches `[Ready for Planning]` status → Ready for planning
4. **Phase 4**: `=plan > [task]` → Create atomic tasks
5. **Phase 5**: `=impl > [task-number]` → Implement based on mode

### Dual-Mode Implementation System

#### **Option A: GitHub Copilot Auto-Trigger (COPILOT Mode)**
**Workflow for `=impl` in COPILOT mode:**

1. **Pre-Implementation Checklist**:
   - Verify Task Issue `[TASK-XXX-X]` exists and assigned to @github-copilot
   - Ensure GitHub Copilot is enabled in repository settings
   - Context Issue must be `[Implementation Ready]`

2. **GitHub CLI Assignment**:
   ```bash
   # Assign single task
   gh issue edit [task-number] --assignee "github-copilot" --add-label "copilot,priority-high"

   # Assign multiple tasks (parallel)
   gh issue edit [task-numbers] --assignee "github-copilot" --add-label "copilot,priority-high"
   ```

3. **GitHub Copilot Auto-Execution**:
   - GitHub Copilot picks up assigned tasks automatically
   - Creates feature branches: `feature/task-[XXX]-[X]-[description]`
   - Implements following task specifications exactly
   - Runs 100% validation: build + lint + TypeScript compilation
   - Creates PRs targeting staging branch (NEVER main)
   - Ensures atomic task independence (no conflicts)

4. **Progress Monitoring**:
   ```bash
   gh pr list --author "github-copilot" --base staging
   gh issue list --assignee "github-copilot" --state open
   ```

#### **Option B: Task Tool Execution (MANUAL Mode)**
**Workflow for `=impl` in MANUAL mode:**

1. **Pre-Implementation Checklist**:
   - `git checkout staging && git pull origin staging`
   - Confirm Task Issue `[TASK-XXX-X]` exists and assigned to human
   - Context Issue must be `[Implementation Ready]`
   - `git status` - working directory must be clean

2. **Task Tool Execution**:
   - Triggers specialized agent with task requirements
   - Agent creates feature branch from staging
   - Implements following atomic task specifications
   - Ensures 100% validation pass (build + lint + TypeScript)

3. **Manual PR Creation**:
   - Human commits and pushes changes
   - Uses `=pr` command to create PR targeting staging
   - Human performs final review and merge

#### **Parallel Execution Commands**
```bash
# COPILOT Mode - Parallel assignment
=impl batch > 16,17,18,19    # Assigns all to GitHub Copilot simultaneously

# MANUAL Mode - Parallel execution
=impl batch > 16,17,18,19    # Triggers 4 Task agents in parallel

# Monitor all modes
=impl status                  # Shows progress across all assigned tasks
```

#### **Mode-Specific Validation Requirements**
**BOTH MODES MUST ENSURE:**
- ✅ `npm run build` passes with **ZERO** errors or warnings
- ✅ `npm run lint` passes with **ZERO** violations
- ✅ `npx tsc --noEmit` passes (TypeScript compilation)
- ✅ PRs target **staging branch only** (NEVER main)
- ✅ Atomic task independence (no merge conflicts)
- ✅ Follow CLAUDE.md safety rules exactly

---

## 🏗️ Technical Architecture

### Core Stack
- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Supabase Client SDK)
- **Authentication**: LINE LIFF Native Auth (Zero-Click Registration + Authentication Guard)
- **Storage**: Supabase Storage for images
- **Real-time**: Supabase Realtime subscriptions

### Database Schema
```typescript
// Core Models (simplified calculator-only approach)
members: {
  line_user_id, display_name, registration_date, contact_info
}

products -> price_tiers (One-to-Many): {
  variety_name, size, plant_shape ("กระโดง" | "ข้าง"),
  base_price, is_available_in_store, image_url, is_active
}

price_tiers: {
  product_id, min_quantity, max_quantity, special_price
}

// Note: No order persistence - calculator-only approach
```

### Key Features
- **Zero-Click Registration**: LINE User ID + Display Name auto-registration
- **Authentication Guard**: Non-members blocked from calculator
- **Real-time Calculation**: Dynamic cart with tiered pricing (1-4, 5-9, 10+ quantities)
- **Dual Product Types**: Store plants (available) + Reference plants (market intelligence)
- **Mobile-First**: Optimized for LINE WebView (≤3 seconds load)
- **Cost Optimization**: No LINE Messaging API costs

### Development Commands
```bash
npm run dev          # Development server
npm run build        # Production build (must 100% pass)
npm run lint         # Lint code (must 100% pass)
npm start            # Production server
```

### Environment Variables (Critical - Never Commit)
- `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- LINE LIFF configuration keys
- Any API keys and secrets

---

## 🎯 Quality Standards

### Code Quality Requirements
- **TypeScript**: Strict mode enabled
- **ESLint**: Zero violations allowed
- **Prettier**: Consistent formatting
- **Build**: 100% success rate (zero errors/warnings)
- **Tests**: 100% pass rate when implemented

### UI/UX Requirements
- **Mobile-First**: LINE WebView optimization (320px minimum width)
- **Accessibility**: WCAG 2.1 AA compliance (4.5:1 contrast)
- **Large Touch Targets**: 44px minimum for elderly users
- **Performance**: ≤3 seconds load time on 4G/5G
- **Reduced Motion**: Respect user preferences

### Template-Guided Quality
- **Context Issues**: Complete PLANNING READINESS CHECKLIST ✅
- **Task Issues**: 100% build/lint/test requirements mandatory
- **Mode Execution**: Follow mode-specific behavior exactly
- **Template Consistency**: All issues follow template structures

---

## 📚 Reference Materials

### Templates
- `/docs/ISSUE-TEMP.md` - Context Issue Template for iterative discussions
- `/docs/TASK-ISSUE-TEMP.md` - Atomic Task Template for implementation

### Performance Metrics
- **Target**: LIFF app loads within ≤3 seconds
- **Goal**: 70%+ QR scan to LINE OA member conversion
- **Engagement**: 80%+ members use calculator at least once
- **Database**: Support 10,000+ member registrations

### Security Notes
- **Input Validation**: Zod schemas for all API inputs
- **Authentication**: LINE Native Auth + Row Level Security (RLS)
- **Data Protection**: Encryption in transit, secure storage
- **Access Control**: Role-based permissions

---

*This document focuses on agent-critical information for efficient workflow execution and safe development practices.*