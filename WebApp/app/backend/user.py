from backend.tools import hashAlg, newUsernameCheck, newPassphraseCheck, generateIterations, generateSalt
import backend.db_conn as db
from flask import request, make_response, jsonify

def create():
    username = request.get_json()['username']
    passphrase1 = request.get_json()['passphrase1']
    passphrase2 = request.get_json()['passphrase2']
    email = request.get_json()['email']

    salt1 = generateSalt()
    salt2 = generateSalt()

    iterations1 = generateIterations()
    iterations2 = generateIterations()

    checkPass, errorMessage = newUsernameCheck(username)
    if not checkPass:
        return make_response(jsonify(status="failed", error=errorMessage))

    checkPass, errorMessage = newPassphraseCheck(passphrase1)
    if not checkPass:
        return make_response(jsonify(status="failed", error=errorMessage))

    checkPass, errorMessage = newPassphraseCheck(passphrase2)
    if not checkPass:
        return make_response(jsonify(status="failed", error=errorMessage))

    if db.isUser(username):
        return make_response(jsonify(status="failed", error="username is already taken"))

    passhash1 = hashAlg(passphrase1, 0)
    passhash2 = hashAlg(passphrase2, 1)

    if db.createUser(username, email, passhash1, passhash2, salt1, salt2, iterations1, iterations2):
        return make_response(jsonify(status="success"))

    return make_response(jsonify(status="falied", error="unknown error occured"))

def authenticate():
    username = request.get_json()['username']
    passphrase1 = request.get_json()['passphrase1']
    passphrase2 = request.get_json()['passphrase2']

    passhash1 = hashAlg(passphrase1, 0)
    passhash2 = hashAlg(passphrase2, 1)

    if not db.isUser(username):
        return False, make_response(jsonify(status="no user with that username"))

    user = db.getUser(username)
    
    if passhash1 == user[2] and passhash2 == user[3]:
        return True, None
    else:
        return False, make_response(jsonify(status="incorrect passphrases"))

def delete():
    username = request.get_json()['username']

    if not db.isUser(username):
        return False, make_response(jsonify(status="no user with that username"))

    user = db.getUser(username)

    devices = db.getDevicesOfUser(user[0])
    for device in devices:
        if not db.deleteDevice(device[0]):
            return make_response(jsonify(status="device " + device[2] + " deletion unsuccessful"))

    if db.deleteUser(user[0]):
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="user deletion unsuccessful"))

def createTrust():
    username = request.get_json()['username']
    otherUsername = request.get_json()['otherUsername']

    if not db.isUser(username):
        return False, make_response(jsonify(status="no user with that username"))

    user = db.getUser(username)

    if not db.isUser(otherUsername):
        return False, make_response(jsonify(status="no other user with that username"))

    otherUser = db.getUser(otherUsername)

    if db.isTrust(user[0], otherUser[0]):
        return False, make_response(jsonify(status="trust already exists"))

    if not db.isTrustNot(otherUser[0], user[0]):
        return False, make_response(jsonify(status="trust notification doesn't exist"))

    if not db.deleteTrustNot(otherUser[0], user):
        return make_response(jsonify(status="trust notification deletion unsuccessful"))

    if db.createTrust(user[0], otherUser[0]):
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="trust creation unsuccessful"))

def deleteTrust():
    username = request.get_json()['username']
    otherUsername = request.get_json()['otherUsername']

    if not db.isUser(username):
        return False, make_response(jsonify(status="no user with that username"))

    user = db.getUser(username)

    if not db.isUser(otherUsername):
        return False, make_response(jsonify(status="no other user with that username"))

    otherUser = db.getUser(otherUsername)

    if not db.isTrust(user[0], otherUser[0]):
        return False, make_response(jsonify(status="trust doesn't exist"))

    if db.deleteTrust(user[0], otherUser[0]):
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="trust deletion unsuccessful"))

def createTrustNot():
    username = request.get_json()['username']
    otherUsername = request.get_json()['otherUsername']

    if not db.isUser(username):
        return False, make_response(jsonify(status="no user with that username"))

    user = db.getUser(username)

    if not db.isUser(otherUsername):
        return False, make_response(jsonify(status="no other user with that username"))

    otherUser = db.getUser(otherUsername)

    if db.isTrustNot(otherUser[0], user[0]):
        return False, make_response(jsonify(status="trust notification already exists"))

    if db.createTrustNot(otherUser[0], user):
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="trust notification creation unsuccessful"))



def deleteTrustNot():
    username = request.get_json()['username']
    otherUsername = request.get_json()['otherUsername']

    if not db.isUser(username):
        return False, make_response(jsonify(status="no user with that username"))

    user = db.getUser(username)

    if not db.isUser(otherUsername):
        return False, make_response(jsonify(status="no other user with that username"))

    otherUser = db.getUser(otherUsername)

    if not db.isTrustNot(otherUser[0], user[0]):
        return False, make_response(jsonify(status="trust notification doesn't exist"))

    if db.deleteTrustNot(otherUser[0], user):
        return make_response(jsonify(status="success"))
    else:
        return make_response(jsonify(status="trust notification deletion unsuccessful"))