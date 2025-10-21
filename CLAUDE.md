## Project Overview

**Project Name**: Praneet Panmai Line App (Premium Member Calculator)

**Repository**: https://github.com/mojisejr/PlaneetPanmaiLineApp.git
**Supabase Project ID**: fefvihkpzubuqykdjeoj

**Description**: ระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิกเท่านั้น (Members-only Calculator) ผ่าน LIFF สำหรับร้านต้นทุเรียน เพื่อสร้าง premium value ให้กับการเป็นสมาชิก LINE OA และลดต้นทุนการดำเนินงาน (MVP)

**Project Goals**:

- เพิ่มจำนวนสมาชิก LINE OA ที่ลงทะเบียนเข้าสู่ระบบ (Member Acquisition)
- สร้าง premium value ให้สมาชิกเข้าถึงเครื่องคำนวนราคาพิเศษ (Premium Member Value)
- สร้างฐานข้อมูลลูกค้าเพื่อใช้ในการสื่อสารและการตลาดในระยะยาว
- ทดสอบประสิทธิภาพของระบบ Zero-Click Registration ผ่าน LINE LIFF
- ลดต้นทุนการดำเนินงานโดยไม่ต้องส่ง LINE messages (Cost Optimization)

---

### Development Guidelines

**⚠️ CRITICAL: Synchronize Time Before Any File Operations**

Before creating a new file or saving any timestamps, you **MUST** use the following command to retrieve the current date and time from the system:

```bash
date +"%Y-%m-%d %H:%M:%S"
```

#### File Naming Conventions

- **Log Files**: `YYYY-MM-DD-[type].log`
- **Backup Files**: `backup-YYYY-MM-DD-HHMM.sql`
- **Migration Files**: Follow Prisma naming conventions

#### Important Notes

- **ALL timestamps** in documentation, logs, and file names must use your local timezone
- **Year format** must be consistent
- **Development sessions** should reference local time

---

## Architecture Overview

### Core Structure

- **Framework**: Next.js 14 (App Router)
- **Frontend/Framework**: React 18 with TypeScript
- **UI Components**: shadcn/ui component library
- **Backend/Database**: Supabase (PostgreSQL + Supabase Client SDK)
- **Authentication**: LINE LIFF Native Auth (Zero-Click Registration + Authentication Guard)
- **Styling**: Tailwind CSS with shadcn/ui + Custom Nature Theme (OKLCH color space)
- **Logic Layer**: Supabase Client SDK with Real-time subscriptions

### Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL database + Supabase Client SDK)
- **API**: Next.js API Routes + Supabase Client SDK (Calculator & Admin only)
- **Authentication**: LINE LIFF Native Authentication (Zero-Click Registration + Authentication Guard)
- **Real-time**: Supabase Realtime subscriptions
- **UI/UX**: Mobile-First Design optimized for LINE WebView (Elderly-friendly)
- **Cost Optimization**: No LINE Messaging API costs (Calculator-only approach)

### Database Schema

#### Core Models

- **members**: ข้อมูลสมาชิก (line_user_id, display_name, registration_date, contact_info)
- **products**: รายการต้นทุเรียน (id, variety_name, size, plant_shape, base_price, is_available_in_store, image_url, is_active)
- **price_tiers**: โปรโมชั่นราคาตามจำนวน (product_id, min_quantity, max_quantity, special_price)

**Note**: No order persistence - calculator-only approach with no quotes/quote_items tables

### Frontend User Journeys

- **Registration Flow**: Scan QR Code → Add LINE OA → Open LIFF App → Zero-Click Member Registration
- **Authentication Guard**: Non-members are blocked from accessing calculator
- **Product Browse Flow**: Home Page → View Product Catalog (Store vs Market Plants) → Check Prices & Promotions
- **Calculator Flow**: Select Products → Adjust Quantities → Real-time Price Calculation → (No order saving)
- **Market Intelligence**: View Reference Plant Prices from Market → Compare with Store Prices
- **Contact Navigation**: View Contact Info → Get Directions → Facebook Link
- **Admin Flow**: Login Admin Panel → Manage Plants (Store + Reference) → Update Prices & Promotions

---

## 🗄️ Database Architecture

