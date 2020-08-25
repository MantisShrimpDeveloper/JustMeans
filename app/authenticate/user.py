from authenticate.tools import hashAlg
from flask import request, make_response, jsonify

users = {'badmomma' : {'pass1hash':b'\xb7g\x1fd\xb7\xe1\xb0\xd44P\x9edj\x8fl\xbap\x0fi}m\xd8\x90\xfb*\x17%\xe0\xd1+\xee\x0f\x96ak\x06a}9_=H\x1e\x02U\xa8\xc0\xf6\x9f\xbeP\x98\xa3\xb8\xf0\x0f\x04\xa3\x83y\x12[2\xda', \
                         'pass2hash':b"\xf8\xfb\x87\xbb\xf7\x8c[X\xcbIr\xaf\xbcS(\xfd<\x9d \xf0\x15PG\xb0y\xd1\xd4_: \x05\xe1\xd4\xce\xf7\xff\xcf'\xe4\x00q\xbdc3,\xb2x\xc2C\xb7\xdd\xb0Fb\xd0\x8e#%\xbaQ\xc0\x82g(", \
                         'currentIP': 0}}


def dashboardWebUser():
    username = request.get_json()['username']
    ip = request.remote_addr
    if users[username]['currentIP'] != ip:
        resp = make_response(jsonify(status="failed"))
        return resp
    

def logOutWebUser():
    username = request.get_json()['username']
    ip = request.remote_addr
    if username in users and users[username]['currentIP'] == ip:
        resp = make_response(jsonify(status="success"))
        users[username]['currentIP'] = 0
        return resp
    return make_response(jsonify(status="failed"))

def logInWebUser():
    username = request.get_json()['username']
    passphrase1 = request.get_json()['passphrase1']
    passphrase2 = request.get_json()['passphrase2']


    pass1hash = hashAlg(passphrase1, 0)
    pass2hash = hashAlg(passphrase2, 1)

    if username not in users:
        resp = make_response(jsonify(status="no user with that username"))
        return resp

    if pass1hash == users[username]['pass1hash'] and pass2hash == users[username]['pass2hash']:
        resp = make_response(jsonify(status="success"))
        users[username]['currentIP'] = request.remote_addr
        return resp
    else:
        resp = make_response(jsonify(status="incorrect passphrases"))
        return resp

def createUser():
    username = request.get_json()['username']
    passphrase1 = request.get_json()['passphrase1']
    passphrase2 = request.get_json()['passphrase2']

    if username == "":
        resp = make_response(jsonify(status="username missing"))
        return resp

    if passphrase1 == "":
        resp = make_response(jsonify(status="passphrase1 missing"))
        return resp

    if passphrase2 == "":
        resp = make_response(jsonify(status="passphrase2 missing"))
        return resp

    if username in users:
        resp = make_response(jsonify(status="already a user with that username"))
        return resp

    pass1hash = hashAlg(passphrase1, 0)
    pass2hash = hashAlg(passphrase2, 1)

    users[username] = {'pass1hash': pass1hash, 'pass2hash': pass2hash, 'currentIP': 0}
    resp = make_response(jsonify(status="success"))
    return resp

    




#in time

def authenticateDeviceUser():
    pass


def createAnonWebUser():
    pass

def createAnonDeviceUser():
    pass

def logOut(username):
    users[username]['loggedIn'] = False

def logIn(username):
    users[username]['loggedIn'] = True
    users[username]['loggedIn'] = request.remote_addr
    print(users[username]['loggedIn'])

accessors = {'badmomma': {}}

requests = {'badmomma': {}}

