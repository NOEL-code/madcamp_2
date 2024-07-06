// var express = require('express');
// var router = express.Router();
var mongoose = require('mongoose');

router.post("/signup", async (req, res, next) => {
  try {
    const {
      userEmail,
      userPassword,
      nickName,
      phoneNumber,
      birthDay,
      department,
    } = req.body;
    console.log(req.body);

    const user = await User.signUp(
      userEmail,
      userPassword,
      nickName,
      phoneNumber,
      birthDay,
      department
    );
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports =  {User}; // 다른 곳에서 사용할 수 있도록 export 해준다
