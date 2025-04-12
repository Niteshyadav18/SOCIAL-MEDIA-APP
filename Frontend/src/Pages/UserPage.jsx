import {useEffect, useState} from "react";
import UserHeader from "../components/UserHeader";
import {useParams, useNavigate} from "react-router-dom"; // 💡 added useNavigate
import {Spinner, Flex} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import {useRecoilState, useRecoilValue} from "recoil"; // 💡 added useRecoilValue
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom"; // 💡 imported userAtom

const UserPage = () => {
    const {user, loading} = useGetUserProfile();
    const {username} = useParams();
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [fetchingPosts, setFetchingPosts] = useState(true);
    const currentUser = useRecoilValue(userAtom); // 💡 get current logged in user
    const navigate = useNavigate();

    // 💡 Redirect if user is logged out
    useEffect(() => {
        if (!currentUser) {
            navigate("/auth");
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        const getPosts = async () => {
            if (!user) return;
            setFetchingPosts(true);
            try {
                const res = await fetch(`/api/posts/user/${username}`);
                const data = await res.json();
                console.log(data);
                setPosts(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                setPosts([]);
            } finally {
                setFetchingPosts(false);
            }
        };

        getPosts();
    }, [username, showToast, setPosts, user]);

    if (!user && loading) {
        return (
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"} />
            </Flex>
        );
    }

    if (!user && !loading) return <h1>User not found</h1>;

    return (
        <>
            <UserHeader user={user} />
            {!fetchingPosts && posts.length === 0 && <h1>User has no posts.</h1>}
            {fetchingPosts && (
                <Flex justifyContent={"center"} my={12}>
                    <Spinner size={"xl"} />
                </Flex>
            )}
            {posts.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
            ))}
        </>
    );
};

export default UserPage;
