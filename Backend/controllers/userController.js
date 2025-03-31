import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookies.js";
import {v2 as cloudinary} from "cloudinary";
import mongoose from "mongoose";

const getUserProfile = async (req, res) => {
    const {username} = req.params; // Use username directly

    // we will fetch  user profile either with username or id
    //query is either username or userId

    // const {query} = req.params;

    try {
        let user;

        if (mongoose.Types.ObjectId.isValid(username)) {
            user = await User.findOne({_id: username}).select("-password -updatedAt");
        } else {
            user = await User.findOne({username}).select("-password -updatedAt");
        }

        if (!user) return res.status(404).json({error: "User not found"});

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getUserProfile:", error.message);
        res.status(500).json({error: error.message});
    }
};

//Signup user

// const signupUser = async (req, res) => {
//     try {
//         const {name, email, username, password} = req.body;
//         const user = await User.findOne({$or: [{email}, {username}]});

//         if (user) {
//             return res.status(400).json({error: "User already exists"});
//         }
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newUser = new User({
//             name,
//             email,
//             username,
//             password: hashedPassword,
//         });
//         await newUser.save();

//         if (newUser) {
//             generateTokenAndSetCookie(newUser._id, res);

//             res.status(201).json({
//                 _id: newUser._id,
//                 name: newUser.name,
//                 email: newUser.email,
//                 username: newUser.username,
//                 // bio: newUser.bio,
//                 // profilePic: newUser.profilePic,
//             });
//         } else {
//             res.status(400).json({error: "Invalid user data"});
//         }
//     } catch (err) {
//         res.status(500).json({error: err.message});
//         console.log("Error in signupUser: ", err.message);
//     }
// };
const signupUser = async (req, res) => {
    try {
        const {name, email, username, password} = req.body;

        // Validate input fields
        if (!name || !email || !username || !password) {
            return res.status(400).json({error: "All fields are required"});
        }

        // Check if user already exists by email or username
        const existingUser = await User.findOne({$or: [{email}, {username}]});
        if (existingUser) {
            return res.status(400).json({error: "User already exists"});
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate token and set cookie
        generateTokenAndSetCookie(newUser._id, res);

        // Send response
        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            bio: newUser.bio,
            profilePic: newUser.profilePic,
        });
    } catch (err) {
        console.error("Error in signupUser:", err);
        return res.status(500).json({error: err.message || "Internal Server Error"});
    }
};

//Login user
const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({error: "Username and password are required"});
        }

        const user = await User.findOne({username});

        if (!user) return res.status(400).json({error: "Invalid credentials"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({error: "Invalid credentials"});

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio, // ✅ Fixed here
            profilePic: user.profilePic, // ✅ Fixed here
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 1});
        res.status(200).json({message: "User logged out successfully"});
    } catch (err) {
        res.status(500).json({error: err.message});
        console.log("Error in signupUser: ", err.message);
    }
};

// const followUnfollowUser = async (req, res) => {
//     try {
//         const {id} = req.params;
//         const userTOModify = await User.findById(req.user._id);
//         const currentUser = await User.findById(req.user._id);
//         if (id === req.user._id.toString()) return res.status(400).json({error: "You cannot follow/unfollow yourself"});

//         if (!userTOModify || !currentUser) return res.status(404).json({error: "User not found"});

//         const isFollowing = currentUser.following.includes(id);

//         if (isFollowing) {
//             //unfollow user
//             //modify current user following, modify followers of userToModify
//             await User.findByIdAndUpdate(req.user._id, {
//                 $pull: {
//                     followers: req.user._id,
//                 },
//             });
//             await User.findByIdAndUpdate(id, {
//                 $pull: {
//                     following: id,
//                 },
//             });
//             res.status(200).json({message: "User unfollowed successfully"});
//         } else {
//             await User.findByIdAndUpdate(req.user._id, {
//                 $push: {
//                     followers: req.user._id,
//                 },
//             });
//             await User.findByIdAndUpdate(id, {
//                 $push: {
//                     following: id,
//                 },
//             });
//             res.status(200).json({message: "User followed successfully"});
//         }
//     } catch (error) {
//         res.status(500).json({error: error.messsage});
//         console.log("Error in followUnfollowUser: ", error.message);
//     }
// };
const followUnfollowUser = async (req, res) => {
    try {
        const {id} = req.params;

        if (id === req.user._id.toString()) {
            return res.status(400).json({error: "You cannot follow/unfollow yourself"});
        }

        const currentUser = await User.findById(req.user._id);
        const userToModify = await User.findById(id);

        if (!userToModify || !currentUser) {
            return res.status(404).json({error: "User not found"});
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow user
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}});

            return res.status(200).json({message: "User unfollowed successfully"});
        } else {
            // Follow user
            await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});

            return res.status(200).json({message: "User followed successfully"});
        }
    } catch (error) {
        console.error("Error in followUnfollowUser:", error.message);
        return res.status(500).json({error: error.message});
    }
};

const updateUser = async (req, res) => {
    const {name, email, username, password, bio} = req.body;
    let {profilePic} = req.body;

    const userId = req.user._id; // Ensure user is authenticated

    try {
        let user = await User.findById(userId);
        if (!user) return res.status(404).json({error: "User not found"});

        // Ensure user can only update their profile
        if (req.params.id !== userId.toString())
            return res.status(403).json({error: "You cannot update another user's profile"});

        // Handle password update
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        // Handle profile picture update
        if (profilePic) {
            try {
                if (user.profilePic) {
                    const publicId = user.profilePic.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId); // Delete old image
                }
                const uploadedResponse = await cloudinary.uploader.upload(profilePic, {
                    folder: "user_profiles", // ✅ Store uploads in folder
                    resource_type: "image",
                });
                profilePic = uploadedResponse.secure_url; // Use secure URL
            } catch (uploadError) {
                return res.status(500).json({error: "Error uploading image"});
            }
        }

        // Update user fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error("Error in updateUser:", err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};

export {signupUser, loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile};
