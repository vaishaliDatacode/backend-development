const { signup, login } = require("../services/authServices");

const signupUser = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;


    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const user = await signup(name, email, password, role);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await login(email, password);
    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { signupUser, loginUser };
