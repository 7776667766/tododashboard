const imgFullPath = (imgPath) => {
  if (!imgPath || imgPath === null) return "";
  if (imgPath.startsWith("http")) return imgPath;
  return process.env.SERVER_URL + imgPath;
};
module.exports = imgFullPath;
