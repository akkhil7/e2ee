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
