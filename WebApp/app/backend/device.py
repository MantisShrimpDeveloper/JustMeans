from flask.wrappers import Response
from backend.tools import signature_verify, generate_message, new_devicename_check, generate_session_id
import backend.db_conn as db
from flask import request, make_response, jsonify

def create() -> Response:
    username = request.get_json()['username']
    devicename = request.get_json()['devicename']
    publickey = request.get_json()['publicKey']
    web = request.get_json()['web']

    userID = db.is_user(username)
    if not userID:
        return make_response(jsonify(status="failed", error="no user with that username"))
    
    if web:
        devices = db.get_devices_of_user(userID)
        names = [dev[1] for dev in devices]
        found = False
        for i in range(10):
            if "web-session" + str(i) not in names:
                devicename = "web-session" + str(i)
                found = True
                break
        if not found:
            return make_response(jsonify(status="failed", error="only 10 web devices allowed at a time"))
    else:
        checkPass, errorMessage = new_devicename_check(devicename)
        if not checkPass:
            return make_response(jsonify(status="failed", error=errorMessage))
        if db.is_device(userID, devicename):
            return make_response(jsonify(status="failed", error="user already has device with this name"))

    if db.create_device(userID, devicename, publickey, web):
        return make_response(jsonify(status="success", devicename=devicename))
    else:
        return make_response(jsonify(status="failed", error="failed device creation"))

def login() -> Response:
    username = request.get_json()['username']
    devicename = request.get_json()['devicename']
    currentIP = request.remote_addr

    userID = db.is_user(username)
    if not userID:
        return make_response(jsonify(status="failed", error="no user with that username"))

    deviceID = db.is_device(userID, devicename)
    if not deviceID:
        return make_response(jsonify(status="failed", error="user has no device by that name"))

    if not db.update_logged_in(deviceID, True):
        return make_response(jsonify(status="failed", error="failed login"))

    if not db.update_current_ip(deviceID, currentIP):
        return make_response(jsonify(status="failed", error="failed IP update"))

    sessionID = generate_session_id()
    print(sessionID.hex())
    if not db.get_device_by_session_id(sessionID) and db.update_session_id(deviceID, sessionID):
        return make_response(jsonify(status="success", sessionID=sessionID.hex()))
    else:
        return make_response(jsonify(status="failed", error="failed to create sessionID"))

def request_authentication() -> Response:
    sessionID = bytes.fromhex(request.get_json()['sessionID'])

    deviceID = db.get_device_by_session_id(sessionID)
    if not deviceID:
        return make_response(jsonify(status="failed", error="sessionID not recognized"))

    if not db.is_logged_in(deviceID):
        return make_response(jsonify(status="failed", error="device not logged in"))

    message = generate_message()
    db.update_device_message(deviceID, message)

    return make_response(jsonify(status="success", message=message.hex()))

def authenticate() -> tuple:
    sessionID = bytes.fromhex(request.get_json()['sessionID'])
    signature = request.get_json()['signature']

    deviceID = db.get_device_by_session_id(sessionID)
    if not deviceID:
        return False, make_response(jsonify(status="failed", error="sessionID not recognized")), None
    device = db.get_device(deviceID)

    if not device.loggedin:
        return False, make_response(jsonify(status="failed", error="device not logged in")), None

    if device.message == b'':
        return False, make_response(jsonify(status="failed", error="authentication failed")), None

    if signature_verify(device.publickey, signature, device.message):
        message = generate_message()
        db.update_device_message(deviceID, message)
        return True, None, message.hex()
    else:
        return False, make_response(jsonify(status="failed", error="authentication failed")), None

def update(message: str) -> Response:
    sessionID = bytes.fromhex(request.get_json()['sessionID'])
    currentIP = request.remote_addr

    deviceID = db.get_device_by_session_id(sessionID)
    if not deviceID:
        return make_response(jsonify(status="failed", error="sessionID not recognized", message=message))
    device = db.get_device(deviceID)

    if not device.loggedin:
        return make_response(jsonify(status="failed", error="device not logged in", message=message))

    trusts = db.get_trusts_for_user(device.userID)
    
    trust_requests = db.get_trust_requests_for_user(device.userID)

    if db.update_current_ip(deviceID, currentIP):
        return make_response(jsonify(status="success", trusts=trusts, trust_requests=trust_requests, message=message))
    else:
        return make_response(jsonify(status="failed", error="failed update", message=message))

def logout() -> Response:
    sessionID = request.cookies.get('sessionID')

    deviceID = db.get_device_by_session_id(sessionID)
    if not deviceID:
        return make_response(jsonify(status="failed", error="sessionID not recognized"))
    device = db.get_device(deviceID)

    if device.web:
        if db.delete_device(deviceID):
            return make_response(jsonify(status="success"))
        else:
            return make_response(jsonify(status="failed", error="device deletion unsuccessful"))

    db.update_current_ip(deviceID, None)
    db.update_session_id(deviceID, None)

    if db.update_logged_in(deviceID, False):
        return make_response(jsonify(status="failed", error="success"))
    else:
        return make_response(jsonify(status="failed", error="failed logout"))

def delete() -> Response:
    username = request.get_json()['username']
    devicename = request.get_json()['devicename']

    userID = db.is_user(username)
    if not userID:
        return make_response(jsonify(status="failed", error="no user with that username"))

    deviceID = db.is_device(userID, devicename)
    if not deviceID:
        return make_response(jsonify(status="failed", error="user has no device by that name"))

    if db.delete_device(deviceID):
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="failed", error="device deletion unsuccessful"))

# conversation protocols