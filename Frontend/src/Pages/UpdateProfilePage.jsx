import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Avatar,
    Center,
} from "@chakra-ui/react";
import {useRef, useState} from "react";
import {useRecoilState} from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";

export default function UpdateProfilePage() {
    const [user, setUser] = useRecoilState(userAtom);
    const [inputs, setInputs] = useState({
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        bio: user?.bio || "",
        password: "",
    });
    const fileRef = useRef(null);
    const [updating, setUpdating] = useState(false);

    const showToast = useShowToast();
    const {handleImageChange, imgUrl, setImgUrl} = usePreviewImg();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (updating) return;
        setUpdating(true);

        try {
            const res = await fetch(`/api/users/update/${user._id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({...inputs, profilePic: imgUrl}),
            });

            const data = await res.json(); // Updated user object
            if (res.ok) {
                showToast("Success", "Profile updated successfully", "success");
                setUser(data);
                localStorage.setItem("user-threads", JSON.stringify(data));
                setImgUrl(null); // Reset image preview
            } else {
                showToast("Error", data.error || "Failed to update profile", "error");
            }
        } catch (error) {
            showToast("Error", "Something went wrong", error);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Flex align={"center"} justify={"center"} my={6}>
                <Stack
                    spacing={4}
                    w={"full"}
                    maxW={"md"}
                    bg={useColorModeValue("white", "gray.dark")}
                    rounded={"xl"}
                    boxShadow={"lg"}
                    p={6}
                >
                    <Heading lineHeight={1.1} fontSize={{base: "2xl", sm: "3xl"}}>
                        User Profile Edit
                    </Heading>
                    <FormControl id="userName">
                        <Stack direction={["column", "row"]} spacing={6}>
                            <Center>
                                <Avatar size="xl" boxShadow={"md"} src={imgUrl || user.profilePic} />
                            </Center>
                            <Center w="full">
                                <Button w="full" onClick={() => fileRef.current.click()}>
                                    Change Avatar
                                </Button>
                                <Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            placeholder="John Doe"
                            value={inputs.name}
                            onChange={(e) => setInputs({...inputs, name: e.target.value})}
                            type="text"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input
                            placeholder="johndoe"
                            value={inputs.username}
                            onChange={(e) => setInputs({...inputs, username: e.target.value})}
                            type="text"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                            placeholder="your-email@example.com"
                            value={inputs.email}
                            onChange={(e) => setInputs({...inputs, email: e.target.value})}
                            type="email"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Bio</FormLabel>
                        <Input
                            placeholder="Your bio."
                            value={inputs.bio}
                            onChange={(e) => setInputs({...inputs, bio: e.target.value})}
                            type="text"
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder="New password"
                            value={inputs.password}
                            onChange={(e) => setInputs({...inputs, password: e.target.value})}
                            type="password"
                        />
                    </FormControl>
                    <Stack spacing={6} direction={["column", "row"]}>
                        <Button bg={"red.400"} color={"white"} w="full" _hover={{bg: "red.500"}}>
                            Cancel
                        </Button>
                        <Button
                            bg={"green.400"}
                            color={"white"}
                            w="full"
                            _hover={{bg: "green.500"}}
                            type="submit"
                            isLoading={updating}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    );
}
