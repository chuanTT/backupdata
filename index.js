const fs = require("fs");
const { writeFileData } = require("./function");
const data = fs.readFileSync("./tovhwoafhosting_huongdanphanmemmktvn.sql").toString();

const text = data.match(
  /INSERT INTO `wp0h_posts` [(].+[)] VALUES\s(\(.*\)\,*\s*)*/g
);

fs.writeFileSync("./chuan.txt", "");

if (text) {
  text.forEach((item) => {
    const newStr = item.replace(
      /INSERT INTO `text` [(].+[)] VALUES\s/g,
      ""
    );
    fs.appendFileSync("./chuan.txt", newStr);
  });
}

const newData = fs.readFileSync("./chuan.txt").toString();
fs.unlinkSync("./chuan.txt")
const resultRegex = newData.match(/\(.*\)/gi);
const arrKey = [
  "ID",
  "post_author",
  "post_date",
  "post_date_gmt",
  "post_content",
  "post_title",
  "post_excerpt",
  "post_status",
  "comment_status",
  "ping_status",
  "post_password",
  "post_name",
  "to_ping",
  "pinged",
  "post_modified",
  "post_modified_gmt",
  "post_content_filtered",
  "post_parent",
  "guid",
  "menu_order",
  "post_type",
  "post_mime_type",
  "comment_count",
];


const newResultArr = [];

if (resultRegex) {
  resultRegex.forEach((item) => {
    let newItem = item.trim();
    newItem = newItem.slice(1)
    newItem = newItem.slice(0, newItem.length - 1)
    const result = {};
    let strNew = newItem;

    arrKey.forEach((key) => {
      const indexS = strNew.indexOf(",");
      const indexStart = strNew.indexOf("'");
      if (indexStart === 0) {
        const newStrEnd = strNew.slice(1);
        const indexEnd = newStrEnd.indexOf("'");

        if (indexEnd !== -1) {
          const strValue = strNew.slice(1, indexEnd + 1);
          result[key] = strValue;
          strNew = strNew.slice(strValue?.length + 3).trim();
        }
      } else if (indexS !== -1) {
        result[key] = strNew.slice(0, indexS);
        strNew = strNew.slice(indexS + 1).trim();
      }
    });

    newResultArr.push(result);
  });
}

writeFileData(newResultArr)
