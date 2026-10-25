# Testing Guide for Exoplanet Prediction App

## Option 1: Test Locally (Recommended)

### Prerequisites
1. **Install Node.js** (if not already installed):
   ```bash
   # Using Homebrew (if you have it)
   brew install node
   
   # Or download from https://nodejs.org/
   # Or use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Get Gemini API Key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key

### Setup Steps

1. **Navigate to project directory**:
   ```bash
   cd /Users/kxue971student.fuhsd.org/Downloads/NASA_Space_Apps_Challenge/NewExoplanetWebsite/exoplanet-predictor
   ```

2. **Create environment file**:
   ```bash
   echo "GEMINI_API_KEY=your_actual_api_key_here" > .env.local
   ```
   Replace `your_actual_api_key_here` with your real Gemini API key.

3. **Install dependencies**:
   ```bash
   npm install
   # or if you have pnpm: pnpm install
   ```

4. **Start development server**:
   ```bash
   npm run dev
   # or: pnpm dev
   ```

5. **Test the application**:
   - Open http://localhost:3000 in your browser
   - Go to the "New Planet Prediction" page
   - Click "Fill with Sample Data (Kepler-442b)" to populate the form
   - Click "Analyze with AI" to test the Gemini integration
   - Check the results page for AI analysis

## Option 2: Test on Render (Deploy First)

If local testing is not working, you can deploy directly to Render and test there:

### Deploy to Render

1. **Push your code to GitHub** (if not already done)

2. **Create a new Web Service on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: Node

3. **Add Environment Variables**:
   - In Render dashboard, go to your service
   - Go to "Environment" tab
   - Add: `GEMINI_API_KEY` = your actual API key

4. **Deploy and Test**:
   - Click "Deploy" and wait for deployment
   - Once deployed, test the application at your Render URL

## Testing Checklist

### ✅ Basic Functionality
- [ ] Form loads correctly
- [ ] Sample data button populates all fields
- [ ] Form validation works
- [ ] Submit button triggers analysis

### ✅ Gemini AI Integration
- [ ] API call to `/api/analyze-planet` works
- [ ] Gemini AI returns detailed analysis
- [ ] Results page displays AI analysis
- [ ] Error handling works (if API fails)

### ✅ UI/UX
- [ ] Loading screen appears during analysis
- [ ] Results page shows both AI analysis and summary
- [ ] Navigation between pages works
- [ ] Responsive design works on different screen sizes

## Troubleshooting

### If Node.js installation fails:
- Try using the official installer from nodejs.org
- Or use a Node version manager like nvm

### If dependencies fail to install:
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### If Gemini API fails:
- Check that your API key is correct
- Verify the API key has proper permissions
- Check the browser console for error messages

### If the app doesn't start:
- Check that all dependencies are installed
- Verify the `.env.local` file exists with the correct API key
- Check the terminal for error messages

## Expected Results

When testing with the sample data (Kepler-442b), you should see:
- Detailed scientific analysis from Gemini AI
- Classification as an exoplanet
- Habitability assessment
- Physical and orbital characteristics analysis
- Scientific significance and recommendations

The AI should provide insights about:
- Planet type (Super-Earth, etc.)
- Habitability potential
- Key characteristics
- Comparison to known exoplanets
- Scientific importance
