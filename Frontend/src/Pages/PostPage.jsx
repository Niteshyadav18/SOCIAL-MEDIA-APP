import {Avatar, Box, Divider, Flex, Image, Spinner, Text} from "@chakra-ui/react";
import {DeleteIcon} from "@chakra-ui/icons";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilState, useRecoilValue} from "recoil";
import {formatDistanceToNow} from "date-fns";

import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";

import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
    const {user, loading} = useGetUserProfile();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const {pid} = useParams();
    const navigate = useNavigate();

    const currentPost = posts[0];
    useEffect(() => {
        // 🔒 Redirect to /auth if user is logged out
        if (!user && !loading) {
            navigate("/auth");
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        const getPost = async () => {
            setPosts([]);
            try {
                const res = await fetch(`/api/posts/${pid}`);
                const data = await res.json();

                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }

                setPosts([data]);
            } catch (error) {
                showToast("Error", error.message, "error");
            }
        };

        getPost();
    }, [pid, setPosts, showToast]);

    const handleDeletePost = async () => {
        const confirm = window.confirm("Are you sure you want to delete this post?");
        if (!confirm) return;

        try {
            const res = await fetch(`/api/posts/${currentPost._id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            showToast("Success", "Post deleted", "success");
            navigate(`/${user.username}`);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    if (!user && loading) {
        return (
            <Flex justifyContent="center">
                <Spinner size="xl" />
            </Flex>
        );
    }

    if (!currentPost) return null;

    return (
        <>
            <Flex justify="space-between" align="center" mb={4}>
                <Flex align="center" gap={3}>
                    <Avatar src={user.profilePic} size="md" name={user.username} />
                    <Flex align="center">
                        <Text fontSize="sm" fontWeight="bold">
                            {user.username}
                        </Text>
                        <Image src="/verified.png" w={4} h={4} ml={2} />
                    </Flex>
                </Flex>

                <Flex gap={3} align="center">
                    <Text fontSize="xs" color="gray.light">
                        {formatDistanceToNow(new Date(currentPost.createdAt))} ago
                    </Text>

                    {currentUser?._id === user._id && (
                        <DeleteIcon boxSize={5} cursor="pointer" onClick={handleDeletePost} />
                    )}
                </Flex>
            </Flex>

            <Text mb={3}>{currentPost.text}</Text>

            {currentPost.img && (
                <Box borderRadius={6} overflow="hidden" border="1px solid" borderColor="gray.light" mb={3}>
                    <Image src={currentPost.img} w="full" />
                </Box>
            )}

            <Flex gap={3} mb={4}>
                <Actions post={currentPost} />
            </Flex>

            <Divider my={4} />

            {currentPost.replies?.map((reply, index) => (
                <Comment
                    key={reply._id}
                    reply={reply}
                    postOwnerId={user._id}
                    lastReply={index === currentPost.replies.length - 1}
                />
            ))}
        </>
    );
};

export default PostPage;
