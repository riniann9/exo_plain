# 🚀 NASA Space Apps Challenge - Exoplanet Predictor

> **A World Away**: AI-Powered Exoplanet Detection and Analysis Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

## 🌟 Overview

An advanced AI-powered platform for analyzing NASA Kepler mission data to detect and classify exoplanets. Built for the NASA Space Apps Challenge, this application combines cutting-edge machine learning with intuitive user interfaces to make exoplanet science accessible to everyone.

### ✨ Key Features

- 🔍 **AI-Powered Analysis**: Intelligent exoplanet detection using Google Gemini AI
- 📊 **NASA Kepler Dataset**: Full compatibility with official Kepler mission data
- 🎨 **Responsive Design**: Mobile-optimized interface with cosmic aesthetics
- 🐳 **Docker Ready**: Complete containerization for easy deployment
- 📱 **Cross-Platform**: Works on desktop, tablet, and mobile devices
- 🚀 **Production Ready**: Optimized for performance and scalability

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | Next.js 15.2.4 | React framework with App Router |
| **Styling** | Tailwind CSS 4.1.9 | Utility-first CSS framework |
| **Language** | TypeScript 5.0 | Type-safe JavaScript |
| **AI/ML** | Google Gemini API | Exoplanet analysis and classification |
| **Deployment** | Docker & Docker Compose | Containerized deployment |
| **UI Components** | Radix UI | Accessible component library |
| **Icons** | Lucide React | Beautiful icon set |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **pnpm** (recommended) or npm
- **Docker** (optional, for containerized deployment)
- **Google Gemini API Key** (for AI analysis)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kx11z/NASA-Space-App-Challenge---A-World-Away.git
   cd NASA-Space-App-Challenge---A-World-Away/exoplanet-predictor
   ```

2. **Install dependencies**
   ```bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local
   ```

4. **Start development server**
   ```bash
   pnpm dev
   # or npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_actual_api_key_here

# Optional: Custom configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env.local` file

## 📱 Usage

### 1. New Planet Prediction

- Navigate to `/new` to access the prediction form
- Fill in Kepler dataset parameters or use sample data
- Click "Analyze with AI" for comprehensive analysis
- View detailed scientific results with confidence scores

### 2. Existing Planets

- Visit `/existing` to explore confirmed exoplanets
- Interactive galaxy map with 3D visualization
- Detailed planet information and characteristics

### 3. Results Analysis

- Comprehensive AI analysis with 4 detailed sections:
  - **Exoplanet Classification**: Yes/No with confidence percentage
  - **Scientific Analysis**: Orbital, physical, and stellar parameters
  - **Planet Type**: Terrestrial, super-Earth, gas giant classification
  - **Confidence Factors**: Strengths, concerns, and data quality

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Clone and navigate to the project**
   ```bash
   git clone https://github.com/kx11z/NASA-Space-App-Challenge---A-World-Away.git
   cd NASA-Space-App-Challenge---A-World-Away/exoplanet-predictor
   ```

2. **Set up environment variables**
   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env.local
   ```

3. **Deploy with Docker Compose**
   ```bash
   # Make deployment script executable
   chmod +x deploy.sh
   
   # Run deployment
   ./deploy.sh
   ```

4. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - View logs: `docker-compose logs -f`
   - Stop: `docker-compose down`

### Manual Docker Build

```bash
# Build the image
docker build -t exoplanet-predictor .

# Run the container
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your_api_key_here \
  exoplanet-predictor
