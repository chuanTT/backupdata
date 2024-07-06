const {
  getProductApi,
  getDataProduct,
  getCategoryApi,
  getDataCategory,
  getGroupApi,
  getDataGroup,
  getDataPosts,
  slugUrl,
  writeFilePosts,
} = require("../function");

// bài viết
const dataPost = getDataPosts();

// sản phẩm
const dataProductApi = getProductApi();
const dataProduct = getDataProduct();

// danh mục
const dataCategoryApi = getCategoryApi();
const dataCategory = getDataCategory();

//  nhóm
const dataGroupApi = getGroupApi();
const dataGroup = getDataGroup();

const newDataPost = dataPost.reduce((total, current) => {
  const slug = `docs/${current?.slug}`;
  const category = dataCategory?.find((current) =>
    current?.slugPost.includes(slug)
  );
  if (category && category?.name) {
    // tìm danh mục
    const currentCategoryApi = dataCategoryApi?.find(
      (item) => item?.slug === slugUrl(category?.name)
    );
    if (currentCategoryApi) {
      const obj = {
        productId: "",
        categoryId: currentCategoryApi?.id ?? "",
        groupId: "",
      };

      // tìm sản phẩm
      const indexPost = category?.slugPost?.findIndex((item) => item === slug);
      const slugProduct = category?.slugProduct?.[indexPost];
      const currentProduct = dataProduct?.find(
        (item) => item?.slug === slugProduct
      );

      if (currentProduct) {
        const currentProductApi = dataProductApi?.find(
          (item) => item?.slug === slugUrl(currentProduct?.name)
        );
        obj.productId = currentProductApi?.id;
      }

      //   tìm nhóm
      const currentGroup = dataGroup?.find((item) =>
        item?.cate?.includes(category?.name)
      );
      if (currentGroup) {
        const currentGroupApi = dataGroupApi?.find(
          (item) => item?.name === currentGroup?.name
        );
        obj.groupId = currentGroupApi?.id;
      }

      if (obj?.categoryId && obj?.productId && obj?.groupId) {
        return [...total, { ...obj, ...current }];
      }
    }
  }
  return total;
}, []);
writeFilePosts(newDataPost);
