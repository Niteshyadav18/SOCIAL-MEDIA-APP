import Reply from "../models/reply.model.js";

export const deleteReply = async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.id);

        if (!reply) {
            return res.status(404).json({error: "Reply not found"});
        }

        if (reply.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({error: "Unauthorized to delete reply"});
        }

        await Reply.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Reply deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server Error"});
    }
};
