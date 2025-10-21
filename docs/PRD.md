เข้าใจครับ! การมีเอกสารข้อกำหนดผลิตภัณฑ์ (PRD) จะช่วยให้การพัฒนามีทิศทางที่ชัดเจนและลดข้อผิดพลาดได้ดีมาก นี่คือร่าง PRD ฉบับสมบูรณ์สำหรับโครงการ **"LIFF Quick Quote & Member Onboarding System"** (ระบบคำนวณราคาและรับสมาชิกด่วนผ่าน LIFF) ในเวอร์ชัน MVP ของคุณครับ

---

# 🌱 Product Requirements Document (PRD) 🌱
## โครงการ: Durian Plant Nursery Sales System (MVP)

| รายละเอียด | ข้อมูล |
| :--- | :--- |
| **ชื่อโครงการ (Project Name)** | Praneet Panmai Line App (Premium Member Calculator) |
| **เวอร์ชัน (Version)** | 1.0 (MVP) |
| **วันที่ออก (Date)** | 21 ตุลาคม 2568 |
| **เจ้าของผลิตภัณฑ์ (Product Owner)** | (คุณ) |
| **ผู้พัฒนา (Development Team)** | (ชื่อทีม/บริษัทที่คุณจะจ้าง) |
| **สถานะ (Status)** | กำลังจะเริ่ม (To Be Started) |

---

### 1. ภาพรวมและเป้าหมาย (Overview & Goals)

#### 1.1 ปัญหาที่ต้องการแก้ไข (The Problem)
* ร้านอยู่ในซอย ทำให้ลูกค้าเข้าถึงยาก และขาดช่องทางติดตามหลังการขาย
* การแข่งขันสูง ลูกค้ากระจายตัวออกไป
* ลูกค้าต้องการดูข้อมูลต้นทุเรียนในถุงปลูกหลายขนาดและราคาที่ชัดเจน แต่ปัจจุบันต้องสอบถามจากพนักงานทีละรายการ
* การขายต้นทุเรียนในถุงดำ (planting bag) มีความซับซ้อนด้านขนาดถุงและประเภททรงพุ่ม (กระโดง/ข้าง) ทำให้การให้ข้อมูลราคาล่าช้า

#### 1.2 เป้าหมายของโครงการ (Project Goals)
* **เป้าหมายหลัก (North Star Metric):** เพิ่มจำนวนสมาชิกที่สมัครผ่าน QR Code ณ จุดขายตลาดนัด เพื่อเข้าถึง **Premium Member Calculator** (Market Member Acquisition)
* **เป้าหมายรองที่ 1:** สร้างระบบหน้า Profile หลักคล้ายแอปธนาคารสำหรับสมาชิกพิเศษ (Member Portal)
* **เป้าหมายรองที่ 2:** ทำให้สมาชิกสามารถคำนวณราคาต้นไม้ด้วยตนเองแบบ Real-time และเปรียบเทียบราคาตลาด (Premium Calculator Tool)
* **เป้าหมายรองที่ 3:** ลดภาระพนักงานในการจัดการต้นทุเรียนและอัพเดตราคา (Plant Management Efficiency)
* **เป้าหมายรองที่ 4:** สร้างคุณค่าพิเศษสำหรับการเป็นสมาชิกและสร้าง FOMO Effect ให้คน Add LINE OA (Premium Value Creation)

#### 1.3 ผู้ใช้งานหลัก (Target Users)
| กลุ่มผู้ใช้ | บทบาทหลักในระบบ |
| :--- | :--- |
| **ลูกค้าตลาดนัด (Market Customer)** | ผู้ซื้อต้นไม้ที่เข้ามาที่ร้านในตลาดนัด (เกษตรกร, ผู้ที่อยากปลูกต้นไม้) ที่ใช้โทรศัพท์มือถือ |
| **เจ้าของร้าน/พนักงาน (Admin)** | ผู้จัดการรายการต้นไม้ (พันธุ์, ขนาด, ราคา, โปรโมชั่น), ผู้รับข้อมูลการคำนวณราคาของลูกค้า |

---

### 2. ข้อกำหนดฟังก์ชัน (Functional Requirements)

