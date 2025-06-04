from flask import Flask, render_template, request, send_file, jsonify, make_response
import os
import json
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
import zipfile
import io

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2MB max file size

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Default configuration template
DEFAULT_CONFIG = {
    "name": "",
    "bio": "",
    "profilePicture": "",
    "url": "",
    "blog": False,
    "iconLinks": [],
    "customLinks": []
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_config():
    try:
        # Get form data
        config = DEFAULT_CONFIG.copy()
        config.update({
            'name': request.form.get('name', ''),
            'bio': request.form.get('bio', ''),
            'url': request.form.get('url', ''),
            'blog': request.form.get('blog', 'false') == 'true'
        })
        
        # Handle profile picture upload
        if 'profilePicture' in request.files:
            file = request.files['profilePicture']
            if file.filename != '':
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                config['profilePicture'] = f"/{filepath}"
        
        # Handle icon links
        icon_links = request.form.getlist('iconLinks[][icon]')
        icon_urls = request.form.getlist('iconLinks[][url]')
        config['iconLinks'] = [
            {"id": str(uuid.uuid4()), "icon": icon, "url": url}
            for icon, url in zip(icon_links, icon_urls)
            if icon and url
        ]
        
        # Handle custom links
        link_titles = request.form.getlist('customLinks[][title]')
        link_urls = request.form.getlist('customLinks[][url]')
        config['customLinks'] = [
            {"id": str(uuid.uuid4()), "title": title, "url": url}
            for title, url in zip(link_titles, link_urls)
            if title and url
        ]
        
        # Create a zip file in memory
        memory_file = io.BytesIO()
        with zipfile.ZipFile(memory_file, 'w') as zf:
            # Add config file
            zf.writestr('siteConfig.json', json.dumps(config, indent=2))
            
            # Add profile picture if exists
            if 'profilePicture' in config and config['profilePicture']:
                profile_path = config['profilePicture'].lstrip('/')
                if os.path.exists(profile_path):
                    zf.write(profile_path, 'profile-picture.jpg')
        
        memory_file.seek(0)
        
        # Clean up uploaded files
        if 'profilePicture' in config and config['profilePicture']:
            profile_path = config['profilePicture'].lstrip('/')
            if os.path.exists(profile_path):
                os.remove(profile_path)
        
        # Send the zip file
        return send_file(
            memory_file,
            mimetype='application/zip',
            as_attachment=True,
            download_name='site-config.zip'
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
