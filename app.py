from flask import Flask, render_template
from app.routes import main
from app.app import app

app = Flask(__name__)
app.secret_key = 'your_super_secret_key_123456'  # Needed for session

# Register blueprints
app.register_blueprint(main)

# ... existing code ... 

if __name__ == '__main__':
    app.run(debug=True) 