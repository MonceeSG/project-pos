const { uploadImage } = require('../lib/cloudinary');
const ProductModel = require('../model/productModel');

class ProductController {
    // Add Product
    static async addProduct(req, res) {
        try {
            console.log(req.body);

            const { name, category, quantity, price} = req.body;
            const file = req.file;
            let imageUrl
            console.log("Received Product Data:", { name, category, quantity, price });
            console.log("Received File:", file);

            if (!name) {
                return res.status(400).json({ message: "Product name is required" });
            }
            if (!category) {
                return res.status(400).json({ message: "Product category is required" });
            }
            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: "Product quantity must be greater than zero" });
            }
            if (!price || price <= 0) {
                return res.status(400).json({ message: "Product price must be greater than zero" });
            }

            if (file) {
                const uploadResult = await uploadImage(file);
                if (!uploadResult || !uploadResult.secure_url) {
                    return res.status(500).json({ message: "Image upload failed" });
            }
            imageUrl = uploadResult.secure_url;
        }

        const newProduct = {
            name,
            category,
            quantity,
            price,
            imageUrl
        };

        const productId = await ProductModel.addProduct(newProduct);
        res.status(201).json({ message: "Product added", product: { id: productId, newProduct } });

        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
            console.error("Error adding product:", error);
        }
    }

    // Get all products
    static async getAllProducts(req, res) {
        try {
            // Ambil semua produk dari model
            const products = await ProductModel.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Get product by id
    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await ProductModel.getProductById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Update product
    static async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, price, category, quantity } = req.body;
            const imageUrl = req.file ? (await uploadImage(req.file)).secure_url : null;
            if (!name) {
                return res.status(400).json({ message: "Product name is required" });
            }

            const updated = await ProductModel.updateProduct(id, {
                name,
                price,
                category,
                quantity,
                imageUrl
            });

            if (!updated) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product updated' });
        } catch (error) {
            console.error("Update Error:", error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }

    // Delete product
    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ProductModel.deleteProduct(id);
            if (!deleted) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = ProductController;