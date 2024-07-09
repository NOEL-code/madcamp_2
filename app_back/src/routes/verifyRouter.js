const express = require("express");
const router = express.Router();
const upload = require("../utils/s3");
const { verify } = require("../controllers/verifyController");

router.post("/:userId", upload.single("file"), verify);

module.exports = router;
