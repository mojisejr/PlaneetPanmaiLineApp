# GitHub Context Issue Template for Iterative Discussion
**Template for creating and evolving context through multi-session discussions**

---

## 🎯 [ISSUE-XXX] Database Schema Design for LINE LIFF Calculator

### 🎯 CONTEXT OBJECTIVE
**Goal หลักที่ต้องการทำ:**
- ออกแบบ Database Schema สำหรับระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิก (Members-only Calculator)
- กำหนดโครงสร้างข้อมูลที่รองรับ LINE LIFF integration, tiered pricing, และ authentication guard
- สร้าง foundation ที่พร้อมสำหรับ 7-phase development จาก Issue #2

### 📝 DISCUSSION LOG
**Session Timeline:**
- **Initial Session**: 2025-10-21 22:47 - เริ่ม discuss database schema design
- [สามารถเพิ่มได้ตามจำนวน discussion sessions]

### 🔄 CURRENT STATUS
**Context Phase**:
- `[Planning]` - กำลังวางแผน/ปรึกษา

**Last Updated**: 2025-10-21 22:47

### 📋 ACCUMULATED CONTEXT
**Requirements ที่ได้จากการ discuss:**
- **Members-only Authentication**: ต้องเก็บ LINE User ID และ Display Name สำหรับ Zero-Click Registration
- **Calculator-first Approach**: เน้นคำนวณราคา ไม่เก็บประวัติการสั่งซื้อ (E-commerce approach)
- **Tiered Pricing System**: รองรับราคาแบบขั้นบันได (1-4, 5-9, 10+ ต้น)
- **Dual Product Types**: แยกระหว่างต้นที่มีขายในร้าน vs ต้นอ้างอิง (market intelligence)
- **LINE LIFF Integration**: ต้องเชื่อมต่อกับ LINE authentication และ LIFF environment

**Technical Decisions:**
- **Database**: Supabase PostgreSQL ตาม Project ID: fefvihkpzubuqykdjeoj
- **Approach**: Calculator-only, no order persistence (in-memory cart)
- **Authentication**: LINE LIFF Native Auth with Row Level Security (RLS)
- **Performance**: Mobile-first optimization for LINE WebView (≤3 seconds load)

