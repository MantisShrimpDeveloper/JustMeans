import os
from flask import Flask, send_from_directory
from authenticate.user import logInWebUser, logOutWebUser, dashboardWebUser, authenticateDeviceUser, createUser, createAnonDeviceUser, createAnonWebUser
from flask_cors import CORS


app = Flask(__name__, static_folder='react/build')
CORS(app)

#backend

@app.route('/login-web-user', methods=['POST'])
def loginwebuser():
    return logInWebUser()

@app.route('/logout-web-user', methods=['POST'])
def logoutwebuser():
    return logOutWebUser()

@app.route('/dashboard-web-user', methods=['POST'])
def dashboardwebuser():
    return dashboardWebUser()

@app.route('/create-user', methods=['POST'])
def createuser():
    return createUser()


#in time

@app.route('/authenticate-device-user', methods=['POST'])
def authDeviceUser():
    return authenticateDeviceUser()
    #authenticateDevice()

@app.route('/create-anonymous-web-user', methods=['POST'])
def creAnonWebUser():
    return createAnonWebUser()

@app.route('/create-anonymous-device-user', methods=['POST'])
def creAnonDeviceUser():
    return createAnonDeviceUser()


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