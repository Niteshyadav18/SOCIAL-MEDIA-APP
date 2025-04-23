import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "20d", // Match this with cookie expiration
    });

    res.cookie("jwt", token, {
        httpOnly: true, // more secure
        secure: process.env.NODE_ENV === "production", // only send cookies over HTTPS in production
        maxAge: 20 * 24 * 60 * 60 * 1000, // 20 days
        sameSite: "strict", // CSRF protection
    });

    return token;
};

export default generateTokenAndSetCookie;
