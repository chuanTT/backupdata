const { default: axios } = require("axios");
const {
  BASE_URL,
  joinPathUrl,
  username,
  password,
  writeFileToken,
} = require("../function");

(async () => {
  const urlLogin = joinPathUrl(BASE_URL, "/api/auth/login");
  const resultLogin = await axios.post(urlLogin, {
    username,
    password,
  });
  const token = resultLogin?.data?.token;
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  writeFileToken(headers);
})();
