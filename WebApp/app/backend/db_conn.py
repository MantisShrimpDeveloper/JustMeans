import psycopg2
import os

CONNECTION = None

CONNECTION_PARAMS = {
    'dbname': os.environ.get("JM_DBNAME"),
    'user': os.environ.get("JM_USER"),
    'password': os.environ.get("JM_PASSWORD"),
    'host': os.environ.get("JM_HOST"),
    'port': os.environ.get("JM_PORT")
}

def establishConnection():
    global CONNECTION
    while CONNECTION == None or CONNECTION.closed != 0:
        try:
            CONNECTION = psycopg2.connect(**CONNECTION_PARAMS)
        except psycopg2.OperationalError as e:
            print("While attempting to connect to the database, the error " + str(e) + " occurred")

def query(q, params=None, fetch=False):
    establishConnection()
    cursor = CONNECTION.cursor()
    try:
        cursor.execute(q, params)
        CONNECTION.commit()
    except psycopg2.OperationalError as e:
        print("While attempting to execute the query " + str(q) + ", the error " + str(e) + " occurred")
        return False
    ret = None
    if fetch:
        ret = cursor.fetchall()
    cursor.close()
    return True, ret

# user interaction

def createUser(username, email, passhash1, passhash2, salt1, salt2, iterations1, iterations2):
    params = (username, email, passhash1, passhash2, salt1, salt2, iterations1, iterations2)
    return query("INSERT INTO jm_user (username, email, passhash1, passhash2, salt1, salt2, iterations1, iterations2) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);", params)

def isUser(username):
    params = (username,)
    _, fetch = query("SELECT username FROM jm_user WHERE username=%s;", params, True)
    return len(fetch) > 0

def getUser(username):
    params = (username,)
    _, fetch = query("SELECT (ID, username, email, passhash1, passhash2, salt1, salt2, iterations1, iterations2) FROM jm_user WHERE username=%s;", params, True)
    return fetch[0]

def deleteUser(userID):
    params = (userID,)
    return query("DELETE FROM jm_user WHERE ID=%s;", params)

# device interaction

def createDevice(userID, devicename, passhash):
    params = (userID, devicename, passhash, False)
    return query("INSERT INTO jm_device (userID, devicename, passhash, loggedIn) VALUES (%s, %s, %s, %s);", params)

def isDevice(userID, devicename):
    params = (userID, devicename)
    _, fetch = query("SELECT (ID, userID, devicename, passhash, loggedIn, currentIP) FROM jm_device WHERE userID=%s AND name=%s;", params, True)
    return len(fetch) > 0

def getDevice(userID, devicename):
    params = (userID, devicename)
    _, fetch = query("SELECT (ID, userID, devicename, passhash, loggedIn, currentIP) FROM jm_device WHERE userID=%s AND name=%s;", params, True)
    return fetch[0]

def isDeviceOn(deviceID):
    params = (deviceID, True)
    _, fetch = query("SELECT (ID, userID, devicename, passhash, loggedIn, currentIP) FROM jm_device WHERE ID=%s AND loggedIn=%s;", params, True)
    return len(fetch) > 0

def updateDeviceLog(deviceID, login):
    params = (login, deviceID)
    return query("UPDATE jm_device SET loggedIn=%s WHERE ID=%s;", params)

def updateDeviceIP(deviceID, IP):
    params = (IP, deviceID)
    return query("UPDATE jm_device SET currentIP=%s WHERE ID=%s;", params)

def deleteDevice(deviceID):
    params = (deviceID,)
    return query("DELETE FROM jm_device WHERE ID=%s;", params)

# trust interaction

def createTrust(userID1, userID2):
    params = (userID1, userID2)
    reverse_params = (userID2, userID1)
    return query("INSERT INTO jm_trust (user1, user2) VALUES (%s, %s);", params) and query("INSERT INTO jm_trust (user1, user2) VALUES (%s, %s);", reverse_params)

def isTrust(userID1, userID2):
    params = (userID1, userID2)
    reverse_params = (userID2, userID1)
    ret1, fetch1 = query("SELECT (user1, user2) FROM jm_trust WHERE userID1=%s AND userID2=%s;", params, True)
    ret2, fetch2 = query("SELECT (user1, user2) FROM jm_trust WHERE userID1=%s AND userID2=%s;", reverse_params, True)
    return len(fetch1) > 0 and len(fetch2) > 0

def deleteTrust(userID1, userID2):
    params = (userID1, userID2)
    reverse_params = (userID2, userID1)
    return query("DELETE FROM jm_trust WHERE user1=%s AND user2=%s;", params) and query("DELETE FROM jm_trust WHERE user1=%s AND user2=%s;", reverse_params)

def createTrustNot(receiver, sender):
    params = (receiver, sender)
    return query("INSERT INTO jm_trust_not (receiver, sender) VALUES (%s, %s);", params)

def isTrustNot(receiver, sender):
    params = (receiver, sender)
    ret, fetch = query("SELECT (receiver, sender) FROM jm_trust_not WHERE receiver=%s AND sender=%s;", params, True)
    return len(fetch) > 0

def deleteTrustNot(receiver, sender):
    params = (receiver, sender)
    return query("DELETE FROM jm_trust_not WHERE receiver=%s AND sender=%s;", params)

# helpful tools
def getDevicesOfUser(userID):
    params = (userID,)
    _, fetch = query("SELECT (ID, userID, name, passhash, loggedIn, currentIP) FROM jm_device WHERE userID=%s;", params, True)
    return fetch