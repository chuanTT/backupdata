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
  const regex = new RegExp('\\\\\\"', 'g')
  const content = item?.post_content?.replace(regex, "'")
  return {
    title: item?.post_title?.trim(),
    slug: item?.post_name,
    basecontent: content,
  };
});

writeFilePosts(postList);
