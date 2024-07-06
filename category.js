const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const {
  getData,
  writeFileProduct,
  writeFileCategory,
  getDataProduct,
  getDataCategory,
  writeFileGroup,
  queryDom,
  replaceUrl,
  joinPathUrl,
} = require("./function");

const newData = getData();
const nnss = newData.reduce(
  (total, current) => {
    const isEqual = current?.post_title === "Hướng dẫn phần mềm MKT";
    if (current?.post_title?.startsWith("Hướng dẫn Phần Mềm MKT") || isEqual) {
      if (isEqual) {
        total.product.push(current);
      } else {
        total.category.push(current);
      }
    }
    return total;
  },
  {
    category: [],
    product: [],
  }
);

writeFileProduct(nnss.product);
writeFileCategory(nnss.category);

// xử lý sản phẩm
const newDataProduct = getDataProduct();
const currentProduct = newDataProduct[newDataProduct?.length - 1]?.post_content;
let htmlData = currentProduct?.replace(/&quot;/g, '"').replace(/&amp;/g, "&");
htmlData = htmlData.slice(htmlData.indexOf("<h2>Phần"));
const string = 'linkedin-248x300-1.png\\" alt=\\"\\" />';
htmlData = htmlData.slice(
  0,
  htmlData.search(/linkedin-248x300-1.png\\"\s[\D]*>/) + string.length
);

const dom = new JSDOM(htmlData, {
  contentType: "text/html",
});

const listNameProduct = [];
const listDescProduct = [];
const listSrcProduct = [];
const listHrefProduct = [];

queryDom({
  dom,
  selector: "h2",
  callBack(text) {
    listNameProduct.push(text.textContent?.trim());
  },
});

queryDom({
  dom,
  selector: "p",
  callBack(text) {
    listDescProduct.push(text.textContent?.trim());
  },
});

queryDom({
  dom,
  selector: "img",
  callBack(text) {
    const url = replaceUrl(text.src);
    const parentElem = text.parentElement;
    if (parentElem) {
      const href = joinPathUrl(replaceUrl(parentElem.getAttribute("href")));
      const newUrl = new URL(href);
      listHrefProduct.push(joinPathUrl(newUrl.pathname));
    }
    listSrcProduct.push(url);
  },
});

const newProductJson = listNameProduct.map((name, index) => {
  return {
    name,
    src: listSrcProduct[index],
    desc: listDescProduct[index],
    slug: listHrefProduct[index],
  };
});

writeFileProduct(newProductJson);

// xử lý danh mục
const newDataCategory = getDataCategory();
const listGroup = [];
const listCategory = [];

newDataCategory.forEach((objCate) => {
  const listNameCate = [];
  const listIconCate = [];
  const listHrefPost = [];
  const domCT = new JSDOM(objCate?.post_content, {
    contentType: "text/html",
  });

  queryDom({
    dom: domCT,
    selector: "h2",
    callBack(item) {
      const textCn = item.textContent?.trim();
      const objGroup = {
        name: textCn,
        cate: [],
      };
      let nextSibling = item?.nextElementSibling;
      while (nextSibling) {
        if (nextSibling.tagName === "P") {
          const aTags = nextSibling.querySelectorAll("a");
          aTags.forEach((aTag) => {
            const text = aTag.textContent?.trim();
            if (!objGroup?.cate?.includes(text)) {
              objGroup.cate.push(text);
            }
          });
        }
        nextSibling = nextSibling.nextElementSibling;
      }
      const exisGroup = listGroup.find((item) => item?.name === textCn);
      if (!exisGroup) {
        listGroup.push(objGroup);
      }
    },
  });

  queryDom({
    dom: domCT,
    selector: "p > a",
    callBack(elem) {
      const textCn = elem.textContent?.trim();
      listNameCate.push(textCn);
      const href = joinPathUrl(replaceUrl(elem.getAttribute("href")));
      const newUrl = new URL(href);
      listHrefPost.push(joinPathUrl(newUrl.pathname));
    },
  });

  queryDom({
    dom: domCT,
    selector: "figure > a >img",
    callBack(elem) {
      const url = replaceUrl(elem.src);
      listIconCate.push(url);
    },
  });

  const arrObjCate = listNameCate?.map((name, index) => {
    return {
      name,
      icon: listIconCate[index],
      slugProduct: objCate?.post_name,
      slugPost: listHrefPost[index],
    };
  });

  if (arrObjCate?.length > 0) {
    listCategory.push(...arrObjCate);
  }
});

const unquireCategory = listCategory.reduce((total, current) => {
  const exis = total.findIndex((item) => item?.name === current?.name);
  if (exis === -1) {
    total.push({
      ...current,
      slugProduct: [current?.slugProduct],
      slugPost: [current?.slugPost],
    });
  } else {
    const slugProduct = total[exis].slugProduct ?? [];
    const slugPost = total[exis].slugPost ?? [];
    if (!slugProduct?.includes(current?.slugProduct)) {
      total[exis].slugProduct = [
        ...(total[exis].slugProduct ?? []),
        current?.slugProduct,
      ];
    }

    if (!slugPost?.includes(current?.slugPost)) {
      total[exis].slugPost = [
        ...(total[exis].slugPost ?? []),
        current?.slugPost,
      ];
    }
  }
  return total;
}, []);

writeFileCategory(unquireCategory);
writeFileGroup(listGroup);