```

## 🏗️ Project Structure

```
exoplanet-predictor/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 api/                      # API routes
│   │   ├── 📁 analyze-planet/       # AI analysis endpoint
│   │   └── 📁 generate-planet-image/ # Image generation endpoint
│   ├── 📁 existing/                 # Existing planets page
│   ├── 📁 new/                      # New prediction form
│   ├── 📁 results/                  # Analysis results
│   └── 📄 page.tsx                  # Home page
├── 📁 components/                   # React components
│   ├── 📁 ui/                       # Reusable UI components
│   ├── 📄 galaxy-map.tsx           # Interactive galaxy visualization
│   ├── 📄 planet-3d-viewer.tsx     # 3D planet viewer
│   └── 📄 unified-results.tsx      # Results display component
├── 📁 lib/                         # Utility functions
├── 📁 hooks/                       # Custom React hooks
├── 📁 styles/                      # Global styles
├── 🐳 Dockerfile                   # Container configuration
├── 🐳 docker-compose.yml           # Multi-container setup
├── 🚀 deploy.sh                    # Automated deployment script
├── 📋 package.json                 # Dependencies and scripts
└── 📚 README.md                    # This file
```

## 🔬 Scientific Features

### AI Analysis Components

1. **Exoplanet Classification**
   - Binary classification (Yes/No/Likely/Unlikely)
   - Confidence scoring (0-100%)
   - Scientific reasoning and evidence

2. **Physical Properties Analysis**
   - Planetary radius classification
   - Temperature-based habitability assessment
   - Atmospheric composition inference

3. **Orbital Dynamics**
   - Period analysis and stability assessment
   - Transit timing and duration evaluation
   - Impact parameter significance

4. **Stellar Characteristics**
   - Host star type classification
   - Temperature and luminosity analysis
   - Habitable zone calculations

### Data Sources

- **NASA Kepler Mission**: Primary dataset for exoplanet parameters
- **Kepler Object of Interest (KOI)**: Candidate exoplanet database
- **Transit Method**: Photometric detection technique
- **Stellar Parameters**: Host star characteristics and properties

## 🎨 Design System

### Color Palette

```css
/* Cosmic Theme */
--primary: #3b82f6      /* Deep space blue */
--secondary: #8b5cf6    /* Nebula purple */
--accent: #06b6d4       /* Stellar cyan */
--background: #0f0f23   /* Dark space */
--foreground: #ffffff   /* Starlight white */
```

### Typography

- **Headings**: Inter (Bold, 600-700 weight)
- **Body**: Inter (Regular, 400 weight)
- **Code**: JetBrains Mono (Monospace)

### Responsive Breakpoints

```css
/* Mobile First */
sm: 640px    /* Small tablets */
md: 768px    /* Tablets */
lg: 1024px   /* Laptops */
xl: 1280px   /* Desktops */
2xl: 1536px  /* Large screens */
```

## 🚀 Performance Optimizations

### Frontend Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component with WebP
- **Bundle Analysis**: Optimized imports and tree shaking
- **Caching**: Static generation and ISR where applicable

### Backend Optimizations

- **API Caching**: Intelligent response caching
- **Error Handling**: Graceful fallbacks and retry logic
- **Rate Limiting**: API quota management
- **Monitoring**: Comprehensive logging and debugging

## 🧪 Testing

### Manual Testing Checklist

- [ ] Form submission with sample data
- [ ] AI analysis generation and display
- [ ] Image generation and fallback
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] API error handling
- [ ] Docker deployment

### Test Data

Use the provided sample data (Kepler-227b) for testing:

```json
{
  "kepid": "10797460",
  "koi_name": "K00752.01",
  "kepler_name": "Kepler-227b",
  "orbital_period_days": "9.48803557±2.775e-05",
  "planetary_radius_earth_radii": "2.26 (+0.26/-0.15)",
  "equilibrium_temperature_k": "793"
}
```

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Create a Pull Request**

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Conventional Commits**: Semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA**: For the Kepler mission and exoplanet data
- **Google**: For the Gemini AI API
- **Next.js Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Radix UI**: For accessible component primitives

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/kx11z/NASA-Space-App-Challenge---A-World-Away/issues)
- **Discussions**: [GitHub Discussions](https://github.com/kx11z/NASA-Space-App-Challenge---A-World-Away/discussions)
- **Documentation**: [Project Wiki](https://github.com/kx11z/NASA-Space-App-Challenge---A-World-Away/wiki)

---

<div align="center">

**Built with ❤️ for the NASA Space Apps Challenge**

[🌐 Live Demo](https://your-deployment-url.com) • [📚 Documentation](https://github.com/kx11z/NASA-Space-App-Challenge---A-World-Away/wiki) • [🐛 Report Bug](https://github.com/kx11z/NASA-Space-App-Challenge---A-World-Away/issues)

</div>