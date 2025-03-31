import {Flex, Spinner} from "@chakra-ui/react";
import {useEffect} from "react";

import useShowToast from "../hooks/useShowToast";
import {useState} from "react";
import Post from "../component/Post";

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const showToast = useShowToast();

    useEffect(() => {
        const getFeedPosts = async () => {
            try {
                const res = await fetch("/api/posts/feed");
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                }
                console.log(data);
                setPosts(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        };
        getFeedPosts();
    }, [showToast]);
    return (
        <>
            {!loading && posts.length === 0 && <h1>Follow some user to see the feed</h1>}
            {loading && (
                <Flex justify="center">
                    <Spinner size="xl" />
                </Flex>
            )}

            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    );
};

export default HomePage;
