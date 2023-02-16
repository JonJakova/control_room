// Singleton to generate a secret for JWT with SubtleCrypto API

let key: CryptoKey;

export const get_key = async () => {
  if (!key) {
    key = await generateKey();
  }
  return key;
};

// Generate key using Web Crypto API
const generateKey = async () => {
  const key = await crypto.subtle.generateKey(
    {
      name: "HMAC",
      hash: "SHA-512",
    },
    true,
    ["sign", "verify"]
  );
  return key;
};
