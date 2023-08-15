import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import { formatDate, formatNumber } from '../utils/utilts'



const MoreItemDetail = ({
    itemSelected
}: any) => {
    return (
        <View style={{
            marginVertical: 10
        }}>
            <View style={styles.mainDiv}>
                <Text style={styles.textTitle}>Source</Text>
                <Text style={styles.textDetails}>DAKTARI NYUMBANI</Text>
            </View>

            <View style={[styles.mainDiv, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View style={styles.smallDiv}>
                    <Text style={styles.textTitle}>Status</Text>
                    <Text style={[styles.textDetails, { color: itemSelected.status == "in stock" ? colors.successGreen : colors.dangerRed }]}>{itemSelected?.status}</Text>
                </View>
                <View style={styles.smallDiv}>
                    <Text style={styles.textTitle}>Date</Text>
                    <Text style={styles.textDetails}>{formatDate(itemSelected?.created_at)}</Text>
                </View>
            </View>
            <View style={[styles.mainDiv, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View style={styles.smallDiv}>
                    <Text style={styles.textTitle}>Buying price</Text>
                    <Text style={styles.textDetails}>{formatNumber(itemSelected?.buying_price)}</Text>
                </View>
                <View style={styles.smallDiv}>
                    <Text style={styles.textTitle}>Selling price</Text>
                    <Text style={styles.textDetails}>{formatNumber(itemSelected?.selling_price)}</Text>
                </View>
            </View>
            <View style={[styles.mainDiv, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <View style={styles.smallDiv}>
                    <Text style={styles.textTitle}>Quantity</Text>
                    <Text style={styles.textDetails}>{itemSelected.remaining_qty}</Text>
                </View>
                <View style={styles.smallDiv}>
                    <Text style={styles.textTitle}>Quantity used</Text>
                    <Text style={styles.textDetails}>{itemSelected.qty - itemSelected.remaining_qty}</Text>
                </View>
                <View style={styles.smallDiv}>
                    <Text style={styles.textTitle}>Total quantity</Text>
                    <Text style={styles.textDetails}>{itemSelected.qty}</Text>
                </View>
            </View>
            {/* <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <View><Text>Sales</Text></View>
        <View><Text>Edit</Text></View>
        <View><Text>Delete</Text></View>
       </View> */}

        </View>
    )
}

export default MoreItemDetail

const styles = StyleSheet.create({

    mainDiv: {
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.darkGrey
    },
    textTitle: {
        marginVertical: 5
    },
    smallDiv: {

    },
    textDetails: {

    }
})