ระบบจะถูกพัฒนาเป็น **Web Application (HTML/JS/CSS)** ที่ทำงานบน **LINE LIFF (LINE Front-end Framework)**

#### 2.1 F1: การลงทะเบียนสมาชิกตลาดนัดอัตโนมัติ (Premium Member Onboarding)
| User Story (ในฐานะลูกค้า...) | Acceptance Criteria (สิ่งที่ต้องเป็นไปตามนี้) |
| :--- | :--- |
| **"ฉันเป็นลูกค้าที่ตลาดนัด อยากสแกน QR Code แล้วเป็นสมาชิกพิเศษทันทีเพื่อใช้เครื่องคำนวนราคาต้นไม้"** | 1. ลูกค้าสแกน QR Code ที่ร้าน → กด "เพิ่มเพื่อน" LINE OA → ระบบเปิด LIFF App อัตโนมัติ 2. LIFF App เรียก `liff.getProfile()` และดึง **LINE User ID (UID)**, **Display Name**, **Profile Picture** มาได้ 3. ระบบบันทึกข้อมูลสมาชิกอัตโนมัติ (Zero-Click Registration) 4. เข้าสู่หน้า Profile หลักสำหรับสมาชิกพิเศษทันที |

#### 2.2 F2: หน้า Profile หลักของสมาชิกพิเศษ (Premium Member Portal)
| User Story (ในฐานะลูกค้า...) | Acceptance Criteria |
| :--- | :--- |
| **"ฉันเป็นสมาชิกพิเศษ อยากเห็นหน้า Profile หลักที่คล้ายแอปธนาคารเพื่อเข้าถึงเครื่องมือพิเศษ"** | 1. หน้า Profile ต้องแสดง **Profile Picture** ของ LINE, **Display Name** 2. ต้องแสดงข้อความ "สมาชิกพิเศษร้านต้นทุเรียน" 3. ต้องมีกลุ่ม **Icons ปุ่ม Feature** ใหญ่ๆ ชัดเจนสำหรับเข้าถึงฟังก์ชันต่างๆ 4. ดีไซน์ต้องเหมือนแอปธนาคาร (Grid Layout ของ Icons) |
| **"ฉันต้องการเห็นปุ่มที่ใช้งานง่ายสำหรับคนสูงอายุและเกษตรกร"** | 3. ปุ่มต้องมีขนาดใหญ่, ตัวอักษรใหญ่ชัดเจน, สีสันสวยงาม เหมาะกับการใช้งานบนมือถือ 4. ปุ่ม Feature แรกคือ **"เครื่องคำนวนราคาต้นไม้ (พิเศษ)"** |

#### 2.3 F3: เครื่องคำนวนราคาต้นไม้แบบ Real-time (Premium Member Calculator)
| User Story (ในฐานะสมาชิกพิเศษ...) | Acceptance Criteria |
| :--- | :--- |
| **"ฉันเป็นสมาชิกพิเศษ อยากเลือกต้นไม้และเปรียบเทียบราคาจากร้านเรากับราคาตลาด"** | 1. ระบบต้องแสดงรายการต้นไม้ทั้งหมด (ทั้งที่ร้านเราขาย และที่ใช้อ้างอิง) 2. แต่ละต้นต้องมีปุ่ม **"เพิ่มเข้าตะกร้า"** 3. ต้องมี **ตะกร้า (Cart)** ที่แสดงรายการที่เลือก และคำนวณราคา Real-time |
| **"ฉันต้องการเห็นว่าต้นไหนร้านเรามีขายจริง และราคาเท่าไหร่"** | 3. ตะกร้าต้องคำนวณ **ราคารวม** และ **จำนวนต้นแถม** แบบ Real-time ตามเงื่อนไขที่กำหนด 4. ต้องแสดง Badge แยกว่าต้นไหน "ร้านเรามีขาย" vs "อ้างอิงราคาตลาด" 5. มีปุ่ม **"ดูผลลัพธ์"** เพื่อแสดงผลการคำนวนสุดท้าย |

