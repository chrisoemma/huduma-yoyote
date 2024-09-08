import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library
import { colors } from '../utils/colors';
import { useSelector, RootStateOrAny } from 'react-redux';
import { combineSubServices, getStatusBackgroundColor } from '../utils/utilts';
import { useTranslation } from 'react-i18next';
import { selectLanguage } from '../costants/languageSlice';

const width = Dimensions.get('window').width;

const RequestList = ({ item, navigation }: any) => {
  const selectedLanguage = useSelector(selectLanguage);

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  const getStatusTranslation = (status: string) => {
    return t(`screens:${status}`);
  };

  const { t } = useTranslation();

  const request_status = item?.statuses[item?.statuses?.length - 1]?.status;

  const subServices = combineSubServices(item);

  const maxItemsToShow = 2;

  return (
    <TouchableOpacity
      style={[
        styles.touchableOpacityStyles,
        { backgroundColor: isDarkMode ? colors.darkModeBackground : colors.white }
      ]}
      onPress={() => {
        navigation.navigate('Requested services', {
          request: item
        });
      }}
    >
      <View>
        <Text style={[styles.serviceName, { color: isDarkMode ? colors.white : colors.secondary }]}>
          {selectedLanguage === 'en' ? item?.service?.name?.en : item?.service?.name?.sw}
        </Text>

        {item?.request_number && (
       <View style={styles.header}>
        <Text style={[styles.requestNumber, { color: isDarkMode ? colors.white : colors.secondary }]}>
         {`#${item.request_number}`}
         </Text>
         </View>
        )}
        
        {/* User Icon and Provider Name */}
        <View style={styles.providerContainer}>
          <Icon name="person" size={20} color={isDarkMode ? colors.white : colors.darkGrey} />
          <Text style={[styles.providerName, { color: isDarkMode ? colors.white : colors.darkGrey }]}>
            {item?.provider?.name}
          </Text>
        </View>

        {subServices.slice(0, maxItemsToShow).map((subService, index) => (
          <Text
            style={[
              styles.subServiceName,
              { color: isDarkMode ? colors.white : colors.darkGrey }
            ]}
            key={subService?.id}
          >
            - {subService?.provider_sub_list?.name || selectedLanguage === 'en' ? subService?.sub_service?.name?.en : subService?.sub_service?.name?.sw || subService?.provider_sub_service?.name}
          </Text>
        ))}

        {subServices.length > maxItemsToShow && (
          <Text style={{ color: isDarkMode ? colors.white : colors.darkGrey }}>
            ...
          </Text>
        )}
      </View>
      <View style={styles.bottomView}>
        <View style={{ marginRight: '35%' }}>
          <Text style={[styles.requestTime, { color: isDarkMode ? colors.white : colors.darkGrey }]}>
            {item?.request_time}
          </Text>
        </View>
        <View style={[styles.status, { backgroundColor: getStatusBackgroundColor(request_status) }]}>
          <Text style={styles.statusText}>{getStatusTranslation(request_status)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableOpacityStyles: {
    borderRadius: 20,
    padding: 15,
    marginHorizontal: 15,
    backgroundColor: colors.white,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  serviceName: {
    fontFamily: 'Prompt-Bold',
    fontSize: 18,
    marginBottom: 5,
  },
  providerContainer: {
    flexDirection: 'row', // Align icon and text horizontally
    alignItems: 'center', // Center the icon with the text
    paddingVertical: 5,
  },
  providerName: {
    fontFamily: 'Prompt-Regular',
    fontSize: 15,
    marginLeft: 5, // Add some space between the icon and the text
  },
  subServiceName: {
    fontFamily: 'Prompt-Regular',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  requestNumber: {
    fontFamily: 'Prompt-SemiBold',
    fontSize: 15,
    marginLeft: 5,
  },
  bottomView: {
    flexDirection: 'row',
    paddingTop: 15,
    alignItems: 'center',
  },
  requestTime: {
    fontFamily: 'Prompt-Regular',
    fontSize: 12,
  },
  status: {
    paddingVertical: 3,
    // paddingRight: 4,
    // paddingLeft:10,
    // margin:5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: colors.white,
    paddingHorizontal:10,
    fontFamily: 'Prompt-Bold',
    fontSize: 14,
  }
});

export default RequestList;
