import requests
from flask import Blueprint, render_template, request, redirect, url_for, session

main = Blueprint('main', __name__)

UNSPLASH_ACCESS_KEY = "Ef1CQnu94V2x6dCA5W0H7-Ptp5aThzGT8TuFeOBHvvQ"  # 你的 Access Key

FILTER_TAGS = {
    "style": ["Minimalist", "Floral", "Geometric", "Abstract"],
    "color": ["Pink", "Purple", "Nude", "Red"],
    "occasion": ["Wedding", "Party", "Casual", "Holiday"]
}

def generate_tags(description):
    tags = []
    desc = (description or "").lower()
    for group in FILTER_TAGS.values():
        for tag in group:
            if tag.lower() in desc:
                tags.append(tag)
    return tags

def fetch_nail_art_images():
    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": "nail art",
        "per_page": 20,
        "client_id": UNSPLASH_ACCESS_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()
    images = []
    for idx, result in enumerate(data.get("results", [])):
        desc = result.get("alt_description") or result.get("description") or ""
        if desc and len(desc) > 5:
            title = desc.capitalize()
        else:
            title = f"Beautiful Nail Art #{idx+1}"
        tags = generate_tags(desc)
        images.append({
            "id": result["id"],
            "title": title,
            "img": result["urls"]["regular"],
            "tags": tags
        })
    return images

# 假数据
nail_arts = [
    {"id": 1, "title": "Pink Minimalist", "img": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&auto=format"},
    {"id": 2, "title": "Purple Floral", "img": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format"},
    {"id": 3, "title": "Geometric Blue", "img": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format"},
]

collections = [
    {
        "id": 1,
        "name": "My Favorites",
        "items": [nail_arts[0], nail_arts[2]]
    },
    {
        "id": 2,
        "name": "Summer Vibes",
        "items": [nail_arts[1]]
    }
]

@main.route('/')
def index():
    nail_arts = fetch_nail_art_images()
    collections = session.get("collections", [])
    return render_template('index.html', nail_arts=nail_arts, collections=collections)

@main.route('/collect', methods=['POST'])
def collect():
    nail_id = request.form.get("nail_id")
    collections = session.get("collections", [])
    if nail_id and nail_id not in collections:
        collections.append(nail_id)
        session["collections"] = collections
    return redirect(url_for('main.index'))

@main.route('/uncollect', methods=['POST'])
def uncollect():
    nail_id = request.form.get("nail_id")
    collections = session.get("collections", [])
    if nail_id in collections:
        collections.remove(nail_id)
        session["collections"] = collections
    return redirect(url_for('main.collections_view'))

@main.route('/collections')
def collections_view():
    nail_arts = fetch_nail_art_images()
    collections = session.get("collections", [])
    collected_nails = [n for n in nail_arts if n["id"] in collections]
    return render_template('collection.html', all_collections=[{"name": "My Collection", "items": collected_nails}], collections=collections) 