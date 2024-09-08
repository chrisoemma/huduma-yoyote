import React from 'react';
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../utils/colors';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { selectLanguage } from '../costants/languageSlice';

const RequestSubServiceList = ({ navigation, requestSubService }: any) => {

  const { t } = useTranslation();
  const selectedLanguage = useSelector(selectLanguage);

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  const RenderItem = ({ type, item }: any) => (
    <TouchableOpacity
      style={styles.contentItem}
      onPress={() => {
        const itemType = type === "subService" ? "subService" : "providerSubService";
        navigation.navigate('providerSubServiceDetails', {
          item: item,
          type: itemType
        });
      }}
    >
      <View style={[styles.itemContent, { backgroundColor: isDarkMode ? colors.darkModeBackground : colors.whiteBackground }]}>
        <Image
          source={
            type === "subService"
              ? { uri: item?.sub_service?.assets?.[0]?.img_url || item?.sub_service?.default_images?.[0]?.img_url }
              : { uri: item?.provider_sub_service?.assets?.[0]?.img_url }
          }
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.categoryService, { color: isDarkMode ? colors.white : colors.secondary }]}>
            {item?.provider_sub_list?.name || (selectedLanguage === 'en' ? item?.sub_service?.name?.en : item?.sub_service?.name?.sw) || item?.provider_sub_service?.name}
          </Text>
          <Text style={[styles.description, {
            color: isDarkMode ? colors.white : colors.black
          }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item?.provider_sub_list?.description || (selectedLanguage === 'en' ? item?.sub_service?.description?.en : item?.sub_service?.description?.sw)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {requestSubService?.map((item) => (
        <RenderItem
          item={item}
          type="subService"
          key={item?.id.toString()}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  contentItem: {
    marginBottom: 15, // Space between items
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 4, // Elevation for shadow effect
    overflow: 'hidden', // Ensure the border radius is applied to the image
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,
  },
  categoryService: {
    fontFamily: 'Prompt-SemiBold',
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: 'Prompt-Regular',
    fontSize: 13,
    color: colors.black,
  },
});

export default RequestSubServiceList;
