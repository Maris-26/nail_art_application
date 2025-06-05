# 💅 Nail Art Recommendation Static Web App

A modern, AI-powered web application that curates and recommends nail art designs using advanced image processing and machine learning techniques. The application helps users explore, filter, and collect designs locally in their browser.

## 🎯 Technical Highlights

### AI-Powered Image Processing
- **CLIP Model Integration**: Utilizes OpenAI's CLIP (Contrastive Language-Image Pre-training) model for intelligent image classification
- **Automated Tagging**: Automatically generates descriptive tags for nail art images based on:
  - Shape (Almond, Square, Coffin, Stiletto)
  - Style (Minimalist, Floral, Geometric, Glitter, French)
  - Color (Pink, Red, Blue, Nude, Black, White)
- **Smart Image Curation**: Leverages Unsplash API for high-quality nail art images, processed and enhanced with AI-generated metadata

### Modern Frontend Architecture
- **Pure Static Implementation**: Zero backend dependencies, ensuring fast loading and deployment
- **Client-Side State Management**: Efficient data handling using browser's localStorage
- **Responsive Design**: Mobile-first approach with fluid layouts and adaptive components
- **Performance Optimizations**:
  - Lazy loading for images
  - Client-side pagination
  - Efficient DOM manipulation
  - Optimized asset loading

### Data Pipeline
1. **Image Collection**: Fetches images from Unsplash API using Python script
2. **AI Processing**: CLIP model analyzes and classifies images
3. **Data Generation**: Creates structured JSON with metadata
4. **Static Deployment**: Pre-processed data served as static assets

## ✨ Features

### Core Functionality
- **Intelligent Image Gallery**: 
  - AI-classified nail art images
  - Dynamic loading with infinite scroll
  - Responsive grid layout
- **Advanced Filtering System**:
  - Multi-criteria filtering (Shape, Style, Color)
  - Real-time search across all attributes
  - Interactive filter sidebar
- **Smart Collections**:
  - Client-side storage using localStorage
  - Persistent user preferences
  - Efficient data management
- **User Experience**:
  - Intuitive navigation
  - Responsive design
  - Smooth animations
  - Error handling and fallbacks

## 🛠 Technical Stack

### Frontend
- **HTML5/CSS3**: Modern semantic markup and responsive styling
- **JavaScript (ES6+)**: Vanilla JS for core functionality
- **CSS Features**:
  - Flexbox/Grid for layouts
  - CSS Variables for theming
  - Media queries for responsiveness
- **Browser APIs**:
  - localStorage for data persistence
  - Intersection Observer for lazy loading
  - Fetch API for data loading

### Data Processing
- **Python Scripts**:
  - `generate_tags_clip.py`: Image processing pipeline
  - CLIP model integration
  - Unsplash API integration
- **Dependencies**:
  - PyTorch for ML operations
  - CLIP for image classification
  - Pillow for image processing
  - Requests for API calls

## 📊 Data Source

The application uses a sophisticated data pipeline:

1. **Image Acquisition**:
   - Fetches high-quality nail art images from Unsplash API
   - Processes up to 100 images per generation
   - Implements proper API rate limiting and error handling

2. **AI Processing**:
   - CLIP model analyzes each image
   - Generates semantic understanding of nail art features
   - Creates structured metadata (shape, style, color)

3. **Data Storage**:
   - Structured JSON format (`tags.json`)
   - Optimized for client-side processing
   - Includes comprehensive metadata

## 🚀 Deployment

The application is optimized for static hosting with zero server-side dependencies:

### Azure Static Web Apps Deployment
1. Push code to GitHub repository
2. Create Azure Static Web App resource
3. Configure build settings:
   - Build Preset: `Custom`
   - App location: `/`
   - Output location: `/`
4. Automatic CI/CD via GitHub Actions

### Alternative Deployment Options
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## 💻 Development Setup

### Prerequisites
- Python 3.8+
- Modern web browser
- Git

### Installation
1. Clone the repository
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Generate image data (optional):
   ```bash
   python generate_tags_clip.py
   ```
4. Start local server:
   ```bash
   python -m http.server
   ```

### Environment Variables
- `UNSPLASH_ACCESS_KEY`: Required for image generation
- Store in `.env` file (not committed to repository)

## 🔍 Project Scope

This project demonstrates:
- Modern static web application architecture
- AI/ML integration in web applications
- Efficient client-side data management
- Responsive and accessible UI design
- Performance optimization techniques

## 👥 Target Users

- Nail art enthusiasts
- Professional nail artists
- Design inspiration seekers
- Users seeking a fast, offline-capable application

## 📬 Contact

- **Client**: Shiyi Chen (sche753@uw.edu)
- **Developer**: Haichao Xing (hcxing@uw.edu)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details. 