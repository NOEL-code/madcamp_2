const { verify } = require("../services/verifyService");

exports.verify = async (req, res) => {
  if (!req.file) {
    console.error("verify error: No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }
  const { userId } = req.params;
  const imageUrl = req.file.location; // S3에 저장된 이미지의 URL
  try {
    const result = await verify(userId, imageUrl);

    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
