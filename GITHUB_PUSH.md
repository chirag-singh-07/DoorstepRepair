# GitHub Push Guide

## Pre-Push Checklist

Before pushing to GitHub, ensure these files are NOT included:

✅ **Will be ignored** (safe to push):
- ✓ `.env` - Contains secrets
- ✓ `node_modules/` - Dependencies
- ✓ `dist/` - Build output
- ✓ `.DS_Store` - OS files
- ✓ IDE folders (`.vscode/`, `.idea/`)

✅ **Safe to include** (will be pushed):
- ✓ Source code (`client/`, `server/`, `shared/`)
- ✓ Configuration files (`tsconfig.json`, `vite.config.ts`, `drizzle.config.ts`)
- ✓ `.env.example` - Template (no secrets)
- ✓ Documentation (README, DEPLOYMENT.md, etc.)
- ✓ GitHub Actions workflows
- ✓ Package files (`package.json`)

---

## Step 1: Initialize Git (if not already done)

```bash
cd c:\Users\chirag singh\Desktop\DoorstepRepair
git init
git branch -M main
```

---

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in details:
   - **Repository name**: `doorstep-repair` (or your choice)
   - **Description**: `Doorstep mobile repair booking platform`
   - **Public** or **Private**: Your choice
   - **Initialize with**: Do NOT check anything (you already have files)
3. Click "Create repository"
4. **Copy the repository URL** (HTTPS or SSH)

---

## Step 3: Add Remote & First Push

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/doorstep-repair.git

# Stage all files (respects .gitignore)
git add .

# Verify what will be committed (optional but recommended)
git status

# Commit
git commit -m "Initial commit: Doorstep Repair booking platform"

# Push to GitHub
git push -u origin main
```

---

## Step 4: Verify on GitHub

1. Refresh your GitHub repo page
2. You should see:
   - ✓ `client/`, `server/`, `shared/` folders
   - ✓ Configuration files
   - ✓ Documentation
   - ✗ No `.env` file (ignored)
   - ✗ No `node_modules/` (ignored)
   - ✗ No `dist/` (ignored)

---

## Important: Never Commit Secrets

❌ **NEVER commit to GitHub:**
- `.env` (with real database URLs, API keys)
- Passwords or API keys
- Private credentials

✅ **Instead:**
- Use `.env.example` with placeholder values
- Store actual secrets in platform (Render/Vercel) environment variables
- Use GitHub Secrets for CI/CD

---

## Common Git Commands

```bash
# Check status
git status

# View changes
git diff

# Add specific files only
git add client/src/App.tsx

# Commit changes
git commit -m "feat: add booking feature"

# Push to GitHub
git push
```

---

## After First Push

### Setting Up CI/CD (Optional)

After pushing, the GitHub Actions workflow will be available:
- Go to your repo → **Actions** tab
- Select "Keep Alive Cron" workflow
- It will run every 10 minutes automatically

### Adding Collaborators

1. Repo Settings → Collaborators
2. Add team members

### Branch Protection (Recommended)

1. Repo Settings → Branches
2. Add rule for `main` branch
3. Require pull requests before merge

---

## Troubleshooting

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://your-repo-url.git
```

### ".env file is being tracked"
```bash
# Remove .env from git tracking (keeps local copy)
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

### "Nothing to commit"
```bash
# Check if .gitignore is excluding everything
git status --ignored
```

---

## First Time GitHub Setup

If you haven't configured Git globally:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# For single repo only:
# git config user.name "Your Name"
# git config user.email "your.email@example.com"
```

---

## Done! ✅

Your project is now on GitHub and ready for:
- Deployment (connect to Render/Vercel)
- Collaboration
- Automatic backups
- Version control

**Next:** Deploy to Render or Vercel following `DEPLOYMENT.md`
