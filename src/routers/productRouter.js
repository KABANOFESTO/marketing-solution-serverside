import express from "express";
import { getAllProduct, createNewProduct, commentingOnProduct, likeProduct, deleteProduct, updateProduct, getOneProduct } from "../Controller/productController.js";
import passport from "passport";
import '../middleware/passport.js';

const router = express.Router();

router.get("/", getAllProduct);
router.get("/:id", getOneProduct);

router.post("/add", passport.authenticate("jwt", { session: false }), createNewProduct);

router.post("/:product_id/comment", passport.authenticate("jwt", { session: false }), commentingOnProduct);
router.post("/:product_id/like", passport.authenticate("jwt", { session: false }), likeProduct);
router.delete("/:id", passport.authenticate("jwt", { session: false }), deleteProduct);
router.put("/:id/update", passport.authenticate("jwt", { session: false }), updateProduct);

export default router;