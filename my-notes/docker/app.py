from flask import Flask
import torch, platform

app = Flask(__name__)

@app.route("/")
def home():
    return f"Hello from a container! torch {torch.__version__} on {platform.system()}"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
