const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAdmin, validateWheel, validateReservation } = require('../middleware');
const wheel = require('../controllers/wheel');
const introduce = require('../controllers/introduce');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', catchAsync(introduce.recommend))

router.route('/:id')
  .get(catchAsync(wheel.goToShow))
  .put(isAdmin, upload.single('image'), validateWheel, catchAsync(wheel.edit))
  .delete(isAdmin, catchAsync(wheel.delete))

router.get('/:id/edit', isAdmin, catchAsync(wheel.goToEdit))

router.route('/:id/reserve')
  .get(isLoggedIn, catchAsync(wheel.goToReserve))
  .post(isLoggedIn, validateReservation, catchAsync(wheel.reserve))

module.exports = router;