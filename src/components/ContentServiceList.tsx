import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../utils/colors';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../costants/languageSlice';

const ContentServiceList = ({ selectedProviderSubServices, subServices, providerSubServices, toggleSubService, selectedSubServices, navigation, screen }) => {
  const { t } = useTranslation();
  const selectedLanguage = useSelector(selectLanguage);

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
);

  const RenderItem = ({ type, item }) => (
    <TouchableOpacity 
      style={[styles.contentItem,{ backgroundColor: isDarkMode ? colors.darkModeBackground : colors.whiteBackground }]}
      onPress={() => {
        const itemType = type === "subService" ? "subService" : "providerSubService";
        navigation.navigate('subservice Details', {
          sub_service: item,
          type: itemType
        });
      }}
    >
    
        <Image
          source={
            type === "subService" ? 
            { uri: item?.assets[0]?.img_url || item?.default_images[0]?.img_url } :
            { uri: item?.assets[0]?.img_url }
          }
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.categoryService,{color:isDarkMode?colors.white:colors.secondary}]}>
            {item?.provider_sub_list?.name || (selectedLanguage === 'en' ? item?.name?.en : item?.name?.sw)}
          </Text>
          {/* <Text style={[styles.subservice,{color:isDarkMode?colors.white:colors.black}]}>
            {selectedLanguage === 'en' ? item?.service?.category?.name?.en : item?.service?.category?.name?.sw}
          </Text> */}
          <Text style={[styles.description,{color:isDarkMode?colors.white:colors.black}]}
            numberOfLines={2}
            ellipsizeMode="tail" 
          >
            {item?.provider_sub_list?.description || (selectedLanguage === 'en' ? item.description?.en : item.description?.sw)}
          </Text>
        </View>
        {screen === "new" && (
          <TouchableOpacity
            style={[
              styles.addBtn,
              {
                backgroundColor: selectedSubServices.includes(item?.id) || selectedProviderSubServices.includes(item?.id)
                  ? colors.dangerRed
                  : colors.secondary,
              },
            ]}
            onPress={() => toggleSubService(type, item.id)}
          >
            <Text style={styles.addBtnText}>
              {selectedSubServices.includes(item?.id) || selectedProviderSubServices.includes(item?.id)
                ? `${t('screens:remove')}`
                : `${t('screens:add')}`}
            </Text>
          </TouchableOpacity>
        )}
    
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {subServices?.map((item) => (
        <RenderItem
          item={item}
          type="subService"
          key={`subService-${item?.id}-${item?.provider_sub_list?.id}`}
        />
      ))}

      {providerSubServices?.map((item) => (
        <RenderItem
          item={item}
          type="providerSubService"
          key={`providerSubService-${item?.id}-${item?.provider_sub_list?.id}`}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
 // Adjust background color if needed
  },
  contentItem: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3, // Add shadow for better depth on Android
    shadowColor: '#000', // Add shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
  },
  categoryService: {
    fontFamily: 'Prompt-Regular', // Apply custom font
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.secondary,
    textTransform: 'uppercase',
  },
  subservice: {
    fontFamily: 'Prompt-Regular', // Apply custom font
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: 4,
  },
  description: {
    fontFamily: 'Prompt-Regular', // Apply custom font
    fontSize: 14,
    color: colors.black,
    marginTop: 4,
  },
  addBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontFamily: 'Prompt-Regular', // Apply custom font
    color: colors.white,
    fontSize: 14,
  },
});

export default ContentServiceList;
