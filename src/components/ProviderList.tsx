import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';
import RatingStars from './RatinsStars';
import { globalStyles } from '../styles/global';

const ProviderList = ({ navigation, onPress, iconType, provider, service }: any) => {


    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("Service request", {
                provider: provider,
                service: service
            })}
            style={styles.touchableOpacityStyles}
        >
            <View style={globalStyles.circle}>

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
              
            </View>
            <View style={styles.divContent}>
                <Text>{provider?.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Ionicons name="location-outline" color={colors.primary} size={17} />
                    <Text>Mwananyamala</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Ionicons name="pin" color={colors.primary} size={20} />
                    <Text>{provider.latitude == null ? 0 : 3}Km</Text>
                </View>
                <RatingStars rating={provider.average_rating == null ? 0 : provider.average_rating} />
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    touchableOpacityStyles: {
        height: 200,
        borderRadius: 18,
        paddingVertical: 8,
        marginHorizontal: 5,
        marginVertical: 5,
        backgroundColor: colors.white
    },
    divContent: {
        margin: 10,

    }
})

export default ProviderList;
