# Firebase Setup for Recife Real Estate (www.brservices.ch)

**Last Updated:** 2025-10-21
**Domain:** www.brservices.ch
**Contact:** +41 79 917 21 19 | sombrasil01@bluewin.ch

---

## ⚠️ CRITICAL: Add Authorized Domain to Firebase

**BEFORE deploying to www.brservices.ch, you MUST add the domain to Firebase:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **real-estate-recife**
3. Go to **Authentication** > **Settings** > **Authorized domains**
4. Click **Add domain**
5. Enter: `brservices.ch`
6. Also add: `www.brservices.ch`
7. Click **Add**

**Without this step, authentication will fail on your live website!**

---

## Final Deployment Checklist

### ✅ Configuration Complete
- [x] Business name: **Recife Real Estate**
- [x] Domain: **www.brservices.ch**
- [x] WhatsApp: **+41 79 917 21 19** (Swiss number)
- [x] Email: **sombrasil01@bluewin.ch**
- [x] Instagram: **@brasil_reisen_abel_andrade**
- [x] Facebook: **brasil_reisen_abel_andrade**
- [x] All HTML files updated with correct branding
- [x] All contact links updated
- [x] Favicon added (using logo.png)

### 🔥 Firebase Setup Required

#### 1. Add Authorized Domains
- [ ] Add `brservices.ch` to Firebase authorized domains
- [ ] Add `www.brservices.ch` to Firebase authorized domains

#### 2. Verify Services are Enabled
- [ ] Authentication > Email/Password is enabled
- [ ] Firestore Database is created
- [ ] Storage is enabled

#### 3. Security Rules

**Firestore Rules** (Go to Firestore > Rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Properties - public read, admin write
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if request.auth != null &&
                   exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // Admins - only authenticated admins can read/write
    match /admins/{adminId} {
      allow read, write: if request.auth != null &&
                         exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

**Storage Rules** (Go to Storage > Rules):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Videos - public read, authenticated write
    match /videos/{videoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

#### 4. Create First Admin User

**Step 1: Create User in Authentication**
1. Go to **Authentication** > **Users**
2. Click **Add user**
3. Email: `sombrasil01@bluewin.ch` (or your preferred admin email)
4. Password: Create a strong password (save it securely!)
5. Click **Add user**
6. **COPY THE USER UID** (you'll need it in step 2)

**Step 2: Add User to Admins Collection**
1. Go to **Firestore Database**
2. Click **Start collection** (if first time) or navigate to `admins` collection
3. Collection ID: `admins`
4. Document ID: **PASTE THE USER UID** from step 1
5. Add these fields:
   - Field: `email` | Type: string | Value: `sombrasil01@bluewin.ch`
   - Field: `createdAt` | Type: timestamp | Value: (current date/time)
   - Field: `createdBy` | Type: string | Value: `manual setup`
6. Click **Save**

**Now you can login to the admin panel with that email and password!**

---

## Deployment to www.brservices.ch

### Upload Files via cPanel

1. **Login to cPanel**
   - URL: (your hosting cPanel URL)
   - Username: (your hosting username)
   - Password: (your hosting password)

2. **Navigate to File Manager**
   - Go to `/public_html/brservices.ch/` or `/public_html/`
   - Delete any old files if exists

3. **Upload Project Files**

   Upload these files:
   ```
   ✓ index.html
   ✓ admin.html
   ✓ config.js
   ✓ css/ (folder with styles.css, admin.css)
   ✓ js/ (folder with main.js, translations.js)
   ✓ assets/ (folder with logo.png)
   ```

   **DO NOT upload:**
   - README.md, DEPLOY.md, SETUP-GUIDE.md (documentation only)
   - PROJECT-ANALYSIS.md, FIREBASE-SETUP.md (documentation only)
   - .git folder
   - .gitignore

4. **Set Permissions**
   - Files: 644
   - Folders: 755

5. **Verify Upload**
   - Check all files are in correct locations
   - Ensure `index.html` is in the root directory

---

## Testing After Deployment

### Test Homepage
1. Visit: `https://www.brservices.ch`
2. Check:
   - [ ] Logo loads correctly
   - [ ] Language switcher works (PT, DE, EN)
   - [ ] All text displays correctly
   - [ ] WhatsApp link opens with correct number (+41 79 917 21 19)
   - [ ] Email link opens with correct email (sombrasil01@bluewin.ch)
   - [ ] Social media links go to Instagram/Facebook profiles
   - [ ] Properties section shows (may be empty if no properties added yet)
   - [ ] Mobile responsive design works

### Test Admin Panel
1. Visit: `https://www.brservices.ch/admin.html`
2. Check:
   - [ ] Login page loads correctly
   - [ ] Can login with admin credentials
   - [ ] Dashboard loads after login
   - [ ] Can add new property
   - [ ] Can edit existing property
   - [ ] Can delete property
   - [ ] Video upload works
   - [ ] YouTube embed works
   - [ ] Logout works

### Test on Multiple Devices
- [ ] Desktop (Chrome, Firefox, Safari, Edge)
- [ ] Mobile (iOS Safari, Chrome)
- [ ] Tablet

---

## Common Issues & Solutions

### Issue: "Authentication domain not whitelisted"
**Solution:** Add `brservices.ch` to Firebase authorized domains (see top of this document)

### Issue: Properties not loading
**Solution:**
- Check Firebase config in `config.js` is correct
- Check Firestore security rules allow public read
- Check browser console (F12) for errors

### Issue: Admin login fails
**Solution:**
- Verify user exists in Firebase Authentication
- Verify user UID is in `admins` collection in Firestore
- Check Firebase authorized domains includes your domain

### Issue: Video upload fails
**Solution:**
- Check file size (max 100MB)
- Check Storage security rules
- Ensure logged in as admin

---

## Next Steps After Deployment

1. **Add Properties**
   - Login to admin panel
   - Add your first property with:
     - Title in PT, DE, EN
     - Description
     - Price
     - Size (m²)
     - Location
     - Video (YouTube link or upload)

2. **Test Everything**
   - Add 2-3 test properties
   - View them on homepage
   - Test all languages
   - Test WhatsApp links
   - Test on mobile

3. **Go Live**
   - Share website link
   - Post on social media
   - Add to business cards

---

## Support Contacts

**Firebase Project:** real-estate-recife
**Domain:** www.brservices.ch
**Business Contact:** +41 79 917 21 19
**Email:** sombrasil01@bluewin.ch

---

## Files Summary

### Updated for Recife Real Estate:
- ✅ `config.js` - All contact info and social media
- ✅ `index.html` - Branding, contacts, meta tags, favicon
- ✅ `admin.html` - Branding, favicon
- ✅ `js/main.js` - WhatsApp number in property cards

### Documentation:
- `README.md` - Project overview
- `SETUP-GUIDE.md` - Complete setup instructions
- `PROJECT-ANALYSIS.md` - Technical analysis
- `DEPLOY.md` - Original deployment notes
- `FIREBASE-SETUP.md` - This file

---

**Your Recife Real Estate platform is ready for deployment! 🎉**

Just follow the checklist above, and you'll be live on www.brservices.ch
