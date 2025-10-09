const express = require('express');
const router = express.Router();
const upload = require('../lib/multer');
const productController = require('../controller/productController');

// Create product (dengan upload gambar)
router.post('/', upload.single('image'), productController.addProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get product by id
router.get('/:id', productController.getProductById);

// Update product (dengan upload gambar baru, opsional)
router.put('/:id', upload.single('image'), productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;