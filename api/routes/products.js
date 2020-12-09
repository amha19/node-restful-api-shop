const express = require('express');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const productsController = require('../controllers/products');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    // instead of null you can pass new Error message.
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get('/', productsController.getAllProducts);

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  productsController.addProduct
);

router.get('/:productId', productsController.getProduct);

router.patch('/:productId', checkAuth, productsController.updateProduct);

router.delete('/:productId', checkAuth, productsController.deleteProduct);

module.exports = router;
