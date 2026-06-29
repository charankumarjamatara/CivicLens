# CivicLens AI — Cloud Deployment & Setup Guide

This guide covers setting up your database, testing the AI integration, and deploying both the backend (Google Cloud Run) and the frontend (GitHub Pages).

---

## 📂 Project Folder Structure (Refactored)

The backend has been refactored into a clean, modern, and production-ready Express.js architecture:

```
stitch_civiclens_ai_landing_page/
├── 📁 middleware/
│   ├── cors.js             # CORS policy for Localhost, Firebase, & GitHub Pages
│   └── errorHandler.js     # Global Express error handler
├── 📁 services/
│   └── geminiService.js    # Google Gemini 1.5 Flash Vision & Text AI service
├── 📁 controllers/
│   ├── configController.js # Handles client configuration discovery
│   ├── analyzeController.js# Handles AI image analyses
│   └── duplicateController.js # Handles duplicate detection checking
├── 📁 routes/
│   └── api.js              # Registers all /api/* routes
├── server.js               # Main Express.js application entry point
├── app.js                  # Frontend Unified Client Database & Auth wrapper
├── supabase_schema.sql     # Database SQL script
├── test_gemini.js          # Direct text test script for Gemini API verification
├── Dockerfile              # Docker recipe for Google Cloud Run
├── deploy.sh / deploy.bat  # Deployment automation scripts
└── README-DEPLOY.md        # This guide
```

---

## ⚡ Step 1: Database Setup (Supabase)

1. Go to [database.new](https://database.new) and create a new project.
2. In the left menu, select **SQL Editor** -> click **New Query**.
3. Copy the contents of `supabase_schema.sql` from your project root and paste them into the SQL Editor.
4. Click **Run** at the bottom right.
5. In your Supabase Dashboard, go to **Project Settings** -> **API** and grab the `Project API URL` and `anon public key`.
6. Add these to your `.env` file at the root of the project:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```
7. Go to **Authentication** -> **Providers** -> **Email** and ensure **Enable Email Signup** is toggled ON.

---

## 🤖 Step 2: AI Setup (Google Gemini)

1. Go to [Google AI Studio](https://aistudio.google.com/) and click **Get API key**.
2. Click **Create API Key** and select your project.
3. Copy the key and add it to your `.env` file:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
4. Verify the API key is working by running:
   ```bash
   node test_gemini.js
   ```
   *(Note: Ensure your key is from Google AI Studio. Google Cloud Console API keys might require enabling the "Generative Language API" in the API Library first).*

---

## 🚀 Step 3: Backend Deployment (Google Cloud Run)

You will host the backend container on Google Cloud Run. We have provided `deploy.sh` (Linux/Mac) and `deploy.bat` (Windows) to automate this.

1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).
2. Open your terminal in this directory and login to your Google account:
   ```bash
   gcloud auth login
   ```
3. Run the deploy script:
   - **Windows**: Double-click `deploy.bat` or run `deploy.bat` in command prompt.
   - **Linux/Mac**: Run `chmod +x deploy.sh && ./deploy.sh`.
4. The script will:
   - Build your container image locally.
   - Deploy the container server to Cloud Run.
   - Inject your environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GEMINI_API_KEY`).
5. Once completed, copy the **Service URL** printed at the end (e.g., `https://civiclens-backend-xxxx.run.app`).
6. Enter this URL when prompted by the script to generate `frontend_config.js` automatically.

---

## 🌐 Step 4: Frontend Deployment (GitHub Pages)

Since the frontend consists of static files that make API requests to your Cloud Run backend, GitHub Pages is the perfect, free hosting choice.

1. Create a new repository on GitHub (e.g., `civiclens-ai`).
2. Initialize git in this folder, commit your changes, and push:
   ```bash
   git init
   ```
   *(Note: Create a `.gitignore` to prevent committing your secret credentials!)*
3. Push to your repository:
   ```bash
   git remote add origin https://github.com/your-username/civiclens-ai.git
   git branch -M main
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push -u origin main
   ```
4. On GitHub, go to your repository **Settings** -> **Pages** tab.
5. Under **Build and deployment**, select **Deploy from branch**.
6. Set the branch to `main` and folder to `/ (root)`, then click **Save**.
7. Within 1-2 minutes, your website will be live at:
   ```
   https://your-username.github.io/civiclens-ai/
   ```

---

## 🛡️ CORS Troubleshooting

If you encounter origin errors:
1. Make sure your GitHub Pages URL (`https://your-username.github.io`) or custom domain is added to `allowedOrigins` in `middleware/cors.js`.
2. Redeploy the backend by running the deploy script again.