#### 2.4 F4: การแสดงผลการคำนวน (Calculation Display)
| User Story (ในฐานะสมาชิกพิเศษ...) | Acceptance Criteria |
| :--- | :--- |
| **"ฉันเป็นสมาชิกพิเศษ อยากดูผลการคำนวนราคาที่ชัดเจนและเข้าใจได้ง่าย"** | 1. เมื่อสมาชิกกด **"ดูผลลัพธ์"** ระบบต้องแสดงหน้า **Summary/Receipt** 2. แสดงรายการต้นไม้ที่เลือกพร้อมจำนวนและราคา 3. แสดงราคารวม และจำนวนต้นแถมที่ได้ตามโปรโมชั่น 4. แสดง Badge ว่าต้นไหน "ร้านเรามีขาย" vs "อ้างอิงราคาตลาด" |
| **"ฉันต้องการข้อมูลร้านเพื่อติดต่อหาสินค้าในอนาคต"** | 3. หน้า Profile ต้องมีปุ่ม **"แผนที่ร้าน"** และ **"Facebook"** สำหรับการติดต่อเพิ่มเติม |

#### 2.5 F5: ระบบจัดการต้นไม้และโปรโมชั่นสำหรับเจ้าของร้าน (Plant & Promotion Management)
| User Story (ในฐานะเจ้าของร้าน...) | Acceptance Criteria |
| :--- | :--- |
| **"ฉันต้องการจัดการรายการต้นไม้และโปรโมชั่นต่างๆ เองได้"** | 1. ต้องมี **Admin Interface** แยกต่างหากจาก LIFF ที่ใช้จัดการข้อมูลต้นไม้ (ชื่อต้นไม้, ราคา, รายละเอียด) 2. ต้องสามารถตั้งค่า **โปรโมชั่นแถมต้น** ได้ (เช่น ซื้อ 100 บาท แถม 1 ต้น, ซื้อ 2 ต้น 100 บาท แถม 1 ต้น) |
| **"ฉันต้องการให้ระบบนี้สามารถนำไปใช้กับร้านอื่นได้ในอนาคต"** | 3. **โครงสร้างฐานข้อมูล** ต้องยืดหยุ่นพอที่จะเพิ่ม **Shop ID** และ **โปรโมชั่นเฉพาะร้าน** ได้ (ใน MVP ให้ hardcode เป็นร้านเดียวก่อน) |

#### 2.6 F6: ฟีเจอร์เสริมสำหรับอนาคต (Future Features)
| User Story (ในฐานะลูกค้า...) | Acceptance Criteria |
| :--- | :--- |
| **"ฉันต้องการข้อมูลการดูแลต้นไม้ที่ซื้อไป"** | **(Future)** ระบบต้องมีหน้าข้อมูลการดูแลต้นไม้ (ปริมาณน้ำ, ปุ๋ย, แสงแดด, การป้องกันโรค) |
| **"ฉันต้องการรู้ว่าต้นไม้จะให้ผลเมื่อไหร่"** | **(Future)** ระบบต้องแสดงข้อมูล **"เวลาให้ผลผลิตโดยประมาณ"** ตามพันธุ์และขนาดต้น |
| **"ฉันต้องการสะสมแต้มและรับสิทธิพิเศษ"** | **(Future)** ระบบสะสมแต้มสำหรับลูกค้าประจำ |

---

### 3. ข้อกำหนดที่ไม่ใช่ฟังก์ชัน (Non-Functional Requirements)

| ด้าน | ข้อกำหนด |
| :--- | :--- |
| **Performance** | LIFF App ต้องโหลดเสร็จภายใน **$\le 3$ วินาที** บนเครือข่าย 4G/5G ทั่วไป เนื่องจากลูกค้าต้องการดูข้อมูลสินค้าได้อย่างรวดเร็ว |
| **Security** | ต้องมีการจัดการ **LINE Channel Access Token** และ **LIFF ID** อย่างปลอดภัย ห้ามเปิดเผยใน Front-end โดยไม่จำเป็น |
| **Usability (UX/UI)** | ดีไซน์ต้อง **Mobile-First** และใช้ shadcn/ui component library พร้อม custom nature theme, ฟอนต์ขนาดใหญ่/ปุ่มใหญ่ที่เหมาะกับกลุ่มเกษตรกรและผู้สูงอายุ รวมถึงการแสดงข้อมูลที่ชัดเจน (เลขที่ถุง, ความสูง, ราคา) |
| **Scalability** | ฐานข้อมูลต้องรองรับการบันทึก User ID ได้อย่างน้อย **10,000 รายการ** และสินค้าต้นทุเรียนได้อย่างน้อย **100 รายการ** ในระยะ MVP |
| **Compatibility** | ต้องทำงานได้อย่างถูกต้องบนแอปพลิเคชัน LINE เวอร์ชันปัจจุบัน ทั้งบน **iOS และ Android** |

