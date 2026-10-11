
const Product = require("../models/product");



exports.getProducts = async (req, res, next) => {
    try {
        const {
            search,
            inStock,
            minPrice,
            maxPrice,
            sort
        } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const filter = {};

        if (search) {
        const safe = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); 
           filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        if (inStock !== undefined) {
            filter.inStock = inStock === "true";
        }

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .sort(sort || "-createdAt")
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            products
        });
    } catch (err) {
        next(err);
    }
};



exports.getProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

exports.getMyProducts = async (req, res, next) => {
    try {
        const products = await Product.find({
            createdBy: req.user.id
        });

        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const { name, price } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name not found"
            });
        }

        if (price == null) {
            return res.status(400).json({
                message: "Price not found"
            });
        }

        const product = await Product.create({
            name,
            price,
            createdBy: req.user.id
        });

        return res.status(201).json(product);
    } catch (err) {
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (String(product.createdBy) !== String(req.user.id)) {
            return res.status(403).json({
                message: "You can only change your own products"
            });
        }

        const { name, price } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        res.status(200).json(updatedProduct);
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (String(product.createdBy) !== String(req.user.id)) {
            return res.status(403).json({
                message: "You cannot delete other users' products"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};