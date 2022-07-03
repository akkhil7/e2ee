export const hexToArray = (str) => {
  if (!str) {
    return new Uint8Array();
  }
  const arr = [];
  for (let i = 0, len = str.length; i < len; i += 2) {
    arr.push(parseInt(str.substr(i, 2), 16));
  }
  return new Uint8Array(arr);
};

export const bufferToHex = (buf) => {
  return Array.from(new Uint8Array(buf))
    .map((x) => `00${x.toString(16)}`.slice(-2))
    .join("");
};

export const generateKeys = async () => {
  const alice = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"]
  );
  return alice;
};

export const getExportedRawKey = async (rawKey) => {
  const value = await window.crypto.subtle.exportKey("raw", rawKey);
  return value;
};

export const getHexKey = async (rawKey) => {
  const exportedKey = await getExportedRawKey(rawKey);
  const hexedKey = bufferToHex(exportedKey);
  return hexedKey;
};

export const getImportedKey = (publicKey) => {
  return window.crypto.subtle.importKey(
    "raw",
    publicKey,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
};

export const exportKey = async (type, key) => {
  return window.crypto.subtle.exportKey(type, key);
};

export const generateRandomID = () => {
  return `${Math.floor(Date.now() / 1000)}`;
};

export const generateSharedSecret = async (publicKey, privateKey) => {
  const publicKeyBuffer = hexToArray(publicKey);
  const importedKey = await getImportedKey(publicKeyBuffer);
  return window.crypto.subtle.deriveBits(
    { name: "ECDH", namedCurve: "P-256", public: importedKey },
    privateKey,
    256
  );
};

export const encryptData = async (text, sharedKey) => {
  text = typeof text === "string" ? text : JSON.stringify(text);
  const key = CryptoJS.enc.Hex.parse(sharedKey);
  const iv = CryptoJS.enc.Hex.parse("000000000000000000000000000000000");
  const response = CryptoJS.AES.encrypt(text, key, { iv }).toString();
  return response;
};

export const decryptData = async (text, sharedKey) => {
  const key = CryptoJS.enc.Hex.parse(sharedKey);
  const iv = CryptoJS.enc.Hex.parse("000000000000000000000000000000000");
  return JSON.stringify(
    CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(text, key, { iv }))
  );
};

export const extractFromDynamicUrl = (dynamicUrl) => {
  const splittedUrl = dynamicUrl.split("|"); // assuming we get | and not %7C
  const token = splittedUrl[splittedUrl.length - 1];
  const url = splittedUrl.slice(0, splittedUrl.length - 1).join("");
  return {
    dynamic_url: url,
    dynamic_token: token,
  };
};
