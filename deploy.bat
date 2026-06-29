@echo off
echo =======================================================
echo        CivicLens AI Cloud Deployment Script
echo =======================================================
echo.

REM Prompt for GCP Project ID
set /p GCP_PROJECT="Enter your Google Cloud Project ID: "
if "%GCP_PROJECT%"=="" (
    echo Error: GCP Project ID is required.
    exit /b 1
)

echo.
echo [1/3] Configuring gcloud cli for project %GCP_PROJECT%...
call gcloud config set project %GCP_PROJECT%

echo.
echo [2/3] Deploying backend Express server to Google Cloud Run...
call gcloud run deploy civiclens-backend ^
    --source . ^
    --platform managed ^
    --region us-central1 ^
    --allow-unauthenticated ^
    --set-env-vars="SUPABASE_URL=%SUPABASE_URL%,SUPABASE_ANON_KEY=%SUPABASE_ANON_KEY%,GEMINI_API_KEY=%GEMINI_API_KEY%,NODE_ENV=production"

if %ERRORLEVEL% neq 0 (
    echo.
    echo Backend deployment failed. Please check the logs.
    exit /b 1
)

echo.
echo Backend successfully deployed!
echo Copy the Service URL returned by Cloud Run above.
echo.

REM Prompt for deployed backend URL to configure frontend
set /p DEPLOYED_URL="Enter the deployed Cloud Run URL (e.g., https://civiclens-backend-xxxx.run.app): "

echo.
echo [3/3] Preparing frontend config...
echo window.BACKEND_URL = "%DEPLOYED_URL%"; > frontend_config.js

echo.
echo === Deployment Setup Completed! ===
echo.
echo To host your frontend on GitHub Pages:
echo 1. Push this folder to a GitHub Repository.
echo 2. Go to Repository Settings -^> Pages.
echo 3. Select 'Deploy from branch' (usually main/master).
echo 4. Your frontend will be live at https://[your-username].github.io/[repo-name]/
echo.
pause
