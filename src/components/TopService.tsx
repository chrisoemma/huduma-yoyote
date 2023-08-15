import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';

const TopService = ({ onPress, iconType, service }: any) => {

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPress}
            style={styles.touchableOpacityStyles}
        >
            <Image
                source={require('./../../assets/images/banner-3.jpg')}
                style={{
                    resizeMode: "cover",
                    width: 180,
                    height: 100,
                    borderRadius: 10,
                }}
            />
            <View style={styles.serviceTextBackground}>
                <Text style={styles.serviceText}>{service.name}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    touchableOpacityStyles: {
        width: 180,
        height: 150,
        borderRadius: 18,
        paddingVertical: 8,
        marginHorizontal: 5,
        marginVertical: 5,
    },
    serviceTextBackground: {
        padding: 8,
        marginTop: 5,
        borderRadius: 15,
        backgroundColor: colors.lightView,
        alignSelf: 'flex-start', // Align the background with the text's start
    },
    serviceText: {
        // Add text styling here
    },
})

export default TopService;
