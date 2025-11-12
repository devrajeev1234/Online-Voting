# GitHub Pages Setup - Show Website Instead of README

Follow these steps to deploy your React website to GitHub Pages:

## Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select: **GitHub Actions**
5. Click **Save**

## Step 2: Update Base Path (If Needed)

If your repository name is **NOT** "VoteSystem", you need to update the base path:

1. Open `frontend/vite.config.js`
2. Find this line:
   ```javascript
   base: process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/' : '/'),
   ```
3. If the automatic detection doesn't work, manually set it:
   ```javascript
   base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
   ```
   Replace `YOUR_REPO_NAME` with your actual repository name.

## Step 3: Push to Main Branch

The GitHub Actions workflow will automatically deploy when you push to `main`:

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## Step 4: Wait for Deployment

1. Go to the **Actions** tab in your repository
2. You'll see the workflow running
3. Wait for it to complete (usually 2-3 minutes)
4. Once done, you'll see a green checkmark

## Step 5: Access Your Website

Your website will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

For example, if your username is `john` and repo is `VoteSystem`:
```
https://john.github.io/VoteSystem/
```

## Troubleshooting

### Website Shows 404 or Blank Page

1. **Check the base path** - Make sure it matches your repository name
2. **Check Actions tab** - Look for any build errors
3. **Wait a few minutes** - GitHub Pages can take 1-5 minutes to update

### Base Path Issues

If you see 404 errors, the base path is likely wrong. To fix:

1. Check your repository name on GitHub
2. Update `frontend/vite.config.js` with the correct base path
3. Push the changes and wait for redeployment

### Manual Base Path Override

You can also set it via environment variable in the workflow:

```yaml
- name: Build
  working-directory: ./frontend
  run: npm run build
  env:
    NODE_ENV: production
    VITE_BASE_PATH: '/YOUR_REPO_NAME/'
```

## Verify Deployment

After deployment, you should see:
- ✅ Your React app loads correctly
- ✅ All routes work (using HashRouter, so URLs will have `#`)
- ✅ Assets (CSS, JS, images) load properly

## Important Notes

- **HashRouter**: The app uses HashRouter, so URLs will look like:
  - `https://username.github.io/repo/#/voter/login`
  - `https://username.github.io/repo/#/admin/login`

- **Backend API**: The frontend will try to call `/api` endpoints. For production, you'll need to:
  1. Deploy the backend separately (Heroku, Railway, etc.)
  2. Update the API base URL in the frontend code

- **Automatic Deployment**: Every push to `main` will trigger a new deployment

## Quick Test

After setup, visit your GitHub Pages URL. You should see:
- The landing page with "Welcome to the Online Voting System"
- Voter Login and Admin Login buttons
- No 404 errors

If everything works, your website is successfully deployed! 🎉

