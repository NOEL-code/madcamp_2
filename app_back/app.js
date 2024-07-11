var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
require("dotenv").config();

var app = express();
var indexRouter = require("./src/routes/index");

const corsMiddleware = require("./src/middlewares/cors");
const connectDB = require("./src/utils/mongodb");

//utils 에 있는 db. mongoose db 를 연결하는 메소드
connectDB();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
//cors?
app.use(corsMiddleware);

// 요청 본문 크기 제한을 50MB로 설정
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api", indexRouter);
app.use("/api/users", require("./src/routes/usersRouter"));
app.use("/api/rooms", require("./src/routes/roomRouter"));
app.use("/api/invited", require("./src/routes/invitedRoomRouter"));
app.use("/api/apply", require("./src/routes/applyRoomRouter"));

console.log("요청은옴?");
app.use("/api/verify", require("./src/routes/verifyRouter"));

//end point ? api 이면 indexrouter에서 잡아가는거야

app.use("/api/attendance", require("./src/routes/attendanceRouter"));

// catch 404 and forward to error handler
// 위에서 걸럿는데 안 걸러졌어 api 가기 전에 404가 잡아서 오류 뿌림. 순서가 중요합니다.
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  // 404는 아닌데 에러나는거임.
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
