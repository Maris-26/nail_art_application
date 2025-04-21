from flask import Flask, render_template
from app.routes import main

app = Flask(__name__)

# Register blueprints
app.register_blueprint(main)

if __name__ == '__main__':
    app.run(debug=True) 