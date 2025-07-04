import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../components/card";
import { FriendCard } from "../components/friend-card";
import { Loader } from "../../../shared/ui/loader/loader";
import { useAllFriends } from "../hooks/use-all-friends";
import { useUserCtx } from "../../users/components/users-ctx";
import { friendsService, funcButtons } from "../services";
import { getErrorMessage } from "../../../shared/utils/errors";
import { ModalName, useModal } from "../../../shared/context/modal";
import { useRouter } from "expo-router";
import { chatsService } from "../../chats/services/chats";

export function AllFriends() {
    const { allFriends, isLoading } = useAllFriends();
    const {deleteFriend} = funcButtons()
    const { user } = useUserCtx();
    const router = useRouter()
    const { open } = useModal();
    if (isLoading || !user) return <Loader />;
   
    return allFriends && allFriends.length > 0 ? (
        <Card title={"Всі друзі"} seeAllLink={"/friends/all-friends"}>
            {allFriends.map((friend) => {
                return (
                    <FriendCard
                        key={friend.id}
                        user={friend}
                        leftButton={
                            <TouchableOpacity
                                onPress={ async ()=>{
                                    const personalChat = await chatsService.getOrCreatePersonalChat(friend.id)
                                    router.push(`/chats/${personalChat.id}`);
                                }}
                                className="flex-row items-center gap-1 bg-slive p-2 rounded-[1234]"
                            >
                                <Text className="text-white text-center px-3">
                                    Повідомлення
                                </Text>
                            </TouchableOpacity>
                        }
                        rightButton={
                            <TouchableOpacity
                                onPress={() => {
                                    open({
                                        name: ModalName.CONFIRMATION, props: {
                                            onConfirm: async () =>
                                                deleteFriend(Number(friend.id)),
                                            label: "Ви дійсно хочете видалити користувача?"
                                        }
                                    });
                                }}
                                className="flex-row items-center gap-1 border border-slive p-2 rounded-[1234]"
                            >
                                <Text className="text-slive text-center px-3">
                                    Видалити
                                </Text>
                            </TouchableOpacity>
                        }
                    />
                );
            })}
        </Card>
    ) : (
        <View className="bg-white p-4 border-border m-2 rounded-xl ">
            <Text className="text-slive pl-2">
                У тебе немає друзів.
            </Text>
        </View>
    );
}
