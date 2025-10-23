# 🌱 Praneet Panmai Line App

> Premium Member Calculator for Durian Plant Nursery

A LINE LIFF-based web application for calculating durian plant prices, designed specifically for premium members of the nursery's LINE Official Account.

## 📋 Project Overview

**Project Name**: Praneet Panmai Line App (Premium Member Calculator)  
**Version**: 1.0 (MVP)  
**Repository**: https://github.com/mojisejr/PlaneetPanmaiLineApp

### Purpose
This system provides a members-only calculator through LINE LIFF to:
- Create premium value for LINE OA membership
- Enable real-time price calculations for durian plants
- Compare store prices with market prices
- Reduce operational costs
- Enhance customer engagement

## 🎯 Key Features

### 1. Multi-Channel Access
- QR Code scanning at physical store
- LINE Rich Menu buttons
- Chat commands
- LINE OA Profile buttons

### 2. Premium Member Calculator
- Real-time price calculations
- Shopping cart functionality
- Promotion and discount handling
- Store vs market price comparison

### 3. LINE WebView Optimization
- **Viewport optimization** for all screen sizes
- **Performance monitoring** with Core Web Vitals
- **WebView-specific fixes** for iOS and Android
- **Development tools** for debugging
- **Automated testing** framework

### 4. Member Portal
- Profile display (similar to banking apps)
- Feature access through icon grid
- Premium content for members only
- Store contact and location information

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- LINE Developers Account
- Supabase Account
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/mojisejr/PlaneetPanmaiLineApp.git

# Navigate to project directory
cd PlaneetPanmaiLineApp

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
# - NEXT_PUBLIC_LIFF_ID
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

## 📁 Project Structure

```
PlaneetPanmaiLineApp/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout with optimizations
│   ├── page.tsx               # Member profile page
│   └── calculator/            # Calculator feature
├── components/                 # React components
│   ├── ui/                    # UI components (shadcn/ui)
│   ├── liff/                  # LIFF-specific components
│   ├── calculator/            # Calculator components
│   └── optimization/          # Performance overlay
├── lib/                       # Utilities & Services
│   ├── optimization/          # WebView optimization
│   │   ├── viewport-config.ts
│   │   ├── performance-monitor.ts
│   │   ├── webview-utils.ts
│   │   └── README.md
│   ├── supabase.ts           # Supabase client
│   ├── liff.ts               # LINE LIFF SDK wrapper
│   └── types.ts              # TypeScript types
├── docs/                      # Documentation
│   ├── PRD.md                # Product Requirements
│   ├── INTEGRATION-GUIDE.md  # Integration guide
│   └── testing/              # Testing documentation
│       └── manual-testing-checklist.md
├── scripts/                   # Utility scripts
│   └── test/
│       └── liff-test-runner.js
└── public/                    # Static assets
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (Strict mode) |
| **UI Library** | React 18 |
| **Styling** | Tailwind CSS + shadcn/ui |
| **LINE Integration** | @line/liff (Official SDK) |
| **Database** | Supabase + PostgreSQL |
| **Authentication** | LINE LIFF Authentication |
| **Deployment** | Vercel / Custom |

## 🧪 Testing

### Automated Tests
```bash
# Run all tests
npm run test:liff

# Run specific scenarios
npm run test:liff viewport
npm run test:liff perf
npm run test:liff webview
```

### Manual Testing
Follow the comprehensive checklist:
- [Manual Testing Checklist](docs/testing/manual-testing-checklist.md)

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 📱 LINE LIFF Setup

### 1. Create LINE Channel
1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Create a new Provider (or select existing)
3. Create a Messaging API channel
4. Note your Channel ID and Channel Secret

### 2. Create LIFF App
1. In your channel settings, go to LIFF tab
2. Click "Add" to create a new LIFF app
3. Configure:
   - **Size**: Full
   - **Endpoint URL**: Your app URL (e.g., https://your-app.vercel.app)
   - **Scopes**: profile, openid
4. Copy the **LIFF ID** (format: 1234567890-AbcdEfgh)

### 3. Configure Environment
Add to your `.env` file:
```bash
NEXT_PUBLIC_LIFF_ID=your-liff-id-here
```

## 🗄️ Database Setup

### Supabase Configuration
1. Create a Supabase project
2. Create tables:
   - `members` - User profiles
   - `plants` - Durian plant catalog
   - `promotions` - Discount rules

3. Set up Row Level Security (RLS)
4. Copy credentials to `.env`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## ⚡ Performance

### Targets
- **Load Time**: < 3 seconds on 4G
- **First Contentful Paint**: < 1.8 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1

### Monitoring
Use the built-in performance overlay in development mode to monitor real-time metrics.

## 🔒 Security

- Environment variables protected
- Row Level Security in Supabase
- LIFF authentication for members-only access
- No sensitive data in frontend code
- Secure API endpoints

## 📚 Documentation

- [Product Requirements Document (PRD)](docs/PRD.md)
- [Integration Guide](docs/INTEGRATION-GUIDE.md)
- [Optimization Library README](lib/optimization/README.md)
- [Manual Testing Checklist](docs/testing/manual-testing-checklist.md)
- [Database Schema](docs/database-schema-context.md)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add some feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open Pull Request

## 📝 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run test:liff    # Run LIFF tests
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: App not loading in LINE WebView  
**Solution**: Check LIFF ID configuration and ensure app is deployed with HTTPS

**Issue**: Performance overlay not showing  
**Solution**: Ensure `NODE_ENV=development` is set

**Issue**: TypeScript errors  
**Solution**: Run `npm run type-check` to see all errors

**Issue**: Build failing  
**Solution**: Check that all dependencies are installed with `npm install`

## 📊 Metrics & KPIs

- **LINE OA Member Growth Rate**: ≥ 70% of store visitors
- **Rich Menu Engagement Rate**: ≥ 60% of members
- **Premium Calculator Usage**: ≥ 80% of new members
- **Performance Score**: ≥ 70%

## 🌟 Features Roadmap

### MVP (Current)
- [x] LINE LIFF integration
- [x] WebView optimization
- [x] Performance monitoring
- [x] Testing framework
- [ ] Member authentication
- [ ] Price calculator
- [ ] Member profile page

### Future Enhancements
- [ ] Plant care information
- [ ] Loyalty points system
- [ ] Pre-order functionality
- [ ] Multi-shop support
- [ ] Push notifications
- [ ] Order history

## 📞 Support

For issues and questions:
- Create an issue in GitHub
- Check the documentation
- Review testing checklist
- Monitor performance metrics

## 📄 License

Copyright © 2025 Praneet Panmai Line App

## 🙏 Acknowledgments

- LINE Corporation for LIFF SDK
- Supabase for database platform
- Next.js team for the framework
- shadcn/ui for components

---

**Built with ❤️ for durian plant enthusiasts** 🌱
