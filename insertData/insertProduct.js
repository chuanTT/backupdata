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
} = require("../function");
const headerToken = getTokenByHeader();

(async () => {
  const listProduct = getDataProduct();
  const URLProduct = joinPathUrl(BASE_URL, "/api/product/create");
  const newDataProduct = await awaitAll(listProduct, async (product) => {
    const urlToFile = await convertURLToFile(product?.src);
    const obj = {
      name: product?.name,
      description: product?.desc,
      slug: slugUrl(product?.name),
    };
    const formDT = new FormData();
    Object.keys(obj).forEach((key) => {
      formDT.append(key, obj[key]);
    });
    formDT.append("file", urlToFile?.blob, {
      filename: urlToFile?.fileName,
      contentType: urlToFile.header["Content-Type"],
    });
    const data = await axios.post(URLProduct, formDT, {
      headers: {
        ...headerToken,
        "Content-Type":
          "multipart/form-data; boundary=<calculated when request is sent>",
      },
    });

    return data.data;
  });
  writeFileProductApi(newDataProduct)
})();
