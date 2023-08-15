import React from "react";
import { View, Animated, Image,StyleSheet, Dimensions } from "react-native";
import { colors } from "../utils/colors";


const Banner = ({
  BannerHeight,
  BannerImgs,
  dotSize,
  dotColor,
}) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get("screen");

  const BannerWidth=width
  return (
    <View style={{ height: BannerHeight, overflow: "hidden" }}>
      <Animated.FlatList
        data={BannerImgs}
        keyExtractor={(_, index) => index.toString()}
        snapToInterval={BannerWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        horizontal
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        bounces={false}
        renderItem={(item) => {
          return (
            <View>
              <Image
                source={require('./../../assets/images/banner.jpg')}
                style={{
                  resizeMode: "cover",
                  width: BannerWidth,
                  height: BannerHeight,
               
                }}
              />
            </View>
          );
        }}
      />

      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: BannerWidth / 2.3,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {BannerImgs?.map((_, index) => {
            return <View style={[styles.dot]} key={index}></View>;
          })}
        </View>

        <Animated.View
          style={[
            styles.dotIndicator,
            {
              transform: [
                {
                  translateX: Animated.divide(scrollX, BannerWidth).interpolate(
                    {
                      inputRange: [0, 1],
                      outputRange: [0, 20],
                    }
                  ),
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: colors.secondary,
  },
  dotIndicator: {
    width: 20,
    height:20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.secondary,
    position: "absolute",
    top: -5,
    left: -5,
  },
});
export default Banner;