**Constraints & Assumptions:**
- **Development Timeline**: 4 สัปดาห์สำหรับ MVP (Issue #2)
- **Testing Strategy**: Manual-first approach (80% manual, 20% automated)
- **Platform Constraint**: LINE LIFF WebView environment
- **Business Model**: Premium value for LINE OA members only

**Scope Boundaries:**
**IN SCOPE:**
- Members registration & authentication (LINE User ID + Display Name)
- Product catalog with pricing information
- Tiered pricing structure for bulk calculations
- In-memory cart calculation (real-time)
- Mobile-optimized UI for LINE WebView

**OUT OF SCOPE:**
- Order history / transaction persistence
- Payment processing integration
- LINE Messaging API (cost optimization)
- Inventory management system
- Advanced analytics/reporting

### 🏗️ TECHNICAL ARCHITECTURE
**System Components:**
- **Frontend Components**: LIFF app, Calculator UI, Product Catalog, Authentication Guard
- **Backend Services**: Supabase Client SDK, Authentication middleware, Real-time pricing API
- **Database Models**: members, products, price_tiers tables
- **External Integrations**: LINE LIFF SDK, Supabase Authentication

**Architecture Patterns:**
- **Mobile-First**: Progressive Web App in LINE WebView
- **Zero-Click Registration**: Auto member registration on first LIFF access
- **Real-time Calculation**: In-memory cart with live price updates
- **Authentication Guard**: Block non-members from premium calculator

**Key Technical Requirements:**
- **Performance**: ≤3 seconds load time on 4G/5G
- **Security**: Row Level Security (RLS) for members-only data access
- **Scalability**: Support 10,000+ member registrations
- **Compatibility**: LINE LIFF WebView on iOS/Android

### 🎯 IMPLEMENTATION DIRECTIONS
**Breaking Down Strategy:**
- Phase 1: Database schema + Next.js + Supabase foundation
- Phase 2: LINE LIFF integration and basic authentication
- Phase 3: Zero-click member registration
- Phase 4: Authentication guard implementation
- Phase 5-6: Product catalog + Calculator engine
- Phase 7: Admin panel for content management

**Risk Areas Identified:**
- **LINE LIFF Environment**: WebView-specific bugs and limitations
- **Authentication Flow**: Ensuring seamless zero-click registration
- **Mobile Performance**: Calculator responsiveness under network constraints
- **Data Sync**: Real-time pricing updates in mobile environment

**Success Criteria:**
- **MVP Delivery**: Functional calculator in 4 weeks
- **User Conversion**: 70%+ QR scan to LINE OA member conversion
- **Performance**: 80%+ calculator loads within 3 seconds
- **Member Engagement**: 80%+ members use calculator at least once

### 📚 REFERENCE MATERIALS
**Documentation:**
- Issue #2: [ISSUE-008] LINE LIFF Development Strategy & Testing Approach
- CLAUDE.md: Project development guidelines and safety rules
- LINE LIFF Documentation: https://developers.line.biz/en/docs/liff/
- Supabase Documentation: https://supabase.com/docs

**Code Examples:**
- Database Schema (proposed):
  ```sql
  members: { line_user_id, display_name, registration_date, contact_info }
  products: { variety_name, size, plant_shape, base_price, is_available_in_store }
  price_tiers: { product_id, min_quantity, max_quantity, special_price }
  ```
- Tiered Pricing Logic: base_price × (1.0, 0.9, 0.8) for (1-4, 5-9, 10+)

**External Resources:**
- Environment Variables: Already configured in .env file
- Supabase Project: fefvihkpzubuqykdjeoj (ready for use)
- LINE LIFF App ID: 1655867694-GN01wkQB (configured)

### 🔄 SESSION NOTES
**Notes from 2025-10-21 22:47 Session:**
- **สิ่งที่คุยกันใน session นี้:**
  - Database schema design for MVP calculator
  - Table structures: members, products, price_tiers
  - Business logic validation for tiered pricing
  - Architecture decisions (calculator-first vs e-commerce)
- **Decisions ที่ทำใน session นี้:**
  - Database Schema Approved: 3 tables with relationships
  - Calculator-first approach confirmed (no order persistence)
  - Row Level Security (RLS) policies defined
  - Tiered pricing logic finalized
- **Questions ที่ยังไม่ตอบ:**
  - การ migrate schema ไป Supabase จริง
  - Sample data generation strategy
  - Index optimization strategy

**Action Items:**
- [ ] Create GitHub Issue from this context for tracking
- [ ] Validate database schema with real Supabase project
- [ ] Prepare database migration scripts
- [ ] Generate sample data for testing

**Next Session Focus:**
- การ migrate database schema ไปยัง Supabase จริง
- การสร้าง sample data สำหรับ development
- การตั้งค่า RLS policies ใน Supabase dashboard
- Integration testing กับ LINE LIFF environment

### 📋 PLANNING READINESS CHECKLIST
✅ **Requirements are clear and complete**
- [x] All functional requirements are documented
- [x] Non-functional requirements are identified
- [x] User stories/use cases are clear

✅ **Technical approach is validated**
- [x] Architecture decisions are confirmed
- [x] Technology stack is selected
- [x] Implementation patterns are defined

✅ **Dependencies are identified**
- [x] External dependencies are listed
- [x] Internal dependencies are mapped
- [x] Blocking factors are acknowledged

✅ **Scope boundaries are defined**
- [x] IN SCOPE items are clearly listed
- [x] OUT OF SCOPE items are explicitly excluded
- [x] Success criteria are measurable

✅ **Risk areas are acknowledged**
- [x] Technical risks are identified
- [x] Mitigation strategies are discussed
- [x] Timeline constraints are realistic

**Overall Planning Status**:
**[Ready for Planning]** - เมื่อ checklist ครบทุกข้อ

### 🔗 RELATED ISSUES
- **Parent Issue**: #2 - [ISSUE-008] LINE LIFF Development Strategy & Testing Approach
- **Related Context Issues**: (ยังไม่มี)
- **Technical Dependencies**: Environment configuration (.env file ready)

**Task Issues Generated from this Context:**
- [จะถูก generate หลังจากการ approve context นี้]

---

## 📝 Instructions for Using This Template

### Initial Context Creation (=fcs > [context title])
1. **Fill basic sections**: CONTEXT OBJECTIVE, เริ่ม DISCUSSION LOG, CURRENT STATUS = Planning
2. **Add initial requirements**: สิ่งที่คุยกันใน session แรก
3. **Update SESSION NOTES**: บันทึกสิ่งสำคัญจากการคุย
4. **Check Planning Readiness**: ดูว่าพร้อม =plan หรือยัง

### Context Updates (=fcs > [ISSUE-XXX])
1. **Add to DISCUSSION LOG**: เพิ่ม session ใหม่พร้อม timestamp
2. **Update ACCUMULATED CONTEXT**: เพิ่ม requirements/decisions ใหม่
3. **Modify TECHNICAL ARCHITECTURE**: อัพเดทข้อมูลที่ได้จากการคุย
4. **Update SESSION NOTES**: บันทึกสิ่งที่คุยใน session ล่าสุด
5. **Check Planning Readiness**: ประเมินว่าพร้อมสำหรับ =plan หรือไม่

### When Ready for Planning (=plan > [task description])
- Ensure **Context Phase** = `[Ready for Planning]`
- All **PLANNING READINESS CHECKLIST** items are ✅
- Use this context to generate atomic tasks following the Task Issue Template in `/docs/TASK-ISSUE-TEMP.md`

### Context Evolution Principles
- **Incremental**: เพิ่มข้อมูลทีละน้อยตามการ discuss
- **Transparent**: บันทึกว่าทำไมถึงตัดสินใจแบบนั้น
- **Flexible**: สามารถปรับ decisions ได้ (พร้อมการอธิบาย)
- **Living Document**: Context เติบโตไปพร้อมกับความเข้าใจ

---

*This template is designed for iterative discussion-based context creation where understanding evolves through multiple sessions.*