require("dotenv").config();
const fs = require("fs");
const path = require("path");
const slugify = require("slugify").default;
const axios = require("axios").default;
const mime = require("mime-types");

const BASE_URL = process.env.BASE_URL;
const username = process.env.USERNAMEDB;
const password = process.env.PASSWORD;

const beautifyUrl = (url) => (url = url.replace(/[\/]{1,}$/, ""));

const joinUrl = (dir, BASE_URL = "/", link = "/") => {
  const maxlength = BASE_URL.length;
  const str = BASE_URL.substring(maxlength - 1, maxlength);
  if (str !== link) {
    BASE_URL += link;
  }

  if (dir) {
    dir = dir.replace(/^[\/]{1,}/, "");
    const url = `${BASE_URL}${dir}`;
    return beautifyUrl(url);
  } else {
    let url = BASE_URL;
    if (url && url?.length > 1) {
      url = beautifyUrl(url);
    }
    return url;
  }
};

const joinPathParent = (...arg) => {
  let str = "";
  if (arg && arg?.length > 0) {
    arg.forEach((item) => {
      str = joinUrl(item, str);
    });
  }
  return str;
};

const joinPathUrl = (...arg) => {
  return joinPathParent(...arg).slice(1);
};

const convertURLToFile = async (url) => {
  const blobFile = await axios.get(url, {
    responseType: "arraybuffer",
  });
  const now = Date.now();
  const type = mime.extension(blobFile?.headers?.getContentType());
  const blob = new Blob([blobFile.data], {
    type: blobFile?.headers?.getContentType(),
  });

  return {
    blob,
    fileName: `${now}.${type}`,
    header: blobFile.headers,
  };
};

const awaitAll = (list, asyncFn) => {
  const promises = [];

  list.map((x, i) => {
    promises.push(asyncFn(x, i));
  });

  return Promise.all(promises);
};

const slugUrl = (name) => {
  return slugify(name, {
    lower: true,
    locale: "vi",
    replacement: "-",
    strict: true,
    trim: true,
  });
};

const replaceUrl = (url) => {
  let newUrl = url.replace(/\\/g, "");
  newUrl = newUrl.replace(/"/g, "");
  return newUrl;
};

const queryDom = ({ dom, selector, callBack }) => {
  dom.window.document.querySelectorAll(selector).forEach(callBack);
};

const dir = path.join(__dirname, "data");
const checkPathCreateFolder = (path) => {
  let error = false;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
    error = true;
  }

  return error;
};
const getPath = (...arg) => {
  checkPathCreateFolder(dir);
  return path.join(dir, ...arg);
};

const pathProduct = getPath("product.json");
const pathCategory = getPath("category.json");
const pathGroup = getPath("group.json");
const pathData = getPath("data.json");
const pathToken = getPath("token.json");
const pathProductApi = getPath("productApi.json");
const pathCategoryApi = getPath("categoryApi.json");
const pathGroupApi = getPath("groupApi.json");
const pathPost = getPath("posts.json");
const pathPostApi = getPath("postsapi.json");

const readFileToPath = (path) => JSON.parse(fs.readFileSync(path));

const getDataProduct = () => readFileToPath(pathProduct);
const getDataCategory = () => readFileToPath(pathCategory);
const getDataGroup = () => readFileToPath(pathGroup);
const getData = () => readFileToPath(pathData);
const getTokenByHeader = () => readFileToPath(pathToken);
const getProductApi = () => readFileToPath(pathProductApi);
const getCategoryApi = () => readFileToPath(pathCategoryApi);
const getGroupApi = () => readFileToPath(pathGroupApi);
const getDataPosts = () => readFileToPath(pathPost);

const writeFileToPath = (path, data, isJson = true) =>
  fs.writeFileSync(path, isJson ? JSON.stringify(data) : data);

const writeFileProduct = (...arg) => writeFileToPath(pathProduct, ...arg);
const writeFileCategory = (...arg) => writeFileToPath(pathCategory, ...arg);
const writeFileGroup = (...arg) => writeFileToPath(pathGroup, ...arg);
const writeFileData = (...arg) => writeFileToPath(pathData, ...arg);
const writeFileToken = (...arg) => writeFileToPath(pathToken, ...arg);
const writeFileProductApi = (...arg) => writeFileToPath(pathProductApi, ...arg);
const writeFileCategoryApi = (...arg) =>
  writeFileToPath(pathCategoryApi, ...arg);
const writeFileGroupApi = (...arg) => writeFileToPath(pathGroupApi, ...arg);
const writeFilePostApi = (...arg) => writeFileToPath(pathPostApi, ...arg);
const writeFilePosts = (...arg) => writeFileToPath(pathPost, ...arg);

module.exports = {
  joinPathParent,
  joinPathUrl,
  convertURLToFile,
  awaitAll,
  replaceUrl,
  BASE_URL,
  username,
  password,
  getTokenByHeader,
  slugUrl,
  getDataProduct,
  getDataCategory,
  getDataGroup,
  getData,
  getCategoryApi,
  getProductApi,
  getGroupApi,
  getDataPosts,
  writeFileProduct,
  writeFileData,
  writeFileCategory,
  writeFileGroup,
  writeFileToken,
  writeFilePosts,
  writeFileProductApi,
  writeFileCategoryApi,
  writeFileGroupApi,
  writeFilePostApi,
  writeFileToPath,
  readFileToPath,
  queryDom,
  beautifyUrl,
};
