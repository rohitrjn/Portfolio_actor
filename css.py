import os
from flask import Flask, request, redirect, url_for, render_template_string, send_from_directory
import sys
import subprocess

app = Flask(__name__)
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Actor Website</title>
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #121212;
            color: #fff;
        }
        header {
            padding: 2rem;
            text-align: center;
            background: linear-gradient(135deg, #222, #444);
        }
        header h1 {
            margin: 0;
            font-size: 2.5rem;
        }
        main {
            max-width: 900px;
            margin: 2rem auto;
            padding: 0 1rem;
        }
        .upload-box {
            border: 2px dashed #555;
            padding: 2rem;
            text-align: center;
            border-radius: 12px;
            background: rgba(255,255,255,0.04);
        }
        .upload-box input[type="file"] {
            margin-top: 1rem;
        }
        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        .gallery img {
            width: 100%;
            height: auto;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }
        footer {
            text-align: center;
            padding: 1rem;
            color: #bbb;
        }
    </style>
</head>
<body>
    <header>
        <h1>Actor Portfolio</h1>
        <p>Upload your photos below to build your gallery.</p>
    </header>
    <main>
        <section class="upload-box">
            <form action="{{ url_for('upload') }}" method="post" enctype="multipart/form-data">
                <label for="photo">Choose a photo to upload:</label><br />
                <input type="file" name="photo" id="photo" accept="image/*" required />
                <br /><br />
                <button type="submit">Upload Photo</button>
            </form>
        </section>

        {% if photos %}
        <section class="gallery">
            {% for photo in photos %}
                <img src="{{ url_for('uploaded_file', filename=photo) }}" alt="Uploaded photo" />
            {% endfor %}
        </section>
        {% else %}
        <p style="margin-top: 1.5rem; color: #ccc;">No photos uploaded yet.</p>
        {% endif %}
    </main>
    <footer>&copy; Actor Portfolio</footer>
</body>
</html>
"""

def allowed_file(filename):
        return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/", methods=["GET"])
def index():
        photos = sorted(os.listdir(app.config["UPLOAD_FOLDER"]))
        return render_template_string(HTML_TEMPLATE, photos=photos)

@app.route("/upload", methods=["POST"])
def upload():
        if "photo" not in request.files:
                return redirect(url_for("index"))
        file = request.files["photo"]
        if file.filename == "" or not allowed_file(file.filename):
                return redirect(url_for("index"))
        filename = file.filename
        save_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(save_path)
        return redirect(url_for("index"))

@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

if __name__ == "__main__":
        app.run(debug=True, port=5000)
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Flask"])

        if __name__ == "__main__":
            app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=False)

