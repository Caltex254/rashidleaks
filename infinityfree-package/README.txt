# RASHID LEAKS - InfinityFree Deployment Package

## 📋 Overview
This is a static frontend package for deploying RASHID LEAKS on **InfinityFree** hosting. It connects to the main backend hosted on **Vercel** at `https://rashidleaks.vercel.app`.

## 🚀 Quick Deployment Steps

### 1. Upload Files to InfinityFree
- Extract all files from this ZIP to your InfinityFree public_html directory (usually `htdocs` or `public_html`)
- Required files:
  - `index.html` (main page)
  - `styles.css` (all styling)
  - `app.js` (application logic)
  - `.htaccess` (Apache configuration)

### 2. File Structure
```
/public_html (or htdocs)
├── index.html      # Main HTML file
├── styles.css      # CSS styles
├── app.js          # JavaScript application
└── .htaccess       # Apache configuration
```

### 3. Access Your Site
After uploading, your site will be available at:
- **Your Domain**: https://rashidleaks.wuaze.com

## ✨ Features Included

### Frontend Features
- ✅ **Splash Screen**: Cool 3-second loading animation with 18+ branding
- ✅ **Age Verification Gate**: Modal requiring users to confirm they're 18+
- ✅ **Responsive Design**: Mobile-first, works perfectly on Android devices
- ✅ **Video Sections**: Featured, Trending, Categories, Creators
- ✅ **Authentication**: Login/Register modals connecting to Vercel API
- ✅ **Search Functionality**: Real-time search with API integration
- ✅ **Admin Support**: Admin users redirected to admin panel
- ✅ **Android Back Button**: Proper History API support

### Security Features
- 🔒 **HTTPS Enforced**: Automatic redirect to SSL
- 🛡️ **Security Headers**: X-Frame-Options, CSP, XSS Protection
- 🚫 **Bot Blocking**: Blocks malicious scrapers
- 🔐 **API Protection**: All API calls go through secure Vercel backend
- 📦 **GZIP Compression**: Faster load times
- ⚡ **Browser Caching**: Optimized cache headers

### Performance
- ⚡ **Optimized Assets**: Minified CSS and JS
- 🖼️ **Lazy Loading**: Images load as needed
- 📱 **Mobile Optimized**: Touch-friendly, fast on mobile
- 🎨 **Smooth Animations**: CSS-based animations for performance

## 🔧 Configuration

### Backend URL
The frontend is configured to connect to:
```
https://rashidleaks.vercel.app
```

To change this, edit `app.js` and update:
```javascript
const CONFIG = {
    API_URL: 'https://your-backend-url.com',
    // ...
};
```

### Customization

#### Change Brand Colors
Edit `styles.css` and update CSS variables:
```css
:root {
    --accent-red: #ef4444;
    --accent-pink: #ec4899;
    /* ... */
}
```

#### Update Content
Edit `app.js` mock data functions:
```javascript
function getMockVideos() { /* ... */ }
function getMockCategories() { /* ... */ }
function getMockCreators() { /* ... */ }
```

## 🔑 Authentication

### Admin Login
- **URL**: https://rashidleaks.wuaze.com
- **Email**: admin@rashidleaks.com (or your admin email)
- **Password**: waynengeno
- **Redirect**: Admins are automatically redirected to admin panel

### User Registration
- No date of birth field (removed per requirements)
- No country selection (removed per requirements)
- Simple 18+ checkbox confirmation required
- Password must be 8+ characters

## 📱 Mobile & Android Support

### Back Button Navigation
The app uses the History API for proper Android back button support:
- Closes modals on back press
- Prevents accidental exits
- Maintains navigation state

### Touch Optimization
- Minimum touch target size: 44px
- Proper spacing between interactive elements
- Smooth scrolling and gestures

## 🌐 Browser Support

- Chrome/Android Browser 80+
- Safari iOS 13+
- Firefox 75+
- Edge 80+
- Samsung Internet 13+

## 📞 Support

For issues or questions:
- Check browser console for errors
- Verify all files uploaded correctly
- Ensure .htaccess is in root directory
- Confirm API endpoint is accessible

## 📄 Legal Notice

This platform contains adult content. By deploying and using this software, you confirm:
- You are at least 18 years old
- You comply with local laws regarding adult content
- You have proper age verification systems in place
- You comply with DMCA and content regulations

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Platform**: RASHID LEAKS Premium Adult Video Platform
