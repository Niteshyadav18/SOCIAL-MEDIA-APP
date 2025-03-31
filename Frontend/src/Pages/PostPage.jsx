import {Avatar, Flex, Text, Image, Divider, Button, Spinner} from "@chakra-ui/react";
import {Box} from "@chakra-ui/react";
import Actions from "../component/Actions.jsx";

import Comment from "../component/Comment.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import {useEffect, useState} from "react";
import useShowToast from "../hooks/useShowToast.js";
import {useNavigate, useParams} from "react-router-dom";
import {formatDistanceToNow} from "date-fns";
import {DeleteIcon} from "@chakra-ui/icons";
import {useRecoilValue} from "recoil";
import userAtom from "../atoms/userAtom.js";

const PostPage = () => {
    const {user, loading} = useGetUserProfile();
    const showToast = useShowToast();
    const [post, setPost] = useState(null);

    const {pid} = useParams();
    const navigate = useNavigate();

    const currentUser = useRecoilValue(userAtom);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await fetch(`/api/posts/${pid}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                }
                console.log(data);
                setPost(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            }
        };
        getPosts();
    }, [pid, showToast]);

    const handleDeletePost = async (e) => {
        try {
            e.preventDefault();
            if (!window.confirm("Are you sure you want to delete this post?")) return;

            const res = await fetch(`/api/posts/${post._id}`, {
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
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />;
            </Flex>
        );
    }
    if (!post) return null;

    return (
        <>
            <Flex>
                <Flex w={"full"} alignItems={"center"} gap={3}>
                    <Avatar src={user.profilePic} size={"md"} name="Mark Zuckerberg" />
                    <Flex>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {user.username}
                        </Text>
                        <Image src="/verified.png" w="4" h={4} ml={4} />
                    </Flex>
                </Flex>

                <Flex gap={4} alignItems={"center"}>
                    <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
                        {formatDistanceToNow(new Date(post.createdAt))} ago
                    </Text>
                    {currentUser?._id === user._id && (
                        <DeleteIcon size={20} cursor={"pointer"} onClick={handleDeletePost} />
                    )}
                </Flex>
            </Flex>

            <Text my={3}>{post.text} </Text>

            {post.img && (
                <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                    <Image src={post.img} w={"full"} />
                </Box>
            )}

            <Flex gap={3} my={3}>
                <Actions post={post} />
            </Flex>

            <Flex gap={2} alignItems={"center"}>
                <Text fontSize={"sm"} color={"gray.light"}>
                    {post.replies.length} replies
                </Text>
                <Box w={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                <Text color={"gray.light"} fontSize={"sm"}>
                    {post.likes.length} likes
                </Text>
            </Flex>
            <Divider my={4} />

            <Flex justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"2x1"}>👋</Text>
                    <Text color={"gray.light"}>Get the app to like, reply and post</Text>
                </Flex>
                <Button>Get</Button>
            </Flex>

            <Divider my={4} />
            {post.replies.map((reply) => (
                <Comment
                    key={reply._id}
                    reply={reply}
                    lastReply={reply._id === post.replies[post.replies.length - 1]._id}
                />
            ))}
        </>
    );
};

export default PostPage;
