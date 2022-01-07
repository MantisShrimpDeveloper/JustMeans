from dataclasses import dataclass

@dataclass
class UserData:
    username: str
    email: str
    passhash1: bytes
    passhash2: bytes
    salt1: bytes
    salt2: bytes
    iterations1: int
    iterations2: int

@dataclass
class DeviceData:
    userID: int
    devicename: str
    publickey: bytes
    loggedin: bool
    currentip: bytes
    message: bytes
    web: bool
    sessionID: int