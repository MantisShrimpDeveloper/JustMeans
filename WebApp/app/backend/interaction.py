from flask.wrappers import Response
from backend import user, device

def create_user() -> Response:
    return user.create()

def delete_user() -> Response:
    checkPass, errorResponse = user.authenticate()
    if not checkPass:
        return errorResponse

    return user.delete()

def create_device() -> Response:
    checkPass, errorResponse = user.authenticate()
    if not checkPass:
        return errorResponse
    
    return device.create()

def delete_device() -> Response:
    checkPass, errorResponse = user.authenticate()
    if not checkPass:
        return errorResponse

    return device.delete()

def login() -> Response:
    checkPass, errorResponse = user.authenticate()
    if not checkPass:
        return errorResponse
        
    return device.login()
    
def request_authentication() -> Response:
    return device.request_authentication()

def logout() -> Response:
    checkPass, errorResponse, message = device.authenticate()
    if not checkPass:
        return errorResponse

    return device.logout()

def update() -> Response:
    checkPass, errorResponse, message = device.authenticate()
    if not checkPass:
        return errorResponse
    
    return device.update(message)

def ask_trust() -> Response:
    checkPass, errorResponse, message = device.authenticate()
    if not checkPass:
        return errorResponse
    
    return user.create_trust_notification(message)

def accept_trust() -> Response:
    checkPass, errorResponse, message = device.authenticate()
    if not checkPass:
        return errorResponse

    return user.create_trust(message)

def decline_trust() -> Response:
    checkPass, errorResponse, message = device.authenticate()
    if not checkPass:
        return errorResponse
    
    return user.delete_trust_notification(message)

def remove_trust() -> Response:
    checkPass, errorResponse, message = device.authenticate()
    if not checkPass:
        return errorResponse
    
    return user.delete_trust(message)

def start_conversation() -> Response:
    checkPass, errorResponse = device.authenticate()
    if not checkPass:
        return errorResponse
    
    return None

def username_search() -> Response:
    return user.username_search()