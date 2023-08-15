import React, { useState } from 'react';
import styled from 'styled-components/native';
import { colors } from '../utils/colors';
import { ActivityIndicator, Dimensions, StyleSheet, View, Text } from 'react-native';
import { formatNumber } from '../utils/utilts';


const width = Dimensions.get('window').width;

const Checkbox = ({
    loading,
    onPress,
    children,
    title,
    height = 30,
    options,
    backgroundColor = colors.primaryBlue,
    elevation = 0,
}: any) => {
    const TouchableOpacity = styled.TouchableOpacity`
    height: ${height}px;
    width: ${width - 50}px;
    border-radius: 6px;
 
  `;

    const [checkboxOptions, setCheckboxOptions] = useState([]);

    const pickOption = (selectedOption: any) => {
        console.log('hello');
        //   const index = checkboxOptions.findIndex(option => option == selectedOption)
        if (checkboxOptions.includes(selectedOption)) {
            setCheckboxOptions(checkboxOptions.filter(option => option !== selectedOption))
            return;
        }

        setCheckboxOptions(checkboxOptions => checkboxOptions.concat(selectedOption))
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.options}>
                {options.map(option => (
                    <View key={option.id} style={styles.option}>
                        <TouchableOpacity style={styles.checkBox} onPress={() => pickOption(option)}>

                            {checkboxOptions.includes(option) && <Text style={styles.check}>✔</Text>}
                        </TouchableOpacity>
                        <Text style={styles.optionName}>{option.service} {checkboxOptions.includes(option) && <Text>({formatNumber(option.amount)})</Text>}</Text>
                    </View>
                ))
                }
            </View>
            <View>
                {checkboxOptions ? (<Text style={styles.total}>Total:  {formatNumber(checkboxOptions.reduce((a, v) => a = a + v.amount, 0))}</Text>) : (<></>)}
            </View>
        </View>
    );
};

export default Checkbox;

const styles = StyleSheet.create({

    total: {
        color: colors.black,
        fontSize: 20
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    options: {
        alignSelf: 'flex-start',
        marginLeft: 50
    },
    title: {
        fontSize: 18,
        fontWeight: '600'
    },
    option: {
        flexDirection: 'row',
        marginVertical: 10
    },
    checkBox: {
        width: 25,
        height: 25,
        borderWidth: 2,
        borderColor: 'green',
        marginRight: 5
    },
    optionName: {
        textTransform: 'capitalize',
        fontSize: 14,
    },
    check: {
        alignSelf: 'center'
    }
});