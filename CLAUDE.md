## Project Overview

**Project Name**: Praneet Panmai Line App (Premium Member Calculator)

**Repository**: https://github.com/mojisejr/PlaneetPanmaiLineApp.git
**Supabase Project ID**: fefvihkpzubuqykdjeoj

**Description**: ระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิกเท่านั้น (Members-only Calculator) ผ่าน LIFF สำหรับร้านต้นทุเรียน เพื่อสร้าง premium value ให้กับการเป็นสมาชิก LINE OA และลดต้นทุนการดำเนินงาน (MVP)

---

## ⚠️ CRITICAL SAFETY RULES

### 🚨 FORBIDDEN ACTIONS (NEVER ALLOWED)
- ❌ **NEVER merge PRs yourself** - Provide PR link and wait for user instructions
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
=mode copilot     # Tasks assigned to @copilot
=mode status      # Show current execution mode
```

**Mode-Specific Behavior**:
- **MANUAL Mode**: `=plan` creates tasks assigned to human, `=impl` waits for human implementation
- **COPILOT Mode**: `=plan` creates tasks assigned to @copilot, `=impl` triggers copilot implementation

### Core Commands
```bash
# Context Management
=fcs > [topic-name]           # Create new Context Issue using /docs/ISSUE-TEMP.md
=fcs > [ISSUE-XXX]            # Update existing Context Issue using /docs/ISSUE-TEMP.md
=fcs list                     # Show all active Context Issues

# Task Management
=plan > [task description]      # Create Task Issue using /docs/TASK-ISSUE-TEMP.md (assigned by current mode)
=impl > [task-number]          # Implementation workflow (triggers based on current mode)
=pr > [feedback]               # Create Pull Request from pushed feature branch

# Other Commands
=rrr > [message]              # Create daily retrospective file and Issue
```

### Template-Driven Workflow Process
1. **Phase 1**: `=fcs > [topic]` → Create initial context issue
2. **Phase 2**: `=fcs > [ISSUE-XXX]` → Update context iteratively
3. **Phase 3**: Context reaches `[Ready for Planning]` status → Ready for planning
4. **Phase 4**: `=plan > [task]` → Create atomic tasks
5. **Phase 5**: `=impl > [task-number]` → Implement based on mode

### Implementation Workflow (MANDATORY)
**Pre-Implementation Checklist**:
1. **Staging Sync**: `git checkout staging && git pull origin staging`
2. **Task Verification**: Confirm Task Issue `[TASK-XXX-X]` exists and is linked to Context Issue
3. **Context Status**: Verify Context Issue is `[Ready for Planning]` or `[Implementation Ready]`
4. **Environment Check**: `git status` - working directory must be clean

**Implementation Steps**:
1. **Create Feature Branch**: `git checkout -b feature/task-[number]-[description]`
2. **Execute Implementation**: Follow task requirements, use TodoWrite for complex tasks
3. **Quality Validation**: `npm run build` (100% pass) + `npm run lint` (100% pass) + `npx tsc --noEmit`
4. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: [feature description]

   - Address TASK-XXX-X: [task title]
   - Build validation: 100% PASS
   - Linter validation: 100% PASS

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```
5. **Push Branch**: `git push -u origin feature/task-[number]-[description]`

**Post-Implementation**:
- **MANUAL Mode**: User commits and pushes, then uses `=pr` to create PR
- **COPILOT Mode**: Agent handles complete implementation including PR creation via `=pr`

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