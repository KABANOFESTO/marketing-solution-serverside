import Article from "../model/product.js";
import { productSchema, updateProductSchema } from "../support/validation.js";
import User from "../model/userModel.js";
import imageUpload from '../support/photoupload.js';

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0");
var yyyy = today.getFullYear();

today = dd + "/" + mm + "/" + yyyy;

// Fixed: Using async/await instead of callbacks
export const getAllProduct = async (req, res) => {
    try {
        const result = await Article.find();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createNewProduct = async (req, res) => {
    try {
        const valationResult = await productSchema.validateAsync(req.body);

        // Fixed: Using await instead of .then()
        const user = await User.findOne({ _id: req.user.id });

        if (user.role.toString() == 'admin') {
            const article = new Article({
                title: valationResult.title,
                content: valationResult.content,
                postedDate: today,
                imageUrl: '',
            });

            if (req.files) {
                const image = await imageUpload(req);
                article.imageUrl = image.url;
            }

            const result = await article.save();
            res.json(result);
        } else {
            res.status(401).json({ message: 'User Not Authorized' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const valationResult = await updateProductSchema.validateAsync({
            product_id: id,
            title,
            content
        });

        // Fixed: Using await instead of .then()
        const user = await User.findOne({ _id: req.user.id });

        if (user.role.toString() == 'admin') {
            const article = await Article.findOne({ _id: id });

            if (!article) {
                return res.status(404).json({ error: 'article doesn\'t exist!' });
            }

            if (valationResult.title) {
                article.title = valationResult.title;
            }
            if (valationResult.content) {
                article.content = valationResult.content;
            }

            const result = await article.save();
            res.status(200).json(result);
        } else {
            res.status(401).json({ message: 'User Not Authorized' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Fixed: Using await instead of .then()
        const user = await User.findOne({ _id: req.user.id });

        if (user.role.toString() == 'admin') {
            const result = await Article.deleteOne({ _id: id });

            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'article doesn\'t exist!' });
            }

            res.json(result);
        } else {
            res.status(401).json({ message: 'User Not Authorized' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const commentingOnProduct = async (req, res) => {
    const { product_id } = req.params;
    const { comment } = req.body;

    try {
        // Fixed: Using await instead of .then()
        const user = await User.findOne({ _id: req.user.id });

        const newComment = {
            user_id: user._id,
            username: user.username,
            comment,
            postedDate: today
        };

        const product = await Article.findOne({ _id: product_id });

        if (!product) {
            return res.status(404).json({ error: "product doesn't exist" });
        }

        product.comments.push(newComment);
        const result = await product.save();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const likeProduct = async (req, res) => {
    const { product_id } = req.params;
    const user_id = req.user.id;

    try {
        const newLike = {
            user_id,
        };

        // Fixed: Using await instead of .then()
        const product = await Article.findOne({ _id: product_id });

        if (!product) {
            return res.status(404).json({ error: "product doesn't exist" });
        }

        const found = product.likes.some(el => el.user_id.toString() === user_id.toString());

        if (found) {
            product.likes = product.likes.filter(item => item.user_id.toString() !== user_id.toString());
        } else {
            product.likes.push(newLike);
        }

        const result = await product.save();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOneProduct = async (req, res) => {
    const { id } = req.params;

    try {
       
        const result = await Article.findOne({ _id: id });

        if (!result) {
            return res.status(404).json('product doesn\'t exist!');
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};