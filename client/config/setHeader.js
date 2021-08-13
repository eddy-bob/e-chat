import { decrypt } from "../encrypt/crypto.js";
const authHeader = () => {
  const jwt = decrypt();
  if (jwt) {
    return { headers: { Authorization: "bearer" + jwt } };
  } else return;
};
export default authHeader;
