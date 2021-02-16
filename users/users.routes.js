const { Router } = require('express');
const userController = require('./user.controller');

const router = Router();

router.post(
    '/auth/register',
    userController.validateUser,
    userController.registerUser,
  );

  router.post(
      '/auth/login',
      userController.validateUser,
      userController.login,
  );

  router.post(
    '/auth/logout',
    userController.authorizeUser,
    userController.logout,
);

router.get(
    '/users/current',
    userController.authorizeUser,
    userController.getCurrentUser
)

module.exports = router;