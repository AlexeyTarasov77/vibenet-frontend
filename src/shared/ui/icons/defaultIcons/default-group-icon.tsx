import Svg, { Circle, Path, SvgProps } from "react-native-svg"

export function DEFAULT_GROUP_ICON(props: SvgProps) {
  return (
    <Svg
    //   width={47}
    //   height={46}
      viewBox="0 0 47 46"
      fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle
        cx={23.1641}
        cy={23}
        r={23}
        fill="#543C52"
        fillOpacity={1}
      />
      <Path
        d="M12.514 29.178v-11.2h1.936l4.432 8.128v-8.128h1.76v11.2h-1.936l-4.432-8.128v8.128h-1.76zm22.18-5.616v1.648h-1.232c-.288 1.323-.907 2.363-1.856 3.12-.939.747-2.139 1.12-3.6 1.12-1.739 0-3.136-.544-4.192-1.632-1.056-1.099-1.579-2.485-1.568-4.16.01-1.664.533-3.072 1.568-4.224 1.045-1.152 2.496-1.728 4.352-1.728 1.344 0 2.464.347 3.36 1.04.906.693 1.408 1.557 1.504 2.592h-2.016a2.318 2.318 0 00-.944-1.424c-.502-.373-1.136-.56-1.904-.56-1.302 0-2.294.41-2.976 1.232-.683.81-1.019 1.835-1.008 3.072-.011 1.184.33 2.17 1.024 2.96.704.79 1.637 1.184 2.8 1.184 1.909 0 3.082-.864 3.52-2.592h-2.16v-1.648h5.328z"
        fill="#fff"
        fillOpacity={1}
      />
    </Svg>
  )
}