import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';
import RatingStars from './RatinsStars';
import { globalStyles } from '../styles/global';

const ProviderList = ({ navigation, provider, service, isDarkMode }: any) => {
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
        key={provider?.id}
      >
        <View style={stylesGlobal.circle}>
          <TouchableWithoutFeedback>
            <Image
              source={
                provider?.profile_img?.startsWith('https://')
                  ? { uri: provider.profile_img }
                  : provider?.user_img?.startsWith('https://')
                    ? { uri: provider.user_img }
                    : require('./../../assets/images/profile.png') // Default static image
              }
              style={styles.profileImage}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.divContent}>
          <Text
            style={[styles.providerName, { color: isDarkMode ? colors.white : colors.black }]}
          > 
            {provider?.business_name ? provider?.business_name : provider?.name}
          </Text>
          {/* <View style={{ flexDirection: 'row' }}>
            <Ionicons name="location-outline" color={colors.primary} size={17} />
            <Text style={{ color: isDarkMode ? colors.white : colors.black }}>Mwananyamala</Text>
          </View> */}
          <RatingStars rating={provider?.average_rating == null ? 0 : provider?.average_rating} />
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  touchableOpacityStyles: {

    borderRadius: 18,
    marginHorizontal:10,
    marginVertical: 5,
     width:'45%',
    elevation: 2,
  
    // borderRadius: 18,
    // paddingVertical: 8,

    // marginVertical: 5,
    // alignItems: 'center', // Center align items
  
  },
  profileImage: {
    resizeMode: 'cover',
    width: 90,
    height: 95,
    borderRadius: 90,
    alignSelf: 'center',
  },
  divContent: {
    marginBottom: 10,
    marginHorizontal:10,
    alignItems: 'center', // Center content horizontally
  },
  providerName: {
    fontFamily: 'Prompt-Regular',
    marginBottom:5
  },
});

export default ProviderList;