### PostgreSQL with Supabase Client SDK

#### Key Features

- **Type-safe Database Access**: Supabase Client SDK with full TypeScript support
- **Real-time Subscriptions**: Live data updates for calculator and admin panel
- **Row Level Security (RLS)**: Built-in authentication and authorization
- **Direct Database Access**: MCP tools for direct database management

#### Database Models Structure

```typescript
// Member Management
members -> (no quotes)  // Calculator-only approach, no order persistence

// Product Management
products -> price_tiers (One-to-Many) // Product has multiple price tiers
products.field: plant_shape ("กระโดง" | "ข้าง") // Plant shape variants
products.field: is_available_in_store (boolean) // Store vs Market plants

// Price Calculation (Real-time)
// No quote_items - calculation happens in frontend only
// price_tiers used for tiered pricing lookup
```

**Note**: Simplified structure with no order tracking - focus on calculator functionality

---

## 📁 File Storage System

### Supabase Storage Integration

- **Image Uploads**: Product photos (durian varieties), technique demonstration images
- **File Types**: JPEG, PNG for product images and promotional materials
- **Access Control**: Public read access with secure upload endpoints
- **URL Generation**: Supabase storage URLs for product image serving

---

## 🎨 UI/UX Design System

### Tailwind CSS + shadcn/ui

- **Component Library**: shadcn/ui components for consistent design
- **Responsive Design**: Mobile-first approach optimized for LINE WebView
- **Typography**: Consistent font hierarchy and spacing
- **Accessibility**: Built-in WCAG compliance and reduced motion support

### LINE LIFF Integration

- **Authentication**: LINE Native Auth for Zero-Click Registration
- **WebView Optimization**: Optimized for LINE in-app browser (≤3 seconds load time)
- **Mobile-First**: Designed specifically for mobile LINE users including elderly farmers
- **QR Code Integration**: Seamless QR code scanning to OA addition flow

### Visual Design Validation Requirements

**CRITICAL**: Visual design quality is equally important as functional implementation, especially for customer-facing features.

#### Pre-Implementation Design Checklist

✅ Color contrast validation (WCAG 2.1 AA compliance)
✅ Accessibility standards verification
✅ Responsive design across device sizes
✅ Typography hierarchy consistency
✅ Animation performance optimization
✅ Reduced motion preference support

#### Design Quality Assurance Process

**3-Phase Approach**:

1. **Design System Integration**: Follow component patterns, centralized utilities (60% duplication reduction)
2. **Accessibility Implementation**: WCAG 2.1 AA compliance (4.5:1 contrast), keyboard navigation, screen reader support, reduced motion
3. **Performance Optimization**: 60fps animations, bundle size monitoring, critical CSS, responsive images

### Centralized Styling Architecture

- **Utility-Based System**: Centralized styling utilities for consistent design
- **TypeScript Interfaces**: Proper typing for styling configurations
- **Accessibility Integration**: Built-in WCAG compliance and reduced motion support
- **Duplication Reduction**: Proven efficiency through centralized approach

### Design Review Integration

**Visual Review Steps**: Browser preview, contrast analysis, multi-device testing, accessibility testing, motion testing

**Common Pitfalls to Avoid**: Poor color choices, inconsistent spacing, animation overuse, desktop-only thinking, accessibility afterthoughts

---

## 🛠️ Development Commands

### Core Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Database Management (Supabase Client SDK)

```bash
# List all Supabase projects
mcp__supabase__list_projects

# Create database tables via migrations
mcp__supabase__apply_migration [project_id] [migration_name] [sql_query]

# Execute SQL directly
mcp__supabase__execute_sql [project_id] [sql_query]

# List tables in database
mcp__supabase__list_tables [project_id]

# Get project configuration
mcp__supabase__get_project [project_id]
mcp__supabase__get_project_url [project_id]
mcp__supabase__get_anon_key [project_id]
```

### Sanity CMS

```bash
# Start Sanity development server
npm run sanity:dev

# Build Sanity studio
npm run sanity:build

# Deploy Sanity studio
npm run sanity:deploy
```

---

## 🔄 Development Workflow

### Shortcut Commands (Agent-Driven Workflow)

