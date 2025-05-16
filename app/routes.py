import requests
import json
from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
import os
from werkzeug.security import generate_password_hash, check_password_hash

main = Blueprint('main', __name__)

UNSPLASH_ACCESS_KEY = "Ef1CQnu94V2x6dCA5W0H7-Ptp5aThzGT8TuFeOBHvvQ"  # 你的 Access Key

FILTER_TAGS = {
    "shape": ["Almond", "Square", "Coffin", "Stiletto"],
    "style": ["Minimalist", "Floral", "Geometric", "Glitter", "French"],
    "color": ["Pink", "Red", "Blue", "Nude", "Black", "White"]
}

# 模拟用户数据库
# 结构: { "email": { "password": "hashed_password", "collections": ["img_url1", "img_url2"] } }
users = {}

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
        "query": "nails",
        "per_page": 120,
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

def load_tags():
    tags_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'tags.json')
    try:
        with open(tags_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return [] # 如果tags.json不存在，返回空列表

@main.route('/')
def index():
    #nail_arts = fetch_nail_art_images() # 不再直接从Unsplash获取，而是通过API获取
    #collections = session.get("collections", []) # Collections暂不使用session，改用localStorage
    return render_template('index.html') # 不再传递collections

@main.route('/collections')
def collections_view():
    # 不再传递数据，由前端JS从API获取并渲染
    return render_template('collection.html')

@main.route('/api/images')
def api_images():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    search = request.args.get('search', '').strip().lower()
    
    # Get lists of selected filter values
    shapes = request.args.getlist('shape')
    styles = request.args.getlist('style')
    colors = request.args.getlist('color')

    data = load_tags()

    # 搜索和筛选
    def match(item):
        # Check if the item matches the search query in name or any tag
        search_match = True
        if search:
             search_match = (search in item.get('name', '').lower() or \
                             search in item.get('shape', '').lower() or \
                             search in item.get('style', '').lower() or \
                             search in item.get('color', '').lower())

        # Check if the item's shape is in the selected shapes list (if any shapes are selected)
        shape_match = True
        if shapes:
            item_shape = item.get('shape', '')
            shape_match = item_shape in shapes

        # Check if the item's style is in the selected styles list (if any styles are selected)
        style_match = True
        if styles:
            item_style = item.get('style', '')
            style_match = item_style in styles

        # Check if the item's color is in the selected colors list (if any colors are selected)
        color_match = True
        if colors:
            item_color = item.get('color', '')
            color_match = item_color in colors

        # An item matches if it passes the search filter (if any) and ALL active tag filters
        return search_match and shape_match and style_match and color_match

    filtered = [item for item in data if match(item)]
    total = len(filtered)
    start = (page - 1) * per_page
    end = start + per_page
    paged = filtered[start:end]

    return jsonify({
        'total': total,
        'page': page,
        'per_page': per_page,
        'images': paged
    })

# 用户认证相关路由
@main.route('/register', methods=['POST'])
def register():
    email = request.form.get('email')
    password = request.form.get('password')
    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400
    if email in users:
        return jsonify({'success': False, 'message': 'Email already registered'}), 409
    hashed_password = generate_password_hash(password)
    users[email] = {'email': email, 'password': hashed_password, 'collections': []}
    return jsonify({'success': True, 'message': 'Registration successful. Please login.'}), 201

@main.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')
    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400
    user = users.get(email)
    if user and check_password_hash(user['password'], password):
        session['logged_in'] = True
        session['email'] = user['email']
        return jsonify({'success': True, 'message': 'Login successful', 'email': user['email']})
    else:
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

@main.route('/logout', methods=['POST'])
def logout():
    session.pop('logged_in', None)
    session.pop('email', None)
    return jsonify({'success': True, 'message': 'Logged out successfully'})

@main.route('/api/user', methods=['GET'])
def get_user():
    if session.get('logged_in'):
        email = session.get('email')
        # 返回用户邮箱，不返回密码或收藏列表，避免泄露
        return jsonify({'logged_in': True, 'email': email})
    else:
        return jsonify({'logged_in': False})

@main.route('/api/user/collections', methods=['GET'])
def get_user_collections():
    if session.get('logged_in'):
        email = session.get('email')
        user = users.get(email)
        if user:
            return jsonify({'success': True, 'collections': user.get('collections', [])})
        else:
             return jsonify({'success': False, 'message': 'User not found'}), 404
    else:
        return jsonify({'success': False, 'message': 'Not logged in'}), 401

@main.route('/api/collect', methods=['POST'])
def api_collect():
    if session.get('logged_in'):
        email = session.get('email')
        user = users.get(email)
        img_url = request.form.get('img_url')
        if user and img_url:
            if img_url not in user['collections']:
                user['collections'].append(img_url)
            return jsonify({'success': True, 'message': 'Collected'})
        else:
            return jsonify({'success': False, 'message': 'User not found or invalid image URL'}), 400
    else:
        return jsonify({'success': False, 'message': 'Not logged in'}), 401

@main.route('/api/uncollect', methods=['POST'])
def api_uncollect():
    if session.get('logged_in'):
        email = session.get('email')
        user = users.get(email)
        img_url = request.form.get('img_url')
        if user and img_url:
            if img_url in user['collections']:
                user['collections'].remove(img_url)
            return jsonify({'success': True, 'message': 'Uncollected'})
        else:
            return jsonify({'success': False, 'message': 'User not found or invalid image URL'}), 400
    else:
        return jsonify({'success': False, 'message': 'Not logged in'}), 401

# fetch_nail_art_images 函数不再使用
# def fetch_nail_art_images():
#     pass 