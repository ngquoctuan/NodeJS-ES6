import productController from "../controllers/productController";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const router = require("express").Router();

// ADD A PRODUCT
router.post("/", productController.addAProduct);

// GET ALL PRODUCTS
router.get("/", productController.getAllProducts);

//GET A PRODUCT
router.get("/:id", productController.getProductID);

//UPDATE A PRODUCT
router.put("/:id", productController.updateProduct);

//DELETE A PRODUCT
router.delete("/:id", productController.deleteProduct);

export default router;