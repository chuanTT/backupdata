const axios = require("axios").default;
const {
  BASE_URL,
  awaitAll,
  convertURLToFile,
  slugUrl,
  joinPathUrl,
  getDataProduct,
  getTokenByHeader,
  writeFileProductApi,
  getDataCategory,
  writeFileCategoryApi,
} = require("../function");
const headerToken = getTokenByHeader();

(async () => {
  const listCategory = getDataCategory();
  const URLCategory = joinPathUrl(BASE_URL, "/api/category/create");

  const newDataCategory = await awaitAll(listCategory, async (category) => {
    const urlToFile = await convertURLToFile(category?.icon);
    const obj = {
      name: category?.name,
      slug: slugUrl(category?.name),
    };
    const formDT = new FormData();
    Object.keys(obj).forEach((key) => {
      formDT.append(key, obj[key]);
    });
    formDT.append("file", urlToFile?.blob, {
      filename: urlToFile?.fileName,
      contentType: urlToFile.header["Content-Type"],
    });
    const data = await axios.post(URLCategory, formDT, {
      headers: {
        ...headerToken,
        "Content-Type":
          "multipart/form-data; boundary=<calculated when request is sent>",
      },
    });
    return data.data;
  });
  writeFileCategoryApi(newDataCategory)
})();