---

### 4. การวัดความสำเร็จ (Success Metrics / KPI)

| ตัวชี้วัด (Metric) | เกณฑ์ความสำเร็จของ MVP (Target) |
| :--- | :--- |
| **LINE OA Member Growth Rate** | **$\ge 70\%$** ของลูกค้าที่เข้ามาที่ร้านในตลาดนัด สแกน QR Code และกลายเป็นสมาชิก LINE OA |
| **Premium Calculator Usage Rate** | **$\ge 80\%$** ของสมาชิกใหม่ ต้องมีการใช้เครื่องคำนวนราคาต้นไม้อย่างน้อย 1 ครั้ง |
| **Lead Generation Value** | **$\ge 50\%$** ของการคำนวนมีมูลค่าการสนใจซื้อขาย **$100-500$ บาท** (ขึ้นอยู่กับจำนวนและชนิดต้นไม้ที่เลือก) |
| **Market Intelligence Access** | **$\ge 30\%$** ของสมาชิกตรวจสอบราคาต้นทุเรียนตลาด (Reference Plants) เพื่อเปรียบเทียบกับร้าน |

---

### 5. สถาปัตยกรรมเทคโนโลยี (Technical Architecture)

#### 5.1 เทคโนโลยีที่ใช้ (Technology Stack)

| ด้าน | เทคโนโลยี | รายละเอียด |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router) + React 18 + TypeScript | Modern React framework พร้อม TypeScript สำหรับ Type Safety |
| **LINE LIFF SDK** | @line/liff (Official Package) | LIFF SDK อย่างเป็นทางการสำหรับเชื่อมต่อ LINE Platform |
| **Architecture Pattern** | Next.js App Router + React Components | ใช้ Server Components, Client Components และ Hooks |
| **Styling** | Tailwind CSS + shadcn/ui + Custom Nature Theme | Modern utility-first CSS framework พร้อม component library และ OKLCH color theme |
| **Backend/Database** | Supabase + PostgreSQL | Real database พร้อม Supabase Client SDK สำหรับ Type Safety |
| **Authentication** | LINE LIFF SDK Authentication | ใช้ `liff.init()`, `liff.getProfile()`, `liff.getAccessToken()` จริง |
| **File Storage** | Supabase Storage | เก็บรูปภาพต้นทุเรียนในถุงปลูกอย่างปลอดภัย |
| **Build Process** | Next.js Build System | Production build พร้อม optimization และ deployment |

#### 5.2 MVC Architecture (โครงสร้างการพัฒนา)

**โครงสร้างไฟล์ (File Structure)**:
```
/
├── app/                      (Next.js App Router)
│   ├── layout.tsx           (Root layout พร้อม LINE LIFF provider)
│   ├── page.tsx             (หน้า LIFF App หลัก - Member Profile)
│   ├── calculator/          (เครื่องคำนวนราคาต้นไม้)
│   │   └── page.tsx         (หน้าคำนวนราคา + ตะกร้า)
│   ├── auth/                (Authentication flow)
│   │   └── callback/        (LINE LIFF callback)
│   ├── api/                 (API Routes)
│   │   ├── auth/            (Authentication endpoints)
│   │   ├── plants/          (Product CRUD)
│   │   ├── quotes/          (Quote calculation)
│   │   └── line/            (LINE Messaging API)
│   └── admin/               (Admin Panel - แยกจาก LIFF)
│       ├── layout.tsx
│       ├── page.tsx         (Admin dashboard)
│       ├── plants/          (จัดการต้นทุเรียน)
│       └── promotions/      (จัดการโปรโมชั่น)
├── components/              (React Components)
│   ├── ui/                  (shadcn/ui components)
│   ├── liff/                (LIFF-specific components)
│   │   ├── LiffProvider.tsx (LIFF SDK initialization)
│   │   ├── ProfileCard.tsx  (Member profile display)
│   │   └── AuthGuard.tsx    (Authentication wrapper)
│   ├── calculator/          (Calculator components)
│   │   ├── PlantCard.tsx    (Product card with selection)
│   │   ├── Cart.tsx         (Shopping cart)
│   │   └── PriceDisplay.tsx (Real-time price calculation)
│   └── admin/               (Admin components)
├── lib/                     (Utilities & Services)
│   ├── supabase.ts          (Supabase client configuration)
│   ├── liff.ts              (LINE LIFF SDK wrapper)
│   ├── types.ts             (TypeScript type definitions)
│   └── database/            (Database utilities)
│       ├── schema.ts        (Database schema types)
│       └── migrations.ts    (Migration scripts)
└── public/                  (Static assets)
    └── images/              (Product images)
```

