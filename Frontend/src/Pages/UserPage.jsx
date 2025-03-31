import {useEffect, useState} from "react";
import UserHeader from "../component/UserHeader";

import {useParams} from "react-router-dom";
import {Spinner, Flex} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import Post from "../component/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";

const UserPage = () => {
    const {user, loading} = useGetUserProfile();
    const {username} = useParams();
    const showToast = useShowToast();

    const [posts, setPosts] = useState([]);
    const [fetchingPosts, setFetchingPosts] = useState(true);

    useEffect(() => {
        const getPosts = async () => {
            setFetchingPosts(true);
            try {
                console.log(`Fetching: /api/posts/user/${username}`); // Debugging
                const res = await fetch(`/api/posts/user/${username}`);
                const data = await res.json();
                console.log("Response Data:", data);

                setPosts(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setFetchingPosts(false);
            }
        };

        getPosts();
    }, [username, showToast]);

    if (!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size="xl" />;
            </Flex>
        );
    }

    if (!user && !loading) return <h1>User not found</h1>;

    return (
        <>
            <UserHeader user={user} />

            {!fetchingPosts && posts.length === 0 && <h1>No posts found</h1>}
            {fetchingPosts && (
                <Flex justifyContent={"center"} my={12}>
                    <Spinner size="xl" />
                </Flex>
            )}
            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    );
};

export default UserPage;
