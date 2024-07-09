const axios = require("axios");
const { getUserImageById } = require("./userService");

const url = "http://localhost:5005/verify";

exports.verify = async (userId, imageUrl) => {
  const image2_path = getUserImageById(userId);
  console.log(photoUrl);
  const image1_path = imageUrl;
  console.log(imageUrl);

  const req = {
    image1_path: image1_path,
    image2_path: image2_path,
  };

  try {
    const result = axios.post(url, req);

    return result.data.verified;
  } catch (err) {
    console.error(err, "docker error");
  }
};