These commands streamline development with GitHub-based context tracking:

- **`=fcs > [topic-name]`**: Creates new GitHub issue `[XXXX] [topic-name]` for context tracking
- **`=fcs > [XXXX]`**: Updates existing context issue by number  
- **`=fcs list`**: Shows all active context issues
- **`=fcs recent`**: Shows recent context issues
- **`=plan > [question/problem]`**: Creates/Updates GitHub Task Issue with detailed action plan
- **`=impl > [message]`**: Iterative implementation workflow (creates feature branch, executes from GitHub issue)
- **`=pr > [feedback]`**: Pull request and integration workflow
- **`=stage > [message]`**: Staging deployment workflow
- **`=prod > [message]`**: Production deployment workflow
- **`=rrr > [message]`**: Creates daily retrospective file and GitHub Issue

### GitHub Context Tracking Features

- **Pure GitHub Storage**: No local context files needed
- **Issue Naming**: `[XXXX] [topic-name]` format for easy identification
- **Stateless**: Works from any machine with GitHub access
- **Collaborative**: Team members can view and contribute to context
- **Searchable**: Full GitHub search capabilities for context history

### Workflow Features

- **GitHub Context + Task Issue Pattern**: All context lives in GitHub issues
- **Automated Branch Management**: Feature branches created from staging
- **Iteration Tracking**: Progress tracking with TodoWrite integration
- **Staging-First Deployment**: All features go through staging before production

### Git Workflow

- **Main Branch**: Production-ready code
- **Staging Branch**: Pre-production validation
- **Feature Branches**: `feature/[issue-number]-[description]` for new features
- **Development**: Work on feature branches, create PRs to staging → main

### Code Quality

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Code formatting with consistent style
- **Supabase Client SDK**: Type-safe database operations

---

## ⚠️ CRITICAL SAFETY RULES

### NEVER MERGE PRS YOURSELF

**DO NOT** use any commands to merge Pull Requests, such as `gh pr merge`. Your role is to create a well-documented PR and provide the link to the user or await user instructions.

**ONLY** provide the PR link to the user and **WAIT** for explicit user instruction to merge. The user will review and merge when ready.

### DO NOT DELETE CRITICAL FILES

You are **FORBIDDEN** from deleting or moving critical files and directories in the project. This includes, but is not limited to: `.env`, `.git/`, `node_modules/`, `package.json`, `lib/database/`, and the main project root files.

### HANDLE SENSITIVE DATA WITH CARE

You must **NEVER** include sensitive information such as API keys, passwords, or user data in any commit messages, Pull Request descriptions, or public logs. Always use environment variables for sensitive data.

**Critical Environment Variables**:
- `DATABASE_URL`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_READ_TOKEN`
- Any other API keys and secrets

### STICK TO THE SCOPE

You are instructed to focus **ONLY** on the task described in the assigned task. Do not perform refactoring or new feature development unless explicitly part of the plan.

### BRANCH SAFETY

**MANDATORY STAGING BRANCH SYNC**: Before any implementation (`=impl`), you **MUST** ensure the local staging branch is synchronized with remote origin.

**STAGING-FIRST WORKFLOW**: All implementations work exclusively with staging branch. **NEVER** create PRs to main branch during implementation.

**FORCE PUSH RESTRICTIONS**: Only use `git push --force-with-lease` when absolutely necessary. **NEVER** use `git push --force`.

**HIGH-RISK FILE COORDINATION**: Files requiring team coordination include:
- `src/app/page.tsx`, `src/app/layout.tsx` (main app structure)
- `package.json`, `yarn.lock` (dependency management)
- `lib/database/schema.ts` (database schema types)
- `.env.example`, configuration files

### AUTOMATED WORKFLOW SAFETY

**BRANCH NAMING ENFORCEMENT**: All feature branches **MUST** follow the pattern `feature/[issue-number]-[description]`.

**COMMIT MESSAGE STANDARDS**: All commits **MUST** include:
- Clear, descriptive subject line (max 50 characters)
- Reference to related issue number
- Type prefix: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`

**CRITICAL RULES**:
- **NEVER** work directly on main/staging branches
- **ALWAYS** create feature branches from staging
- **ALWAYS** deploy to staging before production

