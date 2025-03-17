# Git Deployment Guide for Justice Minds Projects

This guide provides step-by-step instructions for setting up Git repositories and connecting them to Supabase and Vercel for Justice Minds projects.

## Initial Git Setup

```bash
# Initialize Git in the project folder
git init

# Configure Git with Justice Minds credentials
git config user.name "justicemindsdev"
git config user.email "justice@justice-minds.com"

# Add all files to the repository
git add .

# Create initial commit
git commit --no-verify -m "Initial commit"
```

## GitHub Repository Setup

1. Create a new repository on GitHub under the justicemindsdev organization
2. Add a deploy key for secure authentication:

```bash
# Generate an SSH key (press Enter for all prompts to use defaults)
ssh-keygen -t rsa -b 4096 -C "justice@justice-minds.com" -f ~/.ssh/github_justiceminds_rsa

# Display the public key to copy to GitHub
cat ~/.ssh/github_justiceminds_rsa.pub
```

3. Add the displayed public key to GitHub:
   - Go to the repository on GitHub
   - Navigate to Settings > Deploy keys
   - Click "Add deploy key"
   - Enter a title (e.g., "Project Deploy Key")
   - Paste the public key
   - Check "Allow write access"
   - Click "Add key"

4. Configure SSH to use the key:

```bash
# Create or update SSH config
echo -e "Host github.com\n  HostName github.com\n  User git\n  IdentityFile ~/.ssh/github_justiceminds_rsa\n  IdentitiesOnly yes" > ~/.ssh/config
```

5. Connect and push to the repository:

```bash
# Add the remote repository
git remote add origin git@github.com:justicemindsdev/[REPOSITORY-NAME].git

# Push to GitHub
git push -u origin main
```

## Vercel Integration

1. Log in to Vercel and create a new project
2. Connect to the GitHub repository:
   - Select the justicemindsdev organization
   - Select the repository
   - Configure project settings as needed
   - Deploy

## Supabase Integration

1. Log in to Supabase and create a new project
2. Get the Supabase URL and anon key from the project settings
3. Add these as environment variables in your project:

```bash
# Create a .env file (add to .gitignore)
echo "SUPABASE_URL=https://your-project-url.supabase.co" > .env
echo "SUPABASE_ANON_KEY=your-anon-key" >> .env
```

4. Add these environment variables to Vercel:
   - Go to your project on Vercel
   - Navigate to Settings > Environment Variables
   - Add the SUPABASE_URL and SUPABASE_ANON_KEY variables
   - Redeploy the project

## GitHub Personal Access Token (Alternative to Deploy Keys)

If you prefer using a personal access token instead of deploy keys:

```bash
# Set remote URL with token
git remote set-url origin https://[TOKEN]@github.com/justicemindsdev/[REPOSITORY-NAME].git

# Push to GitHub
git push -u origin main
```

## Troubleshooting

- If you encounter permission issues, verify that the deploy key has been added correctly and has write access
- If you're having SSH issues, try using HTTPS with a personal access token instead
- For Vercel deployment issues, check the build logs and environment variables

## Important Tokens and Keys

Store these securely in a password manager or secure vault, not in this file.

- GitHub Personal Access Token: [REDACTED]
- Supabase Token: [REDACTED]
