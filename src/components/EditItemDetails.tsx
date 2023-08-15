import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../utils/colors'
import { formatDate, formatNumber } from '../utils/utilts'
import { useNavigation } from '@react-navigation/native'
import DropDownPicker from 'react-native-dropdown-picker'

const EditItemDetails = ({
    itemSelected
}: any) => {

    // const [open, setOpen] = useState(false);
    // const [form, setForm] = useState({});
    // const [error, setError] = useState(null);
    // const [errors, setErrors] = useState(null);
    // const [itemValue, setValue] = useState(itemSelected.medicine_id);
    // const [itemValueError, setItemValueError] = useState(null)

    // const [localShop, setLocalShop] = useState(null);

    // // const setData = async () => {
    // //     setLocalShop(await getLocalShop());
    // // };
    // // setData();

    // // useEffect(() => {
    // //     getInventoryMedicine()(inventoryMedicineDispatch);


    // //     const { qty: qty, buying_price: buyingPrice, selling_price: sellingPrice } = itemSelected
    // //     setForm((prev) => {
    // //         return { ...prev, qty, buyingPrice, sellingPrice }
    // //     })
    // // }, []);

    // const { navigate } = useNavigation();
    // // const {
    // //     inventoryMedicineDispatch,
    // //     stocksDispatch,
    // //     stockState: {
    // //         editStock: {
    // //             loading: editItemLoading,
    // //         }
    // //     },
    // //     inventoryMedicineStates: { loading: medicineLoading, data },
    // // } = useContext(GlobalContext);

    // // const onSubmit = () => {

    // //     if (!form.qty) {
    // //         setErrors((prev) => {
    // //             return { ...prev, amount: "Qty field is required" };
    // //         });
    // //     }
    // //     if (!itemValue) {
    // //         setItemValueError("Choose items")
    // //     }
    // //     console.log('fommmmm', form)
    // //     if (form.qty && itemValue && form.sellingPrice && form.buyingPrice) {
    // //         form.itemValue = itemValue
    // //         form.userId = 1
    // //         form.stockId = itemSelected.id
    // //         console.log('clicked data', form)
    // //         let shop_id = localShop?.shop_id;

    // //         if (shop_id !== null) {
    // //             editStock(form, shop_id)(stocksDispatch)((response) => {
    // //                 navigate(STOCKS)
    // //             });
    // //         }
    // //     }

    // // };

    // // const onChange = ({ name, value }) => {

    // //     setForm({ ...form, [name]: value });
    // //     if (value !== "") {
    // //         if (name === "qty") {
    // //             if (value.length < 1) {
    // //                 setErrors((prev) => {
    // //                     return { ...prev, [name]: "Qty is not empty" };
    // //                 });
    // //             } else {
    // //                 setErrors((prev) => {
    // //                     return { ...prev, [name]: null };
    // //                 });
    // //             }
    // //         } else {
    // //             setErrors((prev) => {
    // //                 return { ...prev, [name]: null };
    // //             });
    // //         }

    // //     } else {
    // //         setErrors((prev) => {
    // //             return { ...prev, [name]: "This fied is required" };
    // //         });
    // //     }
    // // };

    // // const onChangeValue = (value) => {
    // //     if (error) {
    // //         setError(null);
    // //     }
    // // };

    // return (
    //     <View style={styles.wrapper}>
    //         <View style={styles.container}>
    //             <View style={{ marginHorizontal: scale(15) }}>

    //                 <View style={styles.chooseView}>
    //                     <Text>Choose Item</Text>
    //                 </View>
    //                 {medicineLoading ? (
    //                     <View style={styles.loading}>
    //                         <ActivityIndicator size="large" color={colors.primary} />
    //                     </View>
    //                 ) : (
    //                     <></>
    //                 )}
    //                 <DropDownPicker
    //                     placeholder="Choose items"
    //                     searchable={true}
    //                     open={open}
    //                     value={itemValue}
    //                     items={data}
    //                     setOpen={setOpen}
    //                     setValue={setValue}
    //                     onChangeValue={onChangeValue}
    //                 />
    //                 {
    //                     itemValueError && itemValue == null ? <ErrorMessage error={itemValueError} /> : <View />
    //                 }
    //                 <View
    //                     style={{
    //                         marginTop: scale(5),
    //                     }}
    //                 >
    //                     <Input
    //                         label="Quantity"
    //                         placeholder="Qty"
    //                         keyboardType='numeric'
    //                         value={form.qty || itemSelected?.qty.toString()}
    //                         onChangeText={(value) => {
    //                             onChange({ name: "qty", value });
    //                         }}
    //                         errorMessage={error?.qty || errors?.qty}
    //                     />
    //                 </View>
    //                 <View
    //                     style={{
    //                         marginTop: scale(5),
    //                     }}
    //                 >
    //                     <Input
    //                         label="Buying price"
    //                         placeholder="buying price"
    //                         keyboardType='numeric'
    //                         value={form.buyingPrice || itemSelected?.buying_price ? Math.trunc(itemSelected?.buying_price).toString() : ""}
    //                         onChangeText={(value) => {
    //                             onChange({ name: "buyingPrice", value });
    //                         }}
    //                         errorMessage={error?.buyingPrice || errors?.buyingPrice}
    //                     />
    //                 </View>

    //                 <View
    //                     style={{
    //                         marginTop: scale(5),
    //                     }}
    //                 >
    //                     <Input
    //                         label="Selling price"
    //                         placeholder="selling price"
    //                         keyboardType='numeric'
    //                         value={form.sellingPrice || itemSelected?.selling_price ? Math.trunc(itemSelected?.selling_price).toString() : ""}
    //                         onChangeText={(value) => {
    //                             onChange({ name: "sellingPrice", value });
    //                         }}
    //                         errorMessage={error?.sellingPrice || errors?.sellingPrice}
    //                     />
    //                 </View>
    //                 <View style={{
    //                     marginBottom: 50
    //                 }}>
    //                     <CustomButton
    //                         secondary
    //                         title="Edit Item"
    //                         onPress={onSubmit}
    //                         loading={editItemLoading}
    //                         disabled={editItemLoading}
    //                     />

    //                 </View>

    //             </View>
    //         </View>
    //     </View>

    return (
        <View />
    )
}

export default EditItemDetails