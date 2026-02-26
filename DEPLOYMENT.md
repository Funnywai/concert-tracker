# Deployment Guide

## Deploying to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `concert-log`)
3. Don't initialize with README (we already have one)
4. Click "Create repository"

### Step 2: Push Your Code to GitHub

Open your terminal in the project directory and run:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Concert Log app"

# Rename main branch to main (if needed)
git branch -M main

# Add your GitHub repository as remote
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/concert-log.git

# Push to GitHub
git push -u origin main
```

### Step 3: Deploy to GitHub Pages

1. Update the `base` path in `vite.config.ts`:
   ```typescript
   base: '/concert-log/', // Replace 'concert-log' with your repo name
   ```

2. Run the deploy command:
   ```bash
   npm run deploy
   ```

3. Go to your GitHub repository → Settings → Pages
4. Under "Source", select `gh-pages` branch
5. Click "Save"

6. Your app will be live at: `https://YOUR_USERNAME.github.io/concert-log/`

### Step 4: Update Base Path (Optional)

After deploying, update `vite.config.ts` with your actual repository name:

```typescript
base: '/concert-log/', // Change this to match your repo name
```

Then commit and push:

```bash
git add vite.config.ts
git commit -m "Update base path for GitHub Pages"
git push
```

## Alternative: Deploy to Vercel (Easier!)

Vercel is often easier for React apps:

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect it's a Vite app
4. Click "Deploy"
5. Your app will be live instantly at `https://your-app.vercel.app`

No configuration needed!

## Alternative: Deploy to Netlify

1. Go to https://app.netlify.com/new
2. Import your GitHub repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click "Deploy"

## Updating Your App After Deployment

Whenever you make changes:

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Your changes"
   ```

2. Push to GitHub:
   ```bash
   git push
   ```

3. For GitHub Pages, also run:
   ```bash
   npm run deploy
   ```

For Vercel/Netlify, they will auto-deploy when you push to GitHub!

## Troubleshooting

### 404 Error on GitHub Pages
- Make sure the `base` path in `vite.config.ts` matches your repository name
- Make sure the `gh-pages` branch exists
- Check that Pages is enabled in repository settings

### Build Fails
- Make sure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run build`

### Changes Not Showing
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Make sure you pushed to the correct branch
