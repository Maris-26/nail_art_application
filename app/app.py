from flask import Flask
from .routes import main

app = Flask(__name__)
app.secret_key = 'your_super_secret_key_123456'

# Register blueprints
app.register_blueprint(main)

# 可以选择添加一个 create_app 工厂函数，但为了匹配 gunicorn app.app:app，直接暴露 app 实例更符合。
# def create_app():
#     app = Flask(__name__)
#     app.secret_key = 'your_super_secret_key_123456'
#     app.register_blueprint(main)
#     return app 