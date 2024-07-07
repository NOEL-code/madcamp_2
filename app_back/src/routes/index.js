var express = require("express");
var router = express.Router();

//endpoint가 다시 / 로컨 3000번에 / 만 있으면 index router에서 뺏어가고 get 요청이잖아 get이고 3000번이면 얘갛ㄴ테 할당이 되는거임
// 
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "정우성" });
});

module.exports = router;
