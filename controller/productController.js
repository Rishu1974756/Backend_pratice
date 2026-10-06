const Product=require("../models/product");

exports.getProducts=async (req, res,next) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch(err) {
       next(err);
    }
}

exports.getProductById=async (req, res,next) => {
    try {
        const id = req.params.id;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch(err) {
       next(err);
    }
}

exports.createProduct=async (req, res,next) => {
   try {
        const {name, price} = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name not found"
            })
        }

        if (!price) {
            return res.status(400).json({
                message: "price not found"
            })
        }

        const product = await Product.create(req.body)
        return res.status(201).json(product);
   } catch (err) {
        next(err);
   }
}

exports.updateproduct=async (req, res,next) => {
    try {
        const id = req.params.id;

        const product = await Product.findByIdAndUpdate(id, req.body, {
            returnDocument: "after", runValidators: true
        });
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch(err) {
        next(err);
    }
}

exports.deleteProduct=async (req, res,next) => {
    try{const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json({
        message: "Product deleted successfully"
    })
    }catch(err){
        next(err);
    }
}
