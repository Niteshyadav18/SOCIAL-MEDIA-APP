import {Container} from "@chakra-ui/react";
import {Route, Routes} from "react-router-dom";
import UserPage from "./Pages/UserPage";
import PostPage from "./Pages/PostPage";
import Header from "./components/Header";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";
import {useRecoilValue} from "recoil";
import userAtom from "./atoms/userAtom";
import {Navigate} from "react-router";
import UpdateProfilePage from "./Pages/UpdateProfilePage";

import CreatePost from "./components/CreatePost";

function App() {
    const user = useRecoilValue(userAtom);
    console.log("user: ", user);
    return (
        <Container maxW="620px">
            <Header />
            <Routes>
                <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
                <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
                <Route path="/update" element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />} />

                <Route path="/:username" element={<UserPage />} />
                <Route path="/:username/post/:pid" element={<PostPage />} />
            </Routes>

            {/* {user && <LogoutButton />} */}
            {user && <CreatePost />}
        </Container>
    );
}

export default App;
