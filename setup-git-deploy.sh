#!/bin/bash
# Justice Minds Git Deployment Setup Script
# This script automates the process of setting up Git repositories and connecting them to Supabase and Vercel

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Justice Minds Git Deployment Setup     ${NC}"
echo -e "${GREEN}=========================================${NC}"

# Get repository name
read -p "Enter repository name: " REPO_NAME

# Check if Git is initialized
if [ ! -d .git ]; then
    echo -e "${YELLOW}Initializing Git repository...${NC}"
    git init
    echo -e "${GREEN}Git repository initialized.${NC}"
else
    echo -e "${YELLOW}Git repository already initialized.${NC}"
fi

# Configure Git
echo -e "${YELLOW}Configuring Git with Justice Minds credentials...${NC}"
git config user.name "justicemindsdev"
git config user.email "justice@justice-minds.com"
echo -e "${GREEN}Git configured.${NC}"

# Add files to Git
echo -e "${YELLOW}Adding all files to Git...${NC}"
git add .
echo -e "${GREEN}Files added.${NC}"

# Commit changes
echo -e "${YELLOW}Creating initial commit...${NC}"
git commit --no-verify -m "Initial commit"
echo -e "${GREEN}Initial commit created.${NC}"

# Generate SSH key
echo -e "${YELLOW}Generating SSH key for GitHub authentication...${NC}"
SSH_KEY_PATH=~/.ssh/github_${REPO_NAME}
ssh-keygen -t rsa -b 4096 -C "justice@justice-minds.com" -f $SSH_KEY_PATH -N ""
echo -e "${GREEN}SSH key generated at ${SSH_KEY_PATH}${NC}"

# Display public key
echo -e "${YELLOW}Here is your public key to add to GitHub:${NC}"
echo -e "${GREEN}=========================================${NC}"
cat ${SSH_KEY_PATH}.pub
echo -e "${GREEN}=========================================${NC}"
echo -e "${YELLOW}Please add this key as a deploy key to your GitHub repository.${NC}"
echo -e "${YELLOW}1. Go to https://github.com/justicemindsdev/${REPO_NAME}/settings/keys/new${NC}"
echo -e "${YELLOW}2. Enter a title (e.g., \"${REPO_NAME} Deploy Key\")${NC}"
echo -e "${YELLOW}3. Paste the key above${NC}"
echo -e "${YELLOW}4. Check \"Allow write access\"${NC}"
echo -e "${YELLOW}5. Click \"Add key\"${NC}"

# Wait for user to add the key
read -p "Press Enter once you've added the key to GitHub... " -r

# Configure SSH
echo -e "${YELLOW}Configuring SSH to use the key...${NC}"
echo -e "Host github.com-${REPO_NAME}\n  HostName github.com\n  User git\n  IdentityFile ${SSH_KEY_PATH}\n  IdentitiesOnly yes" >> ~/.ssh/config
echo -e "${GREEN}SSH configured.${NC}"

# Set up remote repository
echo -e "${YELLOW}Setting up remote repository...${NC}"
git remote add origin git@github.com:justicemindsdev/${REPO_NAME}.git
echo -e "${GREEN}Remote repository set up.${NC}"

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push -u origin main
echo -e "${GREEN}Code pushed to GitHub.${NC}"

# Vercel and Supabase setup instructions
echo -e "${YELLOW}Next steps for Vercel and Supabase integration:${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "${YELLOW}Vercel Setup:${NC}"
echo -e "1. Log in to Vercel and create a new project"
echo -e "2. Connect to the GitHub repository:"
echo -e "   - Select the justicemindsdev organization"
echo -e "   - Select the ${REPO_NAME} repository"
echo -e "   - Configure project settings as needed"
echo -e "   - Deploy"
echo -e ""
echo -e "${YELLOW}Supabase Setup:${NC}"
echo -e "1. Log in to Supabase and create a new project"
echo -e "2. Get the Supabase URL and anon key from the project settings"
echo -e "3. Add these as environment variables in your project:"
echo -e "   - Create a .env file (add to .gitignore)"
echo -e "   - Add SUPABASE_URL and SUPABASE_ANON_KEY variables"
echo -e "4. Add these environment variables to Vercel:"
echo -e "   - Go to your project on Vercel"
echo -e "   - Navigate to Settings > Environment Variables"
echo -e "   - Add the SUPABASE_URL and SUPABASE_ANON_KEY variables"
echo -e "   - Redeploy the project"
echo -e "${GREEN}=========================================${NC}"

echo -e "${GREEN}Setup complete! Your repository is now on GitHub and ready for Vercel and Supabase integration.${NC}"
