import os
import json
from flask import Flask, request, redirect, url_for, send_from_directory, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder=os.path.dirname(__file__), static_url_path='')

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
VIDEOS_FILE = os.path.join(os.path.dirname(__file__), "videos.json")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize videos.json with default videos if it doesn't exist
def init_videos():
    if not os.path.exists(VIDEOS_FILE):
        default_videos = [
            "https://youtu.be/8is5TIxcvlA",
            "https://youtu.be/zpLhYOwujqc",
            "https://youtu.be/buqWNNDfcEw"
        ]
        with open(VIDEOS_FILE, 'w') as f:
            json.dump({"videos": default_videos}, f, indent=2)

init_videos()

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def get_youtube_embed_url(youtube_url):
    """Convert YouTube URL to embed URL"""
    if "youtu.be/" in youtube_url:
        video_id = youtube_url.split("youtu.be/")[-1].split("?")[0]
    elif "youtube.com/watch?v=" in youtube_url:
        video_id = youtube_url.split("v=")[-1].split("&")[0]
    else:
        return None
    return f"https://www.youtube.com/embed/{video_id}"

@app.route("/")
def index():
    return send_from_directory(os.path.dirname(__file__), "index.html")

@app.route("/api/photos", methods=["GET"])
def get_photos():
    try:
        photos = sorted([f for f in os.listdir(UPLOAD_FOLDER) if allowed_file(f)])
        return jsonify({"photos": photos})
    except:
        return jsonify({"photos": []})

@app.route("/api/videos", methods=["GET"])
def get_videos():
    try:
        with open(VIDEOS_FILE, 'r') as f:
            data = json.load(f)
        videos = data.get("videos", [])
        embed_urls = [get_youtube_embed_url(url) for url in videos if url]
        return jsonify({"videos": embed_urls})
    except:
        return jsonify({"videos": []})

@app.route("/upload/photo", methods=["POST"])
def upload_photo():
    if "photo" not in request.files:
        return jsonify({"error": "No photo provided"}), 400
    
    file = request.files["photo"]
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400
    
    filename = secure_filename(file.filename)
    save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(save_path)
    
    return jsonify({"message": "Photo uploaded successfully", "filename": filename})

@app.route("/upload/video", methods=["POST"])
def upload_video():
    data = request.get_json()
    video_url = data.get("url", "").strip()
    
    if not video_url:
        return jsonify({"error": "No URL provided"}), 400
    
    # Validate YouTube URL
    if "youtu" not in video_url:
        return jsonify({"error": "Please provide a valid YouTube URL"}), 400
    
    try:
        with open(VIDEOS_FILE, 'r') as f:
            data = json.load(f)
        
        if video_url not in data["videos"]:
            data["videos"].append(video_url)
            with open(VIDEOS_FILE, 'w') as f:
                json.dump(data, f, indent=2)
        
        return jsonify({"message": "Video added successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

@app.route("/<path:filename>")
def serve_static(filename):
    return send_from_directory(os.path.dirname(__file__), filename)

if __name__ == "__main__":
    app.run(debug=True, port=5001)

