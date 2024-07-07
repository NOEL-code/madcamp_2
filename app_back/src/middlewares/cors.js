const cors = require("cors");

const corsOptions = {
  origin: "*", // 모든 도메인 허용
  methods: "*", // 허용할 HTTP 메서드
  allowedHeaders: "*", // 허용할 헤더
  credentials: true, // 인증 정보 허용
};

module.exports = cors(corsOptions);
