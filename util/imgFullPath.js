const imgFullPath = (imgPath) => {
  if (!imgPath || imgPath === null) return "";
  if (imgPath.startsWith("http")) return imgPath;
  // return "http://192.168.18.25:3002/" + imgPath;
  // return "http://192.168.18.27:3000/" + imgPath;
  return process.env.SERVER_URL + imgPath;
};
module.exports = imgFullPath;





