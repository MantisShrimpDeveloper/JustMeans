import hashlib
import os
import random
import secrets
from Crypto.PublicKey import RSA
from Crypto.Signature import PKCS1_v1_5 
from Crypto.Hash import SHA512

random.seed(os.environ.get("JM_RAND_SEED"), version=2)
SYMBOLS = [' ', '!', '\"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~']

def generate_session_id():
    return secrets.token_bytes(64)

def generate_iterations():
    return random.randint(10_000, 100_000)

def generate_salt():
    return secrets.token_bytes(16)

def generate_message():
    return secrets.token_bytes(32)

def hash_algorithm(passphrase, salt, iterations):
    hashterm = hashlib.sha3_512(passphrase.encode() + salt)
    for _ in range(iterations - 1):
        hashterm.update(hashterm.digest())

    return hashterm.digest()

def signature_verify(publicKey, signature, message):
    signature = bytes.fromhex(signature)
    rsakey = RSA.import_key(publicKey)
    signer = PKCS1_v1_5.new(rsakey) 
    digest = SHA512.new(message)
    try:
        if signer.verify(digest, signature):
            return True
    except Exception:
        print("Issue with signature verification")
    return False

def new_username_check(username):
    if len(username) > 64:
        return False, "username is over 64 characters"
    if len(username) < 8:
        return False, "username is under 8 characters"
    return True, ""

def new_devicename_check(devicename):
    if len(devicename) > 32:
        return False, "devicename is over 32 characters"
    if len(devicename) < 4:
        return False, "devicename is under 4 characters"
    return True, ""

def new_passphrase1_check(passphrase):
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

def new_passphrase2_check(passphrase):
    if len(passphrase) > 128:
        return False, "passphrase is too long"
    if len(passphrase) < 8:
        return False, "passphrase is too short"
    return True, ""