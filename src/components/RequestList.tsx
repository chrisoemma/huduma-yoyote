import { View, Text,TouchableOpacity,StyleSheet,Dimensions } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'
import { useSelector,RootStateOrAny } from 'react-redux';
import { combineSubServices, getStatusBackgroundColor } from '../utils/utilts';
import { useTranslation } from 'react-i18next';

const width = Dimensions.get('window').width;

const RequestList = ({item,navigation}:any) => {

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  const getStatusTranslation = (status: string) => {
    return t(`screens:${status}`);
  };

  const { t } = useTranslation();

  const request_status = item?.statuses[item?.statuses.length - 1].status;


  const subServices = combineSubServices(item);


   const maxItemsToShow = 2;

  return (
    <TouchableOpacity style={[styles.touchableOpacityStyles,{backgroundColor:isDarkMode?colors.darkModeBackground:colors.white}]}
     onPress={()=>{navigation.navigate('Requested services',{
      request:item
     })}}
    >
       <View>
        <Text style={{color:isDarkMode?colors.black:colors.primary,fontWeight:'bold'}}>{item?.service?.name}</Text>
        <Text style={{paddingVertical:10,color:isDarkMode?colors.white:colors.darkGrey}}>{item?.provider?.name}</Text>
        {subServices.slice(0, maxItemsToShow).map((subService, index) => (
  <Text style={{ color: isDarkMode ? colors.white : colors.darkGrey }} key={subService.id}>
    - {subService.provider_sub_list?.name || subService?.sub_service?.name || subService?.provider_sub_service?.name} 
  </Text>
))}

{subServices.length > maxItemsToShow && (
  <Text style={{ color: isDarkMode ? colors.white : colors.darkGrey }}>
    ...
  </Text>
)}
           
      </View>
      <View style={styles.bottomView}>
         <View style={{marginRight:'35%'}}><Text style={{color:isDarkMode?colors.white:colors.darkGrey}} >{item?.request_time}</Text></View>
         <TouchableOpacity style={[styles.status, { backgroundColor: getStatusBackgroundColor(request_status) }]}>
          <Text style={{ color: colors.white }}>{getStatusTranslation(request_status)}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
    touchableOpacityStyles: {
         height: 180,
         borderRadius: 25,
         padding:10,
        marginHorizontal:10,
        backgroundColor:colors.white,
        elevation:2
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