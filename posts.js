const { getData, writeFilePosts } = require("./function");
const newData = getData();
const newPost = newData.reduce((total, current) => {
  if (
    current?.guid?.startsWith("https://huongdan.phanmemmkt.vn/?post_type=docs")
  ) {
    total.push(current);
  }
  return total;
}, []);

const postList = newPost.map((item) => {
  return {
    title: item?.post_title?.trim(),
    slug: item?.post_name,
    basecontent: item?.post_content,
  };
});

writeFilePosts(postList);
