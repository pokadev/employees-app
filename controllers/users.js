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
  const { name, email, password } = req.body;

  if(!name && !email && !password){
    return res.status(400).send("Name, email and password are required");
  }
  const registeredUser = await prisma.user.findFirst({
    where: {
      email,
    }
  })
  if(registeredUser){
    return res.status(400).send("User already registered");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const secret = process.env.JWT_SECRET;

  if(user && secret){
    res.status(201).json({
      id: user.id,
      email: user.email,
      name,
      token: jwt.sign({ id: user.id }, secret, {
        expiresIn: "30d",
      })
    })
}else{
  res.status(400).json({
    message: "Something went wrong! Please try again later",
  })
}
}

const current = async (req, res, next) => {
  res.send("current");
}

module.exports = {
  login,
  register,
  current
}