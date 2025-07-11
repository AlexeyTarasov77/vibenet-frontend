import { Text, View, TouchableOpacity } from "react-native";
import { Link, usePathname, useRouter } from "expo-router";
import { LogoIcon, LogOutIcon, PlusIcon, SettingsIcon } from "../../../../shared/ui/icons/headerIcons";
import { LinkItem } from "./link-item";
import { useEffect, useState } from "react";
import { useAuthCtx, useUserCtx } from "../../../users/components/users-ctx";
import { ModalName, useModal } from "../../../../shared/context/modal";


export enum HeaderAction {
  SETTINGS,
  CREATE,
  LOGOUT
}

export function Header() {
  const router = useRouter();
  const defaultHeaderActions: HeaderAction[] = Object.values(HeaderAction) as HeaderAction[]
  const [showedActions, setShowedActions] = useState<HeaderAction[]>(defaultHeaderActions)
  const { user } = useUserCtx();
  const { logout } = useAuthCtx()
  const { open: openModal } = useModal()
  const [createActionCallback, setCreateActionCallback] = useState(() => () => openModal({ name: ModalName.CREATE_POST }))
  const currPath = usePathname()
  useEffect(() => {
    const friendPathRegexp = new RegExp("\/friends.*")
    const profilePathRegexp = new RegExp("\/profile.*")
    const chatsPathRegexp = new RegExp("\/chats.*")
    const settingsPathRegexp = new RegExp("\/settings.*")
    if (friendPathRegexp.test(currPath) || profilePathRegexp.test(currPath)) {
      setShowedActions(defaultHeaderActions.filter(showedAction => showedAction !== HeaderAction.CREATE))
    } else if (chatsPathRegexp.test(currPath)) {
      setCreateActionCallback(() => () => openModal({ name: ModalName.CREATE_CHAT_STEP_1 }))
      setShowedActions(defaultHeaderActions.filter(showedAction => showedAction !== HeaderAction.SETTINGS))
    } else if (settingsPathRegexp.test(currPath)) {
      setCreateActionCallback(() => () => openModal({ name: ModalName.CREATE_ALBUM }))
      //   setShowedActions(defaultHeaderActions.filter(showedAction => showedAction !== HeaderAction.SETTINGS))
      setShowedActions(defaultHeaderActions)
    } else {
      setShowedActions(defaultHeaderActions)
      setCreateActionCallback(() => () => openModal({ name: ModalName.CREATE_POST }))
    }
  }, [currPath])

  const onLogout = async () => {
    await logout();
    router.navigate("/users/login");
  };
  return (
    <View className="flex-row p-2 gap-[30%] bg-white self-center justify-center w-full">
      <View className="self-center items-center justify-center">
        <Link href="/" asChild>
          <TouchableOpacity>
            <LogoIcon />
          </TouchableOpacity>
        </Link>
      </View>
      {user && (
        <View className="flex-row gap-2 max-w-fit">
          {showedActions.includes(HeaderAction.CREATE) &&
            <LinkItem
              onPress={createActionCallback}
              focused={false}
            >
              <PlusIcon width={20} height={20} />
            </LinkItem>
          }
          ,
          {showedActions.includes(HeaderAction.SETTINGS) &&
            <LinkItem
              path="/settings"
            >
              <SettingsIcon width={20} height={20} />
            </LinkItem>
          }
          ,
          {showedActions.includes(HeaderAction.LOGOUT) &&
            <LinkItem
              onPress={onLogout}
            >
              <LogOutIcon width={20} height={20} />
            </LinkItem>
          }
        </View>
      )}
    </View>
  );
}

