# 🚀 Deployment Guide

Step-by-step guide to deploy the Mortgage Prepayment Calculator to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed locally
- Project files (already created)

## Step 1: Create GitHub Repository

```bash
# If repository doesn't exist yet, create it on GitHub
# Then connect your local repository:

cd /home/vpillai/temp/mortgage-calculator/mortgage-calculator

# Initialize git if not already done
git init

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/mortgage-calculator.git

# Verify remote
git remote -v
```

## Step 2: Prepare for Deployment

```bash
# Install dependencies
npm install

# Run tests to ensure everything works
npm test

# Run E2E tests (optional but recommended)
npm run test:e2e

# Build for production
npm run build

# Preview build locally
npm run preview
```

Visit `http://localhost:4173` to test the production build.

## Step 3: Configure GitHub Pages

### Option A: Using GitHub UI

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "feat: initial implementation of Canadian mortgage calculator"
   git push -u origin main
   ```

2. Go to repository settings on GitHub
3. Navigate to "Pages" section
4. Under "Source", select "GitHub Actions"
5. Save settings

The GitHub Actions workflow will automatically deploy on push to main.

### Option B: Using gh CLI

```bash
# Install gh CLI if not already installed
# brew install gh  (macOS)
# Or download from https://cli.github.com

# Authenticate
gh auth login

# Create repository and push
gh repo create mortgage-calculator --public --source=. --push

# Enable GitHub Pages
gh api repos/YOUR_USERNAME/mortgage-calculator/pages --method POST --field source[branch]=gh-pages
```

## Step 4: Update Vite Configuration

Update `vite.config.js` base path to match your repository name:

```javascript
export default defineConfig({
  base: '/mortgage-calculator/', // Change if repo name is different
  // ... rest of config
});
```

## Step 5: Commit and Push

```bash
# Stage all changes
git add .

# Commit with conventional commit message
git commit -m "feat: deploy Canadian mortgage calculator to GitHub Pages"

# Push to main branch (triggers deployment)
git push origin main
```

## Step 6: Monitor Deployment

1. Go to repository on GitHub
2. Click "Actions" tab
3. Watch the deployment workflow
4. Wait for all steps to complete (usually 2-5 minutes)

## Step 7: Access Your Deployed Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/mortgage-calculator/
```

## Verification Checklist

After deployment, verify:

- [ ] Site loads correctly
- [ ] Calculator performs calculations
- [ ] Theme toggle works
- [ ] Mobile responsive design works
- [ ] Comparison table functions
- [ ] All buttons and inputs work
- [ ] No console errors
- [ ] PWA installable

## Updating the Site

Any push to main branch will automatically trigger redeployment:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Wait for GitHub Actions to redeploy
```

## Custom Domain (Optional)

### 1. Add CNAME file

```bash
echo "yourdomain.com" > public/CNAME
git add public/CNAME
git commit -m "docs: add custom domain"
git push origin main
```

### 2. Configure DNS

Add these DNS records at your domain provider:
```
Type: A
Name: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153

Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

### 3. Update GitHub Settings

1. Go to repository Settings → Pages
2. Enter custom domain
3. Wait for DNS check to pass
4. Enable "Enforce HTTPS"

## Troubleshooting

### Deployment Failed

1. Check Actions tab for error logs
2. Verify all tests pass locally
3. Check build succeeds: `npm run build`
4. Review workflow file syntax

### Site Shows 404

1. Verify GitHub Pages is enabled
2. Check repository is public
3. Verify base path in vite.config.js
4. Wait a few minutes after deployment

### Site Loads But Broken

1. Check browser console for errors
2. Verify base path matches repository name
3. Check all asset paths are relative
4. Clear browser cache

### Tests Fail in CI But Pass Locally

1. Check Node.js version in workflow matches local
2. Verify all dependencies in package.json
3. Check for environment-specific issues
4. Review GitHub Actions logs

## Rollback

If deployment has issues:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or force push previous version
git reset --hard HEAD~1
git push -f origin main  # Use with caution!
```

## Monitoring

After deployment:

1. **Check Performance**:
   - Use Lighthouse in Chrome DevTools
   - Target: >90 score

2. **Test Functionality**:
   - Run through all user stories
   - Test on different devices
   - Verify calculations

3. **Monitor Analytics** (if added):
   - Track user engagement
   - Monitor error rates
   - Check performance metrics

## Advanced: Preview Deployments

For pull requests, you can add preview deployments:

1. Update `.github/workflows/deploy.yml`
2. Add preview environment configuration
3. PRs will get unique preview URLs

## Security

- ✅ No sensitive data in repository
- ✅ No API keys or secrets
- ✅ All data client-side only
- ✅ HTTPS enforced
- ✅ No external dependencies

## Performance Optimization

Before deployment:

```bash
# Analyze bundle size
npm run build -- --mode production

# Check dist/ folder size
du -sh dist/

# Should be < 5MB total
```

## Support

For deployment issues:
1. Check GitHub Pages documentation
2. Review GitHub Actions logs
3. Test build locally first
4. Verify all tests pass

---

**You're ready to deploy! 🚀**

Run `git push origin main` and watch your mortgage calculator go live!

