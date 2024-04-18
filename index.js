const express = require("express");
const env = require("dotenv");
var cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("./models/userSchema.js");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes");

env.config();

const app = express();

connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use("/api/users", userRoutes);

app.post("/v1/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json(user);
  } catch (err) {
    res.status(422).json(e);
  }
});

app.post("/v1/api/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json("Invalid Email or Password");
  }
  const passwordComp = await bcrypt.compare(password, user.password);
  if (!passwordComp) {
    return res.status(401).json("Invalid Email or password");
  }
  jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: process.env.JWT_EXPIRES,
    },
    (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json(user);
    }
  );
});

app.get("/v1/api/profile", (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWTPRIVATEKEY, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
