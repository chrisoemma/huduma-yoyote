import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { formatNumber } from '../utils/utilts';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import { useAppDispatch } from '../app/store';
import { cartTotalPriceSelector, cartTotalSelector } from '../features/cart/cartSelectors';
import { useSelector } from 'react-redux';

const OrderSummary = () => {
    const [open, setIsOpen] = useState(false);

    const openSummary = () => {
        setIsOpen(!open);
    };

    const dispatch = useAppDispatch();

    const total = useSelector(cartTotalSelector);
    const cart = useSelector((state) => state.cart);
    const totalPrice = useSelector(cartTotalPriceSelector);

    return (
        <View style={styles.orderContainer}>
            {/* <Text style={styles.stepTitle}>Step {stepNumber}/04</Text> */}
            <View style={styles.orderSummary}>
                <TouchableOpacity onPress={() => openSummary()} >
                    <View style={styles.header}>
                        <Text style={styles.orderText}>Order Summary</Text>
                        {
                            open ? (<Icon
                                name="up"
                                style={styles.summaryIcon}
                                size={20}

                            />) : (<Icon
                                name="down"
                                style={styles.summaryIcon}
                                size={20}

                            />)
                        }
                    </View>
                </TouchableOpacity>

                {open ? (
                    <View style={styles.cartContent}>
                        <View style={styles.carts}>
                            {
                                cart.map((item) => (
                                    <View key={item.id}>
                                        <View style={styles.cart}>
                                            <View style={styles.cartImage}>
                                                <Image
                                                    source={{ uri: item?.images[0]?.img_url }}
                                                    resizeMode="contain"
                                                    style={{
                                                        width: 70,
                                                        height: 120,
                                                    }}
                                                />
                                            </View>

                                            <View
                                                style={{
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    marginLeft: 15,
                                                }}
                                            >
                                                <View style={{}}>
                                                    <Text
                                                        style={{
                                                            fontSize: 15,
                                                            fontFamily: "Poppins-Medium",
                                                            color: colors.black,
                                                        }}
                                                    >
                                                        {item.product}
                                                    </Text>
                                                    <Text
                                                        style={{

                                                            fontSize: 15,
                                                            fontFamily: "Poppins-Medium",
                                                            color: "#CFC6C6",
                                                        }}
                                                    >
                                                        {item.business}
                                                    </Text>
                                                    <View >
                                                        <Text style={{ fontSize: 10 }}>{item.quantity}  pieces(s) @ Tsh {formatNumber(item.selling_price)}</Text>
                                                        <Text
                                                            style={{

                                                                fontSize: 14,
                                                                fontFamily: "Poppins-Medium",
                                                                color: colors.black,
                                                                fontWeight: "bold",
                                                            }}
                                                        >
                                                            Tsh {formatNumber(item.quantity * item.selling_price)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={styles.separator} />
                                    </View>
                                ))
                            }
                        </View>
                        <View style={styles.totalSummary}>
                            <View style={styles.subTotal}>
                                <Text style={styles.totalHeader}>SUB TOTAL</Text>
                                <Text style={styles.summaryAmount}>{formatNumber(totalPrice)}</Text>
                            </View>
                            <View style={styles.delivery}>
                                <Text style={styles.totalHeader}>DELIVERY</Text>
                                <Text style={styles.summaryAmount}>0.00</Text>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.total} >
                                <Text style={styles.totalHeader}>TOTAL</Text>
                                <Text style={styles.summaryAmount}>{formatNumber(totalPrice)}</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View />
                )}

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    orderContainer: {
        backgroundColor: '#fafafa'
    },
    orderSummary: {
        margin: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: colors.white,
        borderRadius: 10,
    },
    orderText: {
        padding: 20,
        fontSize: 16
    },
    summaryIcon: {
        padding: 20,
        alignSelf: "flex-end",
        marginLeft: 45
    },
    header: {
        flexDirection: "row",
    },
    cartContent: {

    },
    cart: {

        flexDirection: "row",
        display: "flex",
        marginBottom: 10,

    },
    cartImage: {
        alignItems: "center",
    },
    separator: {
        borderWidth: 1,
        backgroundColor: colors.darkGrey,
        marginVertical: 3
    },
    carts: {
        marginBottom: 20,
        margin: 10,
    },
    totalSummary: {
        backgroundColor: colors.lightBlue,
        padding: 30
    },
    subTotal: {
        flexDirection: 'row',
        marginBottom: 30,
        justifyContent: 'space-between'

    },
    delivery: {
        flexDirection: 'row',
        marginBottom: 30,
        justifyContent: 'space-between'
    },
    total: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'space-between'
    },
    totalHeader: {
        fontSize: 15
    },
    summaryAmount: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
        fontSize: 15,
        fontWeight: 'bold'
    },
    stepTitle: {
        fontSize: 16,
        margin: 8
    }

})

export default OrderSummary