from backend.tools import hash_algorithm, new_passphrase2_check, new_passphrase1_check, generate_iterations, generate_salt, new_username_check
import backend.db_conn as db
from flask import request, make_response, jsonify
from flask.wrappers import Response

# user protocols

def create() -> Response:
    username = request.get_json()['username']
    passphrase1 = request.get_json()['passphrase1']
    passphrase2 = request.get_json()['passphrase2']
    email = request.get_json()['email']

    salt1 = generate_salt()
    salt2 = generate_salt()

    iterations1 = generate_iterations()
    iterations2 = generate_iterations()

    checkPass, errorMessage = new_username_check(username)
    if not checkPass:
        return make_response(jsonify(status="failed", error=errorMessage))

    checkPass, errorMessage = new_passphrase1_check(passphrase1)
    if not checkPass:
        return make_response(jsonify(status="failed", error=errorMessage))

    checkPass, errorMessage = new_passphrase2_check(passphrase2)
    if not checkPass:
        return make_response(jsonify(status="failed", error=errorMessage))

    if db.is_user(username):
        return make_response(jsonify(status="failed", error="username is unavailable"))

    passhash1 = hash_algorithm(passphrase1, salt1, iterations1)
    passhash2 = hash_algorithm(passphrase2, salt2, iterations2)

    if db.create_user(username, email, passhash1, passhash2, salt1, salt2, iterations1, iterations2):
        return make_response(jsonify(status="success"))

    return make_response(jsonify(status="failed", error="unknown error occured"))

def authenticate() -> tuple:
    username = request.get_json()['username']
    passphrase1 = request.get_json()['passphrase1']
    passphrase2 = request.get_json()['passphrase2']

    userID = db.is_user(username)
    if not userID:
        return False, make_response(jsonify(status="failed", error="no user with that username"))
    user = db.get_user(userID)
    
    passhash1 = hash_algorithm(passphrase1, user.salt1, user.iterations1)
    passhash2 = hash_algorithm(passphrase2, user.salt2, user.iterations2)
    
    if passhash1 == user.passhash1 and passhash2 == user.passhash2:
        return True, None
    else:
        return False, make_response(jsonify(status="failed", error="incorrect passphrases"))

def delete() -> Response:
    username = request.get_json()['username']

    userID = db.is_user(username)
    if not userID:
        return make_response(jsonify(status="failed", error="no user with that username"))

    devices = db.get_devices_of_user(userID)
    for device in devices:
        if not db.deleteDevice(device[0]):
            return make_response(jsonify(status="failed", error="device " + device[2] + " deletion unsuccessful"))

    if db.delete_user(userID):
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="failed", error="user deletion unsuccessful"))

def username_search() -> Response:
    partial_username = request.get_json()['partial_username']
    print(partial_username)
    usernames = db.search_users(partial_username)
    return make_response(jsonify(status="success", usernames=usernames))

# trust protocols

def create_trust(message: str) -> Response:
    username = request.get_json()['username']
    otherUsername = request.get_json()['otherUsername']

    userID = db.is_user(username)
    if not userID:
        return make_response(jsonify(status="failed", error="no user with that username", message=message))

    otherUserID = db.is_user(otherUsername)
    if not otherUserID:
        return make_response(jsonify(status="failed", error="no user with that username", message=message))

    if db.is_trust(userID, otherUserID):
        return make_response(jsonify(status="failed", error="trust already exists", message=message))

    if not db.is_trust_notification(userID, otherUserID):
        return make_response(jsonify(status="failed", error="trust notification doesn't exist", message=message))

    if not db.delete_trust_notification(userID, otherUserID):
        return make_response(jsonify(status="failed", error="trust notification deletion unsuccessful", message=message))

    if db.create_trust(userID, otherUserID):
        return make_response(jsonify(status="success", message=message))
    else:
        return make_response(jsonify(status="failed", error="trust creation unsuccessful", message=message))

def delete_trust(message: str) -> Response:
    username = request.get_json()['username']
    otherUsername = request.get_json()['otherUsername']

    userID = db.is_user(username)
    if not userID:
        return make_response(jsonify(status="failed", error="no user with that username", message=message))

    otherUserID = db.is_user(otherUsername)
    if not otherUserID:
        return make_response(jsonify(status="failed", error="no user with that username", message=message))

    if not db.is_trust(userID, otherUserID):
        return make_response(jsonify(status="failed", error="trust doesn't exist", message=message))

    if db.delete_trust(userID, otherUserID):
        return make_response(jsonify(status="success", message=message))
    else:
        return make_response(jsonify(status="failed", error="trust deletion unsuccessful", message=message))

def create_trust_notification(message: str) -> Response:
    username = request.get_json()['username']
    otherUsername = request.get_json()['otherUsername']

    userID = db.is_user(username)
    if not userID:
        return make_response(jsonify(status="failed", error="no user with that username", message=message))

    otherUserID = db.is_user(otherUsername)
    if not otherUserID:
        return make_response(jsonify(status="failed", error="no user with that username", message=message))

    if db.is_trust_notification(otherUserID, userID):
        return make_response(jsonify(status="failed", error="trust notification already exists", message=message))

    if db.create_trust_notification(otherUserID, userID):
        return make_response(jsonify(status="success", message=message))
    else:
        return make_response(jsonify(status="failed", error="trust notification creation unsuccessful", message=message))

def delete_trust_notification(message: str) -> Response:
    username = request.get_json()['username']
    otherUsername = request.get_json()['otherUsername']

    userID = db.is_user(username)
    if not userID:
        return make_response(jsonify(status="failed", error="no user with that username", message=message))

    otherUserID = db.is_user(otherUsername)
    if not otherUserID:
        return make_response(jsonify(status="failed", error="no user with that username", message=message))

    if not db.is_trust_notification(userID, otherUserID):
        return make_response(jsonify(status="failed", error="trust notification doesn't exist", message=message))

    if db.delete_trust_notification(userID, otherUserID):
        return make_response(jsonify(status="success", message=message))
    else:
        return make_response(jsonify(status="failed", error="trust notification deletion unsuccessful", message=message))