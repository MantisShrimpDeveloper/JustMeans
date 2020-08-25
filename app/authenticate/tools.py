import hashlib

salt = [b'saltoftheearth', b'highbloodpressure']
rounds = [78787, 84567]

def hashAlg(term, cons):
    hashterm = hashlib.sha3_512(term.encode() + salt[cons])
    
    for i in range(rounds[cons] - 1):
        hashterm.update(hashterm.digest())

    return hashterm.digest()