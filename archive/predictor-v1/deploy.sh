#!/bin/bash

# Exoplanet Predictor Docker Deployment Script

echo "🚀 Deploying Exoplanet Predictor with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found. Please create it with your Gemini API key."
    echo "Example: echo 'GEMINI_API_KEY=your_api_key_here' > .env.local"
    exit 1
fi

# Build and start the container
echo "📦 Building Docker image..."
docker-compose build

echo "🚀 Starting the application..."
docker-compose up -d

echo "✅ Exoplanet Predictor is now running!"
echo "🌐 Visit: http://localhost:3000"
echo "📊 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
