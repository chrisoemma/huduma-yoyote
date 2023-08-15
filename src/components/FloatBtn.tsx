import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';

const FloatBtn = ({ onPress, iconType }: any) => {

    return (
        <View style={styles.floatBtnContainer}>
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={onPress}
                style={styles.touchableOpacityStyles}
            >
                <Ionicons name={iconType}
                    color={colors.white}
                    size={25}
                />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    floatBtnContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchableOpacityStyles: {
        position: 'absolute',
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
        zIndex: 5000,
        backgroundColor: colors.secondary,
        borderRadius: 70
    }
})

export default FloatBtn