**การทำงานของ Next.js App Router**:
- **Server Components**: สำหรับการดึงข้อมูลจาก Supabase (Plants, Members, Quotes)
- **Client Components**: สำหรับ UI ที่ต้องการ interaction (Calculator, Cart, Profile)
- **API Routes**: สำหรับ CRUD operations และ LINE API integration
- **Middleware**: สำหรับ authentication และ LINE LIFF integration

#### 5.3 โครงสร้างฐานข้อมูล (Database Schema)

**ตารางหลัก (Core Tables)**:
- **members**: ข้อมูลสมาชิกพิเศษ (line_user_id, display_name, profile_picture_url, registration_date, is_active)
- **plants**: รายการต้นไม้ (ทั้งที่ขายและอ้างอิง) (variety_name, description_code, height_cm, plant_shape, price_per_plant, is_available_in_our_store, is_active, created_at)
- **promotions**: โปรโมชั่นแถมต้น (name, description, condition_type, condition_value, free_plants, is_active)

**ฟิลด์เพิ่มเติมสำหรับ LINE Integration**:
- **members.line_user_id**: Primary key สำหรับเชื่อมโยงกับ LINE User ID (จาก `liff.getProfile()`)
- **plants.is_available_in_our_store**: ตรวจสอบว่าต้นนี้ร้านเรามีขายจริงหรือไม่
- **plants.plant_shape**: ทรงพุ่ม ("กระโดง" หรือ "ข้าง") - มีผลต่อราคา

**ตัวอย่างข้อมูลต้นไม้ (Plants)**:
```
- ทุเรียนหมอนทอง - No.3 - 40cm - กระโดง - 40 บาท (✅ ร้านเรามีขาย)
- ทุเรียนหมอนทอง - No.3 - 40cm - ข้าง - 35 บาท (✅ ร้านเรามีขาย)
- ทุเรียนหมอนทอง - No.9 - 80cm - กระโดง - 90 บาท (✅ ร้านเรามีขาย)
- ทุเรียนหมอนทอง - No.9 - 80cm - ข้าง - 80 บาท (✅ ร้านเรามีขาย)
- ทุเรียนชนี - No.12 - 120cm - กระโดง - 170 บาท (❌ อ้างอิงราคาตลาด)
- ทุเรียนชนี - No.12 - 120cm - ข้าง - 150 บาท (❌ อ้างอิงราคาตลาด)
```

**ตัวอย่างข้อมูลโปรโมชั่น (Promotions)**:
```
โปรเปิดร้าน: ซื้อ 2 ต้น 100 บาท แถม 1 ต้น
โปรเยอะ: ซื้อครบ 200 บาท แถม 2 ต้น
โปรลูกค้าประจำ: ซื้อครบ 300 บาท แถม 4 ต้น
```

#### 5.4 Environment Variables และ API Integration

**Environment Variables ที่ต้องการ**:
```bash
# LINE LIFF Configuration
NEXT_PUBLIC_LIFF_ID=1234567890-AbcdEfgh
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
NODE_ENV=production
```

**LINE LIFF SDK Integration Flow**:
```javascript
// 1. Initialize LIFF SDK
await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID });

// 2. Check login status
if (!liff.isLoggedIn()) {
  await liff.login();
}

// 3. Get user profile
const profile = await liff.getProfile();
// { userId, displayName, pictureUrl, statusMessage }

// 4. Get access token for API calls
const accessToken = liff.getAccessToken();

// 5. Send data to backend
await fetch('/api/auth/register', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ profile })
});
```

