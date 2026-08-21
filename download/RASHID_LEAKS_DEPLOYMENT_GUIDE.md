# RASHID LEAKS - Production Deployment Guide

## 🚀 Deployment on InfinityFree (rashidleaks.wuaze.com)

### 📋 Prerequisites

Before deploying to InfinityFree, ensure you have:

1. **InfinityFree Account** - Free hosting account at [infinityfree.com](https://infinityfree.com)
2. **Domain** - rashidleaks.wuaze.com (already configured)
3. **Node.js Environment** - For building the project
4. **Database** - External database service (InfinityFree doesn't support SQLite well)

---

## 🔧 Step 1: Prepare the Project for Production

### 1.1 Install Dependencies
```bash
cd /home/z/my-project
bun install
```

### 1.2 Build the Project
```bash
bun run build
```

This creates an optimized production build in the `.next` folder.

### 1.3 Configure Environment Variables

Create a `.env.production` file:

```env
# Database Configuration (Use external DB for production)
DATABASE_URL="mysql://user:password@host:3306/rashidleaks"

# NextAuth Configuration
NEXTAUTH_URL="https://rashidleaks.wuaze.com"
NEXTAUTH_SECRET="your-super-secret-key-here-min-32-chars"

# App Configuration
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://rashidleaks.wuaze.com"
NEXT_PUBLIC_APP_NAME="RASHID LEAKS"

# Security
CSRF_SECRET="another-secret-key-here"
ENCRYPTION_KEY="encryption-key-for-sensitive-data"

# File Storage (Use external service like AWS S3, Cloudinary, or Uploadcare)
STORAGE_PROVIDER="external"
STORAGE_BUCKET_NAME="rashidleaks-content"
STORAGE_REGION="auto"
STORAGE_ACCESS_KEY="your-access-key"
STORAGE_SECRET_KEY="your-storage-secret"

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=""
```

---

## 🌐 Step 2: Deploy to InfinityFree

### Option A: Static Export (Recommended for InfinityFree)

Since InfinityFree is primarily static hosting, export as static site:

1. **Update next.config.js** for static export:
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

2. **Build Static Version**:
```bash
bun run build
```

3. **Upload to InfinityFree**:
   - Connect via FTP to your InfinityFree account
   - Upload contents of `out/` folder to `htdocs/`
   - Ensure `.htaccess` is configured for SPA routing

4. **Create `.htaccess`** for routing:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Option B: Node.js Server (Requires Upgrade)

For full functionality, you need Node.js hosting:

1. **Use services like**: Railway, Render, Vercel, or DigitalOcean
2. **Deploy with Docker**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "start"]
```

---

## 🗄️ Step 3: Set Up Production Database

### Recommended Database Options:

#### Option 1: PlanetScale (Free Tier)
```sql
-- Connect to PlanetScale console
-- Create database: rashidleaks
-- Get connection string
mysql://user:password@us.connect.psdb.cloud/rashidleaks?sslaccept=strict
```

#### Option 2: Supabase (Free Tier)
- Create project at supabase.com
- Get connection string from Settings > Database
- Enable Row Level Security for user data

#### Option 3: Neon (Free Tier)
- Create project at neon.tech
- Copy connection string
- Supports PostgreSQL (better than MySQL for this use case)

### Run Migrations:
```bash
# Update schema.prisma datasource provider to mysql or postgresql
bun run db:push
# Or for production: bun run db:migrate deploy
```

---

## 🔐 Step 4: Security Configuration

### 4.1 HTTPS/SSL
- InfinityFree provides free SSL certificates
- Ensure all URLs use `https://`
- Force HTTPS redirect in `.htaccess`:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST%{REQUEST_URI} [L,R=301]
```

### 4.2 Security Headers
Add to `.htaccess` or server config:
```apache
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "DENY"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:"
  Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>
```

### 4.3 Age Verification Security
- Store age verification in httpOnly cookies
- Implement server-side verification check
- Rate limit age gate bypass attempts
- Log suspicious access patterns

---

## 📁 Step 5: File Storage Setup

For video uploads, use external storage:

### Option 1: Cloudinary (Recommended for Video)
```javascript
// lib/storage/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

### Option 2: Uploadcare
- Sign up at uploadcare.com
- Get public/private keys
- Use their file upload API

### Option 3: AWS S3
- Create S3 bucket
- Configure CORS policy
- Set up CloudFront CDN for video delivery

---

## 🧪 Step 6: Testing Checklist

Before going live, test:

### Functional Testing
- [ ] Age gate appears and works correctly
- [ ] User registration with email verification
- [ ] Login/logout functionality
- [ ] Video playback on mobile devices
- [ ] Search with filters
- [ ] Android Back button navigation (CRITICAL)
- [ ] Comment posting
- [ ] Like/Favorite functionality
- [ ] Report submission
- [ ] Creator profile pages
- [ ] Admin panel access

### Mobile Testing
- [ ] Test on Chrome Android
- [ ] Test on Firefox Android
- [ ] Test on Samsung Internet
- [ ] Test physical Back button behavior
- [ ] Test gesture navigation
- [ ] Test in WebView/PWA mode

### Navigation Sequence Test (MANDATORY)
Test this exact sequence:
```
Home → Search → Results → Video → Comments → 
Back → Video → Back → Results → Back → Home
```
Expected: No unexpected exits, reloads, blank screens, or lost state.

### Security Testing
- [ ] All APIs require authentication where needed
- [ ] Rate limiting works
- [ ] Input validation on all forms
- [ ] No sensitive data in client-side code
- [ ] CSRF protection active
- [ ] HTTPS enforced everywhere

---

## 🚨 Step 7: Legal Compliance

### Before Launch, Complete:

1. **Terms of Service Review** - Have lawyer review `/legal/terms`
2. **Privacy Policy** - Ensure GDPR/CCPA compliance
3. **DMCA Agent** - Register DMCA agent with USCO
4. **Age Verification** - Implement appropriate system for jurisdiction
5. **Content Moderation Plan** - Document moderation procedures
6. **Record Keeping** - Set up 2257 compliance records (if applicable)
7. **Tax Registration** - Register business if monetizing

### Required Legal Pages:
- ✅ Terms of Service (`/legal/terms`)
- ✅ Privacy Policy (`/legal/privacy`)
- ✅ Community Guidelines (`/legal/guidelines`)
- ✅ DMCA Process (`/legal/dmca`)
- ✅ 18+ Policy (`/legal/18-plus-policy`)
- ✅ Non-Consensual Policy (`/legal/non-consensual-policy`)
- ✅ Child Safety Policy (`/legal/child-safety`)
- ✅ Contact Page (`/legal/contact`)

---

## 👤 Step 8: Administrator Setup

### Create Admin Account:
```sql
-- Run in database after first deploy
INSERT INTO User (
  id, username, email, passwordHash, role, 
  emailVerified, isBanned, ageVerified,
  createdAt, updatedAt
) VALUES (
  'admin-unique-id',
  'admin',
  'admin@rashidleaks.com',
  '$2a$10$hashed-password-here',
  'ADMIN',
  1, 0, 1,
  datetime('now'),
  datetime('now')
);
```

### Default Admin Credentials (CHANGE IMMEDIATELY):
- Username: `admin`
- Email: `admin@rashidleaks.com`
- Password: `change-this-immediately!`

---

## 📊 Step 9: Monitoring & Maintenance

### Set Up Monitoring:
1. **Error Tracking** - Sentry or LogRocket
2. **Analytics** - Google Analytics or Plausible
3. **Uptime Monitoring** - UptimeRobot or Pingdom
4. **Performance Monitoring** - Lighthouse CI

### Regular Tasks:
- Daily: Check moderation queue
- Weekly: Review reports and takedowns
- Monthly: Backup database, review security logs
- Quarterly: Update dependencies, security audit

---

## 🔄 Step 10: Backup Strategy

### Automated Backups:
```bash
# Database backup script (run daily via cron)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME > backup_$DATE.sql
gzip backup_$DATE.sql
aws s3 cp backup_$DATE.sql.gz s3://rashidleaks-backups/db/
```

### What to Back Up:
- Database (daily)
- User uploads (if self-hosted)
- Configuration files
- SSL certificates
- Application logs (30 days retention)

---

## 🆘 Troubleshooting

### Common Issues:

**Issue: Blank page after deployment**
- Check browser console for errors
- Verify all environment variables set
- Ensure static files uploaded correctly

**Issue: Android Back button not working**
- Verify history-manager.js is loaded
- Check for JavaScript errors
- Test on multiple Android browsers

**Issue: Videos not playing**
- Check video URLs are correct
- Verify CORS headers on video server
- Test adaptive bitrate streaming

**Issue: Age gate not appearing**
- Clear cookies and cache
- Check cookie settings
- Verify age-verification.ts logic

---

## 📞 Support & Resources

### Documentation:
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- shadcn/ui: https://ui.shadcn.com

### Emergency Contacts:
- Hosting Support: InfinityFree Dashboard
- Security Issues: security@rashidleaks.com
- Legal Inquiries: legal@rashidleaks.com
- DMCA Notices: dmca@rashidleaks.com

---

## ✅ Launch Checklist

Before going live:

- [ ] All features tested on mobile
- [ ] Android Back navigation verified
- [ ] Age gate functioning correctly
- [ ] Admin account created
- [ ] Legal pages reviewed by lawyer
- [ ] SSL certificate active
- [ ] Database backed up
- [ ] Monitoring configured
- [ ] Content moderation plan ready
- [ ] Domain DNS propagated (rashidleaks.wuaze.com)
- [ ] Performance optimized (Lighthouse score > 90)
- [ ] Security audit completed
- [ ] Terms of Service accepted by users
- [ ] Privacy policy compliant with regulations

---

## 🎉 You're Ready to Launch!

After completing all steps:

1. **Deploy code to InfinityFree**
2. **Run database migrations**
3. **Create admin account**
4. **Test everything again**
5. **Launch!**

**Your site will be live at:** https://rashidleaks.wuaze.com

---

*Built with ❤️ using Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui*
*Android Back Button Navigation: Fully Implemented ✓*
*Mobile-First Design: Optimized for Android Devices ✓*

**Version:** 1.0.0  
**Last Updated:** 2026-08-20  
**Framework:** Next.js 16 with App Router
