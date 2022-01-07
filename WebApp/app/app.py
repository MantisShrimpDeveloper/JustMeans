import os
from flask import Flask, send_from_directory
from backend import interaction as inter
from flask_cors import CORS


app = Flask(__name__, static_folder='react/build')
CORS(app)

#backend

@app.route('/create-user', methods=['POST'])
def create_user():
    return inter.create_user()

@app.route('/delete-user', methods=['POST'])
def delete_user():
    return inter.delete_user()

@app.route('/create-device', methods=['POST'])
def create_device():
    return inter.create_device()

@app.route('/delete-device', methods=['POST'])
def delete_device():
    return inter.delete_device()

@app.route('/request-authentication', methods=['POST'])
def request_authentication():
    return inter.request_authentication()

@app.route('/update', methods=['POST'])
def update():
    return inter.update()

@app.route('/login', methods=['POST'])
def login():
    return inter.login()

@app.route('/logout', methods=['POST'])
def logout():
    return inter.logout()

@app.route('/ask-trust', methods=['POST'])
def ask_trust():
    return inter.ask_trust()

@app.route('/accept-trust', methods=['POST'])
def accept_trust():
    return inter.accept_trust()

@app.route('/decline-trust', methods=['POST'])
def decline_trust():
    return inter.decline_trust()

@app.route('/remove-trust', methods=['POST'])
def remove_trust():
    return inter.remove_trust()

@app.route('/username-search', methods=['POST'])
def username_search():
    return inter.username_search()

#frontend

@app.route('/')
def splash():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

def main():
    app.run(host="0.0.0.0", use_reloader=True, threaded=True)
    
if __name__ == "__main__":
    main()