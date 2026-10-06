const express = require("express");
const router = express.Router();

const c=require("../controller/productController");


router.get("",c.getProducts);

router.get("/:id", c.getProductById);

router.post("", c.createProduct);

router.put("/:id", c.updateproduct);

router.delete("/:id", c.deleteProduct) 

module.exports = router;