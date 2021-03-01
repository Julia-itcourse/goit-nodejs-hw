const fs = require("fs")
const Joi = require("joi")
const dotenv = require("dotenv")
const {
  Types: { ObjectId },
} = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("./User")
const jwt = require("jsonwebtoken")

const Avatar = require("avatar-builder")
const imagemin = require("imagemin")
const imageminPngquant = require("imagemin-pngquant")

//TODO:
//1. Registation (sign up)
//2. Login
//3. Logout
//4. users current
//5. token check

dotenv.config()

//1. register user
async function registerUser(req, res) {
  try {
    const { body } = req
    const hashedPassword = await bcrypt.hash(body.password, 14)

    const isEmailInUse = await User.findOne({
      email: body.email,
    })
    if (isEmailInUse) {
      return res.status(409).send("Email in use")
    }

    const avatarName = Date.now()
    Avatar.builder(
      Avatar.Image.roundedRectMask(
        Avatar.Image.compose(
          Avatar.Image.randomFillStyle(),
          Avatar.Image.shadow(Avatar.Image.margin(Avatar.Image.cat(), 8), {
            blur: 5,
            offsetX: 2.5,
            offsetY: -2.5,
            color: "rgba(0,0,0,0.7)",
          })
        ),
        28
      ),
      128,
      128
    )
      .create(body.email)
      .then((buffer) => fs.writeFileSync(`tmp/${avatarName}.png`, buffer))

    await imagemin([`tmp/${avatarName}.png`], {
      destination: "public/images",
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    })

    const user = await User.create({
      ...body,
      avatarURL: `http://localhost:3000/images/${avatarName}.png`,
      password: hashedPassword,
    })

    const { email, subscription, avatarURL } = user;

    res
      .status(201)
      .send("User created")
      .json({ user: { email: email, subscription: subscription, avatarURL: avatarURL, } })
  } catch (error) {
    res.status(400).send(error)
  }
}

//Validation middleware
function validateUser(req, res, next) {
  const validationRules = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    subscription: Joi.string().default("free").required(),
  })

  const validationResult = validationRules.validate(req.body)

  if (validationResult.error) {
    return res.status(400).send(validationResult.error.message)
  }

  next()
}

//2. Login

async function login(req, res) {
  const {
    body: { email, password },
  } = req

  const user = await User.findOne({
    email,
  })

  if (!user) {
    return res.status(401).send("Email or password is wrong")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).send("Password is wrong")
  }

  const token = jwt.sign(
    { userId: user._id },

    process.env.JWT_SECRET
  )

  await User.findByIdAndUpdate(user._id, { token: token })
  return res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  })
}

//check token - authorization
async function authorizeUser(req, res, next) {
  const authorizationHeader = req.get("Authorization")
  console.log(authorizationHeader)
  if (!authorizationHeader) {
    return res.status(401).send({
      message: "Not authorized",
    })
  }
  const token = authorizationHeader.replace("Bearer ", "")

  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET)
    const { userId } = payload
    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).send({
        message: "Not authorized",
      })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(401).send(error)
  }
}

//Logout
async function logout(req, res) {
  try {
    const { _id } = req.user
    await User.findById(_id)
    await User.findByIdAndUpdate(_id, { token: "" })
    res.status(204).send("No content")
  } catch (error) {
    res.status(401).send({
      message: "Not authorized",
    })
  }
}

//get current user
async function getCurrentUser(req, res) {
  const { email, subscription } = req.user
  res.json({
    email: email,
    subscription: subscription,
  })
}

//update Avatar

async function updateAvatar(req, res) {
  try {
    const { _id } = req.user;
    const { filename } = req.file;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { avatarURL: `http://localhost:3000/images/${filename}` },
      {
        new: true,
      },
    );

    if (!updatedUser) res.status(400).send('User is not found');
    res.json({
      avatarURL: updatedUser.avatarURL,
    });
  } catch (error) {
    res.status(400).send(error);
  }
}

module.exports = {
  registerUser,
  validateUser,
  login,
  authorizeUser,
  logout,
  getCurrentUser,
  updateAvatar,
}
