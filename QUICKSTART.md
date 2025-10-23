# ⚡ Quick Start Guide

Get the LIFF app running in 5 minutes!

## 🚀 Setup (5 minutes)

### Step 1: Clone and Install (1 min)

```bash
# Clone the repository
git clone https://github.com/mojisejr/PlaneetPanmaiLineApp.git
cd PlaneetPanmaiLineApp

# Install dependencies
npm install
```

### Step 2: Configure Environment (2 mins)

```bash
# Copy environment template
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Get from LINE Developers Console
NEXT_PUBLIC_LIFF_ID=1655867694-GN01wkQB

# Get from Supabase Dashboard
NEXT_PUBLIC_SUPABASE_URL=https://fefvihkpzubuqykdjeoj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=fefvihkpzubuqykdjeoj
```

### Step 3: Set Up Database (2 mins)

Run this SQL in Supabase SQL Editor:

```sql
-- Create members table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  line_user_id TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  picture_url TEXT,
  registration_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS and create policies
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON members FOR ALL USING (true);

-- Create index
CREATE INDEX idx_members_line_user_id ON members(line_user_id);
```

## 🏃 Run the App

```bash
# Development mode
npm run dev

# Open http://localhost:3000
```

## 📱 Test in LINE

### Option 1: Use LINE LIFF Inspector (Recommended for Development)

1. Go to [LIFF Inspector](https://liff-inspector.line.me/)
2. Enter your LIFF ID
3. Login with LINE
4. Test the app

### Option 2: Deploy and Test in Real LINE

```bash
# Deploy to Vercel (easiest)
vercel --prod

# Or use Vercel GitHub integration
# Push to GitHub, connect in Vercel Dashboard
```

Update LIFF Endpoint URL in LINE Developers Console to your Vercel URL.

## ✅ Verify It Works

### Check 1: LIFF Initialization
- Open app in LINE/LIFF Inspector
- Should show loading spinner briefly
- Then redirect to login or calculator

### Check 2: Login Flow
- If not logged in, shows login page
- Click "เข้าสู่ระบบด้วย LINE" button
- LINE login screen appears
- After login, redirects to calculator

### Check 3: Authentication
- Calculator page shows your LINE profile
- Header shows your display name
- Menu button works

### Check 4: Database Registration
- Check Supabase members table
- Your LINE user record should appear
- Contains your display name and picture

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### LIFF Not Initializing
- Check LIFF ID in `.env.local`
- Ensure LIFF endpoint URL matches your domain
- Check browser console for errors

### Database Connection Failed
- Verify Supabase credentials in `.env.local`
- Check Supabase RLS policies
- Ensure table exists

### Profile Not Loading
- Check LIFF scopes include `profile` and `openid`
- Verify user is logged in to LINE
- Check network tab for API errors

## 📚 Next Steps

1. **Customize Styling**: Edit `app/globals.css` and `tailwind.config.ts`
2. **Add Calculator Logic**: Implement in `app/(dashboard)/calculator/page.tsx`
3. **Add Products**: Create products table and fetch data
4. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md) guide

## 🎯 Key Files to Know

```
app/
├── layout.tsx              # Root layout with LIFF provider
├── page.tsx                # Entry point (redirects based on auth)
├── (auth)/login/          # Login page
└── (dashboard)/calculator/ # Main calculator page

lib/
├── liff/                   # LIFF SDK integration
├── supabase/              # Database client
└── routing/               # Auth guard
```

## 💡 Tips

- **Hot Reload**: Code changes auto-refresh in dev mode
- **TypeScript**: Get type checking with `npm run type-check`
- **Linting**: Keep code clean with `npm run lint`
- **Mobile Testing**: Use Chrome DevTools mobile emulator
- **LINE Testing**: Use LIFF Inspector for quick iterations

## 📖 More Resources

- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [docs/PRD.md](./docs/PRD.md) - Product requirements
- [LINE LIFF Docs](https://developers.line.biz/en/docs/liff/)

---

**Happy Coding! 🌱**
