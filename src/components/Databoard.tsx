import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const Databoard = ({ onPress, mainTitle, number, color }: any) => {

    const styles = StyleSheet.create({
        
        dataBoard: {
            backgroundColor: `${color}`,
            marginTop: 12,
            height: 110,
            width: 145,
            padding: 10,
            marginHorizontal: 8,
            borderRadius: 15,
            shadowColor: '#000',
            justifyContent: 'center',
            alignItems: 'center',
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
        },
        headText: {
            fontSize: 15,
            color: '#ffff',
            textAlign: 'center'

        },
        middleText: {
            fontSize: 18,
            fontWeight: 'bold',
            marginTop: 5,
            color: '#ffff',
        }

    })

    return (
        <TouchableOpacity
            style={styles.dataBoard}
            onPress={() => { onPress() }}
        >
            <Text style={styles.headText}>{mainTitle}</Text>
            <Text style={styles.middleText}>{number}</Text>

        </TouchableOpacity>
    )
}



export default Databoard