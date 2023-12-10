const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  // if (!name||!email||!password){
  //    throw new BadRequestError("Please provide email and password")
  // }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const tempUser = { name, email, password: hashedPassword };
  const user = await User.create({ ...tempUser });
  const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME, //30d
  });
  res.status(StatusCodes.CREATED).json({user:{name:user.name, userId:user._id }, token });
};



const login = async (req, res) => {
  const {email, password}= req.body;
  if(!email ||!password){
    throw new BadRequestError('Please provide email and password');
  }
  const user= await User.findOne({email});
  if(!user){
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  // const token= user.createJWT();
  const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME, //30d
  });
    res.status(StatusCodes.OK).json({user:{name:user.name, email:user.email, userId:user._id}, token})
};

module.exports = {
  register,
  login,
};
