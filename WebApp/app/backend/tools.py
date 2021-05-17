import hashlib
import os

SALT_SEED = bytes(os.environ.get("JM_SALT_SEED"), "utf-8")
ITERATION_SEED = int(os.environ.get("JM_ITERATION_SEED"))
SYMBOLS = [' ', '!', '\"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~']

def generateIterations():

def generateSalt():


def hashAlg(passphrase, salt, iterations):
    # global SALTS
    # global ROUNDS

    hashterm = hashlib.sha3_512(passphrase.encode() + salt)
    for _ in range(iterations - 1):
        hashterm.update(hashterm.digest())

    return hashterm.digest()

def newUsernameCheck(username):
    if len(username) > 64:
        return False, "username is over 64 characters"
    if len(username) < 8:
        return False, "username is under 8 characters"
    return True, ""

def newPassphraseCheck(passphrase):
    if passphrase == passphrase.upper():
        return False, "passphrase is missing lowercase letter"
    if passphrase == passphrase.lower():
        return False, "passphrase is missing uppercase letter"
    if not any([str.isdigit(c) for c in passphrase]):
        return False, "passphrase is missing number"
    if not any([c in SYMBOLS for c in passphrase]):
        return False, "passphrase is missing symbol"
    if len(passphrase) > 128:
        return False, "passphrase is too long"
    if len(passphrase) < 8:
        return False, "passphrase is too short"
    return True, ""