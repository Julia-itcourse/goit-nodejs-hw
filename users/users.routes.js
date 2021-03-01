const { Router } = require('express');
const path = require('path');

const multer = require('multer');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const userController = require('./user.controller');

const router = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'tmp');
    },
    filename: function (req, file, cb) {
      const { ext } = path.parse(file.originalname);
      cb(null, `${Date.now()}${ext}`);
    },
  });
  
  const upload = multer({ storage });
  
  async function minifyAvatar(req, res, next) {
    const files = await imagemin(
      [`${req.file.destination}/${req.file.filename}`],
      {
        destination: 'public/images',
        plugins: [
          imageminJpegtran(),
          imageminPngquant({
            quality: [0.6, 0.8],
          }),
        ],
      },
    );
    next();
  }

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
);

router.patch(
    '/users/avatars',
    userController.authorizeUser,
    upload.single('avatar'),
    minifyAvatar,
    userController.updateAvatar,
  );

module.exports = router;