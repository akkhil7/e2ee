## E2EE Server

- This is a simple nodejs server
- It has a couple of api endpoints
  - `pair-public-key` - This is to pair the public key from client to generate a secret on server side
    - returns `serverPublicKey`
  - `encrypted-data` - This is to send some encrypted data to client
    - returns `serverEncryptedData`
  - `decrypt-data` - This is to decrypt the data from client
    - returns `clientDecryptedData`

```
  a. server will generate public key and private key (like m2p)
  b. client will generate shared secret based on public key in step a
  c. server will generate shared secret based on client public key
  d. client will use shared secret in step b to encrypt req
  e. server will take encrypt req and decrypt using shared secret in step c
  f. server will send encrypt response using shared secret in step c
  d. client will take encrypt response and decrypt using shared secret b
```

## Installation of Server

- `npm install` and it should install the required packages
- `npm start` to start your server at PORT 3001

## Installation of Client

- If you have node installed, you can do `npx serve` and it should serve your files at `localhost:3000`
- Open the address in your browser and open chrome dev tools console for the logs printed

## Findings

1. Client<>Server communication working properly (full-duplex communication)
2. Same secret key is generated on both ends
3. Since same secret is generated on client side with web crypto api, we can confirm web crypto api is working fine in Razorpay implementation also.
4. Client uses web crypto api (because `crypto` module is only for node)
5. Server (in nodejs) uses `crypto-js` and `crypto` both.
6. We can confirm encryption from frontend is also working fine because the nodejs example is able to successfully decrypt it.
7. Only grey area is the decryption part

- Maybe decryption is failing
- or maybe decryption worked, but the decrypted data was invalid.

What can we do?

1. Use app public key and pair via postman
2. Generate token

- Get m2p public key
- Let browser app accept m2p public key to generate the secret key
- Use secret key to encrypt the request

3. Use encrypted data to send fetch txn

- Use encrypted data in request body
- Use token in request header
- Use new url key in request params
