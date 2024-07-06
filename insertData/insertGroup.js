const { default: axios } = require("axios");
const {
  getDataGroup,
  getTokenByHeader,
  awaitAll,
  joinPathUrl,
  BASE_URL,
  writeFileGroupApi,
} = require("../function");

(async () => {
  const headerToken = getTokenByHeader();
  const dataGroup = getDataGroup();
  const URLGroup = joinPathUrl(BASE_URL, "/api/group/create");
  const newDataGroup = await awaitAll(dataGroup, async (item) => {
    const data = await axios.post(
      URLGroup,
      { name: item?.name },
      {
        headers: headerToken,
      }
    );
    return data.data
  });
  writeFileGroupApi(newDataGroup)
})();
