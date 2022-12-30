const express = require("express")
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProduct} = require("../controllers/productController")
const { isAuthenticated } = require("../middleWare/auth")
const router = express.Router()
const upload = require("../middleWare/upload")
 
router.route("/products").get(getAllProducts)
router.route("/products/new").post(isAuthenticated,upload.any(),createProduct)
router.route("/products/:id").put(isAuthenticated,updateProduct).delete(isAuthenticated,deleteProduct).get(getProduct)



module.exports = router