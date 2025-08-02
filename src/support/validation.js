
import joi from 'joi';

const productSchema = joi.object({
    title: joi.string().min(10).required(),
    content: joi.string().min(20).required(),
})

const updateProductSchema = joi.object({
    product_id: joi.string().required(),
    title: joi.string().min(10),
    content: joi.string().min(20)
})

const createUserSchema = joi.object({
    username: joi.string().required().min(4),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    role: joi.string().valid('admin', 'visitor').optional().default('visitor'),
    confirm_password: joi.ref('password'),
})
const loginUserSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
})
const messageSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    message: joi.string().min(6).required(),
})

module.exports = {
    productSchema, updateProductSchema, createUserSchema, loginUserSchema, messageSchema
}