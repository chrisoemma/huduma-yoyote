import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign';
import { colors } from '../utils/colors';
import { useSelector,RootStateOrAny } from 'react-redux';
import { selectLanguage } from '../costants/languageSlice';

const Category = ({ onPress, iconType,category }: any) => {

  

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );


  const selectedLanguage = useSelector(selectLanguage);

  const generateRandomColorNearBase = (baseColor, deviation = 32) => {
    const parseHex = (color) => parseInt(color, 16);
  
    const baseR = parseHex(baseColor.substring(1, 3));
    const baseG = parseHex(baseColor.substring(3, 5));
    const baseB = parseHex(baseColor.substring(5, 7));
  
    const getRandomDeviation = () => Math.floor(Math.random() * (deviation * 2 + 1)) - deviation;
  
    const r = Math.min(255, Math.max(0, baseR + getRandomDeviation()));
    const g = Math.min(255, Math.max(0, baseG + getRandomDeviation()));
    const b = Math.min(255, Math.max(0, baseB + getRandomDeviation()));
  
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
  };
  
  const generateRandomLightColorNearBase = () => {
    return generateRandomColorNearBase('#DFF3F3');
  };
  

  const touchableOpacityStyle = {
    backgroundColor: generateRandomLightColorNearBase(),
    width: 100,
    height: 100,
    borderRadius: 18,
    elevation: 4,
    paddingVertical: 8,
    marginHorizontal: 5,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={[styles.touchableOpacityStyles, touchableOpacityStyle]}
    >
      <View style={styles.circle}>
        <Image
          source={{ uri: category.images[0].img_url }}
          style={{
            resizeMode: 'cover',
            width: '100%',
            height: '100%',
            borderRadius: 60,
            overflow: 'hidden',
          }}
        />
      </View>
      <Text style={{ color: '#525354' }}>{ selectedLanguage === 'en'? category?.name?.en:category?.name?.sw}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
 
touchableOpacityStyles: {

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