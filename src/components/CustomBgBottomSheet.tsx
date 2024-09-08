import React, { useMemo } from "react";
import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";
import { useSelector,RootStateOrAny } from "react-redux";

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {

    const {isDarkMode} = useSelector(
        (state: RootStateOrAny) => state.theme,
      );

      
  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    // @ts-ignore
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      isDarkMode ? ["#333131", "#333131"]: ["#FFFFFF", "#FFFFFF"]
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomBackground;