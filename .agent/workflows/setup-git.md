---
description: How to install and configure Git on Windows
---
1. **Download Git**:
   - Go to [git-scm.com/download/win](https://git-scm.com/download/win).
   - The download should start automatically.

2. **Install**:
   - Run the downloaded installer (`.exe`).
   - **Important**: When asked about "Adjusting your PATH environment variable", ensure "Git from the command line and also from 3rd-party software" is selected (usually the default).
   - You can safely accept the defaults for all other options by clicking "Next".

3. **Verify Installation**:
   - **Close any currently open terminals** (VS Code terminal, PowerShell, etc.) and open a new one to refresh the environment variables.
   - Run the following command:
     ```powershell
     git --version
     ```
   - You should see something like `git version 2.x.x.windows.x`.

4. **Configure Identity**:
   - Git needs to know who you are for your commit history. Run these commands (replace with your info):
     ```powershell
     git config --global user.name "Your Name"
     git config --global user.email "your.email@example.com"
     ```

5. **Initialize Your Project**:
   - Navigate to your project folder:
     ```powershell
     cd "c:\Users\adero\Documents\My Code\threat-intel-app"
     ```
   - Initialize Git:
     ```powershell
     git init
     ```
   - Add your files:
     ```powershell
     git add .
     ```
   - Make your first commit:
     ```powershell
     git commit -m "Initial commit"
     ```
