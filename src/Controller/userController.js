import { createUserSchema, loginUserSchema } from "../support/validation.js";
import User from '../model/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const createNewUser = async (req, res) => {
    try {
        // Extract all fields including role
        const { username, email, password, role } = req.body;
        const validationResult = await createUserSchema.validateAsync({
            username,
            email,
            password
        });

        // Check if user already exists
        const userExist = await User.findOne({ email: validationResult.email });

        if (userExist) {
            return res.status(400).json({
                "success": false,
                "message": "User email already exists"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(validationResult.password, salt);

        // Create new user - use role from request or default to 'visitor'
        const user = new User({
            username: validationResult.username,
            email: validationResult.email,
            password: hashedPassword,
            role: role || 'visitor' // Use role from request body or default to 'visitor'
        });

        // Save user (using await instead of .then())
        const savedUser = await user.save();

        // Return success response
        res.status(201).json({
            "success": true,
            "user": {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role,
                token: generateToken(savedUser._id) // Pass only the ID
            }
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({
            "success": false,
            "message": error.message
        });
    }
};

const LoginUser = async (req, res) => {
    try {
        const validationResult = await loginUserSchema.validateAsync(req.body);
        const { email, password } = validationResult;

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and password is correct
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({
                "success": true,
                "user": {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id) // Pass only the ID
                }
            });
        } else {
            res.status(400).json({
                "success": false,
                "message": "Invalid credentials" // Fixed typo
            });
        }

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(400).json({
            "success": false,
            "message": error.message
        });
    }
};

const generateToken = (userId) => {
    return jwt.sign(
        { id: { _id: userId } }, 
        "my-token-secret",
        { expiresIn: '30d' }
    );
};

// Export using ES modules
export {
    createNewUser,
    LoginUser
};