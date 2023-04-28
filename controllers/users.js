const { prisma } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if(!email && !password){
    return res.status(400).send("Email and password are required");
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    }
  });

  const isPasswordCorrect = user && (await bcrypt.compare(password, user.password))

  if(user && isPasswordCorrect){
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  } else {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }


}
const register = async (req, res, next) => {
  res.send("register");
}
const current = async (req, res, next) => {
  res.send("current");
}

module.exports = {
  login,
  register,
  current
}