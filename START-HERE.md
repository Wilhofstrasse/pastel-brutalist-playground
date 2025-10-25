# 🎯 START HERE - Deploy Your Site in 5 Minutes

## Your Recife Real Estate website is 100% ready!

**Domain:** www.brservices.ch
**Status:** Production Ready ✅

---

## 🚀 STEP 1: Deploy (2 minutes)

### Click this button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWilhofstrasse%2Fpastel-brutalist-playground&project-name=recife-real-estate&repository-name=recife-real-estate)

Vercel will:
- Connect your GitHub
- Deploy your site
- Give you a live URL

---

## 🔥 STEP 2: Setup Firebase (3 minutes)

### A. Add Authorized Domains
1. Go to: https://console.firebase.google.com/
2. Select project: **real-estate-recife**
3. Authentication → Settings → **Authorized domains**
4. Click **Add domain**
5. Add these three:
   - `brservices.ch`
   - `www.brservices.ch`
   - Your Vercel URL (e.g., `recife-real-estate.vercel.app`)

### B. Create Admin User
1. Still in Firebase Console
2. Authentication → **Users** → **Add user**
3. Email: `sombrasil01@bluewin.ch` (or your preferred email)
4. Password: Create a strong password (**save it!**)
5. Click **Add user**
6. **COPY THE USER UID** (long string like `AbCd1234...`)

### C. Add to Admins Collection
1. Go to: Firestore Database
2. Click **Start collection** or open `admins`
3. Collection ID: `admins`
4. Document ID: **PASTE THE USER UID** from step B
5. Add field:
   - Field: `email`
   - Type: `string`
   - Value: `sombrasil01@bluewin.ch`
6. Click **Save**

---

## 🌐 STEP 3: Connect Domain (1 minute)

In Vercel Dashboard:
1. Go to your project → **Settings** → **Domains**
2. Add: `brservices.ch`
3. Add: `www.brservices.ch`
4. Update DNS at your domain provider (Vercel shows you the records)

---

## ✅ DONE! Test Your Site

### Homepage:
Visit: `https://www.brservices.ch` (or your Vercel URL)

Check:
- Logo loads ✓
- Language switcher works ✓
- WhatsApp: +41 79 917 21 19 ✓
- Email: sombrasil01@bluewin.ch ✓
- Social media links work ✓

### Admin Panel:
Visit: `https://www.brservices.ch/admin.html`

1. Login with email/password from Firebase
2. Add your first property
3. Check it appears on homepage

---

## 🎉 Your Site is Live!

Everything is configured:
- ✅ Recife Real Estate branding
- ✅ www.brservices.ch domain
- ✅ Contact: +41 79 917 21 19
- ✅ Email: sombrasil01@bluewin.ch
- ✅ Instagram/Facebook: @brasil_reisen_abel_andrade
- ✅ Multi-language (PT, DE, EN)
- ✅ Firebase backend
- ✅ Admin panel
- ✅ Global CDN
- ✅ HTTPS/SSL

---

## 📚 Need More Info?

- `DEPLOY-NOW.md` - Quick deployment
- `VERCEL-DEPLOY.md` - Detailed Vercel guide
- `FIREBASE-SETUP.md` - Firebase setup
- `README.md` - Full documentation

---

## 🆘 Problems?

**Most common issue:** Firebase domain not authorized
- **Fix:** Add your Vercel URL to Firebase authorized domains (Step 2A above)

**Can't login to admin:**
- **Fix:** Make sure you created the admin user correctly (Step 2B-C above)

---

**Total time: 5 minutes. Then you're live!** 🚀
