# UIDAI Aadhaar Dashboard - Full Stack Application

Interactive dashboard for analyzing Aadhaar enrollment data with geographic visualization, time series analysis, and comprehensive statistics.

![Dashboard Preview](https://img.shields.io/badge/Next.js-16.1.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?logo=react)
![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green?logo=fastapi)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This full-stack application provides comprehensive visualization and analysis of Aadhaar enrollment data across Indian states. It features an interactive dashboard with real-time data updates, geographic mapping, and detailed statistics.

**Live Dashboard**: [http://localhost:3000](http://localhost:3000) (when running)  
**API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs) (when running)

## ✨ Features

### Frontend (Next.js + React)

- 📊 **Interactive Dashboard**: Real-time metrics and statistics
- 🗺️ **Geographic Visualization**: Interactive Leaflet maps with state-wise data
- 📈 **Time Series Charts**: Monthly enrollment trends using Recharts
- 🎨 **Responsive UI**: Tailwind CSS with dark mode support
- 🔄 **Auto-refresh**: Periodic data updates from backend
- 📱 **Mobile Friendly**: Responsive design for all screen sizes

### Backend (FastAPI + Python)

- ⚡ **Fast API Server**: High-performance REST API with automatic documentation
- 📊 **Data Processing**: Real-time aggregation and analysis using Pandas
- 🔒 **CORS Enabled**: Configured for frontend integration
- 📈 **Multiple Endpoints**: Metrics, trends, state data, demographics, and insights
- 💾 **Data Caching**: In-memory caching for optimized performance

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 16.1.3 (React 19.2.3)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts 3.6.0
- **Maps**: Leaflet 1.9.4 + React-Leaflet 5.0.0
- **Build**: Next.js App Router

### Backend

- **Framework**: FastAPI (Python 3.12)
- **Data Processing**: Pandas
- **Server**: Uvicorn ASGI server
- **Documentation**: Auto-generated OpenAPI (Swagger)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 9.x or higher (comes with Node.js)
- **Python**: Version 3.12 ([Download](https://www.python.org/downloads/))
- **pip**: Python package manager (comes with Python)

### Verify Installation

```bash
# Check Node.js version
node --version  # Should be v18.x or higher

# Check npm version
npm --version   # Should be 9.x or higher

# Check Python version
python --version  # Should be 3.12.x

# Check pip version
pip --version
```

## 🚀 Installation

### Step 1: Clone the Repository

```bash
cd "C:\Users\hp1\OneDrive\Desktop\UIDAI HACKATHON"
```

### Step 2: Install Frontend Dependencies

```bash
cd uidai-code
npm install
```

This will install:

- Next.js 16.1.3
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Recharts 3.6.0
- Leaflet 1.9.4
- React-Leaflet 5.0.0

### Step 3: Install Backend Dependencies

```bash
cd ..
pip install fastapi uvicorn pandas python-multipart
```

Or install from requirements file if available:

```bash
pip install -r requirements.txt
```

### Step 4: Verify Data Files

Ensure the cleaned data files exist in the correct location:

```
UIDAI HACKATHON/
├── data_clean/
│   ├── enrolment_clean.csv      # Required
│   ├── demographic_clean.csv    # Required
│   └── biometric_clean.csv      # Required
```

If data files are missing, run the data cleaning script first:

```bash
python scripts/data_cleaning.py
```

## 🏃 Running the Application

### Option 1: Using Start Script (Recommended - Windows)

```bash
cd scripts
start-app.bat
```

This will:

1. Start the backend API server on port 8000
2. Start the frontend dev server on port 3000
3. Open both in separate terminal windows

### Option 2: Manual Start

#### Terminal 1 - Start Backend API

```bash
cd "C:\Users\hp1\OneDrive\Desktop\UIDAI HACKATHON"
python -m uvicorn scripts.api_server:app --reload --host 0.0.0.0 --port 8000
```

Expected output:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
✓ Data loaded successfully
```

#### Terminal 2 - Start Frontend

```bash
cd "C:\Users\hp1\OneDrive\Desktop\UIDAI HACKATHON\uidai-code"
npm run dev
```

Expected output:

```
  ▲ Next.js 16.1.3
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Starting...
 ✓ Ready in 2.5s
```

### Access the Application

1. **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
2. **Backend API**: [http://localhost:8000](http://localhost:8000)
3. **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 📁 Project Structure

```
uidai-code/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Main dashboard page
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Global styles
│   ├── api.ts                    # API service layer
│   ├── Dashboard.tsx             # Main dashboard component
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── MainContent.tsx           # Static content version
│   ├── MainContentWithAPI.tsx    # API-connected content
│   ├── IndiaMap.tsx              # India map component (static)
│   └── IndiaMapLeaflet.tsx       # Interactive Leaflet map
│
├── public/                       # Static assets
│
├── node_modules/                 # NPM dependencies (auto-generated)
├── .next/                        # Next.js build output (auto-generated)
│
├── package.json                  # NPM dependencies and scripts
├── package-lock.json             # Locked dependency versions
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
├── .gitignore                    # Git ignore rules
└── README.md                     # This file

../scripts/                       # Backend Python scripts
├── api_server.py                 # FastAPI backend server
├── data_cleaning.py              # Data cleaning pipeline
└── start-app.bat                 # Windows startup script
```

## 🔌 API Endpoints

Base URL: `http://localhost:8000`

### Available Endpoints

| Method | Endpoint        | Description                               |
| ------ | --------------- | ----------------------------------------- |
| GET    | `/`             | API health check                          |
| GET    | `/metrics`      | Dashboard metrics and statistics          |
| GET    | `/trends`       | Time series data for charts               |
| GET    | `/states`       | State-wise enrollment data                |
| GET    | `/states/all`   | All states with geographic data           |
| GET    | `/demographics` | Age distribution statistics               |
| GET    | `/anomalies`    | Data quality issues and anomalies         |
| GET    | `/insights`     | AI-generated insights and recommendations |

### Example API Calls

```bash
# Get dashboard metrics
curl http://localhost:8000/metrics

# Get time series trends
curl http://localhost:8000/trends

# Get state-wise data
curl http://localhost:8000/states

# Get all states for map
curl http://localhost:8000/states/all
```

## 📊 Dashboard Features

### 1. Overview Section

- Total enrollments across India
- Demographic updates count
- Biometric updates count
- Data quality score (0-100)
- Record counts by dataset

### 2. Time Series Visualization

- Monthly enrollment trends
- Demographic update patterns
- Biometric update patterns
- Interactive line charts with hover details

### 3. Geographic Map

- Interactive India map with Leaflet
- State-wise enrollment visualization
- Click states for detailed information
- Color-coded by enrollment intensity
- Zoom and pan controls

### 4. State Statistics

- Top 10 states by enrollment
- Districts covered per state
- Quality scores by state
- Enrollment density metrics

### 5. Demographics

- Age group distribution (0-5, 5-17, 18+)
- Visual pie charts
- Percentage breakdowns

## 🔧 Configuration

### Backend Configuration (api_server.py)

```python
# Change port
uvicorn.run(app, host="0.0.0.0", port=8000)  # Modify port here

# CORS settings
allow_origins=["http://localhost:3000"]  # Add your domains
```

### Frontend Configuration (app/api.ts)

```typescript
// Change API base URL
const API_BASE_URL = "http://localhost:8000"; // Update for production
```

### Next.js Configuration (next.config.ts)

```typescript
// Configure for production deployment
const nextConfig = {
  output: "standalone", // For Docker deployment
  // Add your custom configurations
};
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Backend Not Starting

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`  
**Solution**:

```bash
pip install fastapi uvicorn pandas
```

#### 2. Data Files Not Found

**Problem**: `FileNotFoundError: data_clean/enrolment_clean.csv`  
**Solution**: Run data cleaning script first:

```bash
python scripts/data_cleaning.py
```

#### 3. Frontend Not Loading Data

**Problem**: Map or charts show "Loading..." indefinitely  
**Solution**:

- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify API endpoints return data:
  ```bash
  curl http://localhost:8000/metrics
  ```

#### 4. Port Already in Use

**Problem**: `Error: Port 3000 is already in use`  
**Solution**:

```bash
# Windows: Kill process on port
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Or use different port
npm run dev -- -p 3001
```

#### 5. Module Resolution Errors

**Problem**: TypeScript module errors  
**Solution**:

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

#### 6. Map Not Displaying

**Problem**: Leaflet map shows blank or errors  
**Solution**:

- Check browser console for CSS loading errors
- Ensure Leaflet CSS is imported in globals.css
- Verify API returns state data with coordinates

### Debug Mode

Enable verbose logging:

**Backend**:

```bash
# Add --log-level debug
uvicorn scripts.api_server:app --reload --log-level debug
```

**Frontend**:

```bash
# Check browser console (F12)
# Look for network errors in DevTools > Network tab
```

## 📝 Development Scripts

```bash
# Frontend development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Backend development
python scripts/api_server.py          # Direct Python execution
python -m uvicorn scripts.api_server:app --reload  # With auto-reload
```

## 🚀 Production Deployment

### Build Frontend

```bash
cd uidai-code
npm run build
npm run start  # Production server
```

### Run Backend in Production

```bash
uvicorn scripts.api_server:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📈 Performance Optimization

- **Backend**: Uses in-memory caching for frequently accessed data
- **Frontend**: Next.js automatic code splitting and optimization
- **API**: CORS configured for specific origins only
- **Data**: Pre-processed CSV files for fast loading

## 🤝 Contributing

This project is part of the UIDAI Hackathon submission. For questions or improvements:

1. Review the code structure
2. Test thoroughly before changes
3. Follow TypeScript and Python best practices
4. Update documentation for new features

## 📄 License

This project is submitted for the UIDAI Hackathon 2026.

## 🔗 Related Files

- **Jupyter Notebook**: `../UIDAI_Hackathon_Submission.ipynb` - Complete data analysis
- **Data Cleaning**: `../scripts/data_cleaning.py` - Data preprocessing pipeline
- **Clean Data**: `../data_clean/` - Processed CSV files

## 📞 Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review API documentation at http://localhost:8000/docs
3. Check browser console for frontend errors
4. Review terminal output for backend errors

---

**Built with ❤️ for UIDAI Hackathon 2026**

Last Updated: January 19, 2026