**API Integration Points**:
- **Authentication API**: `/api/auth/register` - สร้าง/อัพเดต member จาก LINE profile
- **Plants API**: `/api/plants` - CRUD ข้อมูลต้นทุเรียน (ทั้งที่ขายและอ้างอิง)
- **Calculator API**: `/api/calculator/estimate` - คำนวณราคาแบบ Real-time (ไม่บันทึก)
- **Admin API**: `/api/admin/plants` - จัดการต้นทุเรียนสำหรับ Admin

#### 5.5 การวัดประสิทธิภาพ (Performance Requirements)

- **Load Time**: LIFF App โหลดภายใน ≤3 วินาทีบน 4G/5G (รวม LIFF SDK initialization)
- **Database Scaling**: รองรับสมาชิกพิเศษได้อย่างน้อย 10,000 คน
- **Plant Database**: รองรับต้นทุเรียนได้อย่างน้อย 200 รายการ (ทั้งที่ขายและอ้างอิง)
- **Mobile-First**: ออกแบบสำหรับหน้าจอมือถือและผู้สูงอายุ
- **Large Touch Targets**: ปุ่มขนาดใหญ่สำหรับการใช้งานง่าย
- **Build Process**: Next.js build system พร้อม optimization
- **Browser Compatibility**: ทำงานได้บน LINE WebView และ browsers ที่รองรับ ES6+

#### 5.6 UI/UX Design System & Theme

**Premium Member Experience**:
- **Authentication Guard**: สมาชิกพิเศษเท่านั้นที่สามารถเข้าถึง Calculator
- **Badge System**: แสดงความพร้อมในร้านเรา vs อ้างอิงราคาตลาด
- **Calculator Interface**: แยกต้นที่ขายจริง vs ต้นอ้างอิงอย่างชัดเจน
- **Non-Members**: แสดง QR Code + ข้อมูลติดต่อร้าน + แระบาบ Add LINE OA

#### 5.7 Error Handling และ Security

**Color Theme (Nature-inspired)**:
- **Primary Color**: Green-based OKLCH (oklch(0.5234 0.1347 144.1672))
- **Design Philosophy**: Organic, Modern, Trustworthy สำหรับร้านต้นทุเรียน
- **Color Space**: OKLCH สำหรับความแม่นยำและ accessibility สูง
- **Dark/Light Mode**: Full support พร้อม smooth transitions

**Typography System**:
- **Primary Font**: Montserrat (Modern, Clean, Elderly-friendly)
- **Secondary Font**: Merriweather (Trustworthy, Organic feel)
- **Monospace Font**: Source Code Pro (Data display)

**Design Components**:
- **Button Sizes**: Large touch targets (44px+) สำหรับผู้สูงอายุ
- **Border Radius**: 0.5rem (Soft, Modern)
- **Shadows**: Layered shadows สำหรับ depth perception
- **Spacing**: Consistent 0.25rem base unit

**Color Palette Examples**:
```
Light Mode:
- Background: ขาวเบจอ่อน (oklch(0.9711 0.0074 80.7211))
- Primary: เขียวสดใส (oklch(0.5234 0.1347 144.1672))
- Accent: เขียวอ่อน (oklch(0.8952 0.0504 146.0366))

Dark Mode:
- Background: เขียวเข้มมันวาว (oklch(0.2683 0.0279 150.7681))
- Primary: เขียวสด (oklch(0.6731 0.1624 144.2083))
- Accent: เขียวกลาง (oklch(0.5752 0.1446 144.1813))

Chart Colors: 5-level green spectrum สำหรับ data visualization
```

#### 5.7 Error Handling และ Security

**LIFF Error Handling**:
- **Initialization Errors**: จัดการกรณี `liff.init()` ล้มเหลว
- **Login Errors**: จัดการกรณี `liff.login()` ถูกยกเลิก
- **Profile Access Errors**: จัดการกรณี `liff.getProfile()` ถูกปฏิเสธ
- **Network Errors**: จัดการกรณีขาดการเชื่อมต่ออินเทอร์เน็ต

