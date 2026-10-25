> Historical setup instructions from the previous server deployment. For the maintained setup, see [deployment.md](deployment.md).

# Gemini API Setup Instructions

To enable real AI analysis of exoplanet data, you need to set up a Gemini API key.

## Steps:

1. **Get a Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the API key

2. **Set up Environment Variable:**
   Create a `.env.local` file in the project root with:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Restart the Development Server:**
   ```bash
   npm run dev
   ```

## Features:

- **Real AI Analysis**: Uses Google's Gemini LLM to analyze exoplanet data
- **Scientific Accuracy**: Based on NASA Kepler dataset parameters
- **Detailed Explanations**: Provides reasoning for each classification decision
- **Feature Importance**: Ranks the 5 most important features in the analysis
- **Fallback Mode**: If API key is not set, falls back to mock analysis

## API Endpoint:

The application uses `/api/analyze-planet` to send data to Gemini and receive structured analysis results.

## Data Format:

The system automatically converts form inputs to NASA Kepler dataset format and sends them to Gemini with the following prompt structure:

```
You are an expert exoplanet scientist analyzing data from NASA space missions...
```

The response includes:
- Boolean classification (exoplanet yes/no)
- Top 5 most important features
- Detailed explanations for each feature
- Relevance ratings for scientific accuracy
