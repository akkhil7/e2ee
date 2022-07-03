const express = require("express");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
var cors = require("cors");

const app = express();
const port = 3001;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

const alice = crypto.createECDH("prime256v1");
alice.generateKeys(); // public key <> private key
let sharedSecret = null;

const encrypt = (text) => {
  const key = CryptoJS.enc.Hex.parse(sharedSecret);
  const iv = CryptoJS.enc.Hex.parse("000000000000000000000000000000000");
  return CryptoJS.AES.encrypt(text, key, {
    iv,
  }).toString();
};

const decrypt = (text) => {
  const key = CryptoJS.enc.Hex.parse(sharedSecret);
  const iv = CryptoJS.enc.Hex.parse("000000000000000000000000000000000");
  return JSON.stringify(
    CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(text, key, { iv }))
  );
};

app.post("/pair-public-key", (req, res) => {
  sharedSecret = alice.computeSecret(req.body.appPublicKey, "hex", "hex");
  console.log("PAIR-PUBLIC-KEY", { sharedSecret });
  res.json({
    m2p_public_key: alice.getPublicKey("hex"),
  });
});

app.get("/encrypted-data", (req, res) => {
  const someData = "Hello World! This is encrypted data from backend.";
  console.log("PAIR-PUBLIC-KEY", { sharedSecret });
  res.json({
    encrypted_data: encrypt(someData),
  });
});

app.post("/decrypt-data", (req, res) => {
  const decryptedData = decrypt(req.body.encryptedData);
  console.log("PAIR-PUBLIC-KEY", { sharedSecret });
  res.json({
    decrypted_data: decryptedData,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
