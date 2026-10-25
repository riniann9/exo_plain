# 🤖 Gemini API Setup Guide

> **Complete setup instructions for Google Gemini AI integration**

## 📋 Overview

This guide will help you set up the Google Gemini API for AI-powered exoplanet analysis in the NASA Space Apps Challenge project.

## 🔑 Getting Your API Key

### Step 1: Access Google AI Studio

1. **Visit** [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Sign in** with your Google account
3. **Navigate** to the API Keys section

### Step 2: Create API Key

1. **Click** "Create API Key"
2. **Select** your Google Cloud project (or create a new one)
3. **Copy** the generated API key
4. **Store** it securely (you won't see it again)

### Step 3: Configure Environment

Create a `.env.local` file in your project root:

```env
# Google Gemini API Configuration
GEMINI_API_KEY=your_actual_api_key_here

# Optional: Custom configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🚀 Features Enabled

### ✅ AI-Powered Analysis

- **Exoplanet Classification**: Yes/No/Likely/Unlikely with confidence scores
- **Scientific Analysis**: Detailed bullet points covering:
  - Orbital characteristics and significance
  - Physical properties and planet type classification
  - Stellar parameters and impact
  - Transit properties and detection reliability
  - Habitability assessment
  - Comparison to known exoplanet characteristics

### ✅ Planet Type Classification

- **Terrestrial**: Earth-like rocky planets
- **Super-Earth**: 1.25-2x Earth radius
- **Gas Giant**: Large hydrogen/helium planets
- **Ice Giant**: Neptune-like planets
- **Mini-Neptune**: Intermediate size planets

### ✅ Habitability Assessment

- **Temperature Analysis**: Based on equilibrium temperature
- **Insolation Flux**: Stellar radiation received
- **Orbital Dynamics**: Distance from host star
- **Atmospheric Potential**: Surface conditions inference

## 🔧 API Configuration

### Model Selection

The application uses the following Gemini models:

```typescript
// Text Analysis
model: "gemini-2.5-pro-preview-03-25"

// Image Generation (fallback)
model: "gemini-1.5-pro"
```

### Rate Limits

| Tier | Requests/Day | Tokens/Day | Requests/Minute |
|------|---------------|------------|-----------------|
| **Free** | 1,500 | 50,000 | 15 |
| **Paid** | 1,000,000 | 1,000,000 | 60 |

### Fallback System

When API quota is exceeded, the application automatically switches to:

- **Intelligent Fallback**: Algorithm-based analysis
- **Scientific Accuracy**: Based on Kepler dataset parameters
- **User Experience**: Always provides analysis, never fails
- **Transparency**: Clear indication of fallback usage

## 📊 Analysis Output Format

### 1. Exoplanet Classification

```
**1. EXOPLANET CLASSIFICATION:**
- Answer: [Yes/No/Likely/Unlikely]
- Confidence: [0-100]%
- Reasoning: [Brief explanation of key factors]
```

### 2. Scientific Analysis

```
**2. SCIENTIFIC ANALYSIS:**
• Orbital Characteristics: [Period, stability, significance]
• Physical Properties: [Radius, mass, composition]
• Stellar Parameters: [Temperature, type, luminosity]
• Transit Properties: [Depth, duration, reliability]
• Habitability Assessment: [Temperature, insolation, conditions]
• Comparison to Known Exoplanets: [Database alignment, characteristics]
```

### 3. Planet Type & Characteristics

```
**3. PLANET TYPE & CHARACTERISTICS:**
- Classification: [terrestrial/super-Earth/gas giant/ice giant]
- Habitability: [habitable/potentially habitable/uninhabitable]
- Key features: [atmosphere, surface conditions, orbital dynamics]
```

### 4. Confidence Factors

```
**4. CONFIDENCE FACTORS:**
- Strengths: [What supports exoplanet classification]
- Concerns: [What might indicate false positive]
- Data quality: [Assessment of measurement reliability]
```

## 🛠️ Troubleshooting

### Common Issues

#### ❌ "Missing GEMINI_API_KEY"

**Solution:**
```bash
# Check if .env.local exists
ls -la .env.local

# Create if missing
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Restart development server
pnpm dev
```

#### ❌ "API quota exceeded"

**Symptoms:**
- 429 status code in logs
- Fallback analysis activated
- "API quota exceeded" message

**Solutions:**
1. **Wait for quota reset** (24 hours for free tier)
2. **Upgrade to paid tier** for higher limits
3. **Use fallback analysis** (already implemented)

#### ❌ "Invalid API key"

**Solutions:**
1. **Verify key format**: Should be 39 characters
2. **Check key validity**: Test at [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Regenerate key**: Create new key if compromised

### Debug Mode

Enable detailed logging by checking the browser console:

```typescript
// Console output example
🔍 Starting planet analysis API call...
📊 Received form data: ['kepid', 'kepler_name', ...]
✅ API key found, calling Gemini REST API...
📝 Generated prompt length: 1925
⚠️ Gemini API quota exceeded, using fallback analysis
```

## 🔒 Security Best Practices

### Environment Variables

```bash
# ✅ Good: Use .env.local (gitignored)
GEMINI_API_KEY=your_key_here

# ❌ Bad: Never commit API keys
# Don't put keys in .env or .env.example
```

### API Key Management

1. **Never commit** API keys to version control
2. **Use environment variables** for all secrets
3. **Rotate keys regularly** for security
4. **Monitor usage** in Google Cloud Console
5. **Set up billing alerts** for paid tiers

### Production Deployment

```bash
# Docker environment
docker run -e GEMINI_API_KEY=your_key_here exoplanet-predictor

# Vercel deployment
vercel env add GEMINI_API_KEY

# Railway deployment
railway variables set GEMINI_API_KEY=your_key_here
```

## 📈 Performance Optimization

### Caching Strategy

```typescript
// API response caching
const cacheKey = `analysis-${hash(formData)}`
const cached = await redis.get(cacheKey)
if (cached) return JSON.parse(cached)
```

### Error Handling

```typescript
// Graceful degradation
try {
  const response = await callGeminiAPI(prompt)
  return response
} catch (error) {
  if (error.status === 429) {
    return generateFallbackAnalysis(formData)
  }
  throw error
}
```

### Monitoring

```typescript
// Usage tracking
console.log('📊 API calls today:', dailyCount)
console.log('⏱️ Average response time:', avgResponseTime)
console.log('❌ Error rate:', errorRate)
```

## 🧪 Testing

### API Key Validation

```bash
# Test API key validity
curl -H "Authorization: Bearer $GEMINI_API_KEY" \
  "https://generativelanguage.googleapis.com/v1beta/models"
```

### Analysis Testing

```bash
# Test analysis endpoint
curl -X POST http://localhost:3000/api/analyze-planet \
  -H "Content-Type: application/json" \
  -d '{"formData":{"kepler_name":"Kepler-227b","orbital_period_days":"9.488"}}'
```

## 📚 Additional Resources

### Documentation

- [Google AI Studio](https://makersuite.google.com/)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Rate Limits Guide](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Model Information](https://ai.google.dev/gemini-api/docs/models)

### Community

- [Google AI Community](https://discuss.ai.google.dev/)
- [GitHub Issues](https://github.com/kx11z/NASA-Space-App-Challenge---A-World-Away/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-gemini-api)

---

<div align="center">

**Need Help?** [Open an Issue](https://github.com/kx11z/NASA-Space-App-Challenge---A-World-Away/issues) • [View Documentation](https://github.com/kx11z/NASA-Space-App-Challenge---A-World-Away/wiki)

</div>