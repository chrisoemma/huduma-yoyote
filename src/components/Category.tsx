import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import { colors } from '../utils/colors';

const Category = ({ onPress, iconType,category }: any) => {

    return (
        
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={onPress}
                style={styles.touchableOpacityStyles}
            >

             <View style={styles.circle}>
             <Icon    
                  name={category.icon}
                  color={colors.secondary}
                  size={30}

                  />
             </View>
               <Text>{category.name}</Text>
            </TouchableOpacity>
        
    )
}
const styles = StyleSheet.create({
 
touchableOpacityStyles: {

  backgroundColor: colors.lightView,
  width:'30%',
  height :95,
  borderRadius :18,
  elevation :20,
  paddingVertical :8,

  marginHorizontal :5,
  marginVertical :5,
  justifyContent :'center',
  alignItems :'center',
    },
    circle:{
       height:60,
       width:60,
       borderRadius:60,
       backgroundColor:colors.white,
       alignItems:'center',
       justifyContent:'center'
    }
})

export default Category