### CRITICAL WORKFLOW SAFETY

**🚨 NEVER MERGE MAIN → STAGING**: See `docs/git-workflow.md`
**🔍 STAGING SYNC VALIDATION**: See `docs/conflict-prevention.md`
**🚨 EMERGENCY RECOVERY**: See `docs/conflict-prevention.md#recovery`

**Key Rules**:
- staging → main (ONLY direction)
- feature → staging (integration)
- NEVER main → staging (forbidden)

---

## 🌿 Enhanced Workflow Implementation

### Multi-Phase Implementation Strategy

**Proven 5-Phase Approach** (15-34 minute sessions):

1. **Analysis & Preparation** (5-8 min): Component analysis, dependency mapping
2. **Core Implementation** (8-15 min): Primary changes, API updates
3. **Integration & Testing** (3-8 min): Build validation, error resolution
4. **Documentation & Cleanup** (2-5 min): Commits, documentation
5. **Review & Validation** (1-2 min): Final validation

### TodoWrite Integration Patterns

**High-Impact Usage**: Complex refactoring (3+ files), multi-phase implementations, large system changes

**Workflow Pattern**:
1. Break into 5-12 manageable todos
2. Mark exactly ONE todo in_progress → completed
3. Provides real-time visibility and accountability
4. Enables accurate time estimation

**High-Impact TodoWrite Usage Patterns**:
✅ Complex multi-component refactoring (3+ files)
✅ Full-stack implementations (API + Frontend)
✅ Multi-phase system changes (Database + Application)
✅ Large refactoring with dependency management

### Branch Management Excellence

- **ALWAYS** create feature branches: `feature/[issue-number]-[description]`
- **NEVER** work directly on main branch
- **Workflow**: Analysis → Branch → Implementation → Build → Commit → PR → Updates

---

## 🔧 Key Features Implementation

### LINE LIFF Authentication System (Zero-Click Registration + Authentication Guard)

- **Native LINE Login**: Seamless authentication without password requirements
- **Automatic Member Registration**: Zero-click registration using LINE User ID and Display Name
- **QR Code Integration**: Scan QR Code → Add LINE OA → Open LIFF App → Auto Registration
- **Authentication Guard**: Non-members are blocked from accessing premium calculator
- **WebView Optimization**: Optimized experience within LINE application (≤3 seconds load)

### Premium Member Calculator (Members-Only)

- **Authentication Guard**: Only LINE OA members can access the calculator
- **Real-time Price Calculation**: Dynamic cart with instant price calculation based on quantity
- **Tiered Pricing Logic**: Automatic application of promotional pricing (1-4, 5-9, 10+ quantities)
- **Plant Shape Variants**: Support for "กระโดง" (central) and "ข้าง" (side) plant shapes
- **No Order Persistence**: Calculator-only approach without saving data to backend
- **Cost Optimization**: No LINE Messaging API costs

### Product Catalog System (Store + Reference)

- **Dual Product Types**: Store plants (available for purchase) + Reference plants (market intelligence)
- **Mobile-First Catalog**: Display durian varieties with images, prices, and descriptions
- **Large Button Interface**: Elderly-friendly design with large touch targets
- **Real-time Price Display**: Show base prices and promotional tier pricing
- **Product Images**: High-quality photos for each durian variety
- **Market Comparison**: Compare store prices with reference market prices

### Admin Panel (Plants Management)

- **Plant Management**: Add/edit/delete durian varieties with plant shape and availability flags
- **Price Tier Configuration**: Set up promotional pricing based on quantity
- **Store vs Reference**: Manage which plants are available in store vs market reference
- **Member Database**: Access registered member information for marketing
- **Multi-Shop Ready**: Scalable architecture for future shop expansion

### Contact & Navigation

- **Store Location**: Direct Google Maps integration for shop location
- **Social Media Links**: Facebook page integration for marketing
- **Contact Information**: Clear display of shop contact details
- **Operating Hours**: Store hours and special event information

---

## 📊 Data Models

### Product Categories

- **Durian Varieties**: Different durian types (Monthong, Chanee, Kan Yao, etc.)
- **Size Classifications**: Product sizes (Small, Medium, Large, Extra Large)
- **Grade Levels**: Quality grades for each product type
- **Seasonal Products**: Time-sensitive product availability

