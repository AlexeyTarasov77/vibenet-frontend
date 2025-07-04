import { View } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

export function ContactsIcon({
  active,
  ...props
}: SvgProps & { active?: boolean }) {
  return (
    <View className={active ? "border-t-2 border-slive" : ""}>
      <Svg width={21} height={14} viewBox="0 0 21 14" fill="none" {...props}>
        <Path
          d="M3.246 4.498a4.375 4.375 0 117.372 3.186 6.887 6.887 0 013.793 5.105.938.938 0 01-1.852.294 5 5 0 00-9.875 0 .938.938 0 01-1.853-.295 6.875 6.875 0 013.793-5.103 4.375 4.375 0 01-1.378-3.187zm11.25-1.875a3.751 3.751 0 012.775 6.272 6.25 6.25 0 013.2 3.766.936.936 0 01-1.536.963.938.938 0 01-.256-.414 4.388 4.388 0 00-3.153-2.965.937.937 0 01-.717-.912v-.44a.937.937 0 01.52-.84 1.875 1.875 0 00-.833-3.555.938.938 0 010-1.875zm-6.875-.625a2.5 2.5 0 10-.113 4.999 2.5 2.5 0 00.113-4.999z"
          fill="#81818D"
          fillOpacity={1}
        />
      </Svg>
    </View>
  );
}
