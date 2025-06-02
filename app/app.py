from flask import Flask
from .routes import main

app = Flask(__name__)
app.secret_key = 'your_super_secret_key_123456'  # Needed for session

# Register blueprints
app.register_blueprint(main)

# Add this block for local development, Gunicorn won't use it directly
if __name__ == '__main__':
    app.run(debug=True) 