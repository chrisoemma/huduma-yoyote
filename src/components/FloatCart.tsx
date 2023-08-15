import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import Ionicons from 'react-native-vector-icons/Ionicons';

const FloatCart = ({ onPress, cart }: any) => {
    return (
        <View style={styles.floatBtnContainer}>
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={onPress}
                style={styles.touchableOpacityStyles}
            >
                <View style={styles.cart}><Text style={{
                    color: colors.white,
                    padding: 8
                }}>{cart}</Text></View>
                <Ionicons name='cart'
                    color={colors.black}
                    size={40}
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
        backgroundColor: colors.lightGrey,
        borderRadius: 70
    },
    cart: {
        position: 'absolute',
        top: -8,
        left: 10,
        borderRadius: 30,
        backgroundColor: colors.dangerRed
    }

})

export default FloatCart