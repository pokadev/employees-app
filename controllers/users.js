const login = async (req, res, next) => {
  res.send("login");
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