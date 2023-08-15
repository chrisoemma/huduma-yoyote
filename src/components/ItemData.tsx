import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import React from 'react'
// import Icon from '../Icon'

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { colors } from '../utils/colors';
import { formatDate, formatNumber } from '../utils/utilts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ItemData = ({
    banch,
    item,
    qty,
    date,
    stock,
    getSelectedItem,
    getActionType,
    onPressMore,
    onPressDelete,
    onPressEdit
}: any) => {

    return (
        <TouchableOpacity
            style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginVertical: 5,
                borderBottomWidth: 1,
                borderBottomColor: colors.grey,
                paddingVertical: 20,
            }}
            onPress={() => { }}


        >
            <View>
                <Text>{banch}</Text>
            </View>
            <View>
                <Text>{item.remaining_qty}</Text>
            </View>
            <View>
                <AntDesign
                    name={stock == "in stock" ? "check" : "close"}
                    size={20}
                    color={stock == "in stock" ? colors.successGreen : colors.dangerRed}
                />
            </View>
            <View>
                <Text>{formatDate(item.created_at)}</Text>
            </View>

            <Menu>
                <MenuTrigger>
                    <Ionicons
                        name="ellipsis-vertical-sharp"
                        size={20}
                        color={colors.black}
                    />
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={() => {
                        getActionType("view")
                        getSelectedItem(item);
                        onPressMore()
                    }}
                        customStyles={optionStyles}>
                        <Text style={{ color: colors.successGreen }}>More</Text>
                    </MenuOption>
                    {item.qty == item.remaining_qty ?
                        <>
                            {/* <MenuOption onSelect={() => {
                                getActionType("edit")
                                getSelectedItem(item);
                                onPressEdit()
                            }}
                                customStyles={optionStyles}
                            >
                                <Text style={{ color: colors.warningYellow }}>Edit</Text>
                            </MenuOption> */}
                            <MenuOption onSelect={
                                () => {

                                    getSelectedItem(item);
                                    onPressDelete()
                                }
                            }
                                customStyles={optionStyles}
                            >
                                <Text style={{ color: colors.dangerRed }}>Delete</Text>
                            </MenuOption>
                        </>
                        : <View />

                    }
                </MenuOptions>
            </Menu>
        </TouchableOpacity>
    )
}

export default ItemData

const optionStyles = {
    optionWrapper: {
        margin: 10,
        borderBottomWidth: 0.5,
        borderColor: colors.darkGrey
    },
};