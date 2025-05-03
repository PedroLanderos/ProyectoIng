import CryptoJS from "crypto-js";

const SECRET_KEY = "aXv92Lk01Zm48Tyz";
const IV = "c9P6u1GvTqR4Bn7f";

export const encryptArticleId = (id, title) => {
  const combined = `${id}-${title}`;
  const encrypted = CryptoJS.AES.encrypt(
    combined,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return encrypted.toString();
};

export const decryptArticleId = (encrypted) => {
    const decrypted = CryptoJS.AES.decrypt(
      encrypted,
      CryptoJS.enc.Utf8.parse(SECRET_KEY),
      {
        iv: CryptoJS.enc.Utf8.parse(IV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
  
    const plainText = decrypted.toString(CryptoJS.enc.Utf8);
    return plainText; // formato esperado: "{id}-{title}"
  };
