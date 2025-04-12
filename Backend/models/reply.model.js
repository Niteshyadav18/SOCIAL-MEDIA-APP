import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true,
        },
    },
    {timestamps: true}
);

const Reply = mongoose.model("Reply", replySchema);
export default Reply;
