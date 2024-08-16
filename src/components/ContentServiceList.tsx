import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../utils/colors';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../costants/languageSlice';

const ContentServiceList = ({ selectedProviderSubServices, subServices, providerSubServices, toggleSubService, selectedSubServices, navigation, screen }) => {
  const { t } = useTranslation();
  const selectedLanguage = useSelector(selectLanguage);

  const RenderItem = ({ type, item }) => (
    <TouchableOpacity 
      style={styles.contentItem}
      onPress={() => {
        const itemType = type === "subService" ? "subService" : "providerSubService";
        navigation.navigate('subservice Details', {
          sub_service: item,
          type: itemType
        });
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={
            type === "subService" ? 
            { uri: item?.assets[0]?.img_url || item?.default_images[0]?.img_url } :
            { uri: item?.assets[0]?.img_url }
          }
          style={{
            resizeMode: 'cover',
            width: 90,
            height: 90,
            borderRadius: 10,
          }}
        />
        {type === "subService" ? (
          <View style={styles.textContainer}>
            <Text style={styles.categoryService}>
              {item?.provider_sub_list?.name || (selectedLanguage === 'en' ? item?.name?.en : item?.name?.sw)}
            </Text>
            <Text style={styles.subservice}>
              {selectedLanguage === 'en' ? item?.service?.category?.name?.en : item?.service?.category?.name?.sw}
            </Text>
            <Text style={{ color: colors.black }}>
              {item?.provider_sub_list?.description || (selectedLanguage === 'en' ? item.description?.en : item.description?.sw)}
            </Text>
          </View>
        ) : (
          <View style={styles.textContainer}>
            <Text style={styles.categoryService}>{item?.name}</Text>
            <Text style={styles.subservice}>
              {selectedLanguage === 'en' ? item?.service?.category?.name?.en : item?.service?.category?.name?.sw}
            </Text>
            <Text style={{ color: colors.black }}>{item?.description}</Text>
          </View>
        )}
      </View>
      {screen === "new" ? (
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
          <Text style={{ color: colors.white }}>
            {selectedSubServices.includes(item?.id) || selectedProviderSubServices.includes(item?.id)
              ? `${t('screens:remove')}`
              : `${t('screens:add')}`}
          </Text>
        </TouchableOpacity>
      ) : <View />}
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
    paddingTop: 20,
    paddingVertical: 20,
  },
  contentItem: {
    flex: 1,
    padding: 10,
    margin: 2,
    borderTopWidth: 0.5,
  },
  textContainer: {
    margin: 5,
  },
  categoryService: {
    textTransform: 'uppercase',
    color: colors.secondary,
  },
  subservice: {
    paddingTop: 5,
    fontWeight: 'bold',
    color: colors.black,
  },
  addBtn: {
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
});

export default ContentServiceList;
