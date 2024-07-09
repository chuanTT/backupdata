const { default: axios } = require("axios");
const {
  getDataPosts,
  BASE_URL,
  joinPathUrl,
  getTokenByHeader,
  awaitAll,
  writeFilePostApi,
} = require("../function");

const dataPost = getDataPosts();
const headerToken = getTokenByHeader();
const URLPost = joinPathUrl(BASE_URL, "/api/post/create");
(async () => {
  const newDataPost = await awaitAll(dataPost, async (item) => {
    const data = await axios.post(URLPost, item, {
      headers: headerToken,
    });
    return data.data;
  });
  writeFilePostApi(newDataPost);
})();
