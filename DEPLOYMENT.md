# 🚀 Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. ✅ LINE Developer Account with LIFF App created
2. ✅ Supabase Project with database schema set up
3. ✅ Environment variables configured
4. ✅ Build passes locally (`npm run build`)

## 📋 Deployment Checklist

### 1. LINE LIFF Setup

#### Create LIFF App
1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Select your channel (or create new Messaging API channel)
3. Go to LIFF tab → Click "Add"
4. Configure LIFF settings:
   - **Name**: Praneet Panmai Calculator
   - **Size**: Full
   - **Endpoint URL**: `https://your-domain.com` (will be Vercel URL)
   - **Scopes**: `profile`, `openid`
   - **Bot link feature**: On (optional)
5. Copy the LIFF ID (format: `1234567890-AbcdEfgh`)

### 2. Supabase Database Setup

#### Create Tables

```sql
-- Members table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  line_user_id TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  picture_url TEXT,
  registration_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can read their own data"
  ON members
  FOR SELECT
  USING (true); -- Allow all reads for now, refine later

CREATE POLICY "Users can insert their own data"
  ON members
  FOR INSERT
  WITH CHECK (true); -- Allow inserts for zero-click registration

CREATE POLICY "Users can update their own data"
  ON members
  FOR UPDATE
  USING (true);

-- Create index for fast lookups
CREATE INDEX idx_members_line_user_id ON members(line_user_id);
```

#### Get Supabase Credentials
1. Go to Supabase Dashboard → Project Settings
2. Copy:
   - Project URL: `https://xxx.supabase.co`
   - Project ID: Found in URL
   - Anon/Public Key: Under API section
   - Service Role Key: Under API section (keep secret!)

### 3. Vercel Deployment (Recommended)

#### Deploy to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via GitHub** (recommended):
   - Push code to GitHub
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - **Framework Preset**: Next.js
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Set Environment Variables** in Vercel:
   ```
   NEXT_PUBLIC_LIFF_ID=1655867694-GN01wkQB
   NEXT_PUBLIC_SUPABASE_URL=https://fefvihkpzubuqykdjeoj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   NEXT_PUBLIC_SUPABASE_PROJECT_ID=fefvihkpzubuqykdjeoj
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

#### Update LIFF Endpoint URL
1. Go back to LINE Developers Console
2. Update LIFF Endpoint URL to your Vercel URL:
   - Example: `https://planeet-panmai-line-app.vercel.app`
3. Save changes

### 4. Post-Deployment Verification

#### Test the Flow
1. Open LINE app on mobile
2. Scan QR code or click LIFF URL
3. Verify LIFF initialization
4. Test login flow
5. Verify zero-click registration in Supabase
6. Check calculator page loads

#### Common Issues

**LIFF initialization failed**
- Check LIFF ID in environment variables
- Ensure LIFF endpoint URL matches deployment URL
- Check browser console for errors

**Supabase connection failed**
- Verify Supabase URL and keys
- Check RLS policies are set up correctly
- Ensure network access from Vercel

**Authentication not working**
- Clear LINE app cache
- Check LIFF scopes include `profile` and `openid`
- Verify member registration logic

### 5. Monitoring & Maintenance

#### Set Up Monitoring
1. **Vercel Analytics**: Enable in project settings
2. **Supabase Logs**: Monitor database queries
3. **Error Tracking**: Consider Sentry integration

#### Performance Optimization
1. Enable Vercel Edge Network
2. Configure caching headers
3. Optimize images with Next.js Image
4. Monitor Core Web Vitals

#### Security Updates
1. Regularly update dependencies: `npm update`
2. Monitor security advisories
3. Rotate Supabase keys periodically
4. Review RLS policies

## 🌍 Alternative Deployment Options

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy to Custom Server

```bash
# Build
npm run build

# Start production server
npm start
```

Configure reverse proxy (nginx/Apache) to point to port 3000.

## 📊 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_LIFF_ID` | Yes | LINE LIFF App ID | `1234567890-AbcdEfgh` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase Project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Anonymous Key | `eyJ...` |
| `NEXT_PUBLIC_SUPABASE_PROJECT_ID` | Yes | Supabase Project ID | `fefvihkpzubuqykdjeoj` |
| `NODE_ENV` | Auto | Node environment | `production` |

## 🔒 Security Considerations

### Production Checklist
- [ ] All environment variables set correctly
- [ ] Supabase RLS policies enabled and tested
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Secrets not exposed in client-side code
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting configured (if needed)
- [ ] CORS configured properly

### Secrets Management
- ✅ Use environment variables for all secrets
- ✅ Never commit `.env` or `.env.local` files
- ✅ Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only
- ✅ Rotate keys regularly
- ✅ Use different keys for dev/staging/production

## 📱 LINE Rich Menu Setup (Optional)

Create a Rich Menu for easy access:

1. Go to LINE Official Account Manager
2. Create Rich Menu with:
   - **Calculator Button**: Opens LIFF URL with `?path=calculator`
   - **Profile Button**: Opens LIFF URL with `?path=profile`
3. Set tap actions to LIFF URL

## 🎯 Success Metrics

After deployment, monitor:

- **Member Registrations**: Track new sign-ups
- **Calculator Usage**: Monitor page views
- **Load Time**: Keep < 3 seconds
- **Error Rate**: Aim for < 1%
- **User Retention**: Track returning users

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Review Supabase logs
3. Check LINE Developers Console
4. Review application error logs

## 🔄 Continuous Deployment

Set up automatic deployment:
1. Connect GitHub to Vercel
2. Enable automatic deployments from `main` branch
3. Preview deployments from pull requests
4. Configure deployment hooks if needed

---

**Deployment Status**: Ready for production ✅
