# GitHub Pages Deployment Guide

This guide explains how to deploy the frontend to GitHub Pages.

## ⚠️ Important Notes

- **Frontend Only**: GitHub Pages can only host the frontend. The backend API must run separately.
- **HashRouter**: The app uses HashRouter for GitHub Pages compatibility.
- **Base Path**: The app is configured for repository name `/VoteSystem/`. Update `vite.config.js` if your repo name differs.

## Prerequisites

1. GitHub repository
2. GitHub Pages enabled in repository settings
3. Node.js installed locally (for manual deployment)

## Deployment Methods

### Method 1: GitHub Actions (Automatic) - Recommended

The repository includes a GitHub Actions workflow that automatically deploys on push to `main` branch.

**Steps:**

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Select "GitHub Actions"

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Wait for deployment:**
   - Go to Actions tab
   - Watch the workflow run
   - Deployment completes in ~2-3 minutes

4. **Access your site:**
   - URL: `https://YOUR_USERNAME.github.io/VoteSystem/`

### Method 2: Manual Deployment with gh-pages

**Install gh-pages:**
```bash
cd frontend
npm install --save-dev gh-pages
```

**Deploy:**
```bash
cd frontend
npm run deploy
```

This will:
1. Build the production bundle
2. Deploy to `gh-pages` branch
3. Make it available on GitHub Pages

### Method 3: Manual Build & Upload

**Build:**
```bash
cd frontend
npm run build
```

**Upload dist folder:**
- Go to repository Settings → Pages
- Source: Select "Deploy from a branch"
- Branch: `gh-pages` / `main` / `master`
- Folder: `/dist` or `/frontend/dist`

## Configuration

### Update Base Path

If your repository name is NOT `VoteSystem`, update `frontend/vite.config.js`:

```javascript
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
```

### Update API Endpoint

For production, you'll need to:
1. Deploy backend separately (Heroku, Railway, Render, etc.)
2. Update API calls to use production backend URL
3. Or use environment variables

**Example:**
```javascript
// frontend/src/api/axiosConfig.js
const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.com/api'
    : '/api',
  // ...
});
```

## Troubleshooting

### 404 Errors on Routes

- **Solution**: Using HashRouter fixes this. Routes work as:
  - `https://username.github.io/VoteSystem/#/voter/login`
  - `https://username.github.io/VoteSystem/#/admin/login`

### Assets Not Loading

- **Solution**: Check `base` path in `vite.config.js` matches repository name

### API Calls Failing

- **Solution**: Backend must be deployed separately. Update API base URL in production.

### Build Fails

- **Solution**: 
  ```bash
  cd frontend
  rm -rf node_modules package-lock.json
  npm install
  npm run build
  ```

## Custom Domain (Optional)

1. Add `CNAME` file to `frontend/public/`:
   ```
   yourdomain.com
   ```

2. Update DNS records:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `YOUR_USERNAME.github.io`

3. In GitHub Pages settings, add custom domain

## Environment Variables

For production builds, create `.env.production`:

```env
VITE_API_URL=https://your-backend-api.com
```

Then update axios config to use it.

## Continuous Deployment

The GitHub Actions workflow automatically:
- Builds on push to `main`
- Deploys to GitHub Pages
- No manual steps needed after initial setup

## Backend Deployment

The backend needs separate hosting. Options:
- **Heroku**: Free tier available
- **Railway**: Free tier available
- **Render**: Free tier available
- **Vercel**: For serverless functions
- **DigitalOcean**: Paid but reliable

Update CORS in `backend/server.js` to allow your GitHub Pages domain.

## Security Notes

⚠️ **Remember**: This is a demo prototype. For production:
- Never expose backend credentials
- Use environment variables
- Enable HTTPS
- Add rate limiting
- Implement proper authentication

## Quick Deploy Checklist

- [ ] Repository created on GitHub
- [ ] Code pushed to `main` branch
- [ ] GitHub Pages enabled (Settings → Pages → GitHub Actions)
- [ ] Base path updated in `vite.config.js` (if repo name differs)
- [ ] Backend deployed separately (if needed)
- [ ] API endpoints updated for production
- [ ] Test deployment at `https://USERNAME.github.io/VoteSystem/`

---

**Need Help?** Check GitHub Pages documentation: https://docs.github.com/en/pages

