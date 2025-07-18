import { useLocalSearchParams } from "expo-router";
import { View, Text, Image } from "react-native";
import { useGroupChat } from "../hooks";
import { Loader } from "../../../shared/ui/loader/loader";
import { IUser } from "../../users/types";
import { BaseChatScreen } from "../components/base-chat-screen";
import { DEFAULT_AVATAR_URL } from "../../../shared/constants";
import { useSocketCtx } from "../../users/components/users-ctx";
import { DEFAULT_ICONS } from "../../../shared/ui/icons/icons";


export function GroupChatScreen() {
  const { checkUserOnline } = useSocketCtx()
  const { id } = useLocalSearchParams()
  const { isLoading, chat, setChat } = useGroupChat(Number(id))
  if (isLoading) return <Loader />
  if (!chat) return
  const chatMembersMap: Record<number, IUser> = {}
  let onlineMembersCount = -1 // set -1 initial value to exclude current user
  chat.members.forEach(member => {
    chatMembersMap[member.id] = member
    if (checkUserOnline(member.id)) {
      onlineMembersCount++;
    }
  })
  return <BaseChatScreen
    menuEnabled={true}
    setChat={setChat as any}
    chat={chat}
    getMsgAuthor={(authorId: number) => chatMembersMap[authorId]}
    chatInfo={<>
    {chat.avatar? 
      <Image source={{ uri: chat.avatar }} className="rounded-full w-12 h-12" />
    :
    <DEFAULT_ICONS.DEFAULT_GROUP_ICON className="w-12 h-12"  width={48} height={48}/>
    }
      <View>
        <Text className="font-medium text-2xl">
          {chat.name}
        </Text>
        <Text className="text-grey">
          {chat.members.length} учасники {onlineMembersCount > 0 ? `, ${onlineMembersCount} в мережі` : ""}
        </Text>
      </View>

    </>}
  />
}
