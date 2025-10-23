# 🌱 Praneet Panmai Line App (Premium Member Calculator)

ระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิกเท่านั้น (Members-only Calculator) ผ่าน LIFF สำหรับร้านต้นทุเรียน

## 📋 Features

- **LINE LIFF Integration**: Seamless authentication through LINE app
- **Member Profile**: Display user profile from LINE
- **Premium Calculator**: Tools exclusive to LINE OA members
- **Mobile-First Design**: Optimized for mobile experience

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- LINE Developers Account
- LIFF App configured in LINE Developers Console

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mojisejr/PlaneetPanmaiLineApp.git
cd PlaneetPanmaiLineApp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your LINE LIFF ID:
```
NEXT_PUBLIC_LIFF_ID=your_liff_id_here
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build

Build for production:
```bash
npm run build
```

### Lint

Run ESLint:
```bash
npm run lint
```

### Type Check

Run TypeScript type checking:
```bash
npm run type-check
```

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── liff/              # LIFF app entry point
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/                   # Library code
│   └── liff/             # LIFF client and configuration
│       ├── client.ts     # LIFF client implementation
│       └── config.ts     # LIFF configuration
├── hooks/                 # React hooks
│   └── use-liff.ts       # LIFF state management hook
├── types/                 # TypeScript type definitions
│   └── liff.ts           # LIFF types
└── docs/                  # Documentation
```

## 🔧 Configuration

### LINE LIFF Setup

1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Create a new channel (Messaging API)
3. Create a LIFF app in the channel settings
4. Set the LIFF app URL to your deployment URL
5. Copy the LIFF ID to your `.env.local` file

### Environment Variables

- `NEXT_PUBLIC_LIFF_ID`: Your LINE LIFF app ID (required)
- `NEXT_PUBLIC_LIFF_DEBUG`: Enable debug logging (optional)
- `NEXT_PUBLIC_LIFF_MOCK`: Enable mock mode for development (optional)

## 📱 LIFF Features

### Implemented

- ✅ LIFF SDK initialization
- ✅ User authentication via LINE
- ✅ User profile retrieval
- ✅ Login/Logout functionality
- ✅ Error handling and loading states
- ✅ React hooks for state management

### Coming Soon

- 🔜 Premium calculator feature
- 🔜 Price comparison tool
- 🔜 Store location map
- 🔜 Facebook integration

## 🛡️ Security

- Environment variables properly configured
- Next.js security patches applied (v14.2.25)
- TypeScript strict mode enabled
- No credentials stored in repository

## 📝 License

Private - Not for public distribution

## 👨‍💻 Development

This project uses:
- **Next.js 14.2** (App Router)
- **TypeScript** (strict mode)
- **LINE LIFF SDK** v2.22+
- **Tailwind CSS** for styling
- **ESLint** for code quality

## 🔗 Related Documentation

- [LINE LIFF Documentation](https://developers.line.biz/en/docs/liff/overview/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Project PRD](./docs/PRD.md)