**Security Measures**:
- **LINE Access Token Validation**: ตรวจสอบความถูกต้องของ access token
- **Row Level Security (RLS)**: ใช้ Supabase RLS สำหรับข้อมูลสมาชิก
- **Environment Variable Protection**: ไม่เปิดเผย sensitive data ใน frontend
- **Input Validation**: ตรวจสอบข้อมูลที่ส่งมาจาก frontend

---

### 6. แผนการพัฒนา (Deployment & Phasing)

| Phase | ฟังก์ชันที่รวม (MVP Core) | วันที่คาดว่าจะเสร็จ (Estimated) | หมายเหตุ |
| :--- | :--- | :--- | :--- |
| **Phase 1: Foundation (MVP)** | F1 (LINE LIFF Auth Integration), F2 (Member Portal Profile), F3 (Real-time Calculator), F4 (LINE Message Sharing), F5 (Plant & Promotion Management) | (กำหนดวันที่เริ่มต้น) + 4 สัปดาห์ | ใช้ LINE LIFF SDK จริง + Supabase Database |
| **Phase 2: Enhancement** | Performance Optimization, Advanced UI/UX, Analytics Dashboard, Export Member Data | (หลัง MVP 2-3 สัปดาห์) | เพิ่มความสามารถและปรับปรุงประสิทธิภาพ |
| **Phase 3: Future Features** | F6 (ข้อมูลการดูแลต้นไม้), ระบบสะสมแต้ม, ระบบจองสินค้าล่วงหน้า, Multi-Shop Support | (อยู่ระหว่างการวางแผน) | ฟีเจอร์ขั้นสูงสำหรับการขยายธุรกิจ |

**Prerequisites ก่อน Phase 1**:
1. **LINE Developers Console Setup**: สร้าง LINE Channel และ LIFF App
2. **Supabase Project Setup**: สร้าง database และ configure RLS policies
3. **Environment Configuration**: ตั้งค่า environment variables ทั้งหมด
4. **Domain & SSL**: เตรียม domain สำหรับ production deployment

---

## 7. ภาพรวม Flow การใช้งาน (User Journey Summary)

### Flow หลักสำหรับลูกค้าตลาดนัด (อัพเดตด้วย LIFF SDK):
```
1. Scan QR Code ที่ร้าน
   ↓
2. Add LINE OA เพื่อน
   ↓
3. LIFF App เปิดอัตโนมัติใน LINE WebView
   ↓
4. LIFF SDK Initialization (liff.init() + liffId)
   ↓
5. Auto Authentication:
   - liff.isLoggedIn() → liff.login() (ถ้ายังไม่ login)
   - liff.getProfile() (ดึง userId, displayName, pictureUrl)
   - liff.getAccessToken() (สำหรับ API calls)
   ↓
6. Database Registration:
   - เรียก /api/auth/register สร้าง/อัพเดต member ใน Supabase
   - เก็บ LINE User ID เป็น Primary Key
   ↓
7. เข้าหน้า Profile หลัก (คล้ายแอปธนาคาร)
   ↓
8. กดปุ่ม "เครื่องคำนวนราคาต้นไม้"
   ↓
9. Real-time Calculator:
   - เลือกต้นทุเรียน (พันธุ์ + ขนาด + ทรงพุ่ม)
   - เพิ่มเข้าตะกร้า
   - คำนวณราคา + โปรโมชั่น (Real-time)
   ↓
10. ส่งผลการคำนวน:
    - เรียก /api/quotes/calculate บันทึกข้อมูล
    - เรียก /api/line/send-staff ส่งข้อมูลให้พนักงานทาง LINE
```

### Flow สำหรับเจ้าของร้าน (Admin Panel):
```
1. Login Admin Panel (แยกจาก LIFF - ไม่ต้องผ่าน LINE)
   ↓
2. Dashboard:
   - ดูสถิติสมาชิกใหม่
   - ดูประวัติการคำนวน
   ↓
3. Plant Management:
   - เพิ่ม/แก้ไขต้นทุเรียน (พันธุ์, ขนาด, ทรงพุ่ม, ราคา)
   - อัพโหลดรูปภาพไป Supabase Storage
   ↓
4. Promotion Management:
   - ตั้งค่าโปรโมชั่นแถมต้น
   - กำหนดเงื่อนไข (จำนวนต้น/ยอดเงิน)
   ↓
5. Order Management:
   - รับข้อมูลการคำนวนจากลูกค้าทาง LINE
   - ดูรายละเอียดการสั่งซื้อใน Admin Dashboard
```

