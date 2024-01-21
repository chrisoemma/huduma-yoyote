import React, { useRef, useEffect } from "react";
import { View, Animated, Image, StyleSheet, Dimensions } from "react-native";
import { colors } from "../utils/colors";

const Banner = ({ BannerHeight, BannerImgs, dotSize, dotColor }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const { width } = Dimensions.get("screen");
  const BannerWidth = width;

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (flatListRef.current) {
        currentIndex = (currentIndex + 1) % BannerImgs.length;
        flatListRef.current.scrollToIndex({
          animated: true,
          index: currentIndex,
        });
      }
    }, 8000);
  
    return () => clearInterval(interval);
  }, [BannerImgs]);

  return (
    <View style={{ height: BannerHeight, overflow: "hidden" }}>
      <Animated.FlatList
        ref={flatListRef}
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
                source={{ uri: item?.item?.url }}
                style={{
                  resizeMode: "cover",
                  width: BannerWidth,
                  height: BannerHeight,
                  borderRadius: 20,
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
    height: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.secondary,
    position: "absolute",
    top: -5,
    left: -5,
  },
});

export default Banner;
