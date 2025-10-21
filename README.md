# BR Services Real Estate Sales Platform

A modern, multilingual real estate sales platform built with Firebase and vanilla JavaScript. Perfect for real estate agencies looking to showcase premium properties with video presentations and multi-language support.

![Status](https://img.shields.io/badge/status-ready%20for%20deployment-green)
![License](https://img.shields.io/badge/license-private-red)

---

## 🌟 Features

### Public Website
- **📱 Fully Responsive** - Works perfectly on desktop, tablet, and mobile
- **🌍 Multi-language** - Portuguese, German, and English support
- **🎥 Video Integration** - YouTube embeds and video uploads
- **⚡ Fast & Modern** - Vanilla JavaScript, no heavy frameworks
- **🎨 Beautiful UI** - Elegant animations and professional design
- **📞 Direct Contact** - WhatsApp integration for instant inquiries
- **🔍 SEO Optimized** - Meta tags and Open Graph support

### Admin Panel
- **🔐 Secure Login** - Firebase Authentication
- **✏️ Property Management** - Full CRUD operations
- **🎬 Video Management** - YouTube links or file uploads with progress tracking
- **🌐 Multi-language Content** - Manage property details in PT, DE, EN
- **📊 Property Status** - Track Active, Sold, and Reserved properties
- **👥 Admin Management** - (Manual setup required - see Setup Guide)

---

## 🚀 Quick Start

### Prerequisites
- Firebase account with project created
- Web hosting (cPanel, Firebase Hosting, etc.)
- Domain name configured

### Installation

1. **Clone or download this repository**

2. **Configure the platform**
   ```bash
   # Edit config.js with your business information
   nano config.js
   ```
   Update:
   - Contact information (WhatsApp, email)
   - Social media links
   - Firebase configuration

3. **Set up Firebase**
   - Enable Authentication (Email/Password)
   - Create Firestore Database
   - Enable Storage
   - Configure security rules (see SETUP-GUIDE.md)

4. **Create admin users**
   - See [SETUP-GUIDE.md](SETUP-GUIDE.md) for detailed instructions
   - Must be done manually via Firebase Console

5. **Deploy to your hosting**
   ```bash
   # Upload all files to your web server
   # Ensure config.js has correct values
   ```

6. **Test everything**
   - Visit your website
   - Login to admin panel at /admin.html
   - Add your first property

---

## 📁 Project Structure

```
real-estate-sales-platform/
├── index.html              # Public homepage
├── admin.html              # Admin panel (requires login)
├── config.js               # Configuration file (UPDATE THIS!)
├── css/
│   ├── styles.css         # Homepage styles
│   └── admin.css          # Admin panel styles
├── js/
│   ├── main.js            # Homepage logic
│   └── translations.js    # Multi-language support
├── assets/
│   └── logo.png           # Company logo
├── DEPLOY.md              # Deployment instructions
├── SETUP-GUIDE.md         # Comprehensive setup guide
├── PROJECT-ANALYSIS.md    # Technical analysis
└── README.md              # This file
```

---

## ⚙️ Configuration

### Essential Configuration (Before Deployment)

Edit `config.js` and update:

```javascript
// Business contact information
contact: {
    whatsapp: "5581999999999",           // ⚠️ UPDATE THIS
    whatsappDisplay: "+55 (81) 9 9999-9999",  // ⚠️ UPDATE THIS
    email: "contact@brservices.com",      // ⚠️ UPDATE THIS
}

// Social media links
social: {
    instagram: "https://instagram.com/brservices",  // ⚠️ UPDATE THIS
    facebook: "https://facebook.com/brservices",    // ⚠️ UPDATE THIS
}
```

See [SETUP-GUIDE.md](SETUP-GUIDE.md) for complete configuration instructions.

---

## 🔥 Firebase Setup

### Required Services
1. **Authentication** - Email/Password enabled
2. **Firestore Database** - For storing properties
3. **Storage** - For video uploads

### Security Rules

**Firestore:**
```javascript
// Allow public read, authenticated admin write
match /properties/{propertyId} {
  allow read: if true;
  allow write: if request.auth != null &&
               exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}
```

**Storage:**
```javascript
// Allow public read, authenticated write
match /videos/{videoId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

See [SETUP-GUIDE.md](SETUP-GUIDE.md) for complete security rules.

---

## 👤 Creating Admin Users

⚠️ **IMPORTANT:** Admin users must be created manually via Firebase Console.

### Quick Steps:
1. Go to Firebase Console > Authentication
2. Add user with email and password
3. Copy the User UID
4. Go to Firestore > Create `admins` collection
5. Add document with User UID containing email field

See [SETUP-GUIDE.md](SETUP-GUIDE.md#creating-admin-users) for detailed instructions.

---

## 🌐 Deployment

### Option 1: cPanel/Shared Hosting
```bash
# Upload all files to /public_html/your-domain/
# Ensure config.js is configured
# Test at https://your-domain.com
```

### Option 2: Firebase Hosting
```bash
firebase init hosting
firebase deploy --only hosting
```

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.

---

## 📖 Documentation

- **[SETUP-GUIDE.md](SETUP-GUIDE.md)** - Complete setup and configuration guide
- **[DEPLOY.md](DEPLOY.md)** - Deployment instructions
- **[PROJECT-ANALYSIS.md](PROJECT-ANALYSIS.md)** - Technical analysis and roadmap

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Firebase (Authentication, Firestore, Storage)
- **Styling:** Custom CSS with CSS Variables
- **Fonts:** Google Fonts (Playfair Display, Montserrat, Inter)
- **Icons:** SVG icons

---

## 🌍 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📱 Responsive Design

- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

---

## 🔒 Security

- Firebase Authentication for admin access
- Firestore security rules for data protection
- Storage security rules for file uploads
- HTTPS required (SSL certificate)
- Client-side validation
- Server-side validation via Firebase rules

**Note:** The Firebase API key in the code is intentionally public - this is normal and secure for Firebase projects. Security is enforced via Firebase Security Rules.

---

## 🎯 Roadmap

### Current Status: v1.0 - Ready for Deployment

### Planned Improvements:
- [ ] Property image galleries
- [ ] Advanced search and filtering
- [ ] Property detail pages
- [ ] Contact form
- [ ] Newsletter signup
- [ ] Analytics integration
- [ ] Property comparison feature
- [ ] Map integration
- [ ] Virtual tours support
- [ ] Client testimonials section

---

## 📝 License

This is a private project. All rights reserved.

---

## 📞 Support

For setup assistance or questions:

1. Review [SETUP-GUIDE.md](SETUP-GUIDE.md)
2. Check [PROJECT-ANALYSIS.md](PROJECT-ANALYSIS.md)
3. Review Firebase Console for errors
4. Check browser console (F12) for errors

---

## ✅ Pre-Deployment Checklist

Before going live, ensure:

- [ ] `config.js` updated with real contact information
- [ ] `config.js` updated with real social media links
- [ ] Firebase project created and configured
- [ ] Firebase security rules set up
- [ ] Admin users created manually
- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] Test homepage loads correctly
- [ ] Test admin panel login works
- [ ] Test adding/editing/deleting properties
- [ ] Test multi-language functionality
- [ ] Test on mobile devices
- [ ] Test WhatsApp links
- [ ] Test social media links

---

## 🎉 Getting Started

1. Read [SETUP-GUIDE.md](SETUP-GUIDE.md)
2. Configure `config.js`
3. Set up Firebase
4. Create admin users
5. Deploy to hosting
6. Add your first properties
7. Share with clients!

---

**Built with ❤️ for BR Services Real Estate**
