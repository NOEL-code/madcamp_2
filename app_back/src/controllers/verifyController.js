const { verify } = require("../services/verifyService");

exports.verify = async (req, res) => {
  console.log("updateImage called with file:", req.file);
  if (!req.file) {
    console.error("updateImage error: No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }
  const { userId } = req.params;
  const imageUrl = req.file.location; // S3에 저장된 이미지의 URL
  try {
    const result = await verify(userId, imageUrl);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.updateImage = async (req, res) => {
//     console.log('updateImage called with file:', req.file);
//     if (!req.file) {
//       console.error('updateImage error: No file uploaded');
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const { userId } = req.body;
//     const imageUrl = req.file.location; // S3에 저장된 이미지의 URL

//     try {
//       console.log("Updating image for user:", userId);
//       const resImageUrl = await updateProfileImage(userId, imageUrl);
//       if (!resImageUrl) {
//         console.error('updateImage error: User not found');
//         return res.status(404).json({ message: "User not found" });
//       }
//       console.log('updateImage successful, new imageUrl:', resImageUrl);
//       res.status(200).json({ imageUrl: resImageUrl });
//     } catch (err) {
//       console.error("Error updating profile image:", err);
//       res.status(500).json({ message: "Error updating profile image" });
//     }
//   };