### Technical Flow Summary:
- **Frontend**: Next.js + React + LINE LIFF SDK (Members-only access)
- **UI/UX**: shadcn/ui + Custom Nature Theme (OKLCH color space)
- **Authentication**: LINE LIFF (Zero-Click Registration + Authentication Guard)
- **Database**: Supabase PostgreSQL + Supabase Client SDK (No order persistence)
- **API**: Next.js API Routes (Calculator & Admin only)
- **Storage**: Supabase Storage (รูปภาพต้นทุเรียน)
- **Deployment**: Production ready with SSL certificate
- **Cost Optimization**: No LINE Messaging API costs (Calculator-only approach)

**Design Implementation**:
- **Component Library**: shadcn/ui สำหรับ consistency และ accessibility
- **Theme Variables**: CSS custom properties สำหรับ maintainability
- **Responsive Design**: Mobile-first พร้อม breakpoints สำหรับ tablets
- **Accessibility**: WCAG 2.1 AA compliance ด้วย OKLCH contrast ratios
- **Typography**: Web font optimization สำหรับ Montserrat & Merriweather
- **Theme Switching**: Instant theme switching พร้อม localStorage persistence

---

*หมายเหตุ: PRD นี้อัปเดตตามที่เราคุยกัน โดยเน้นเฉพาะฟีเจอร์ในเวอร์ชัน MVP สำหรับตลาดนัด - ระบบสมาชิก + เครื่องคำนวนราคาต้นไม้แบบ Real-time*

**🔄 การอัพเดตครั้งล่าสุด (2025-10-21)**:
- ✅ เปลี่ยนจาก Vanilla JavaScript เป็น **Next.js 14 + TypeScript**
- ✅ เพิ่ม **LINE LIFF SDK อย่างเป็นทางการ** (ไม่ใช่ mockup)
- ✅ ใช้ **Supabase Database จริง** พร้อม Supabase Client SDK
- ✅ เพิ่มฟิลด์ `plant_shape` สำหรับ "กระโดง"/"ข้าง"
- ✅ อัพเดต Authentication Flow ให้ใช้ `liff.init()`, `liff.getProfile()`, `liff.getAccessToken()`
- ✅ เพิ่ม **shadcn/ui + Custom Nature Theme** ด้วย OKLCH color space
- ✅ เพิ่ม Environment Variables และ API Integration
- ✅ เพิ่ม Error Handling และ Security measures
- ✅ ปรับ Deployment plan ให้เป็น Production-ready
- 🔄 **ปรับเปลี่ยนเป็น Premium Member Calculator**:
  - ✅ เปลี่ยนชื่อโปรเจกต์เป็น "Praneet Panmai Line App (Premium Member Calculator)"
  - ✅ ทำให้เครื่องคำนวนเป็น **สำหรับสมาชิกเท่านั้น** (Members-only access)
  - ✅ ลบระบบ Order และ LINE Messaging API (ลดต้นทุน)
  - ✅ เพิ่ม Authentication Guard ป้องกันการเข้าถึงโดยไม่มีสิทธิ์
  - ✅ เพิ่มฟิลด์ `is_available_in_store` สำหรับแยกต้นที่ขายในร้าน vs ตลาด
  - ✅ ปรับ Success Metrics ให้วัด Member Growth และ Lead Generation
  - ✅ อัพเดต Technical Flow ให้สอดคล้องกับรูปแบบใหม่
  - ✅ **เปลี่ยนจาก Prisma ORM เป็น Supabase Client SDK** (ง่ายกว่าและเข้าถึงได้โดยตรง)

**ระบบนี้พร้อมสำหรับการพัฒนาจริงด้วย Database และ LINE LIFF SDK ที่เป็นทางการ** 🚀

**🎨 Design System**: เพิ่ม **shadcn/ui + Custom Nature Theme** สำหรับ Brand Identity ที่เป็นเอกลักษณ์และเป็นมิตรกับผู้ใช้ทุกวัย โดยเฉพาะกลุ่มเกษตรกรและผู้สูงอายุ 🌱