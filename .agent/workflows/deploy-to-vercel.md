---
description: How to deploy your Next.js app to the web using Vercel
---

1.  **Sign Up / Log In to Vercel**:
    - Go to [vercel.com](https://vercel.com).
    - Sign up using your **GitHub** account. This makes connecting your repo automatic.

2.  **Add New Project**:
    - On your Vercel dashboard, click **"Add New..."** -> **"Project"**.

3.  **Import Repository**:
    - You should see your `threat-intel-app` repository in the list.
    - Click **"Import"**.

4.  **Configure Project**:
    - **Framework Preset**: It should auto-detect "Next.js".
    - **Environment Variables**:
        - Expand the "Environment Variables" section.
        - Add your API keys here (copy them from your local `.env.local` file):
            - `NEXT_PUBLIC_MAPBOX_TOKEN` (if used)
            - `ALIENVAULT_API_KEY`
            - `ABUSEIPDB_API_KEY`
            - `VIRUSTOTAL_API_KEY`
            - `URLSCAN_API_KEY`

5.  **Deploy**:
    - Click **"Deploy"**.
    - Vercel will build your site. This takes about a minute.

6.  **View Live Site**:
    - Once done, you'll get a live URL (e.g., `threat-intel-app.vercel.app`) that you can share with anyone!
