import http from "../../http.js";
class user {
  constructor(http) {
    this.authUser = http;
  }
  async register() {}
}

export default new user(http);
