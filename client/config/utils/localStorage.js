export const setLocalStorage = (jwt) => {
  return localStorage.setItem("tke", jwt);
};
export const getLocalStorage = (jwt) => {
  return localStorage.getItem("tke");
};
