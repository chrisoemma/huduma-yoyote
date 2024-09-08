import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList, Modal } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { colors } from "../utils/colors";

const Banner = ({ BannerHeight, BannerImgs }) => {
  const { width } = Dimensions.get("screen");
  const BannerWidth = width;
  
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ height: BannerHeight }}>
      <FlatList
        data={BannerImgs}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => openModal(index)}>
            <Image
              source={{ uri: item.url }}
              style={{
                width: BannerWidth,
                height: BannerHeight,
                resizeMode: "cover",
                borderRadius: 20,
              }}
            />
          </TouchableOpacity>
        )}
      />

      <View
        style={{
          position: "absolute",
          bottom: 10,
          left: BannerWidth / 2.3,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          {BannerImgs?.map((_, index) => (
            <View style={styles.dot} key={index}></View>
          ))}
        </View>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <ImageViewer
          imageUrls={BannerImgs.map(img => ({ url: img.url }))}
          index={currentIndex}
          enableSwipeDown
          onSwipeDown={closeModal}
          backgroundColor={colors.secondary} 
          onCancel={closeModal}
        />
      </Modal>
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
  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Banner;
