import {
  getHexKey,
  generateSharedSecret,
  decryptData,
  encryptData,
  generateRandomID,
  generateKeys,
  bufferToHex,
} from "./utils.js";

async function createKeyPairAndGenerateSecret(keyPair) {
  let sharedSecret = "";
  const hexedAppPublicKey = await getHexKey(keyPair.publicKey);
  console.log("Start of E2EE");
  console.log("Hexed Public Key");
  console.log(hexedAppPublicKey);
  const res = await axios
    .post("http://localhost:3001/pair-public-key", {
      appPublicKey: hexedAppPublicKey,
    })
    .then(async (res) => {
      const { m2p_public_key } = res.data;
      // const m2p_public_key = window.prompt("Enter m2p public key");
      // console.log('LOCALHOST', { m2p_public_key });
      // console.log("M2P Public Key");
      console.log(m2p_public_key);
      sharedSecret = await generateSharedSecret(
        m2p_public_key,
        keyPair.privateKey // client side private key
      );

      console.log("SHARED KEY:");
      console.log(bufferToHex(sharedSecret));
      return axios.get("http://localhost:3001/encrypted-data");
    })
    .then(async (res) => {
      const { encrypted_data } = res.data;
      const decryptedData = await decryptData(
        encrypted_data,
        bufferToHex(sharedSecret)
      );
      console.log("DECRYPTED DATA", { decryptedData });
      const samplePayload = {
        deviceId: "123456",
        request: {
          requestId: generateRandomID(),
          entityId: "naren09",
          fromDate: "2022-05-01",
          toDate: "2022-06-29",
          pageNumber: 0,
          pageSize: 10,
        },
        endPoint: "fetchTxn",
      };
      const clientEncryptedData = await encryptData(
        samplePayload,
        bufferToHex(sharedSecret)
      );
      console.log({ clientEncryptedData });
      return axios.post("http://localhost:3001/decrypt-data", {
        encryptedData: clientEncryptedData,
      });
    })
    .then((res) => {
      const { decrypted_data } = res.data;
      console.log("LOCALHOST", { decrypted_data });
    })
    .catch((err) => {
      console.log(err);
    });
  return res;
}

generateKeys().then(createKeyPairAndGenerateSecret);
