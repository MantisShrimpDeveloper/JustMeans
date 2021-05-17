from backend.tools import hashAlg
import backend.db_conn as db
from flask import request, make_response, jsonify

def create():
    username = request.get_json()['username']
    devicename = request.get_json()['devicename']
    passkey = request.get_json()['passkey']

    if db.isUser(username):
        userID = db.getUser(username)[0]
    else:
        return make_response(jsonify(status="no user with that username"))

    #passkey check

    #name check

    passhash = hashAlg(passkey, 2)
    
    if db.isDevice(userID, devicename):
        return make_response(jsonify(status="user already has device with this name"))

    if db.createDevice(userID, devicename, passhash):
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="failed device creation"))

def authenticate():
    username = request.get_json()['username']
    devicename = request.get_json()['devicename']
    passkey = request.get_json()['passkey']

    if db.isUser(username):
        userID = db.getUser(username)[0]
    else:
        return make_response(jsonify(status="no user with that username"))

    passhash = hashAlg(passkey, 2)

    if not db.isDevice(userID, devicename):
        return make_response(jsonify(status="user has no device by that name"))

    device = db.getDevice(userID, devicename)
    if passhash == device[2]:
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="incorrect device key"))

def login():
    username = request.get_json()['username']
    devicename = request.get_json()['devicename']
    currentIP = request.remote_addr

    if db.isUser(username):
        userID = db.getUser(username)[0]
    else:
        return make_response(jsonify(status="no user with that username"))

    if not db.isDevice(userID, devicename):
        return make_response(jsonify(status="user has no device by that name"))

    device = db.getDevice(userID, devicename)

    if not db.updateDeviceLog(device[0], True):
        return make_response(jsonify(status="failed login"))

    if db.updateDeviceIP(device[0], currentIP):
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="failed IP update"))

def logout():
    username = request.get_json()['username']
    devicename = request.get_json()['devicename']

    if db.isUser(username):
        userID = db.getUser(username)[0]
    else:
        return make_response(jsonify(status="no user with that username"))

    if not db.isDevice(userID, devicename):
        return make_response(jsonify(status="user has no device by that name"))

    device = db.getDevice(userID, devicename)

    if not db.isDeviceOn(device[0]):
        return make_response(jsonify(status="device not logged in"))

    if not db.updateDeviceIP(device[0], None):
        return make_response(jsonify(status="failed IP update"))

    if db.updateDeviceLog(device[0], False):
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="failed logout"))

def update():
    username = request.get_json()['username']
    devicename = request.get_json()['devicename']
    currentIP = request.remote_addr

    if db.isUser(username):
        userID = db.getUser(username)[0]
    else:
        return make_response(jsonify(status="no user with that username"))

    if not db.isDevice(userID, devicename):
        return make_response(jsonify(status="user has no device by that name"))

    device = db.getDevice(userID, devicename)

    if not db.isDeviceOn(device[0]):
        return make_response(jsonify(status="device not logged in"))

    if db.updateDeviceIP(device[0], currentIP):
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="failed IP update"))

def delete():
    username = request.get_json()['username']
    devicename = request.get_json()['devicename']

    if db.isUser(username):
        userID = db.getUser(username)[0]
    else:
        return make_response(jsonify(status="no user with that username"))
    
    if not db.isDevice(userID, devicename):
        return make_response(jsonify(status="user has no device by that name"))

    device = db.getDevice(userID, devicename)

    if db.deleteDevice(device[0]):
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="device deletion unsuccessful"))

def checkLoggedIn():
    username = request.get_json()['username']
    devicename = request.get_json()['devicename']

    if not db.isDeviceOn(device[0]):
        return False, make_response(jsonify(status="device not logged in"))
    else:
        return True, None