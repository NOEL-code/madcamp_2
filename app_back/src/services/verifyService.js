const axios = require("axios");
const { getUsersImages, findUserNameById } = require("./userService");
const { getRoomInfo } = require("./roomService");

const url = "http://192.249.29.7:5005/verify";

exports.verify = async (imageUrl, roomId) => {
  const img1_path = imageUrl;

  // Room 정보를 가져옵니다.
  const roomInfo = await getRoomInfo(roomId);

  // members 배열에서 userId가 있는 멤버들의 ID를 추출합니다.
  const usersIds = roomInfo.members
    .filter((member) => member.userId !== null)
    .map((member) => member.userId._id);

  // usersIds를 이용하여 사용자 이미지 정보를 가져옵니다.
  const userImages = await getUsersImages(usersIds);

  for (let i = 0; i < userImages.length; i++) {
    const img2_path = userImages[i].photoUrl;
    const userId = userImages[i].id;

    const req = {
      img1_path: img1_path,
      img2_path: img2_path,
      enforce_detection: false,
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
