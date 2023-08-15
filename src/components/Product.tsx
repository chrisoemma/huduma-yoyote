import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import { formatNumber } from '../utils/utilts'
import { TextInput } from 'react-native-paper'
import { Controller } from 'react-hook-form'
import { TextInputField } from './TextInputField'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import {
    increment,
    decrement,
    clear,
    removeItem,
    addToCart
} from '../features/cart/cartSlice'
import { useAppDispatch } from '../app/store'



const Product = ({ product, name, img_url, price, qty, handleRemoveCart, handleAddProduct, onPress }: any) => {

    const cart = useSelector((state) => state.cart);

    const itemQty = () => {

        const find = cart.filter((item) => item.product_id === product.product_id);

        if (find !== null) {
            return find
        } else {
            return 0;
        }



    }

    const dispatch = useAppDispatch();
    return (
        <>

            <View style={styles.product}>
                <TouchableOpacity
                    onPress={onPress}

                >

                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Image
                            source={{ uri: img_url }}
                            resizeMode="cover"
                            style={{
                                width: 140,
                                height: 120,
                                borderRadius: 5,
                            }}
                        />
                    </View>

                    <View style={styles.priceView}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ flex: 1 }}>
                                {name && (
                                    <View style={styles.productContainer}>
                                        <Text
                                            style={{
                                                justifyContent: "flex-start",
                                                marginLeft: 8,
                                                fontFamily: "Poppins-Medium",
                                                fontWeight: "bold",
                                                fontSize: 14,
                                                marginTop: 4
                                            }}
                                        >
                                            {name}
                                        </Text>
                                    </View>
                                )}

                                {price && (
                                    <Text
                                        style={{
                                            justifyContent: "flex-start",
                                            marginLeft: 8,
                                            fontFamily: "Poppins-Medium",
                                            fontWeight: "bold",
                                            color: "#2b2b2b",
                                            marginTop: 4
                                        }}
                                    >
                                        Tsh {formatNumber(price)}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.cartDiv}>
                    <View style={styles.increDecrement}>
                        <TouchableOpacity
                            style={{ marginVertical: 8, marginLeft: 3 }}
                            onPress={() => {
                                dispatch(decrement(product.product_id));
                            }}
                        >
                            <Ionicons name="remove" color={colors.black} size={16} />
                        </TouchableOpacity>
                        <View><Text>{itemQty()[0]?.quantity ? itemQty()[0]?.quantity : 0}</Text></View>

                        <TouchableOpacity
                            style={{
                                marginVertical: 8,
                                alignItems: "flex-end",
                                marginRight: 3,
                            }}
                            onPress={() => {
                                dispatch(addToCart(product));
                            }}
                        >
                            <Ionicons name="add" color={colors.black} size={16} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </>
    )
}


const styles = StyleSheet.create({

    product: {
        width: 140,
        marginTop: 18,
        marginLeft: 18,
        backgroundColor: colors.alsoLightGrey,
        paddingBottom: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    priceView: {
        height: 50,
    },
    productContainer: {
        width: 100,
    },
    cartDiv: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    increDecrement: {
        width: 100,
        height: 30,
        borderWidth: 0.5,
        borderRadius: 25,
        marginLeft: 17,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

})

export default Product