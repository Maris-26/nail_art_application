# 💅 Nail Art Recommendation Web App

A web application that curates a wide range of nail art styles and helps users explore, filter, collect, and receive personalized recommendations powered by machine learning.

---

## ✨ Features

The application currently includes the following features:

- **Image Gallery:** Display of nail art images loaded from a local data source (`tags.json`). Supports pagination (loading more images on demand).
- **Tag-based Filtering:** Filter images based on **multiple selections** of Nail Shape, Style, and Color tags using a sidebar filter UI.
- **Search:** Search images by name or tags.
- **User Authentication:** Users can register, log in, and log out.
- **User Collections:** Logged-in users can collect (save) nail art images. Collections are stored persistently (simulated in a Python dictionary on the backend for this prototype). A separate Collections page displays the user's saved items.
- **Interactive Elements:** Save/bookmark button on images to add/remove from collections. Filter toggle button to open/close the sidebar.
- **Navigation:** Fixed header with navigation links (Home, Collections) and dynamic display of user authentication status (Sign In/Up or Welcome message/Logout).
- **Active Page Indicator:** Navigation link for the current page is visually highlighted.

---

## 🆕 Recent Progress (Since June 2024 Update)

- Implemented a process to generate image tags (Shape, Style, Color) using CLIP model and save them to `tags.json`.
- Developed backend API (`/api/images`) for fetching paginated and filtered images based on `tags.json`.
- Replaced direct Unsplash API calls on the homepage with data loading from `/api/images`.
- Migrated collection feature from session-based storage to a user-bound system on the backend.
- Implemented backend APIs (`/api/user/collections`, `/api/collect`, `/api/uncollect`) for managing user collections.
- Updated frontend JavaScript (`main.js`, `collection.js`) to interact with the new user-bound collection APIs.
- Refined frontend filter UI: converted to multi-select checkboxes, removed Occasion filter, added an Apply Filters button.
- Adjusted navbar CSS for fixed positioning and improved centering of navigation links.
- Added visual indicator for the active navigation page.

---

## ⚠️ Known Issues

- **User Collections Fetch Error:** The frontend's attempt to fetch user collections (`/api/user/collections`) sometimes results in a 404 error, possibly due to an unexpected `:1` suffix being added to the request URL in certain environments. This prevents collections from loading correctly and affects collection UI state consistency across pages.
- **"Explore More" Button Visibility:** The button to load more images does not appear if the total number of images in `tags.json` is less than or equal to the number of images displayed per page (currently 20). To fix this, `tags.json` needs to be regenerated with more images.
- **Collection UI State Inconsistency:** Due to the collection fetch error, the bookmark icon on images may not consistently reflect the user's collection status when navigating between pages.
- **Image Content Update:** Changing the Unsplash query directly in the (currently unused for main gallery) `fetch_nail_art_images` function in `app/routes.py` does not update the images displayed on the Home page. The `generate_tags_clip.py` script must be modified and re-run to update `tags.json` with new images.

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

### Unsplash API Integration

- Integrated Unsplash API: homepage now displays real nail art images from Unsplash in real time.
- Each image is shown with an auto-generated descriptive title (or fallback to "Beautiful Nail Art #n").
- Tags for each image are automatically generated based on the image description and match the filter categories (style, color, occasion).
- Homepage template updated to render dynamic images, titles, and tags from the API.
- **Collection feature:** Users can click the bookmark icon on the homepage to add a nail art to their collection. The collection page displays all saved items, and users can remove items from their collection with a single click. Collection state is stored in the user session (no login required).

### Notes
- The virtual environment (`venv/`) is excluded from version control via `.gitignore`
- Make sure to activate the virtual environment before running the application
- All Python packages should be installed within the virtual environment 