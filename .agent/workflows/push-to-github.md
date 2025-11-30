---
description: How to push your local code to a new GitHub repository
---

1. **Create a Repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Name your repository (e.g., `threat-intel-app`).
   - **Important**: Do NOT check "Initialize with README", "Add .gitignore", or "Choose a license". You want an empty repository.
   - Click **Create repository**.

2. **Copy the Repository URL**:
   - You will see a Quick setup page. Copy the HTTPS URL (e.g., `https://github.com/username/threat-intel-app.git`).

3. **Push from Your Terminal**:
   - Open your terminal (PowerShell or Command Prompt) and run these commands:

   ```powershell
   # Navigate to your project
   cd "c:\Users\adero\Documents\My Code\threat-intel-app"

   # Initialize Git (if you haven't already)
   git init
   git add .
   git commit -m "Initial commit"

   # Link to GitHub (Replace URL with the one you copied)
   git remote add origin https://github.com/YOUR_USERNAME/threat-intel-app.git

   # Push your code
   git branch -M main
   git push -u origin main
   ```

4. **Authenticate**:
   - A window may pop up asking you to sign in to GitHub. Follow the prompts to authorize.
