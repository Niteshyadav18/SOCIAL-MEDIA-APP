import {Avatar, Divider, Flex, Text, Image} from "@chakra-ui/react";

const Comment = ({reply, lastReply}) => {
    return (
        <>
            <Flex>
                <Flex w={"full"} alignItems={"center"} gap={3}>
                    <Avatar src={reply.userProfilePic} size={"md"} />
                    <Flex>
                        <Text fontSize={"sm"} fontWeight={"bold"}>
                            {reply.username}
                        </Text>
                        <Image src="/verified.png" w="4" h={4} ml={4} />
                    </Flex>
                </Flex>

                <Text fontSize={"sm"}>{reply.text}</Text>
            </Flex>

            {!lastReply ? <Divider /> : null}
        </>
    );
};

export default Comment;
