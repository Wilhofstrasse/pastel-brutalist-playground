# ⚡ VERCEL AUTO-REDEPLOY INSTRUCTIONS

## Your Repository is Clean! ✅

Main branch now has:
- ✅ Recife Real Estate website (HTML/CSS/JS)
- ✅ All configuration (config.js)
- ✅ All contact info (Swiss number, email, social)
- ✅ Vercel configuration (vercel.json)
- ❌ NO old Lovable project files

## 🔄 Trigger Vercel Redeploy (3 Options):

### Option 1: Vercel Dashboard (Easiest)
1. Go to: https://vercel.com
2. Find your project: "recife-real-estate"
3. Click: **Deployments** tab
4. Click: **Redeploy** button (or the 3 dots → Redeploy)
5. Wait 60 seconds
6. ✅ Done! Visit https://recife-real-estate.vercel.app

### Option 2: Push a Small Change
```bash
# Add a comment to trigger redeploy
echo "# Updated: $(date)" >> README.md
git add README.md
git commit -m "Trigger redeploy"
git push
```

### Option 3: GitHub Actions (If Vercel is connected)
- Just push to main (already done!)
- Vercel auto-detects and redeploys

## 🗑️ Clean Up Old Branches

### Via GitHub Web:
1. Go to: https://github.com/Wilhofstrasse/pastel-brutalist-playground/branches
2. Delete these branches:
   - `real-estate-files` (old)
   - `codex/perform-thorough-testing-on-filipeandrade.com` (old)
   - Keep: `main` (production)
   - Keep: `claude/init-real-estate-project-011CULCEzDZjFP21Uonok9MJ` (working branch)

## ✅ After Redeploy:

Visit: https://recife-real-estate.vercel.app

You should see:
- ✅ "Recife Real Estate" (not old Lovable site)
- ✅ Portuguese/German/English switcher
- ✅ WhatsApp: +41 79 917 21 19
- ✅ Email: sombrasil01@bluewin.ch
- ✅ Instagram/Facebook links

## 🔥 Still Need to Do:

1. **Add Vercel URL to Firebase:**
   - Firebase Console → Authentication → Authorized domains
   - Add: `recife-real-estate.vercel.app`

2. **Connect Custom Domain:**
   - Vercel Dashboard → Settings → Domains
   - Add: `brservices.ch` and `www.brservices.ch`

3. **Create Admin User** (see FIREBASE-SETUP.md)

---

**Next:** Click Option 1 above to redeploy!
