const Joi = require("joi")
const {
  Types: { ObjectId },
} = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("./User")

//TODO:
//1. Registation (sign up)
//2. Login
//3. Logout
//4. users current
//5. token check

//register user
async function registerUser(req, res) {
  try {
    const { body } = req
    const hashedPassword = await bcrypt.hash(body.password, 14)

const isEmailInUse = await User.findOne({
  email: body.email,
})
if (isEmailInUse) {
  return res.status(409).send('Email in use')
}

    const user = await User.create({ ...body, password: hashedPassword });

    res
    .status(201).send('User created')
    .json({user: {email: email,
    subscription: subscription}})
  } catch (error) {
    res.status(400).send(error)
  }
}
