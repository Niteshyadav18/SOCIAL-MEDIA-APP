import {Avatar, Divider, Flex, IconButton, Text} from "@chakra-ui/react";
import {DeleteIcon} from "@chakra-ui/icons";
import {useRecoilState, useRecoilValue} from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import useShowToast from "../hooks/useShowToast";

//NEED IMPROVEMENT
const Comment = ({reply, lastReply, postOwnerId, postId}) => {
    const currentUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const showToast = useShowToast();

    const canDelete = currentUser && (currentUser._id === reply.userId || currentUser._id === postOwnerId);

    const handleDeleteReply = async () => {
        if (!window.confirm("Are you sure you want to delete this reply?")) return;

        try {
            const res = await fetch(`/api/posts/${postId}/replies/${reply._id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            setPosts((prevPosts) => {
                const updatedPosts = [...prevPosts];
                updatedPosts[0].replies = updatedPosts[0].replies.filter((r) => r._id !== reply._id);
                return updatedPosts;
            });

            showToast("Success", "Reply deleted", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    return (
        <>
            <Flex gap={4} py={2} my={2} w={"full"}>
                <Avatar src={reply.userProfilePic} size={"sm"} />
                <Flex gap={1} w={"full"} flexDirection={"column"}>
                    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                        <Text fontSize="sm" fontWeight="bold">
                            {reply.username}
                        </Text>
                        {canDelete && (
                            <IconButton
                                icon={<DeleteIcon />}
                                size="sm"
                                onClick={handleDeleteReply}
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Delete Reply"
                            />
                        )}
                    </Flex>
                    <Text>{reply.text}</Text>
                </Flex>
            </Flex>
            {!lastReply ? <Divider /> : null}
        </>
    );
};

export default Comment;
