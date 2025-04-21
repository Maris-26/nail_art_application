# 💅 Nail Art Recommendation Web App

A web application that curates a wide range of nail art styles and helps users explore, filter, collect, and receive personalized recommendations powered by machine learning.

---

## 📌 Project Scope

This project aims to build a web application that collects and organizes a wide range of nail art styles from the internet. Users will be able to browse, search, filter, and save nail art designs, while receiving personalized recommendations powered by a lightweight machine learning model.

The scope focuses on front-end feature development, tag-based filtering, user interaction logging, and basic personalization. Raw image-based recognition is excluded due to complexity and low return on effort.

---

## 👤 Target Users

The intended users are:

- **Nail art enthusiasts** looking for inspiration and references  
- **Nail artists/designers** who want to explore trends and organize style references  
- **Casual users** interested in trying new nail art styles  

These users seek a simple yet powerful way to find styles that match their personal preferences based on visual features like color, shape, and occasion.

---

## ✨ Features

The application will include the following core features:

- Display of nail art images sourced from the internet or datasets  
- Tag-based filters: shape, color, occasion  
- User interactions: like, collect  
- Search bar with history tracking  
- Personalized feed based on user interactions (likes, search terms, collections)

---

## 🗓 Timeline

- **Week 3**: Set up virtual environment and initialize frontend layout  
- **Week 4**: Implement homepage UI and filter components  
- **Week 5**: Collect nail art images and assign fixed tags  
- **Week 6**: Integrate filtering system with image data  
- **Week 7**: Organize multi-page structure  
- **Week 8**: Add ML recommendation based on tag vectors  
- **Week 9**: Polish UI and deploy the app (optional chatbot)  
- **Week 10**: Final testing and class presentation  

---

## 📬 Contact Info

- **Client**: Shiyi Chen (sche753@uw.edu)  
- **Developer**: Haichao Xing (hcxing@uw.edu)

---

## 🛠 Development Setup

### Virtual Environment Setup

1. **Create a virtual environment**:
   ```bash
   python -m venv venv
   ```

2. **Activate the virtual environment**:
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Deactivate the virtual environment** when you're done:
   ```bash
   deactivate
   ```

### Project Structure
```
nail_art_application/
├── app/                  # Application package
│   └── routes.py        # Route definitions
├── static/              # Static files
│   ├── css/            # CSS files
│   │   └── style.css   # Main stylesheet
│   ├── js/             # JavaScript files
│   │   └── main.js     # Main JavaScript file
│   └── images/         # Image assets
├── templates/           # HTML templates
│   ├── base.html       # Base template
│   └── index.html      # Home page template
├── venv/               # Virtual environment (not tracked)
├── .gitignore         # Git ignore file
├── app.py             # Application entry point
├── requirements.txt   # Project dependencies
└── README.md         # Project documentation
```

### Notes
- The virtual environment (`venv/`) is excluded from version control via `.gitignore`
- Make sure to activate the virtual environment before running the application
- All Python packages should be installed within the virtual environment 