import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js"; // Ensure correct import

const JWT_SECRET = process.env.JWT_SECRET; // Store securely (e.g., in env variables)

export const RegisterAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        // Check if admin already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Admin already exists",
                success: false
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newUser = new User({
            email,
            password: hashedPassword,
            role: "admin"
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "Admin account created successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const LoginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        // Find admin
        const foundUser = await User.findOne({ email });

        if (!foundUser || foundUser.role !== "admin") {
            return res.status(403).json({
                message: "Unauthorized: Only admin can log in",
                success: false
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);

        if (!isPasswordValid) {
            return res.status(403).json({
                message: "Invalid password",
                success: false
            });
        }

        const JWT_SECRET = process.env.JWT_SECRET
        if (!JWT_SECRET) {
            return res.status(403).json({
                success: false,
                message: "JWT Do Not Exist"
            });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: foundUser._id, role: foundUser.role }, JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });
    } catch (error) {
        console.log("Error ",error)
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};



export const FindUser = async (req, res) => {
    try {
        const userId = req.id

        const foundUser = await User.findOne({ id: userId });

        if (!foundUser) {
            return res.status(403).json({
                message: "User Not Found",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            message: "User Dound",
            foundUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


export const GetAuthenticatedUser = async (req, res) => {
    try {
        const userId = req.admin?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No user ID found"
            });
        }

        const foundUser = await User.findById(userId).select("-password");
        if (!foundUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User found",
            user: foundUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
