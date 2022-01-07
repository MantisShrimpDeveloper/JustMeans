from backend.models import UserData, DeviceData

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

def establish_connection() -> None:
    global CONNECTION
    while CONNECTION == None or CONNECTION.closed != 0:
        try:
            CONNECTION = psycopg2.connect(**CONNECTION_PARAMS)
        except psycopg2.OperationalError as e:
            print("While attempting to connect to the database, the error " + str(e) + " occurred")

def execute_query(query: str, params=None, fetch=False) -> tuple:
    establish_connection()
    cursor = CONNECTION.cursor()
    try:
        cursor.execute(query, params)
        CONNECTION.commit()
    except Exception as e:
        print("While attempting to execute the query " + str(query) + ", the error " + str(e) + " occurred")
        return False, []
    ret = None
    if fetch:
        ret = cursor.fetchall()
    cursor.close()
    return True, ret

# user interaction

def create_user(username: str, email: str, passhash1: bytes, passhash2: bytes, salt1: bytes, salt2: bytes, iterations1: int, iterations2: int) -> bool:
    params = (username, email, passhash1, passhash2, salt1, salt2, iterations1, iterations2)
    return execute_query("INSERT INTO jm_user (username, email, passhash1, passhash2, salt1, salt2, iterations1, iterations2) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);", params)

def is_user(username: str) -> int:
    params = (username,)
    _, fetch = execute_query("SELECT \"ID\" FROM jm_user WHERE username=%s;", params, True)
    if len(fetch) > 0:
        return int(fetch[0][0])
    else:
        return None

def get_user(userID: int) -> UserData:
    params = (userID,)
    _, fetch = execute_query("SELECT (username, email, passhash1, passhash2, salt1, salt2, iterations1, iterations2) FROM jm_user WHERE \"ID\"=%s;", params, True)
    print(fetch)
    if len(fetch) > 0:
        att = fetch[0][0].split(',')
        att[0] = att[0][1:]
        att[2] = bytes.fromhex(att[2][4:-1])
        att[3] = bytes.fromhex(att[3][4:-1])
        att[4] = bytes.fromhex(att[4][4:-1])
        att[5] = bytes.fromhex(att[5][4:-1])
        att[6] = int(att[6])
        att[7] = int(att[7][:-1])
        return UserData(*att)
    else:
        return None

def delete_user(userID: int) -> bool:
    params = (userID,)
    return execute_query("DELETE FROM jm_user WHERE \"ID\"=%s;", params)

def search_users(partial_username: str) -> list:
    params = ("%%" + partial_username + "%%",)
    _, fetch = execute_query("SELECT username FROM jm_user WHERE username LIKE %s LIMIT 50;", params, True)
    ret = []
    if len(fetch) > 0:
        for f in fetch:
            ret.append(f[0])
    return ret 

# device interaction

def create_device(userID: int, devicename: str, publickey: bytes, web: bool) -> bool:
    params = (userID, devicename, publickey, web, False)
    return execute_query("INSERT INTO jm_device (\"userID\", devicename, publickey, web, loggedin) VALUES (%s, %s, %s, %s, %s);", params)

def is_device(userID: int, devicename: str) -> int:
    params = (userID, devicename)
    _, fetch = execute_query("SELECT \"ID\" FROM jm_device WHERE \"userID\"=%s AND devicename=%s;", params, True)
    if len(fetch) > 0:
        return int(fetch[0][0])
    else:
        return None

def get_device(deviceID: int) -> DeviceData:
    params = (deviceID,)
    _, fetch = execute_query("SELECT (\"userID\", devicename, publickey, loggedin, currentip, message, web, \"sessionID\") FROM jm_device WHERE \"ID\"=%s;", params, True)
    if len(fetch) > 0:
        att = fetch[0][0].split(',')
        att[0] = int(att[0][1:])
        att[2] = bytes.fromhex(att[2][4:-1])
        att[3] = True if att[3] == "t" else False
        att[4] = bytes.fromhex(att[4][4:-1])
        att[5] = bytes.fromhex(att[5][4:-1])
        att[6] = True if att[6][:-1] == "t" else False
        att[7] = bytes.fromhex(att[7][4:-2])
        return DeviceData(*att)
    else:
        return None

