import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';
import RatingStars from './RatinsStars';
import { globalStyles } from '../styles/global';

const ProviderList = ({ navigation, onPress, iconType, provider, service, isDarkMode }: any) => {
  const stylesGlobal = globalStyles();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate('Service request', { provider: provider, service: service })}
        style={[styles.touchableOpacityStyles, { backgroundColor: isDarkMode ? '#545352' : colors.white }]}
      >
        <View style={stylesGlobal.circle}>
          <TouchableWithoutFeedback onPress={toggleModal}>
            <Image
              source={
                provider?.profile_img?.startsWith('https://')
                  ? { uri: provider.profile_img }
                  : provider?.user_img?.startsWith('https://')
                  ? { uri: provider.user_img }
                  : require('./../../assets/images/profile.png') // Default static image
              }
              style={{
                resizeMode: 'cover',
                width: provider?.user_img?.startsWith('https://') ? 90 : 90,
                height: provider?.user_img?.startsWith('https://') ? 95 : 95,
                borderRadius: provider?.user_img?.startsWith('https://') ? 90 : 90,
                alignSelf: 'center',
              }}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.divContent}>
          <Text style={{ color: isDarkMode ? colors.white : colors.black }}>{provider?.name}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons name="location-outline" color={colors.primary} size={17} />
            <Text style={{ color: isDarkMode ? colors.white : colors.black }}>Mwananyamala</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons name="pin" color={colors.primary} size={20} />
            <Text style={{ color: isDarkMode ? colors.white : colors.black }}>
              {provider.latitude == null ? 0 : 3}Km
            </Text>
          </View>
          <RatingStars rating={provider.average_rating == null ? 0 : provider.average_rating} />
        </View>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} onRequestClose={toggleModal}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableWithoutFeedback onPress={toggleModal}>
            <Image
              source={
                provider?.profile_img?.startsWith('https://')
                  ? { uri: provider.profile_img }
                  : provider?.user_img?.startsWith('https://')
                  ? { uri: provider.user_img }
                  : require('./../../assets/images/profile.png') // Default static image
              }
              style={{
                resizeMode: 'contain',
                width: '80%',
                height: '80%',
              //  borderRadius:200,
                overflow: 'hidden', // Ensure that the borderRadius is applied correctly
              }}
            />
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  touchableOpacityStyles: {
    height: 200,
    borderRadius: 18,
    paddingVertical: 8,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  divContent: {
    margin: 10,
  },
});

export default ProviderList;
