const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        unique: true,
        required: true,
      },
    },
  );

  userSchema.statics.signUp = async function (
    userEmail,
    userPassword,
    nickName,
    phoneNumber,
    birthDay,
    department
  ) {
    const salt = await bcrypt.genSalt();
    console.log(salt);
    try {
      const hashedPassword = await bcrypt.hash(userPassword, salt);
      const user = await this.create({
        userEmail: userEmail,
        userPassword: hashedPassword,
        nickName: nickName,
        phoneNumber,
        birthDay,
        department,
      });
      return {
        _id: user._id,
        userEmail: user.userEmail,
        nickName: user.nickName,
        phoneNumber: user.phoneNumber,
        birthDay: user.birthDay,
        department: user.department,
      };
    } catch (err) {
      throw err;
    }
  };
  
  userSchema.statics.login = async function (userEmail, userPassword) {
    const user = await this.findOne({ userEmail });
  
    if (user) {
      const auth = await bcrypt.compare(userPassword, user.userPassword);
      if (auth) {
        return user.visibleUser;
      }
      throw Error("incorrect password");
    }
    throw Error("incorrect email");
  };