### Member Data System

- **Registration Tracking**: Automatic capture of LINE User ID and registration timestamp
- **Purchase History**: Order history for customer relationship management
- **Contact Preferences**: Optional contact information for marketing
- **Loyalty Tracking**: Foundation for future loyalty program implementation

### Pricing Structure

- **Base Pricing**: Standard pricing for each product variant
- **Volume Discounts**: Tiered pricing based on quantity purchased
- **Promotional Pricing**: Special event or seasonal pricing
- **Dynamic Pricing**: Real-time price calculation engine

---

## 🚀 Deployment Architecture

### Next.js Deployment

- **Static Generation**: Optimized pages for better performance
- **Server Components**: Next.js 14 App Router for efficient server-side rendering
- **Environment Variables**: Secure configuration management for Supabase and LINE
- **Database**: Supabase PostgreSQL with managed connection pooling

### Supabase Storage

- **Image Storage**: Scalable file storage for solution images and demonstrations
- **Public URLs**: Direct access to stored images for optimal performance
- **Security**: Row-level security and access control policies

---

## 📈 Performance Optimization

### Frontend Optimizations

- **Code Splitting**: Automatic code splitting with Next.js App Router
- **Image Optimization**: Next.js Image component for product photos
- **Performance Target**: LIFF App loads within ≤3 seconds on 4G/5G networks
- **Bundle Analysis**: Regular bundle size monitoring for mobile LINE users
- **Large Touch Targets**: Optimized for elderly users with accessibility focus

### Backend Optimizations

- **Database Indexing**: Optimized queries on products, members, and quotes tables
- **Connection Pooling**: Supabase managed database connection pooling
- **Stored Procedures**: Real-time price calculations in database layer
- **Real-time Updates**: Supabase real-time for live cart and pricing updates
- **Scalability**: Database supports 10,000+ member registrations in MVP phase

---

## ⚡ Efficiency Patterns & Performance Optimization

### 15-Minute Implementation Strategy

**Results**: 15-minute implementations vs 34+ minute baseline

**Prerequisites**: Reference pattern, TodoWrite initialized, component structure analyzed, integration points identified

**Speed Optimization Techniques**:

1. **Pattern Recognition**: 56% faster when following proven patterns
2. **MultiEdit**: Batch multiple edits instead of sequential single edits
3. **Systematic Analysis**: 2-3 minute analysis of target areas and integration points
4. **Build Validation**: `npm run build` after major changes, `npx tsc --noEmit` for type checking

### High-Impact Optimization Areas

#### TodoWrite Integration ROI

- **Setup Time**: 2-3 minutes
- **Visibility Benefit**: Real-time progress tracking
- **Accountability**: Prevents skipping critical steps
- **Stakeholder Communication**: Clear progress indicators
- **Proven Results**: 56% faster implementations documented

#### Reference Pattern Utilization

- **Pattern Documentation**: Create detailed retrospectives for reusable approaches
- **Pattern Library**: Maintain reference files as implementation guides
- **Systematic Replication**: Follow proven approaches exactly
- **Context Adaptation**: Modify only necessary elements

#### Tool Optimization

- **Efficient Pattern**: Read (targeted) → MultiEdit (batch) → Build (validation)
- **Avoid**: Multiple single Edits → Multiple Reads → Late build testing

### Efficiency Factor Analysis

**High Efficiency Sessions** (15-20 minutes):
- ✅ TodoWrite usage for progress tracking
- ✅ Reference pattern available
- ✅ Clear component structure understanding
- ✅ Systematic 5-phase approach
- ✅ Proactive build validation

**Low Efficiency Sessions** (45+ minutes):
- ❌ No reference pattern
- ❌ Schema assumptions without verification
- ❌ Working directly on main branch
- ❌ Build testing only at end
- ❌ Complex dependency analysis needed

---

## 🛡️ Security Considerations

### Data Protection

- **Input Validation**: Zod schemas for all API inputs
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **File Upload Security**: Type validation and size limits
- **Authentication**: Secure user authentication and authorization

### Privacy & Compliance

