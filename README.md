# 🌱 Praneet Panmai LINE App

ระบบคำนวณราคาต้นทุเรียนสำหรับสมาชิกเท่านั้น (Premium Member Calculator)

## 🎯 Project Overview

A LINE LIFF (LINE Front-end Framework) application for durian plant nursery calculator and member management system. Built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework**: Next.js 14.2.15 (App Router)
- **Language**: TypeScript 5.7.2 (Strict Mode)
- **Styling**: Tailwind CSS 3.4.16
- **UI Components**: shadcn/ui
- **Code Quality**: ESLint + Prettier
- **Target Platform**: LINE WebView (Mobile-first, 320px minimum width)

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run type-check
```

The development server will start at [http://localhost:3000](http://localhost:3000).

## 🏗️ Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions
│   └── utils.ts          # shadcn/ui utilities
├── docs/                  # Project documentation
├── .eslintrc.json        # ESLint configuration
├── .gitignore            # Git ignore rules
├── components.json       # shadcn/ui configuration
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── prettier.config.js    # Prettier configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Design System

### Mobile-First Approach

- **Minimum Width**: 320px (LINE WebView compatible)
- **Touch Targets**: 44px minimum for elderly users
- **Color Contrast**: 4.5:1 minimum ratio
- **Thai Language**: Optimized font loading

### Responsive Breakpoints

```css
xs: 320px   /* LINE WebView minimum */
sm: 375px   /* Standard mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Component System

Built with shadcn/ui for consistency and accessibility:
- Modern, accessible components
- Customizable with Tailwind CSS
- TypeScript support
- Dark mode ready

## 🔧 Configuration

### Environment Variables

Required environment variables (see `.env.example`):

```bash
# LINE LIFF
NEXT_PUBLIC_LIFF_ID=your_liff_id
LINE_CHANNEL_ACCESS_TOKEN=your_channel_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application
NEXT_PUBLIC_APP_URL=your_app_url
NODE_ENV=development
```

### TypeScript

Strict mode enabled for type safety:
- All types must be explicitly defined
- No implicit any
- Strict null checks

### Code Quality

Automated linting and formatting:
- ESLint for code quality
- Prettier for consistent formatting
- TypeScript compiler checks

## 📱 LINE LIFF Integration

This app is designed to run within LINE's WebView environment:

1. **Authentication**: LINE LIFF SDK handles user authentication
2. **Profile Access**: Access to LINE user profile (ID, name, picture)
3. **Rich Menu**: Integrated with LINE's Rich Menu for navigation
4. **QR Code**: Supports QR code scanning for member registration

## 🔐 Security

- Environment variables for sensitive data
- TypeScript strict mode for type safety
- ESLint rules for code security
- Proper authentication guards for premium features

## 📚 Documentation

- [PRD (Product Requirements Document)](./docs/PRD.md)
- [Database Schema Context](./docs/database-schema-context.md)
- [Issue Templates](./docs/)

## 🤝 Contributing

This is a private project. For team members:

1. Create feature branch from `staging`
2. Follow commit message format
3. Ensure all tests pass
4. Submit PR for review

## 📄 License

Private - All Rights Reserved

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful component library
- LINE Corporation for LIFF platform
- Supabase for backend infrastructure