def is_logged_in(deviceID: int) -> bool:
    params = (deviceID,)
    _, fetch = execute_query("SELECT loggedin FROM jm_device WHERE \"ID\"=%s", params, True)
    return len(fetch) > 0 and fetch[0][0]

def update_logged_in(deviceID: int, login: bool) -> bool:
    params = (login, deviceID)
    return execute_query("UPDATE jm_device SET loggedIn=%s WHERE \"ID\"=%s;", params)

def update_current_ip(deviceID: int, IP: bytes) -> bool:
    params = (IP, deviceID)
    return execute_query("UPDATE jm_device SET currentIP=%s WHERE \"ID\"=%s;", params)

def update_device_message(deviceID: int, message: bytes) -> bool:
    params = (message, deviceID)
    return execute_query("UPDATE jm_device SET message=%s WHERE \"ID\"=%s;", params)

def update_session_id(deviceID: int, sessionID: bytes) -> bool:
    params = (sessionID, deviceID)
    return execute_query("UPDATE jm_device SET \"sessionID\"=%s WHERE \"ID\"=%s;", params)

def get_device_by_session_id(sessionID: bytes) -> int:
    params = (sessionID,)
    _, fetch = execute_query("SELECT \"ID\" FROM jm_device WHERE \"sessionID\"=%s;", params, True)
    if len(fetch) > 0:
        return int(fetch[0][0])
    else:
        return None

def delete_device(deviceID: int) -> bool:
    params = (deviceID,)
    return execute_query("DELETE FROM jm_device WHERE \"ID\"=%s;", params)

# trust interaction

def create_trust(userID1: int, userID2: int) -> bool:
    params = (userID1, userID2)
    reverse_params = (userID2, userID1)
    return execute_query("INSERT INTO jm_trust (user1, user2) VALUES (%s, %s);", params) and execute_query("INSERT INTO jm_trust (user1, user2) VALUES (%s, %s);", reverse_params)

def is_trust(userID1: int, userID2: int):
    params = (userID1, userID2)
    _, fetch1 = execute_query("SELECT (user1, user2) FROM jm_trust WHERE user1=%s AND user2=%s;", params, True)
    return len(fetch1) > 0

def delete_trust(userID1: int, userID2: int) -> bool:
    params = (userID1, userID2)
    reverse_params = (userID2, userID1)
    return execute_query("DELETE FROM jm_trust WHERE user1=%s AND user2=%s;", params) and execute_query("DELETE FROM jm_trust WHERE user1=%s AND user2=%s;", reverse_params)

def create_trust_notification(receiver: int, sender: int) -> bool:
    params = (receiver, sender)
    return execute_query("INSERT INTO jm_trust_not (receiver, sender) VALUES (%s, %s);", params)

def is_trust_notification(receiver: int, sender: int) -> bool:
    params = (receiver, sender)
    _, fetch = execute_query("SELECT (receiver, sender) FROM jm_trust_not WHERE receiver=%s AND sender=%s;", params, True)
    return len(fetch) > 0

def delete_trust_notification(receiver: int, sender: int) -> bool:
    params = (receiver, sender)
    return execute_query("DELETE FROM jm_trust_not WHERE receiver=%s AND sender=%s;", params)

# helpful tools
def get_devices_of_user(userID: int) -> list:
    params = (userID,)
    _, fetch = execute_query("SELECT (\"ID\", devicename) FROM jm_device WHERE \"userID\"=%s;", params, True)
    ret = []
    if len(fetch) > 0:
        for f in fetch:
            dev = f[0].split(',')
            ret.append((int(dev[0][1:]), dev[1][:-1]))
    return ret

def get_trusts_for_user(userID: int) -> list:
    params = (userID,)
    _, fetch = execute_query("SELECT jm_user.username FROM jm_user, jm_trust WHERE jm_user.\"ID\" = jm_trust.user2 AND jm_trust.user1 =%s;", params, True)
    ret = []
    if len(fetch) > 0:
        for f in fetch:
            ret.append(f[0])
    return ret

def get_trust_requests_for_user(userID: int) -> list:
    params = (userID,)
    _, fetch = execute_query("SELECT jm_user.username FROM jm_user, jm_trust_not WHERE jm_user.\"ID\" = jm_trust_not.sender AND jm_trust_not.receiver =%s", params, True)
    ret = []
    if len(fetch) > 0:
        for f in fetch:
            ret.append(f[0])
    return ret
