const axios = require("axios");
const { getUserImages, findUserNameById } = require("./userService");

const url = "http://192.249.29.4:5005/verify";

exports.verify = async (imageUrl) => {
  const img1_path = imageUrl;

  const userImages = await getUserImages();

  for (let i = 0; i < userImages.length; i++) {
    const img2_path = userImages[i].photoUrl;
    const userId = userImages[i].id;

    const req = {
      img1_path: img1_path,
      img2_path: img2_path,
    };

    const result = await axios.post(url, req);
    console.log(result.data, "service");

    if (result.data.verified === true) {
      const userName = await findUserNameById(userId);
      return { userId, userName };
    }
  }
  return false;
};
