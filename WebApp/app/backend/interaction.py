from backend import user
from backend import device

def createUser():
    return user.create()

def deleteUser():
    checkPass, errorResponse = user.authenticate()
    if not checkPass:
        return errorResponse

    return user.delete()

def createDevice():
    checkPass, errorResponse = user.authenticate()
    if not checkPass:
        return errorResponse
    
    return device.create()

def deleteDevice():
    checkPass, errorResponse = user.authenticate()
    if not checkPass:
        return errorResponse

    return device.delete()

def logIn():
    checkPass, errorResponse = user.authenticate()
    if not checkPass:
        return errorResponse

    checkPass, errorResponse = device.authenticate()
    if not checkPass:
        return errorResponse
        
    return device.login()
    
def logOut():
    checkPass, errorResponse = device.authenticate()
    if not checkPass:
        return errorResponse

    return device.logout()

def updateIP():
    checkPass, errorResponse = device.authenticate()
    if not checkPass:
        return errorResponse
    
    return device.update()

def askTrust():
    checkPass, errorResponse = device.authenticate()
    if not checkPass:
        return errorResponse

    checkPass, errorResponse = device.checkLoggedIn()
    if not checkPass:
        return errorResponse
    
    return user.createTrustNot()

def acceptTrust():
    checkPass, errorResponse = device.authenticate()
    if not checkPass:
        return errorResponse

    checkPass, errorResponse = device.checkLoggedIn()
    if not checkPass:
        return errorResponse

    return user.createTrust()

def declineTrust():
    checkPass, errorResponse = device.authenticate()
    if not checkPass:
        return errorResponse

    checkPass, errorResponse = device.checkLoggedIn()
    if not checkPass:
        return errorResponse
    
    return user.deleteTrustNot()

def removeTrust():
    checkPass, errorResponse = device.authenticate()
    if not checkPass:
        return errorResponse

    checkPass, errorResponse = device.checkLoggedIn()
    if not checkPass:
        return errorResponse
    
    return user.deleteTrust()

def converse():
    checkPass, errorResponse = device.authenticate()
    if not checkPass:
        return errorResponse

    checkPass, errorResponse = device.checkLoggedIn()
    if not checkPass:
        return errorResponse
    
    return device.converse()