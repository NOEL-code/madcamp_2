const axios = require("axios");
const { getUserImageById } = require("./userService");

const url = "http://192.249.29.4:5005/verify";

exports.verify = async (userId, imageUrl) => {
  const image2_path = await getUserImageById(userId);
  const image1_path = imageUrl;

  const req = {
    img1_path: image1_path,
    img2_path: image2_path,
  };

  console.log(req);

  try {
    const result = await axios.post(url, req);
    console.log(result.data, "service");
    return result.data.verified;
  } catch (err) {
    console.error(err, "docker error");
    throw err;
  }
};
