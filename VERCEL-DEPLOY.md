# Vercel Deployment Guide for Recife Real Estate

**Domain:** www.brservices.ch
**Last Updated:** 2025-10-21

---

## ✅ Pre-Deployment Checklist

Your project is ready for Vercel deployment:

- ✅ `vercel.json` - Vercel configuration created
- ✅ `.vercelignore` - Unnecessary files excluded
- ✅ Static HTML/CSS/JS files ready
- ✅ All contact information configured
- ✅ Domain: www.brservices.ch

---

## 🚀 Deploy to Vercel (2 Methods)

### **Method 1: Vercel CLI (Fastest)**

#### Step 1: Login to Vercel
```bash
vercel login
```
This will open your browser for authentication. Login with your Vercel account.

#### Step 2: Deploy
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Select your account
- **Link to existing project?** → `N` (No, it's a new project)
- **Project name?** → `recife-real-estate` (or your preferred name)
- **In which directory is your code?** → `.` (current directory)
- **Want to modify settings?** → `N` (No)

Vercel will deploy and give you a URL like: `https://recife-real-estate-xxx.vercel.app`

#### Step 3: Deploy to Production
```bash
vercel --prod
```

This deploys to production and gives you the final URL.

---

### **Method 2: GitHub Integration (Recommended for Auto-Deploy)**

#### Step 1: Push to GitHub (Already Done ✅)
Your code is already on GitHub in branch: `claude/init-real-estate-project-011CULCEzDZjFP21Uonok9MJ`

#### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Select **Import Git Repository**
4. Choose your GitHub repository: `Wilhofstrasse/pastel-brutalist-playground`
5. Configure:
   - **Branch:** `claude/init-real-estate-project-011CULCEzDZjFP21Uonok9MJ`
   - **Framework Preset:** Other (or leave as detected)
   - **Root Directory:** `./` (root)
   - **Build Command:** Leave empty (it's static files)
   - **Output Directory:** Leave empty
6. Click **Deploy**

Vercel will automatically deploy your site!

**Benefits of GitHub Integration:**
- ✅ Every push automatically deploys
- ✅ Preview deployments for branches
- ✅ Rollback capability
- ✅ Deployment history

---

## 🌐 Connect Your Custom Domain (www.brservices.ch)

After deployment, connect your domain:

### In Vercel Dashboard:

1. Go to your project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter: `brservices.ch`
4. Click **Add**
5. Also add: `www.brservices.ch`

### Configure DNS at Your Domain Provider:

Vercel will show you DNS records to add. Typically:

**For apex domain (brservices.ch):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Or use Vercel nameservers** (recommended):
- ns1.vercel-dns.com
- ns2.vercel-dns.com

---

## 🔥 Firebase Configuration for Vercel

### CRITICAL: Update Firebase Authorized Domains

After deploying to Vercel, add these domains to Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **real-estate-recife**
3. **Authentication** → **Settings** → **Authorized domains**
4. Add these domains:
   - `brservices.ch` ✅
   - `www.brservices.ch` ✅
   - Your Vercel deployment URL (e.g., `recife-real-estate.vercel.app`) ✅

**Without this, Firebase authentication will fail on your live site!**

---

## 📋 Environment Variables (If Needed)

Vercel supports environment variables. For this project:

**Currently:** Firebase config is in the code (this is normal and secure for client-side Firebase)

**If you want to use env variables later:**
1. Project Settings → Environment Variables
2. Add:
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - etc.

---

## ✅ Post-Deployment Testing

After deployment, test:

### Homepage (https://www.brservices.ch or your Vercel URL):
- [ ] Loads correctly
- [ ] Language switcher works (PT, DE, EN)
- [ ] Properties section loads (may be empty initially)
- [ ] WhatsApp link: +41 79 917 21 19
- [ ] Email link: sombrasil01@bluewin.ch
- [ ] Social media links work
- [ ] Mobile responsive

### Admin Panel (/admin.html):
- [ ] Login page loads
- [ ] Can login with admin credentials
- [ ] Can add properties
- [ ] Properties appear on homepage
- [ ] Video upload works
- [ ] YouTube embed works

---

## 🔧 Vercel Settings for This Project

### Performance:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ HTTP/2
- ✅ Brotli compression
- ✅ Image optimization (for future images)

### Headers (already configured in vercel.json):
- ✅ Security headers (X-Frame-Options, etc.)
- ✅ Cache control for static assets

---

## 🚨 Common Issues

### Issue: "Firebase authentication domain not whitelisted"
**Solution:** Add your Vercel URL to Firebase authorized domains (see above)

### Issue: "404 on admin.html"
**Solution:** Vercel should serve it automatically. If not, check vercel.json routing

### Issue: "Properties not loading"
**Solution:**
- Check browser console (F12)
- Verify Firebase config in config.js
- Check Firebase security rules

---

## 📊 Vercel vs cPanel Deployment

| Feature | Vercel | cPanel |
|---------|--------|--------|
| **Speed** | Global CDN, very fast | Server location dependent |
| **HTTPS** | Automatic, free | Depends on hosting |
| **Deployments** | Git push = auto deploy | Manual upload |
| **Rollback** | One-click | Manual |
| **Preview** | Every branch/PR | No |
| **Cost** | Free tier available | Depends on hosting |

---

## 🎯 Recommended: Use Both!

**Vercel** (Primary):
- Main production site
- Fast, global CDN
- Auto-deployments from Git
- Free tier includes custom domain

**cPanel** (Backup):
- Emergency fallback
- Direct file access if needed

---

## 📝 Quick Commands

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Remove deployment
vercel remove [deployment-url]
```

---

## ✨ Benefits of Vercel for This Project

1. **Fast Deployment:** Push to Git → Auto deploy (30 seconds)
2. **Global CDN:** Your site loads fast worldwide
3. **Free HTTPS:** Automatic SSL certificate
4. **Easy Domain:** Connect www.brservices.ch in minutes
5. **Preview URLs:** Test changes before going live
6. **Zero Config:** Works with your static HTML/CSS/JS
7. **Analytics:** See visitor stats (paid tier)

---

## 🔄 Deployment Workflow

### Development:
```bash
# Make changes locally
# Test locally (open index.html in browser)

# Commit changes
git add .
git commit -m "Update property details"
git push
```

### With Vercel GitHub Integration:
- ✅ Push triggers automatic deployment
- ✅ Preview deployment created
- ✅ Check preview URL
- ✅ Merge to main → Production deployment

---

## 📞 Support

**Vercel Documentation:** https://vercel.com/docs
**Vercel Support:** https://vercel.com/support

**Your Project:**
- GitHub: `Wilhofstrasse/pastel-brutalist-playground`
- Branch: `claude/init-real-estate-project-011CULCEzDZjFP21Uonok9MJ`
- Domain: www.brservices.ch

---

## 🎉 Ready to Deploy!

Your Recife Real Estate platform is fully configured and ready for Vercel deployment!

**Next Steps:**
1. Run `vercel login` in terminal
2. Run `vercel` to deploy
3. Connect your domain (www.brservices.ch)
4. Add Vercel URL to Firebase authorized domains
5. Test everything
6. Share with clients!

---

**Questions?** Check the Vercel docs or run `vercel help`
