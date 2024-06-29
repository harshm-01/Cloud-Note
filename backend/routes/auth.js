const express = require("express");
const User = require("../models/User");
const router = express.Router();
// const connectToMongo = require("../db");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "";
const fetchuser = require("../middleware/fetchuser");

//CREATE A USER USING : POST "/api/auth/createNewUser". DOESNOT REQUIRE AUTH

const success = true;
const failure = false;

router.post(
  "/createNewUser",
  [
    body("name", "Enter the valid name").isLength({ min: 3 }),
    body("password", "Password should be minimum 5 characters").isLength({
      min: 6,
    }),
    body("email", "Enter the valid email").isEmail(),
  ],
  async (req, res) => {
    //   try {
    //     let isConnected = await connectToMongo();
    //     console.log(isConnected);
    //     console.log(req.body);
    //     const user = User(req.body);
    //     await user.save();
    //     res.send(req.body);
    //   } catch (error) {
    //     console.log(error);
    //     res.send(error);
    //   }

    //   obj = {
    //     a: "Harsh",
    //     b: 22,
    //   };
    //   res.json(obj);

    //
    //   console.log(req.body);
    // //   // res.send("Hello");
    //   const user = User(req.body);
    //   user.save();
    //   res.send(req.body);

    //

    //

    //Handling Errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
      // console.log("Bad Request");
      return res.status(400).json({failure, error: error.array() });
    }

    try {
      // Create new user/ Check existing user
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ failure, error: "Sorry a user with this email already exist" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        // password: req.body.password,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      res.send({success, authToken });
      // console.log(jwtData);
      // res.send(req.body);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Occured");
    }

    // User.create({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password,
    // })
    //   .then((user) => res.json(user))
    //   .catch((err) => {
    //     console.log(err);
    //     res.json({ error: "Please enter a unique value of email" , message: err.message});
    //   });
    // res.send({ errors: result.array() });
    // res.send(req.body);
  }
);

router.post(
  "/login",
  [
    body("email", "Enter the valid email").isEmail(),
    body("password", "Password should not be blank").exists(),
  ],
  async (req, res) => {
    //Handling Errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
      // console.log("Bad Request");
      return res.status(400).json({ failure, error: error.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ failure, error: "Please enter the valid credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ failure, error: "Please enter the valid credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      res.send({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Occured");
    }
  }
);

// GET USER DETAILS
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
