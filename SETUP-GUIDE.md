# BR Services Real Estate Platform - Setup Guide

This guide will walk you through setting up and configuring the BR Services Real Estate Sales Platform for production use.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Configuration](#configuration)
3. [Firebase Setup](#firebase-setup)
4. [Creating Admin Users](#creating-admin-users)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- [ ] A Firebase account and project set up
- [ ] Web hosting (cPanel, Firebase Hosting, or similar)
- [ ] Domain name configured (brservices.ch)
- [ ] SSL certificate installed
- [ ] Business contact information (phone, email, social media)

---

## Configuration

### Step 1: Update Business Information

Edit `config.js` and update the following sections:

#### Contact Information
```javascript
contact: {
    whatsapp: "5581999999999",  // Your WhatsApp number (international format, no +)
    whatsappDisplay: "+55 (81) 9 9999-9999",  // Formatted for display
    email: "your-email@brservices.com",  // Your business email
}
```

#### Social Media Links
```javascript
social: {
    instagram: "https://instagram.com/your-username",
    facebook: "https://facebook.com/your-page",
    // Add others as needed
}
```

### Step 2: Verify Firebase Configuration

The Firebase configuration in `config.js` should match your Firebase project. If you need to update it:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > General
4. Scroll to "Your apps" and copy the configuration
5. Update `config.js` with the new values

---

## Firebase Setup

### Step 1: Enable Required Services

In your Firebase Console:

#### 1. Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password**
3. Click **Save**

#### 2. Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Production mode**
4. Select a location close to your users
5. Update security rules (see below)

#### 3. Storage
1. Go to **Storage**
2. Click **Get started**
3. Use default security rules
4. Update security rules (see below)

### Step 2: Configure Security Rules

#### Firestore Security Rules

Go to **Firestore Database** > **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Properties collection - public read, admin write
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // Admins collection - only readable/writable by authenticated admins
    match /admins/{adminId} {
      allow read, write: if request.auth != null && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

#### Storage Security Rules

Go to **Storage** > **Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Videos - public read, admin write
    match /videos/{videoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 3: Add Authorized Domain

1. Go to **Authentication** > **Settings** > **Authorized domains**
2. Click **Add domain**
3. Add your domain: `brservices.ch` or `www.brservices.ch`
4. Click **Add**

---

## Creating Admin Users

⚠️ **IMPORTANT:** The "Add Admin" feature in the admin panel will NOT work in production. You must create admin users manually.

### Method 1: Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** > **Users**
4. Click **Add user**
5. Enter email and password
6. Click **Add user**
7. Copy the User UID
8. Go to **Firestore Database**
9. Click **Start collection**
10. Collection ID: `admins`
11. Document ID: (paste the User UID)
12. Add fields:
    - `email` (string): the admin's email
    - `createdAt` (timestamp): current date/time
    - `createdBy` (string): "manual"
13. Click **Save**

### Method 2: Firebase CLI

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Create user (requires Firebase Admin SDK)
# Contact developer for automated script
```

---

## Deployment

### Option 1: cPanel Deployment

1. **Clean the server directory:**
   ```
   Delete old files from /public_html/brservices.ch/
   ```

2. **Upload files:**
   - Upload all files from this repository
   - Ensure `config.js` is updated with correct values
   - Upload to correct directory

3. **Verify:**
   - Visit https://brservices.ch
   - Check homepage loads
   - Check admin.html loads
   - Test language switcher
   - Test property display

### Option 2: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase Hosting
firebase init hosting

# Select your project
# Set public directory to current directory
# Configure as single-page app: No
# Don't overwrite files

# Deploy
firebase deploy --only hosting
```

---

## Testing

### Homepage Testing

- [ ] Homepage loads at https://brservices.ch
- [ ] Logo displays correctly
- [ ] Language switcher works (PT, DE, EN)
- [ ] Properties load from Firebase
- [ ] Videos display correctly (YouTube and uploaded)
- [ ] WhatsApp button opens correct number
- [ ] Email button opens correct email
- [ ] Social media links go to correct profiles
- [ ] Mobile responsive design works
- [ ] All animations work smoothly

### Admin Panel Testing

- [ ] Admin panel loads at https://brservices.ch/admin.html
- [ ] Login works with admin credentials
- [ ] Can view all properties
- [ ] Can add new property
- [ ] Can edit existing property
- [ ] Can delete property
- [ ] YouTube video embedding works
- [ ] Video upload works (with progress bar)
- [ ] Multi-language fields save correctly
- [ ] Logout works correctly

### Cross-Browser Testing

Test on:
- [ ] Chrome (desktop & mobile)
- [ ] Firefox
- [ ] Safari (desktop & mobile)
- [ ] Edge

---

## Troubleshooting

### Issue: Properties not loading

**Possible causes:**
1. Firebase configuration incorrect
2. Firestore security rules too restrictive
3. No properties in database yet

**Solution:**
- Check browser console for errors (F12)
- Verify Firebase config in `config.js`
- Check Firestore Database has properties collection
- Review security rules

### Issue: Admin login fails

**Possible causes:**
1. User not created in Firebase Authentication
2. User UID not added to `admins` collection
3. Incorrect email/password

**Solution:**
- Verify user exists in Firebase Console > Authentication
- Verify user UID exists in Firestore > admins collection
- Try password reset if needed

### Issue: Video upload fails

**Possible causes:**
1. File too large (>100MB)
2. Storage security rules too restrictive
3. Not authenticated

**Solution:**
- Check file size
- Review Storage security rules
- Ensure logged in as admin

### Issue: WhatsApp link doesn't work

**Possible causes:**
1. WhatsApp number incorrectly formatted
2. WhatsApp not installed on device

**Solution:**
- Verify number format in `config.js`: `5581999999999` (no + or spaces)
- Test on device with WhatsApp installed

---

## Next Steps After Setup

1. **Add Your First Properties**
   - Login to admin panel
   - Add 3-5 test properties
   - Verify they display correctly on homepage

2. **Customize Branding**
   - Replace logo.png with your logo
   - Update colors in CSS if needed
   - Update meta tags for SEO

3. **Set Up Analytics** (Optional)
   - Add Google Analytics
   - Track property views
   - Monitor conversions

4. **Marketing**
   - Share website link
   - Post on social media
   - Add to business cards
   - Set up Google My Business

---

## Support

If you encounter issues:

1. Check [PROJECT-ANALYSIS.md](PROJECT-ANALYSIS.md) for detailed technical information
2. Review [DEPLOY.md](DEPLOY.md) for deployment-specific instructions
3. Check Firebase Console for errors
4. Review browser console for JavaScript errors

---

## Security Checklist

Before going live:

- [ ] Firebase security rules configured
- [ ] SSL certificate installed
- [ ] Admin passwords are strong
- [ ] Contact information is correct
- [ ] Social media links are correct
- [ ] Test all functionality
- [ ] Backup Firebase data
- [ ] Document admin credentials securely

---

**Your BR Services Real Estate Platform is ready to go live!** 🎉
