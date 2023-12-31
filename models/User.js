const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      //regex validation
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 6,
    // maxLength: 12,
  },
});

// userSchema.pre('save', async function(next){
//   const salt=await bcrypt.getSalt(10);
//   this.password= await bcrypt.hash(this.password, salt);
//   next()
// })

// userSchema.methods.createJWT = function () {
//   return jwt.sign({ userId: this._id, name: this.name }, "jwtSecret", {
//     expiresIn: "30d",
//   });
// };

module.exports = mongoose.model("User", userSchema);
