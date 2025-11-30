---
description: How to push changes to GitHub and trigger a Vercel deployment
---

1.  **Commit Your Changes**:
    Since you have made changes (like the security fixes), you need to save them to Git first.

    **Using GitHub Desktop**:
    - Open GitHub Desktop.
    - You should see a list of changed files on the left (e.g., `next.config.ts`).
    - In the bottom left "Summary" box, type a message like "Fix security vulnerabilities".
    - Click **Commit to main**.

    **Using Terminal**:
    ```powershell
    git add .
    git commit -m "Fix security vulnerabilities"
    ```

2.  **Push to GitHub**:
    This uploads your new commit to the GitHub server.

    **Using GitHub Desktop**:
    - Click the **Push origin** button in the top toolbar.

    **Using Terminal**:
    ```powershell
    git push origin main
    ```

3.  **Vercel Deployment**:
    - **Automatic**: Vercel is connected to your GitHub repository.
    - **Trigger**: As soon as you push to the `main` branch on GitHub, Vercel detects the new commit.
    - **Action**: Vercel automatically starts a new build and deployment.
    - **Verify**: Go to your Vercel Dashboard to see the "Building" status. Once it turns green ("Ready"), your live site is updated!
