import os
import json
import random
import requests
from PIL import Image
from io import BytesIO
import torch
import clip

# 我的Unsplash API Key
UNSPLASH_ACCESS_KEY = "Ef1CQnu94V2x6dCA5W0H7-Ptp5aThzGT8TuFeOBHvvQ"

SHAPES = ["Almond", "Square", "Coffin", "Stiletto"]
STYLES = ["Minimalist", "Floral", "Geometric", "Glitter", "French"]
COLORS = ["Pink", "Red", "Blue", "Nude", "Black", "White"]

# 一些常用英文单词用于生成名字
NAME_WORDS = [
    "Elegant", "Dream", "Chic", "Glam", "Classic", "Modern", "Sparkle", "Bliss", "Grace", "Shine",
    "Bloom", "Magic", "Dazzle", "Velvet", "Crystal", "Lush", "Muse", "Lively", "Bold", "Soft"
]

def fetch_unsplash_images(page=1, per_page=40):
    url = "https://api.unsplash.com/search/photos"
    params = {
        "query": "nails",
        "per_page": per_page,
        "page": page,
        "client_id": UNSPLASH_ACCESS_KEY
    }
    response = requests.get(url, params=params)
    data = response.json()
    images = []
    for result in data.get("results", []):
        images.append(result["urls"]["regular"])
    return images

def generate_name():
    return " ".join(random.sample(NAME_WORDS, k=random.choice([2, 3])))

def classify_with_clip(model, preprocess, device, image_url, candidates):
    try:
        response = requests.get(image_url)
        image = Image.open(BytesIO(response.content)).convert("RGB")
    except Exception as e:
        print(f"Error loading image: {e}")
        return random.choice(candidates)
    image_input = preprocess(image).unsqueeze(0).to(device)
    text_inputs = torch.cat([clip.tokenize(f"a photo of {c} nails") for c in candidates]).to(device)
    with torch.no_grad():
        image_features = model.encode_image(image_input)
        text_features = model.encode_text(text_inputs)
        logits_per_image, _ = model(image_input, text_inputs)
        probs = logits_per_image.softmax(dim=1).cpu().numpy()[0]
    idx = int(probs.argmax())
    return candidates[idx]

def main():
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    model, preprocess = clip.load("ViT-B/32", device=device)

    images = fetch_unsplash_images(page=1, per_page=20)
    results = []
    for idx, img_url in enumerate(images):
        print(f"Processing image {idx+1}/{len(images)}...")
        name = generate_name()
        shape = classify_with_clip(model, preprocess, device, img_url, SHAPES)
        style = classify_with_clip(model, preprocess, device, img_url, STYLES)
        color = classify_with_clip(model, preprocess, device, img_url, COLORS)
        results.append({
            "img_url": img_url,
            "name": name,
            "shape": shape,
            "style": style,
            "color": color
        })
    with open("tags.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print("Done! Results saved to tags.json.")

if __name__ == "__main__":
    main() 