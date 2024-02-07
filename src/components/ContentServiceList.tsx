import React from 'react';
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../utils/colors';
import { useTranslation } from 'react-i18next';
import { combineSubServices } from '../utils/utilts';

const ContentServiceList = ({ selectedProviderSubServices, subServices,providerSubServices, toggleSubService, selectedSubServices,navigation,screen }: any) => {

  const { t } = useTranslation();

  
  
  const RenderItem = ({type, item }: any) => (
      

    <TouchableOpacity 
    style={styles.contentItem}
    onPress={()=>{}}
    >
     
      <View style={{flexDirection:'row'}}>
       
      <Image
        source={
          type=="subService"? 
          { uri:item?.assets[0]?.img_url || item?.default_images[0]?.img_url }
           :
           {uri: item?.assets[0]?.img_url}
        }
      
        style={{
          resizeMode: 'cover',
          width: 90,
          height:90,
          borderRadius: 10,
        }}
        
      />
      {type=="subService"?(
      <View style={styles.textContainer}>
      <Text style={styles.categoryService}>{item?.provider_sub_list?.name || item.name}</Text>
      <Text style={styles.subservice}>{item?.service?.category?.name}</Text>
      <Text style={{color:colors.black}}>{item?.provider_sub_list?.description || item.description}</Text>
      </View>
      ):( <View style={styles.textContainer}>
        <Text style={styles.categoryService}>{item?.name}</Text>
        <Text style={styles.subservice}>{item?.service?.category?.name}</Text>
        <Text style={{color:colors.black}}>{item?.description}</Text>
        </View>)}
      </View>
      {screen=="new"?
      <TouchableOpacity   style={[
          styles.addBtn,
          {
            backgroundColor: selectedSubServices.includes(item?.id) || selectedProviderSubServices.includes(item?.id)
              ? colors.dangerRed
              : colors.secondary,
          },
        ]} 
      onPress={() => toggleSubService(type,item.id)}>
  <Text style={{ color: colors.white }}>
    {selectedSubServices.includes(item?.id) || selectedProviderSubServices.includes(item?.id) ? `${t('screens:remove')}` : `${t('screens:add')}`}
  </Text>
</TouchableOpacity>
:<View />}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
     {subServices?.map((item)=>(
       
      <RenderItem  
      item={item} 
      type="subService" 
      key={item?.id.toString()}
      />
     ))
     }

{providerSubServices?.map((item)=>(
    
       <RenderItem  
       item={item}
       type="providerSubService" 
       key={item?.id.toString()}
       />
      ))
      }
   
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
       flex: 1,
        paddingTop: 20,
        paddingVertical: 20,
      },
      contentContainer: {
       marginHorizontal:5
      },
      contentItem: {
        flex:1,
       padding: 10,
       margin:2,
       borderTopWidth:0.5,
      },
      textContainer:{
        margin:5
      },
      categoryService:{
        textTransform: 'uppercase',
        color:colors.secondary
      },
      service:{
        paddingTop:5
      },
      subservice:{
        paddingTop:5,
        fontWeight:'bold',
        color:colors.black
      },
      desc:{
       
      },
      addBtn:{
      alignSelf:'flex-end',
      padding:8,
      borderRadius:8,
      backgroundColor:colors.secondary
      },
      removeBtn: {
        alignSelf: 'flex-end',
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.dangerRed,
        marginTop: 5,
      },
      
});

export default ContentServiceList;