- **Data Encryption**: Sensitive data encryption in transit
- **Access Control**: Role-based access to different features
- **Audit Logs**: Track important system activities
- **Data Retention**: Proper data lifecycle management

---

## 🛡️ Security Implementation Methodology

### Systematic Security Audit Approach

**8-Phase Security Audit Process** (31-minute comprehensive audits):

1. **Infrastructure Analysis** (2-3 min): Environment variables, database schema, authentication
2. **Core Endpoint Analysis** (5-8 min): Input validation, rate limiting, error handling, authorization
3. **Data Integrity Analysis** (3-5 min): Transaction security, data flow assessment, logging
4. **Compliance Assessment** (3-5 min): Industry standards and regulations
5. **Vulnerability Testing** (5-8 min): Injection prevention, authentication bypass, authorization
6. **Security Implementation** (8-12 min): Rate limiting, input validation, error hardening
7. **Build Validation** (2-3 min): TypeScript compilation, dependency validation
8. **Documentation & Reporting** (3-5 min): Security audit report, compliance metrics

### Enterprise-Grade Security Measures

#### Critical Security Implementations

- **Rate Limiting**: 15-minute windows, configurable limits per endpoint
- **Input Validation**: Comprehensive Zod schemas for all API endpoints
- **Secure Error Handling**: Generic error responses prevent information disclosure
- **File Upload Security**: Type validation, size limits, and secure storage

### Security Best Practices

**Key Security Areas**:

- **Webhook Security**: Validate signatures, prevent replay attacks, never log secrets
- **File Upload System**: Server-side validation, secure storage, access control
- **Error Handling**: Generic error responses, sanitized logging
- **Data Protection**: Encryption in transit, secure storage of sensitive data

---

## 🔍 Monitoring & Debugging

### Error Handling

- **Global Error Boundaries**: React error boundaries for UI errors
- **API Error Handling**: Consistent error responses
- **Logging**: Structured logging for debugging
- **Performance Monitoring**: Track application performance

### Development Tools

- **Prisma Studio**: Database inspection and management
- **React DevTools**: Component state debugging
- **Network Tab**: API request/response monitoring
- **Console Logging**: Development-time debugging information

---

## 📝 Documentation Standards

### Code Documentation

- **TypeScript Comments**: JSDoc comments for functions and types
- **API Documentation**: tRPC auto-generated API documentation
- **Database Schema**: Supabase database structure as source of truth
- **Component Documentation**: Storybook-style component documentation

### Project Documentation

- **README**: Project setup and usage instructions
- **CHANGELOG**: Track important changes and updates
- **CONTRIBUTING**: Guidelines for contributors
- **DEPLOYMENT**: Deployment instructions and checklists

---

## 📈 Success Metrics & KPIs

### MVP Success Targets

- **LINE OA Member Growth Rate**: ≥70% of market visitors scan QR Code and become LINE OA members
- **Premium Calculator Usage Rate**: ≥80% of new members must use the price calculator functionality at least once
- **Lead Generation Value**: ≥50% of calculations represent potential sales interests of 100-500 THB
- **Market Intelligence Access**: ≥30% of members check market plant prices for comparison
- **Performance Target**: LIFF App loads within ≤3 seconds on 4G/5G networks
- **User Satisfaction**: Elderly users can complete plant selection and price calculation within 2 minutes

### Technical Performance Metrics

- **Database Scalability**: Support 10,000+ member registrations in MVP phase
- **Load Time Performance**: Consistent ≤3 second load times across devices
- **Conversion Rate**: QR Code scan → Member Registration completion rate
- **Calculator Engagement**: Monitor member interaction with premium calculator features
- **Cost Optimization**: Zero LINE Messaging API costs through calculator-only approach

---

## 📈 Retrospective Workflow

When you use the `=rrr` command, the agent will create a file and an Issue with the following sections and details:

### Retrospective Structure

**Required Sections**:

- **Session Details**: Date (YYYY-MM-DD local timezone), Duration, Focus, Issue/PR references
- **Session Summary**: Overall work accomplished
- **Timeline**: Key events with local timestamps
- **📝 AI Diary** (MANDATORY): First-person reflection on approach and decisions
- **💭 Honest Feedback** (MANDATORY): Performance assessment and improvement suggestions
- **What Went Well**: Successes achieved
- **What Could Improve**: Areas for enhancement
- **Blockers & Resolutions**: Obstacles and solutions
- **Lessons Learned**: Patterns, mistakes, and discoveries

