# Vercel Deployment Checklist

## 1. Push Changes to GitHub
Ensure all changes, especially the new `.env.example` and `vite.config.ts`, are committed and pushed to your repository.

```bash
git add .
git commit -m "chore: prepare for Vercel deployment"
git push origin main
```

## 2. Vercel Project Setup
1.  Log in to [Vercel](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `ShopKart` repository.

## 3. Configure Project Settings
Vercel should automatically detect **Vite**. If not, manually select:
-   **Framework Preset**: `Vite`
-   **Root Directory**: `frontend` (Important! Since your `package.json` is in `frontend/`)

## 4. Environment Variables
Expand the **"Environment Variables"** section and add:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://your-backend-service.onrender.com` |

*Note: Replace the value with your actual active Render backend URL.*

## 5. Deploy
Click **"Deploy"**. Vercel will install dependencies and build the project.

## 6. Verification
Once deployed:
1.  Open the Vercel app URL.
2.  Open Developer Tools (F12) -> Network Tab.
3.  Perform a Login or Register action.
4.  Verify the request URL starts with your Render Backend URL, not `localhost`.
