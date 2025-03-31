import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import useShowToast from "./useShowToast";

function useGetUserProfile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const {username} = useParams();
    const showToast = useShowToast();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/users/profile/${username}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setUser(data);
                console.log(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, [username, showToast]);
    return {user, loading};
}

export default useGetUserProfile;
