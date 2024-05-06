import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';
import { Platform } from 'react-native';
import { useSelector,RootStateOrAny } from 'react-redux';
import { selectLanguage } from '../costants/languageSlice';

const TopService = ({ onPress, iconType, service }: any) => {

    const { isDarkMode } = useSelector(
        (state: RootStateOrAny) => state.theme,
      );


      const selectedLanguage = useSelector(selectLanguage);

      const shadowStyle = isDarkMode
      ? {
          ios: {
            shadowColor: 'rgba(255, 255, 255, 0.3)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
          },
          android: {
            elevation: 4,
          },
        }
      : {
          ios: {
            shadowColor: 'rgba(0, 0, 0, 0.3)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
          },
          android: {
            elevation: 4,
          },
        };
     
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPress}
            style={[styles.touchableOpacityStyles,{backgroundColor:colors.white},
                shadowStyle[Platform.OS],
            ]}
            key={service.id}
        >
            <Image
                source={{uri:service.images[0].img_url}}
                style={{
                    resizeMode: "cover",
                    width: '100%',
                    height: '70%',
                    borderRadius: 10,
                }}
            />
            <View style={styles.serviceTextBackground}>
                <Text style={styles.serviceText}>{selectedLanguage=='en'? service?.name?.en:service?.name?.sw}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    touchableOpacityStyles: {
        width:'45%',
        height:150,
        borderRadius: 18,
        marginHorizontal: 8,
        marginVertical: 5,
    },
    serviceTextBackground: {
        paddingBottom: 8,
        paddingHorizontal:3,
        borderRadius: 15,
        alignSelf: 'flex-start', 
    },
    serviceText: {
      color:colors.primary,
      fontWeight:'bold'  
    },
})

export default TopService;
