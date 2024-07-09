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
  const regex = new RegExp('\\\\\\"', "g");
  let content = item?.post_content?.replace(regex, "'");
  content = content.replace(/<!-- \/*wp:paragraph -->/g, "");
  content = content.replace(/<!-- \/*wp:image -->/g, "");
  const regexLine = new RegExp("(\\\\n|\\\\r\\\\n|\\\\n\\\\n)", "g");
  content = content.replace(regexLine, "<br/>");
  content = content.replace(/(<br\/>)\1+/g, "<br/>")
  content = content.replace(/\t/g, '&#9;')
  return {
    title: item?.post_title?.trim(),
    slug: item?.post_name,
    basecontent: content,
  };
});

writeFilePosts(postList);
