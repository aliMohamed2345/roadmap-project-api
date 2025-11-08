import User from "../models/user.model.js"
import { validateChangeProfileCredentials } from "../utils/validateUserCredentials.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";
import fs from "fs";
export const Profile = async (req, res) => {

    try {
        const { id: userId } = req.user

        const user = await User.findById(userId).select('-password -__v')
        return res.status(200).json({ success: true, user })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { username, email, imageURL, bio } = req.body;

        const { isValid, message } = validateChangeProfileCredentials(email, username, imageURL, bio)
        if (!isValid) return res.status(400).json({ success: false, message })

        const updatedData = {};

        if (username) updatedData.username = username;
        if (email) updatedData.email = email;
        if (imageURL) updatedData.imageURL = imageURL;
        if (bio) updatedData.bio = bio;

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select('username email imageURL id isAdmin');
        return res.status(200).json({ success: true, message: 'User updated successfully', user })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { currentPassword, password, confirmPassword } = req.body;

        // Validate input presence
        if (!currentPassword || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password, new password, and confirm password are required.",
            });
        }

        //Match new password and confirmation
        if (password !== confirmPassword) {
            return res
                .status(400)
                .json({ success: false, message: "Passwords do not match." });
        }

        //Validate new password strength
        const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
            });
        }

        //Check current password correctness
        const user = await User.findById(userId);
        if (!user)
            return res.status(404).json({ success: false, message: "User not found." });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch)
            return res
                .status(401)
                .json({ success: false, message: "Current password is incorrect." });

        // Hash and update password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        return res
            .status(200)
            .json({ success: true, message: "Password changed successfully.", });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const { q, page = 1, isAdmin } = req.query;

        const userPerPage = 10;
        const skip = (page - 1) * userPerPage;

        // Build dynamic query
        const queryData = {};

        if (isAdmin !== undefined) {
            queryData.isAdmin = (isAdmin) === "true"
        }
        if (q) {
            queryData.$or = [
                { email: { $regex: q, $options: 'i' } },
                { username: { $regex: q, $options: 'i' } }
            ];
        }

        // Get total count for pagination
        const totalUsers = await User.countDocuments(queryData);

        // Fetch users with pagination
        const users = await User.find(queryData)
            .select('-password -__v')
            .limit(userPerPage)
            .skip(skip)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            page: +page,
            totalUsers,
            totalPages: Math.ceil(totalUsers / userPerPage),
            users
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getSpecificUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select('-password -__v')
        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const toggleRole = async (req, res) => {
    try {
        const { id: userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        //toggle user role 
        user.isAdmin = !user.isAdmin;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `User role updated successfully. ${user.username} is now ${user.isAdmin ? "an admin" : "a regular user"
                }.`,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id: userId } = req.user
        await User.findByAndDelete(userId)
        return res.status(200).json({ success: true, message: 'User deleted successfully' })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({ success: false, message: error.message })
    }
}


export const uploadProfileImage = async (req, res) => {
    try {
        const { id: userId } = req.user;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "user_profiles",
            public_id: `user_${userId}`,
            transformation: [{ width: 300, height: 300, crop: "fill" }],
        });

        // Remove the local file
        fs.unlinkSync(req.file.path);

        // Update user image URL
        const user = await User.findByIdAndUpdate(
            userId,
            { imageURL: uploadResult.secure_url },
            { new: true }
        ).select("-password -__v");

        return res.status(200).json({
            success: true,
            message: "Profile image updated successfully",
            imageURL: user.imageURL,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
