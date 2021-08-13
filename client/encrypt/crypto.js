import CryptoJS from "crypto-js";
import { getLocalStorage } from "../config/utils/localStorage.js";
// generate salt to act as pass or
const genSalt = () => {
  var salt = CryptoJS.lib.WordArray.random(128 / 8);
  return CryptoJS.PBKDF2(p, salt, { keySize: 512 / 32, iterations: 1000 });
};
// encrypt jwt
export const encrypt = async (jwt) => {
  // generate salt to act as pass or
  var salt = genSalt();

  var ciphertext = await CryptoJS.AES.encrypt(jwt, salt).toString();
  return ciphertext;
};
// Decrypt jwt
export const decrypt = async () => {
  jwtStored = getLocalStorage();
  parseJwt = json.parse(jwtStored);
  var salt = genSalt();
  var decryptJwt = CryptoJS.AES.decrypt(parseJwt, salt);
  var originalText = decryptJwt.toString(CryptoJS.enc.Utf8);
  return originalText;
};