**File Naming**: `session-YYYY-MM-DD-[description].md` with local date

---

## 📚 Best Practices from Retrospectives

### TodoWrite Integration Best Practices

**Results**: **15-minute implementations** vs 34+ minute sessions

**When to Use**: Complex multi-step tasks (3+ phases), multi-component refactoring, full-stack implementations, large refactoring projects, security audits, database migrations

**Workflow Pattern**:

1. Break into 5-12 manageable todos
2. Mark exactly ONE todo in_progress → completed
3. Provides real-time visibility and accountability
4. Enables accurate time estimation

**Proven Benefits**: 56% faster implementation, reduces context switching, prevents missing steps, ensures comprehensive testing

### Pattern Replication Strategy

#### Reference Implementation Approach

1. **Document Successful Patterns**: Create detailed retrospectives for reusable approaches
2. **Systematic Replication**: Use previous session files as implementation guides
3. **Adapt, Don't Recreate**: Modify proven patterns for new contexts
4. **Measure Efficiency**: Track implementation time improvements

### Build Validation Checkpoints

#### Critical Validation Points

- **Schema Changes**: `npm run build && npx tsc --noEmit`
- **API Modifications**: `npm run build 2>&1 | grep -A 5 "error"`
- **Large Refactoring**: `npm run build` (with Supabase Client SDK validation)

#### Proactive Testing Strategy

- **Incremental Builds**: Test builds after each major change, not just at the end
- **TypeScript Validation**: Run `npx tsc --noEmit` for pure type checking
- **Dependency Verification**: Check imports and exports after file restructuring
- **Database Sync**: Verify Supabase Client SDK connection after schema changes

### Schema Investigation Protocol

#### Before Implementation Checklist

1. **Verify Database Schema**: Always check actual Prisma schema definitions
2. **Trace Data Structures**: Follow interface definitions through the codebase
3. **Validate Field Names**: Don't assume field naming conventions
4. **Check Relationships**: Understand model relationships before querying

#### Common Schema Pitfalls

- **Assumption Errors**: Making assumptions about field names/structures
- **Interface Misalignment**: Frontend interfaces not matching database schema
- **Relationship Complexity**: Not understanding foreign key relationships
- **Type Mismatches**: TypeScript interfaces not reflecting actual data structures

### Multi-Phase Implementation Approach

#### Systematic Phase Breakdown

- **Phase 1**: Analysis & Preparation (10-15%)
- **Phase 2**: Core Implementation (40-50%)
- **Phase 3**: Integration & Testing (25-30%)
- **Phase 4**: Documentation & Cleanup (10-15%)

#### Phase Management Best Practices

- **Clear Phase Objectives**: Define specific deliverables for each phase
- **Dependency Mapping**: Identify cross-phase dependencies upfront
- **Progress Checkpoints**: Validate phase completion before proceeding
- **Issue Tracking**: Update GitHub issues after each phase completion

### Database Best Practices

#### PostgreSQL Sequence Management

- **Check Sequence**: `SELECT last_value FROM "TableName_id_seq";`
- **Reset Sequence**: `SELECT setval('"TableName_id_seq"', COALESCE(MAX(id), 0) + 1) FROM "TableName";`
- **Common Issue**: Auto-increment sequences become desynchronized after manual insertions

### Documentation Standards

#### PR Description Requirements

- **Implementation Summary**: Clear overview of changes made
- **Technical Details**: Specific technical implementation notes
- **Before/After Analysis**: Impact assessment and improvement metrics
- **Testing Validation**: Build success and functionality verification
- **Iteration Note Summary**: Key decisions and hurdles from development

#### Retrospective Documentation

- **AI Diary**: First-person reflection on approach and decision-making
- **Honest Feedback**: Critical assessment of session efficiency and quality
- **Pattern Recognition**: Identification of reusable patterns and approaches
- **Lessons Learned**: Specific insights for future implementation improvement