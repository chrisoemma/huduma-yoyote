import { View, Text,TouchableOpacity,StyleSheet,Dimensions } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'

const width = Dimensions.get('window').width;

const RequestList = ({item,navigation}:any) => {
  return (
    <TouchableOpacity style={styles.touchableOpacityStyles}
     onPress={()=>{navigation.navigate('Requested services',{
      request:item
     })}}
    >
      <View>
        <Text style={{color:colors.primary}}>{item?.service?.name}</Text>
        <Text style={{paddingVertical:10,color:colors.black}}>{item?.provider?.name}</Text>
        {item?.requested_sub_services?.map((subService):any=>(
             <Text>-{subService?.name}</Text>
           ))
           }
      </View>
      <View style={styles.bottomView}>
         <View style={{marginRight:'35%'}}><Text >{item?.request_time}</Text></View>
         <TouchableOpacity style={styles.status}>
            <Text style={{color:colors.white}}>{item?.statuses[item?.statuses?.length-1]?.status}</Text>
         </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    touchableOpacityStyles: {
         height: 160,
         borderRadius: 18,
         padding:10,
        marginHorizontal:10,
        backgroundColor:colors.white
    },
    bottomView:{
        flexDirection:'row',
        paddingTop:10
    },
    status:{
        alignItems:'flex-end',
        alignContent:'flex-end',
        justifyContent:'flex-end',
        backgroundColor:colors.secondary,
        padding:7,
        borderRadius:10
       
    }
})

export default RequestList